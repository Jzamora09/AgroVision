
import base64
import io
import json
import logging
import re

from PIL import Image, ImageOps
from openai import OpenAI

from app.config.settings import settings
from app.schemas.detection_schema import PlantAnalysis


logger = logging.getLogger(__name__)


class AIService:

    def __init__(self):
        self.client = OpenAI(
            base_url=settings.NVIDIA_BASE_URL,
            api_key=settings.NVIDIA_API_KEY,
            timeout=120.0,
            max_retries=0
        )

    # --------------------------------------------------
    # PRUEBA DE TEXTO
    # --------------------------------------------------

    def analyze_text(self, prompt: str):

        response = self.client.chat.completions.create(
            model=settings.NVIDIA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=500
        )

        if not response.choices:
            raise ValueError(
                "NVIDIA no devolvió una respuesta."
            )

        return (
            response.choices[0].message.content
            or "Sin respuesta."
        )

    # --------------------------------------------------
    # PREPARAR FOTOGRAFÍA
    # --------------------------------------------------

    def prepare_image(self, image_path: str):

        try:
            with Image.open(image_path) as image:

                if image.format not in ("JPEG", "PNG"):
                    raise ValueError(
                        "Formato no soportado. Utiliza JPG o PNG."
                    )

                image = ImageOps.exif_transpose(image)
                image = image.convert("RGB")

                # Mayor resolución para observar lesiones
                image.thumbnail((1024, 1024))

                buffer = io.BytesIO()

                image.save(
                    buffer,
                    format="JPEG",
                    quality=85
                )

                image_bytes = buffer.getvalue()

        except (OSError, ValueError) as error:
            raise ValueError(
                "No fue posible preparar la fotografía."
            ) from error

        encoded = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        return f"data:image/jpeg;base64,{encoded}"

    # --------------------------------------------------
    # EXTRAER JSON
    # --------------------------------------------------

    def parse_json(self, content: str):

        content = content.strip()

        # Eliminar bloque Markdown si existe
        if content.startswith("```"):
            lines = content.splitlines()

            if lines and lines[0].startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]

            content = "\n".join(lines).strip()

        try:
            result = json.loads(content)

            if isinstance(result, dict):
                return result

        except json.JSONDecodeError:
            pass

        # Buscar JSON dentro de texto adicional
        decoder = json.JSONDecoder()

        for match in re.finditer(r"\{", content):
            try:
                result, _ = decoder.raw_decode(
                    content[match.start():]
                )

                if isinstance(result, dict):
                    return result

            except json.JSONDecodeError:
                continue

        raise ValueError(
            "NVIDIA no devolvió un JSON válido."
        )

    # --------------------------------------------------
    # INTERPRETAR MARKDOWN ESTRUCTURADO
    # --------------------------------------------------

    def parse_markdown(self, content: str):

        labels = {
            "cultivo coincide": "cultivo_coincide",
            "estado": "estado",
            "enfermedad": "enfermedad",
            "tipo de problema": "tipo_problema",
            "confianza": "confianza",
            "síntomas": "sintomas",
            "sintomas": "sintomas",
            "descripción": "descripcion",
            "descripcion": "descripcion",
            "recomendaciones": "recomendaciones",
            "prevención": "prevencion",
            "prevencion": "prevencion"
        }

        list_fields = {
            "sintomas",
            "recomendaciones",
            "prevencion"
        }

        result = {}
        current_list = None

        for raw_line in content.splitlines():

            line = raw_line.strip()

            if not line:
                continue

            cleaned = re.sub(
                r"\*\*(.*?)\*\*",
                r"\1",
                line
            )

            cleaned = cleaned.lstrip("# ").strip()

            if ":" in cleaned:
                label, value = cleaned.split(":", 1)

                key = labels.get(
                    label.strip().lower()
                )

                if key:
                    value = value.strip()

                    if key in list_fields:
                        result[key] = []
                        current_list = key

                        if value:
                            result[key].append(value)

                    else:
                        result[key] = value
                        current_list = None

                    continue

            if current_list and re.match(
                r"^[-*]\s+",
                line
            ):
                item = re.sub(
                    r"^[-*]\s+",
                    "",
                    line
                ).strip()

                result[current_list].append(item)

        required = {
            "cultivo_coincide",
            "estado",
            "enfermedad",
            "tipo_problema",
            "confianza",
            "sintomas",
            "descripcion",
            "recomendaciones",
            "prevencion"
        }

        missing = required - result.keys()

        if missing:
            raise ValueError(
                "Markdown incompleto. Faltan campos: "
                f"{sorted(missing)}"
            )

        crop_match = str(
            result["cultivo_coincide"]
        ).strip().lower()

        if crop_match not in ("true", "false"):
            raise ValueError(
                "cultivo_coincide no es válido."
            )

        result["cultivo_coincide"] = (
            crop_match == "true"
        )

        confidence_text = str(
            result["confianza"]
        ).replace("%", "").strip()

        result["confianza"] = int(
            confidence_text
        )

        return result

    # --------------------------------------------------
    # VALIDAR ANÁLISIS
    # --------------------------------------------------

    def validate_analysis(self, data: dict):

        analysis = PlantAnalysis.model_validate(
            data
        )

        return analysis.model_dump()

    # --------------------------------------------------
    # ANÁLISIS DE IMÁGENES
    # --------------------------------------------------

    def analyze_image(
        self,
        image_path: str,
        crop: dict
    ):

        # 1. Preparar fotografía
        image_data = self.prepare_image(
            image_path
        )

        # 2. Información contextual del cultivo
        nombre = crop.get("nombre") or "No especificado"
        tipo = crop.get("tipo") or "No especificado"
        variedad = crop.get("variedad") or "No especificada"

        descripcion_cultivo = (
            crop.get("descripcion")
            or "No especificada"
        )

        # --------------------------------------------------
        # 3. PROMPT AGRÍCOLA DETALLADO
        # --------------------------------------------------

        prompt = f"""
You are an agricultural image analysis assistant
specialized in plant health and phytopathology.

Analyze the photograph using the registered
crop information as context.

CROP INFORMATION:
Name: {nombre}
Crop type: {tipo}
Variety: {variedad}
Description: {descripcion_cultivo}

TASK:

Examine the visible characteristics of the plant.

Identify visible symptoms such as:
- Leaf spots
- Chlorosis or yellowing
- Necrosis
- Mosaic patterns
- Leaf deformation
- Pest damage
- Nutritional deficiency signs
- Environmental stress

When the visible evidence supports it,
identify a possible disease compatible with
the registered crop.

For example, depending on the crop,
possible conditions may include fungal,
bacterial or viral plant diseases.

Do not select a disease merely because
it appears in the examples.

If a specific disease cannot be supported
by visible evidence, use "No determinada".

Provide a detailed Spanish description of
the observed visual characteristics.

Include useful general agricultural
recommendations and preventive measures.

Do not claim a definitive diagnosis.
Do not invent symptoms.
Do not infer hidden causes from the image.

Use the registered crop type as context,
but do not assume it is visually correct.

OUTPUT REQUIREMENTS:

Return ONLY one valid JSON object.
No Markdown.
No introductory text.
No explanations outside JSON.

Use exactly these nine keys:

cultivo_coincide
estado
enfermedad
tipo_problema
confianza
sintomas
descripcion
recomendaciones
prevencion

DATA TYPES:

cultivo_coincide: boolean
estado: Spanish string
enfermedad: Spanish string
tipo_problema: Spanish string
confianza: integer between 0 and 100
sintomas: array of Spanish strings
descripcion: Spanish string
recomendaciones: array of Spanish strings
prevencion: array of Spanish strings

STATUS RULES:

- Use "Sana" if no visible health problem
  is supported by the image.
- Use "Enferma" when visible evidence
  supports a plant health problem.
- Use "No concluyente" when the image
  is insufficient for classification.
- If uncertain about the specific disease,
  use "No determinada" for enfermedad.

CONFIDENCE RULES:

- Do not automatically return 0.
- Do not automatically return 100.
- The value must reflect the model's
  estimated confidence in the visible assessment.
- Do not present confidence as validated
  diagnostic accuracy.

DESCRIPTION RULES:

- Describe the visible symptoms in detail.
- Explain possible compatible conditions.
- Mention uncertainty when appropriate.
- Keep the response in Spanish.

RECOMMENDATIONS:

- Provide 3 to 5 practical general recommendations
  when supported by the analysis.
- Include preventive measures.
- Recommend professional evaluation when necessary.

Return valid JSON only.
"""

        # --------------------------------------------------
        # 4. CONSULTAR NVIDIA NIM
        # --------------------------------------------------

        response = self.client.chat.completions.create(
            model=settings.NVIDIA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_data
                            }
                        }
                    ]
                }
            ],
            temperature=0.2,
            max_tokens=1400
        )

        # --------------------------------------------------
        # 5. OBTENER RESPUESTA
        # --------------------------------------------------

        if not response.choices:
            raise ValueError(
                "NVIDIA no devolvió resultados."
            )

        content = response.choices[0].message.content

        if not isinstance(content, str) or not content.strip():
            raise ValueError(
                "NVIDIA devolvió una respuesta vacía."
            )

        # --------------------------------------------------
        # 6. INTERPRETAR RESPUESTA
        # --------------------------------------------------

        try:
            analysis_data = self.parse_json(
                content
            )

            logger.info(
                "NVIDIA devolvió JSON válido."
            )

        except ValueError:

            logger.warning(
                "NVIDIA devolvió Markdown. "
                "Intentando interpretación local."
            )

            analysis_data = self.parse_markdown(
                content
            )

        # --------------------------------------------------
        # 7. VALIDAR RESULTADO
        # --------------------------------------------------

        analysis = self.validate_analysis(
            analysis_data
        )

        logger.info(
            "Análisis agrícola completado."
        )

        return analysis


ai_service = AIService()

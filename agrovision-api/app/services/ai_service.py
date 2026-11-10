
import base64
import io
import json
import logging
import re

from PIL import Image, ImageOps
from openai import OpenAI
from pydantic import ValidationError

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
            max_tokens=3000
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

                # Mantener proporción y detalles visibles
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

        try:
            result["confianza"] = int(
                confidence_text
            )
        except ValueError as error:
            raise ValueError(
                "La confianza devuelta no es válida."
            ) from error

        return result

    # --------------------------------------------------
    # VALIDAR ANÁLISIS
    # --------------------------------------------------

    def validate_analysis(self, data: dict):

        try:
            analysis = PlantAnalysis.model_validate(
                data
            )

        except ValidationError as error:
            raise ValueError(
                "NVIDIA devolvió un análisis incompatible "
                "con el esquema de AgroVision."
            ) from error

        return analysis.model_dump()

    # --------------------------------------------------
    # ANÁLISIS DE IMÁGENES
    # --------------------------------------------------

    def analyze_image(
        self,
        image_path: str,
        crop: dict
    ):

        image_data = self.prepare_image(
            image_path
        )

        nombre = crop.get("nombre") or "No especificado"
        tipo = crop.get("tipo") or "No especificado"
        variedad = crop.get("variedad") or "No especificada"

        descripcion_cultivo = (
            crop.get("descripcion")
            or "No especificada"
        )

        # --------------------------------------------------
        # PROMPT AGRÍCOLA EQUILIBRADO
        # --------------------------------------------------

        prompt = f"""
You are an agricultural crop monitoring assistant
specialized in visual plant health assessment.

IMPORTANT CONTEXT:
This task concerns agricultural plants, not human
or veterinary medicine.

Your purpose is to observe the photograph and
provide an informative agricultural assessment,
not a definitive diagnosis.

REGISTERED CROP:
Name: {nombre}
Crop type: {tipo}
Variety: {variedad}
Description: {descripcion_cultivo}

MAIN TASK:

First determine whether the plant appears healthy,
shows visible signs of a health problem, or cannot
be assessed reliably from the photograph.

Do not assume that every plant has a disease.

HEALTHY PLANTS:

If the plant has normal coloration, healthy-looking
leaves and no evident signs of disease or pest damage:

- Set estado to "Sana".
- Set enfermedad to "Ninguna visible".
- Set tipo_problema to "Ninguno visible".
- Use an empty list for sintomas.
- Describe the visible healthy characteristics.
- Provide general recommendations for maintaining
  plant health.
- Do not invent symptoms or diseases.

PLANTS WITH VISIBLE HEALTH PROBLEMS:

If the photograph shows visible alterations such as:

- Brown or dark spots on leaves.
- Yellowing or chlorosis.
- Necrotic or damaged tissue.
- Unusual leaf deformation.
- Possible pest damage.
- Abnormal coloration or texture.
- Other visible signs of plant stress.

Then:

- Set estado to "Enferma" when evidence supports
  a plant health problem.
- Describe the visible symptoms clearly.
- Mention a possible disease only if compatible
  with the registered crop and visual evidence.
- If the exact disease is uncertain, use
  "No determinada".
- Provide general recommendations and prevention.

UNCERTAIN CASES:

If the photograph is blurry, incomplete,
poorly illuminated, or lacks sufficient evidence:

- Set estado to "No concluyente".
- Set enfermedad to "No determinada".
- Explain why the assessment is uncertain.
- Recommend obtaining a clearer photograph
  or consulting an agricultural specialist.
- Do not force a healthy or diseased classification.

CROP COMPATIBILITY:

Use the registered crop as context, but evaluate
whether the photograph appears compatible with it.

Set cultivo_coincide to true only when the
photograph reasonably supports the registered crop.

If the crop cannot be identified visually,
do not claim that compatibility was confirmed.
Explain the uncertainty in descripcion.

GENERAL RULES:

- Base observations on visible evidence.
- Do not invent symptoms or hidden causes.
- Do not present a definitive diagnosis.
- Do not assume that every photograph is diseased.
- Distinguish visible symptoms from possible causes.
- Use Spanish for all descriptive values.
- Provide useful and cautious recommendations.
- Include preventive measures when appropriate.

CONFIDENCE:

Return an integer between 0 and 100 representing
the model's subjective confidence in its visual
assessment.

Do not automatically return 0 or 100.
Do not present confidence as validated accuracy.

OUTPUT FORMAT:

Return ONLY one valid JSON object.
No Markdown, no headings, no additional explanations.

Use exactly these nine keys:

{{
  "cultivo_coincide": true,
  "estado": "Sana",
  "enfermedad": "Ninguna visible",
  "tipo_problema": "Ninguno visible",
  "confianza": 0,
  "sintomas": [],
  "descripcion": "",
  "recomendaciones": [],
  "prevencion": []
}}

FIELD TYPES:

cultivo_coincide: boolean
estado: "Sana", "Enferma", or "No concluyente"
enfermedad: Spanish string
tipo_problema: Spanish string
confianza: integer between 0 and 100
sintomas: array of Spanish strings
descripcion: detailed Spanish string
recomendaciones: array of Spanish strings
prevencion: array of Spanish strings

The JSON above is only a format example.
Do not copy its values automatically.

Choose the values according to the photograph.

Return valid JSON only.
"""

        # --------------------------------------------------
        # CONSULTAR NVIDIA NIM
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
        # OBTENER RESPUESTA
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
        # INTERPRETAR RESPUESTA
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
                "NVIDIA devolvió una respuesta no JSON."
            )

            print("\n========== RESPUESTA NVIDIA ==========")
            print(content[:3000])
            print("=====================================\n")

            analysis_data = self.parse_markdown(
                content
            )

        # --------------------------------------------------
        # VALIDAR RESULTADO
        # --------------------------------------------------

        analysis = self.validate_analysis(
            analysis_data
        )

        logger.info(
            "Análisis agrícola completado."
        )

        return analysis


ai_service = AIService()

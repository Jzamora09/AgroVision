import base64
import json
import mimetypes

from openai import OpenAI
from app.config.settings import settings


class AIService:

    def __init__(self):
        self.client = OpenAI(
            base_url=settings.NVIDIA_BASE_URL,
            api_key=settings.NVIDIA_API_KEY
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
            temperature=0.3,
            max_tokens=500
        )

        message = response.choices[0].message

        if message.content:
            return message.content

        return "Sin respuesta."

    # --------------------------------------------------
    # ANÁLISIS DE IMÁGENES
    # --------------------------------------------------

    def analyze_image(
        self,
        image_path: str,
        crop: dict
    ):

        # 1. Detectar tipo de imagen
        mime_type, _ = mimetypes.guess_type(image_path)

        allowed_types = [
            "image/jpeg",
            "image/png"
        ]

        if mime_type not in allowed_types:
            raise ValueError(
                "Formato de imagen no soportado. "
                "Utiliza JPG, JPEG o PNG."
            )

        # 2. Leer imagen
        with open(image_path, "rb") as image_file:
            image_bytes = image_file.read()

        # 3. Convertir imagen a Base64
        image_base64 = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        image_data = (
            f"data:{mime_type};base64,{image_base64}"
        )

        # 4. Obtener información del cultivo
        nombre = crop.get("nombre") or "No especificado"
        tipo = crop.get("tipo") or "No especificado"
        variedad = crop.get("variedad") or "No especificada"
        ubicacion = crop.get("ubicacion") or "No especificada"
        fecha_siembra = crop.get("fecha_siembra") or "No especificada"
        estado = crop.get("estado") or "No especificado"
        descripcion = crop.get("descripcion") or "No especificada"

        # 5. Prompt especializado para AgroVision
        prompt = f"""
Eres un sistema de análisis visual agrícola especializado
en fitopatología.

La fotografía pertenece a un cultivo previamente registrado
por el usuario en AgroVision.

INFORMACIÓN DEL CULTIVO:

Nombre: {nombre}
Tipo de cultivo: {tipo}
Variedad: {variedad}
Ubicación: {ubicacion}
Fecha de siembra: {fecha_siembra}
Estado registrado: {estado}
Descripción: {descripcion}

Utiliza el TIPO DE CULTIVO indicado por el usuario como contexto
principal para realizar el análisis.

Tu objetivo NO es identificar qué cultivo es.

Tu objetivo es analizar la fotografía buscando signos visibles
de enfermedades, plagas, deficiencias nutricionales, estrés
hídrico u otros problemas que puedan afectar específicamente
al cultivo indicado.

También verifica visualmente si la fotografía parece compatible
con el cultivo seleccionado.

REGLAS:

- No presentes el resultado como un diagnóstico definitivo.
- No inventes síntomas que no sean visibles.
- La posible enfermedad debe ser compatible con el tipo de
  cultivo indicado.
- Si no existe evidencia suficiente para identificar una
  enfermedad específica, utiliza "No determinada".
- "confianza" debe ser un número entero entre 0 y 100.
- "cultivo_coincide" debe ser true o false.
- Los síntomas deben basarse en características visibles.
- Las recomendaciones deben ser generales y prudentes.
- No incluyas explicaciones fuera del JSON.
- No incluyas Markdown.
- No utilices bloques de código.
- Devuelve SOLAMENTE JSON válido.

Utiliza exactamente esta estructura:

{{
    "cultivo_coincide": true,
    "estado": "string",
    "enfermedad": "string",
    "tipo_problema": "string",
    "confianza": 0,
    "sintomas": [
        "string"
    ],
    "descripcion": "string",
    "recomendaciones": [
        "string"
    ],
    "prevencion": [
        "string"
    ]
}}
"""

        # 6. Enviar imagen + contexto a NVIDIA
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
            max_tokens=3000
        )

        # 7. Obtener respuesta final
        message = response.choices[0].message

        if not message.content:
            raise ValueError(
                "La IA no generó una respuesta final."
            )

        # 8. Convertir JSON a diccionario Python
        try:
            analysis = json.loads(message.content)

        except json.JSONDecodeError as error:
            print("Respuesta recibida de NVIDIA:")
            print(message.content)

            raise ValueError(
                "La IA respondió, pero no devolvió un JSON válido."
            ) from error

        # 9. Devolver análisis
        return analysis


ai_service = AIService()
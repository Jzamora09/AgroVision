
import base64
import mimetypes
from pathlib import Path

from openai import OpenAI, OpenAIError
from app.config.settings import settings


# ------------------------------------------
# CONFIGURACIÓN DE PRUEBA
# ------------------------------------------

MODELO_PRUEBA = "nvidia/nemotron-3.5-super-vl-120b-a12b"
IMAGE_PATH = Path("Planta mala.jpeg")


# ------------------------------------------
# CLIENTE NVIDIA NIM
# ------------------------------------------

client = OpenAI(
    base_url=settings.NVIDIA_BASE_URL,
    api_key=settings.NVIDIA_API_KEY,
    timeout=120.0,
    max_retries=0
)


# ------------------------------------------
# PROBAR ANÁLISIS VISUAL
# ------------------------------------------

def main():

    if not IMAGE_PATH.exists():
        print("No se encontró la fotografía.")
        print("Ruta:", IMAGE_PATH.resolve())
        return

    # Detectar formato
    mime_type, _ = mimetypes.guess_type(
        str(IMAGE_PATH)
    )

    if mime_type not in ("image/jpeg", "image/png"):
        print("Formato de imagen no soportado.")
        return

    # Leer fotografía
    with open(IMAGE_PATH, "rb") as file:
        image_bytes = file.read()

    if not image_bytes:
        print("La fotografía está vacía.")
        return

    # Convertir a Base64
    image_base64 = base64.b64encode(
        image_bytes
    ).decode("utf-8")

    image_data = (
        f"data:{mime_type};base64,{image_base64}"
    )

    print("=" * 50)
    print("PRUEBA DE ANÁLISIS VISUAL - AGROVISION")
    print("=" * 50)

    print("Modelo:", MODELO_PRUEBA)
    print("Fotografía:", IMAGE_PATH.name)
    print("Tamaño:", round(len(image_bytes) / 1024, 2), "KB")

    # ------------------------------------------
    # PROMPT AGRÍCOLA
    # ------------------------------------------

    prompt = """
You are an agricultural image analysis assistant.

Analyze the visible characteristics of this
plant photograph.

This task concerns agricultural plants.

First evaluate whether the plant appears healthy,
shows visible signs of damage, or cannot be
assessed reliably.

Do not assume every plant has a disease.

If the plant appears healthy:
- Use "Sana".
- Do not invent symptoms or diseases.

If visible health problems are present:
- Use "Enferma".
- Describe the visible abnormalities.
- Mention a possible disease only when
  supported by the image.

If evidence is insufficient:
- Use "No concluyente".

Do not provide a definitive diagnosis.

Return ONLY valid JSON.
Do not include Markdown or additional text.

All descriptive values must be in Spanish.

Required JSON fields:

{
    "estado": "Sana",
    "enfermedad": "Ninguna visible",
    "confianza": 0,
    "descripcion": ""
}

Rules:
- estado: Sana, Enferma or No concluyente.
- enfermedad: Spanish string.
- confianza: integer between 0 and 100.
- descripcion: Spanish description of visible signs.
- Do not copy the example values automatically.
"""

    # ------------------------------------------
    # CONSULTAR NVIDIA
    # ------------------------------------------

    try:

        print("\nEnviando fotografía a NVIDIA...")

        response = client.chat.completions.create(
            model=MODELO_PRUEBA,
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
            max_tokens=1500
        )

        if not response.choices:
            print("NVIDIA no devolvió resultados.")
            return

        content = response.choices[0].message.content

        choice = response.choices[0]
        message = choice.message

        print("\n===== DIAGNÓSTICO DEL MODELO =====")
        print("Motivo de finalización:", choice.finish_reason)
        print("Contenido:", repr(message.content))
        print("Tokens utilizados:", response.usage)

        print("\nRespuesta completa:")
        print(message.model_dump_json(indent=2))

        print("\n" + "=" * 50)
        print("RESPUESTA DE NVIDIA")
        print("=" * 50)

        print(content or "Respuesta vacía.")

        # ------------------------------------------
        # VALIDAR JSON
        # ------------------------------------------

        if content:
            import json

            try:
                analysis = json.loads(content.strip())

                if not isinstance(analysis, dict):
                    raise ValueError(
                        "La respuesta no es un objeto JSON."
                    )

                print("\nJSON válido recibido.")

                print(
                    "Estado:",
                    analysis.get("estado", "No disponible")
                )

                print(
                    "Enfermedad:",
                    analysis.get(
                        "enfermedad",
                        "No disponible"
                    )
                )

                print(
                    "Confianza:",
                    analysis.get(
                        "confianza",
                        "No disponible"
                    )
                )

            except (json.JSONDecodeError, ValueError):
                print(
                    "\nEl modelo respondió, pero no "
                    "generó un objeto JSON válido."
                )

        print("\nPrueba visual finalizada.")

    except OpenAIError as error:

        print("\n" + "=" * 50)
        print("ERROR DE NVIDIA")
        print("=" * 50)

        print("Tipo:", type(error).__name__)
        print("Detalle:", str(error))


if __name__ == "__main__":
    main()


import base64
import mimetypes
from pathlib import Path

from openai import OpenAI, OpenAIError
from app.config.settings import settings


# Fotografía de prueba
IMAGE_PATH = Path("Planta mala.jpeg")

client = OpenAI(
    base_url=settings.NVIDIA_BASE_URL,
    api_key=settings.NVIDIA_API_KEY,
    timeout=120.0,
    max_retries=0
)


def main():

    if not IMAGE_PATH.exists():
        print("No se encontró la fotografía.")
        return

    mime_type, _ = mimetypes.guess_type(
        str(IMAGE_PATH)
    )

    if mime_type not in ("image/jpeg", "image/png"):
        print("Formato de imagen no soportado.")
        return

    with open(IMAGE_PATH, "rb") as file:
        image_base64 = base64.b64encode(
            file.read()
        ).decode("utf-8")

    image_data = (
        f"data:{mime_type};base64,{image_base64}"
    )

    print("Probando análisis visual con NVIDIA...")
    print("Modelo:", settings.NVIDIA_MODEL)

    try:
        response = client.chat.completions.create(
            model=settings.NVIDIA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",

                            "text": (
                                "Analyze the visible characteristics of this "
                                "plant photograph. Return ONLY a valid JSON "
                                "object, without Markdown or additional text. "
                                "Use exactly these fields: "
                                "{\"estado\":\"Sana or Enferma or No concluyente\", "
                                "\"enfermedad\":\"No determinada\", "
                                "\"confianza\":0, "
                                "\"descripcion\":\"Spanish description of visible signs\"}. "
                                "The values of estado must be in Spanish. "
                                "Use confianza as an integer from 0 to 100. "
                                "Do not invent a disease or make a definitive diagnosis."
                            )

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
            max_tokens=500
        )

        print("\nRESPUESTA DE NVIDIA:")
        print(response.choices[0].message.content)

        print("\nPrueba visual completada.")

    except OpenAIError as error:
        print("\nERROR:")
        print(type(error).__name__)
        print(str(error))


if __name__ == "__main__":
    main()


from openai import OpenAI, OpenAIError
from app.config.settings import settings

client = OpenAI(
    base_url=settings.NVIDIA_BASE_URL,
    api_key=settings.NVIDIA_API_KEY,
    timeout=30.0,
    max_retries=0
)

print("Probando conexión con NVIDIA NIM...")
print("Modelo:", settings.NVIDIA_MODEL)

try:
    response = client.chat.completions.create(
        model=settings.NVIDIA_MODEL,
        messages=[
            {
                "role": "user",
                "content": (
                    "Responde únicamente con la palabra OK."
                )
            }
        ],
        temperature=0,
        max_tokens=20
    )

    print("Respuesta:", response.choices[0].message.content)
    print("Conexión completada correctamente.")

except OpenAIError as error:
    print("Error de NVIDIA:")
    print(type(error).__name__)
    print(str(error))

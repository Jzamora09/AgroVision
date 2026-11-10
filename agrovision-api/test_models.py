
from openai import OpenAI, OpenAIError
from app.config.settings import settings

client = OpenAI(
    base_url=settings.NVIDIA_BASE_URL,
    api_key=settings.NVIDIA_API_KEY,
    timeout=30.0,
    max_retries=0
)

try:
    models = client.models.list()

    print("MODELOS DISPONIBLES:")
    print("-" * 50)

    for model in models.data:
        print(model.id)

except OpenAIError as error:
    print("No fue posible consultar los modelos.")
    print(type(error).__name__)
    print(str(error))

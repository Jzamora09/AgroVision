from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    # Aplicación
    APP_NAME = os.getenv("APP_NAME", "AgroVision API")
    VERSION = os.getenv("APP_VERSION", "1.0.0")

    # NVIDIA AI
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
    NVIDIA_BASE_URL = os.getenv(
        "NVIDIA_BASE_URL",
        "https://integrate.api.nvidia.com/v1"
    )
    NVIDIA_MODEL = os.getenv(
        "NVIDIA_MODEL",
        "thinkingmachines/inkling"
    )

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")


settings = Settings()
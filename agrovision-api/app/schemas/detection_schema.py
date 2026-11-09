
from typing import Literal

from pydantic import BaseModel, Field


# Información del cultivo
class CropInfo(BaseModel):
    nombre: str
    tipo: str
    variedad: str | None = None


# Resultado del análisis
class PlantAnalysis(BaseModel):
    cultivo_coincide: bool

    estado: str
    enfermedad: str
    tipo_problema: str

    confianza: int = Field(
        ge=0,
        le=100
    )

    sintomas: list[str]
    descripcion: str
    recomendaciones: list[str]
    prevencion: list[str]


# Respuesta completa del endpoint
class DetectionResponse(BaseModel):
    success: bool
    cultivo_id: str
    cultivo: CropInfo
    image_path: str
    analysis: PlantAnalysis

    # Identificación del modelo utilizado
    modelo_utilizado: Literal[
        "NVIDIA NIM",
        "Random Forest"
    ] = "NVIDIA NIM"

    # Indica si se utilizó el respaldo
    respaldo_activado: bool = False

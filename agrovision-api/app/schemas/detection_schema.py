
from typing import Literal

from pydantic import BaseModel, Field


class CropInfo(BaseModel):
    nombre: str
    tipo: str
    variedad: str | None = None


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


class DetectionResponse(BaseModel):
    success: bool
    cultivo_id: str
    cultivo: CropInfo
    image_path: str
    analysis: PlantAnalysis

    modelo_utilizado: Literal[
        "NVIDIA NIM",
        "Random Forest",
        "Información de referencia"
    ] = "NVIDIA NIM"

    respaldo_activado: bool = False

from pydantic import BaseModel, Field


# Información del cultivo obtenida desde Supabase
class CropInfo(BaseModel):
    nombre: str
    tipo: str
    variedad: str | None = None


# Resultado generado por la IA
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
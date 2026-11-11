
import logging
import unicodedata

from fastapi import UploadFile, HTTPException
from openai import OpenAIError
from pydantic import ValidationError

from app.services.image_service import image_service
from app.services.ai_service import ai_service
from app.services.supabase_service import supabase_service
from app.services.crop_knowledge_service import (
    crop_knowledge_service
)

from app.schemas.detection_schema import (
    PlantAnalysis,
    DetectionResponse,
    CropInfo
)


logger = logging.getLogger(__name__)


class DetectionService:

    @staticmethod
    def normalize_text(value):
        text = unicodedata.normalize(
            "NFKD",
            str(value or "").lower().strip()
        )

        return "".join(
            character
            for character in text
            if not unicodedata.combining(character)
        )

    # --------------------------------------------------
    # INFORMACIÓN AGRÍCOLA DE RESPALDO
    # --------------------------------------------------

    def knowledge_fallback(self, crop: dict):

        info = crop_knowledge_service.get_crop_information(
            crop
        )

        nombre = (
            crop.get("nombre")
            or crop.get("tipo")
            or "cultivo"
        )

        if info is None:
            info = {
                "tipo_problema": "No determinado",
                "problemas": [],
                "sintomas": [],
                "descripcion": (
                    "No existe una ficha agrícola específica "
                    "para este cultivo."
                ),
                "recomendaciones": [
                    "Inspeccionar visualmente la planta.",
                    "Tomar fotografías claras.",
                    "Consultar a un especialista agrícola."
                ],
                "prevencion": [
                    "Mantener monitoreo periódico."
                ]
            }

        problemas = info.get("problemas", [])

        descripcion = (

            f"Se presenta información agrícola de referencia. "
            f"{info.get('descripcion', '')} "
        )

        if problemas:
            descripcion += (
                "Problemas que pueden presentarse "
                "en este cultivo: "
                + ", ".join(problemas)
                + "."
            )

        return PlantAnalysis(
            cultivo_coincide=False,
            estado="No concluyente",
            enfermedad="No determinada",
            tipo_problema=info.get(
                "tipo_problema",
                "No determinado"
            ),
            confianza=0,
            sintomas=info.get("sintomas", []),
            descripcion=descripcion,
            recomendaciones=info.get(
                "recomendaciones", []
            ),
            prevencion=info.get(
                "prevencion", []
            )
        )

    # --------------------------------------------------
    # ANÁLISIS PRINCIPAL
    # --------------------------------------------------

    async def analyze(
        self,
        image: UploadFile,
        cultivo_id: str
    ):

        # 1. Obtener cultivo
        crop = supabase_service.get_crop_by_id(
            cultivo_id
        )

        if not crop:
            raise HTTPException(
                status_code=404,
                detail="El cultivo seleccionado no existe."
            )

        # 2. Guardar imagen
        image_path = image_service.save_image(
            image
        )

        modelo_utilizado = "NVIDIA NIM"
        respaldo_activado = False

        # 3. Intentar NVIDIA
        try:
            analysis_data = ai_service.analyze_image(
                image_path=image_path,
                crop=crop
            )

            analysis = PlantAnalysis.model_validate(
                analysis_data
            )

            logger.info(
                "Análisis NVIDIA completado."
            )

        except (
            OpenAIError,
            ValueError,
            ValidationError
        ) as error:

            logger.warning(
                "NVIDIA no completó el análisis: %s",
                error
            )

            analysis = self.knowledge_fallback(crop)
            modelo_utilizado = "Información de referencia"
            respaldo_activado = True

            logger.info(
                "Ficha agrícola de respaldo activada."
            )

        # 4. Guardar solo análisis visuales reales
        if not respaldo_activado:
            supabase_service.save_disease_analysis(
                crop_id=cultivo_id,
                image_url=image_path,
                analysis=analysis.model_dump()
            )

        # 5. Actualizar estado solo con NVIDIA
        if (
            not respaldo_activado
            and analysis.cultivo_coincide
        ):
            estado = self.normalize_text(
                analysis.estado
            )

            if estado == "enferma":
                supabase_service.update_crop_status(
                    crop_id=cultivo_id,
                    estado="Con enfermedad"
                )

            elif estado == "sana":
                supabase_service.update_crop_status(
                    crop_id=cultivo_id,
                    estado="Activo"
                )

        # 6. Información del cultivo
        crop_info = CropInfo(
            nombre=crop["nombre"],
            tipo=crop["tipo"],
            variedad=crop.get("variedad")
        )

        # 7. Respuesta
        return DetectionResponse(
            success=True,
            cultivo_id=cultivo_id,
            cultivo=crop_info,
            image_path=image_path,
            analysis=analysis,
            modelo_utilizado=modelo_utilizado,
            respaldo_activado=respaldo_activado
        )


detection_service = DetectionService()

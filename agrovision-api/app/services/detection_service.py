
import logging
import unicodedata

from fastapi import UploadFile, HTTPException
from openai import OpenAIError
from pydantic import ValidationError

from app.services.image_service import image_service
from app.services.ai_service import ai_service
from app.services.supabase_service import supabase_service
from app.services.classification_service import (
    classification_service
)

from app.schemas.detection_schema import (
    PlantAnalysis,
    DetectionResponse,
    CropInfo
)


logger = logging.getLogger(__name__)


class DetectionService:

    # --------------------------------------------------
    # NORMALIZAR TEXTO DEL CULTIVO
    # --------------------------------------------------

    @staticmethod
    def normalize_text(value):
        text = str(value or "").lower().strip()

        text = unicodedata.normalize(
            "NFKD",
            text
        )

        return "".join(
            character
            for character in text
            if not unicodedata.combining(character)
        )

    # --------------------------------------------------
    # COMPROBAR SI EL CULTIVO ES TOMATE
    # --------------------------------------------------

    def is_tomato(self, crop):

        nombre = self.normalize_text(
            crop.get("nombre")
        )

        tipo = self.normalize_text(
            crop.get("tipo")
        )

        return any(
            word in f"{nombre} {tipo}".split()
            for word in ("tomate", "tomato")
        )

    # --------------------------------------------------
    # GENERAR RESULTADO PRELIMINAR RANDOM FOREST
    # --------------------------------------------------

    def random_forest_analysis(
        self,
        image_path
    ):

        result = classification_service.classify_image(
            image_path
        )

        estado = result["estado"]

        # La probabilidad del modelo no equivale
        # a certeza diagnóstica.
        confianza = int(
            round(result["confianza"])
        )

        if estado == "Enferma":

            descripcion = (
                "El clasificador Random Forest identificó "
                "características visuales compatibles con "
                "la categoría de tomate con tizón temprano "
                "utilizada durante su entrenamiento. "
                "Este resultado es preliminar y no confirma "
                "la presencia de una enfermedad específica."
            )

        else:

            descripcion = (
                "El clasificador Random Forest identificó "
                "características compatibles con la categoría "
                "de tomate sano utilizada durante su "
                "entrenamiento. Este resultado es preliminar "
                "y no descarta otras enfermedades."
            )

        return PlantAnalysis(
            cultivo_coincide=True,
            estado=estado,
            enfermedad="No determinada",
            tipo_problema="No determinado",
            confianza=confianza,
            sintomas=[],
            descripcion=descripcion,
            recomendaciones=[
                "Solicitar una evaluación agronómica "
                "si existen síntomas visibles."
            ],
            prevencion=[
                "Mantener el monitoreo periódico "
                "del cultivo."
            ]
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

        # 2. Guardar fotografía
        image_path = image_service.save_image(
            image
        )

        modelo_utilizado = "NVIDIA NIM"
        respaldo_activado = False
        analysis = None

        # --------------------------------------------------
        # 3. INTENTAR ANÁLISIS CON NVIDIA
        # --------------------------------------------------

        try:

            analysis_data = ai_service.analyze_image(
                image_path=image_path,
                crop=crop
            )

            analysis = PlantAnalysis.model_validate(
                analysis_data
            )

            # Un estado no concluyente es una respuesta
            # válida, pero puede activar el respaldo.
            if (
                self.normalize_text(analysis.estado)
                == "no concluyente"
            ):

                logger.info(
                    "NVIDIA devolvió estado no concluyente."
                )

                if self.is_tomato(crop):
                    analysis = None

        except (
            OpenAIError,
            ValueError,
            ValidationError
        ) as error:

            logger.warning(
                "NVIDIA no completó el análisis: %s",
                error
            )

            analysis = None

        # --------------------------------------------------
        # 4. ACTIVAR RESPALDO RANDOM FOREST
        # --------------------------------------------------

        if analysis is None:

            if not self.is_tomato(crop):

                raise HTTPException(
                    status_code=503,
                    detail=(
                        "El análisis multimodal no está "
                        "disponible o no fue concluyente. "
                        "El clasificador de respaldo "
                        "solo está preparado para tomate."
                    )
                )

            try:

                analysis = self.random_forest_analysis(
                    image_path
                )

                modelo_utilizado = "Random Forest"
                respaldo_activado = True

                logger.info(
                    "Respaldo Random Forest activado."
                )

            except Exception as error:

                logger.exception(
                    "Error ejecutando Random Forest."
                )

                raise HTTPException(
                    status_code=503,
                    detail=(
                        "No fue posible completar "
                        "el análisis de la fotografía."
                    )
                ) from error

        # --------------------------------------------------
        # 5. GUARDAR RESULTADO EN SUPABASE
        # --------------------------------------------------

        supabase_service.save_disease_analysis(
            crop_id=cultivo_id,
            image_url=image_path,
            analysis=analysis.model_dump()
        )

        # --------------------------------------------------
        # 6. INFORMACIÓN DEL CULTIVO
        # --------------------------------------------------

        crop_info = CropInfo(
            nombre=crop["nombre"],
            tipo=crop["tipo"],
            variedad=crop.get("variedad")
        )

        # --------------------------------------------------
        # 7. RESPUESTA
        # --------------------------------------------------

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

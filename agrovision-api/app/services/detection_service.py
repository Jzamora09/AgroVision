
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
    # NORMALIZAR TEXTO
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

        words = f"{nombre} {tipo}".split()

        return any(
            word in words
            for word in ("tomate", "tomato")
        )

    # --------------------------------------------------
    # GENERAR RESPALDO RANDOM FOREST
    # --------------------------------------------------

    def random_forest_analysis(
        self,
        image_path: str,
        crop: dict
    ):

        # Ejecutar modelo independientemente
        # del tipo de cultivo.
        result = classification_service.classify_image(
            image_path
        )

        estado_modelo = str(
            result["estado"]
        ).strip().capitalize()

        confianza_modelo = float(
            result["confianza"]
        )

        # Comprobar si el cultivo pertenece
        # a la especie utilizada en entrenamiento.
        cultivo_validado = self.is_tomato(crop)

        nombre_cultivo = (
            crop.get("nombre")
            or crop.get("tipo")
            or "cultivo"
        )

        # --------------------------------------------------
        # RESULTADO PARA TOMATE
        # --------------------------------------------------

        if cultivo_validado:

            estado = estado_modelo

            confianza = int(
                round(confianza_modelo)
            )

            if estado == "Enferma":

                descripcion = (
                    "El clasificador Random Forest identificó "
                    "características visuales similares a las "
                    "fotografías de tomate con tizón temprano "
                    "utilizadas durante su entrenamiento. "
                    "Esta clasificación es preliminar y "
                    "no confirma una enfermedad específica."
                )

            else:

                descripcion = (
                    "El clasificador Random Forest identificó "
                    "características similares a las fotografías "
                    "de tomate sano utilizadas durante su "
                    "entrenamiento. Este resultado es preliminar "
                    "y no descarta otras enfermedades."
                )

        # --------------------------------------------------
        # RESULTADO PARA OTROS CULTIVOS
        # --------------------------------------------------

        else:

            # No presentar como diagnóstico una predicción
            # fuera del dominio de entrenamiento.
            estado = "No concluyente"
            confianza = 0

            descripcion = (
                f"El análisis principal de NVIDIA no estuvo "
                f"disponible para el cultivo {nombre_cultivo}. "
                f"Se ejecutó el clasificador Random Forest "
                f"como mecanismo de respaldo experimental. "
                f"El modelo encontró mayor similitud con "
                f"la categoría '{estado_modelo}' de su "
                f"entrenamiento con fotografías de tomate. "
                f"Su puntuación interna fue de "
                f"{confianza_modelo:.2f} %. "
                f"Este resultado no está validado para "
                f"el cultivo seleccionado y no permite "
                f"determinar su estado fitosanitario."
            )

        # --------------------------------------------------
        # CONSTRUIR RESULTADO COMPATIBLE CON FRONTEND
        # --------------------------------------------------

        return PlantAnalysis(
            # Random Forest no comprueba la especie.
            # No afirmamos compatibilidad visual.
            cultivo_coincide=False,

            estado=estado,
            enfermedad="No determinada",
            tipo_problema="No determinado",
            confianza=confianza,
            sintomas=[],
            descripcion=descripcion,

            recomendaciones=[
                "Realizar una inspección visual del cultivo.",
                "Tomar fotografías claras de las hojas "
                "y de las zonas que presenten alteraciones.",
                "Solicitar una evaluación agronómica "
                "si se observan síntomas persistentes."
            ],

            prevencion=[
                "Mantener un monitoreo periódico.",
                "Registrar cambios visibles en las plantas.",
                "Aplicar buenas prácticas de manejo "
                "adecuadas al cultivo."
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

        # --------------------------------------------------
        # 1. OBTENER CULTIVO DESDE SUPABASE
        # --------------------------------------------------

        crop = supabase_service.get_crop_by_id(
            cultivo_id
        )

        if not crop:
            raise HTTPException(
                status_code=404,
                detail="El cultivo seleccionado no existe."
            )

        # --------------------------------------------------
        # 2. GUARDAR FOTOGRAFÍA
        # --------------------------------------------------

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

            logger.info(
                "NVIDIA completó el análisis correctamente."
            )

            # Si NVIDIA no puede concluir,
            # ejecutar el respaldo.
            if (
                self.normalize_text(analysis.estado)
                == "no concluyente"
            ):

                logger.warning(
                    "NVIDIA devolvió un resultado "
                    "no concluyente."
                )

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

            logger.warning(
                "Activando respaldo Random Forest."
            )

            try:

                analysis = self.random_forest_analysis(
                    image_path=image_path,
                    crop=crop
                )

                modelo_utilizado = "Random Forest"
                respaldo_activado = True

                logger.info(
                    "Respaldo Random Forest ejecutado."
                )

            except Exception as error:

                logger.exception(
                    "Random Forest también falló."
                )

                raise HTTPException(
                    status_code=503,
                    detail=(
                        "No fue posible completar el análisis "
                        "con NVIDIA ni con Random Forest."
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
        # 6. CONSTRUIR INFORMACIÓN DEL CULTIVO
        # --------------------------------------------------

        crop_info = CropInfo(
            nombre=crop["nombre"],
            tipo=crop["tipo"],
            variedad=crop.get("variedad")
        )

        # --------------------------------------------------
        # 7. DEVOLVER RESPUESTA
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

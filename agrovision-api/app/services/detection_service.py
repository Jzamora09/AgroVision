from fastapi import UploadFile, HTTPException
from pydantic import ValidationError

from app.services.image_service import image_service
from app.services.ai_service import ai_service
from app.services.supabase_service import supabase_service

from app.schemas.detection_schema import (
    PlantAnalysis,
    DetectionResponse,
    CropInfo
)


class DetectionService:

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
        # 2. GUARDAR IMAGEN
        # --------------------------------------------------

        image_path = image_service.save_image(
            image
        )

        # --------------------------------------------------
        # 3. ANALIZAR IMAGEN CON NVIDIA
        # --------------------------------------------------

        analysis_data = ai_service.analyze_image(
            image_path=image_path,
            crop=crop
        )

        # --------------------------------------------------
        # 4. VALIDAR RESPUESTA DE LA IA CON PYDANTIC
        # --------------------------------------------------

        try:
            analysis = PlantAnalysis.model_validate(
                analysis_data
            )

        except ValidationError as error:
            print("===== RESPUESTA IA INVÁLIDA =====")
            print(error)
            print("=================================")

            raise HTTPException(
                status_code=502,
                detail="La IA devolvió un resultado inválido."
            )

        # --------------------------------------------------
        # 5. GUARDAR ANÁLISIS EN SUPABASE
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
            analysis=analysis
        )


detection_service = DetectionService()
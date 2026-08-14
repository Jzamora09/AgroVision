from fastapi import APIRouter, UploadFile, File, Form

from app.services.detection_service import detection_service
from app.schemas.detection_schema import DetectionResponse


router = APIRouter(
    prefix="/api/detection",
    tags=["Disease Detection"]
)


@router.post(
    "/analyze",
    response_model=DetectionResponse
)
async def analyze_image(
    cultivo_id: str = Form(...),
    image: UploadFile = File(...)
):
    return await detection_service.analyze(
        image=image,
        cultivo_id=cultivo_id
    )
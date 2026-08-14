from fastapi import APIRouter
from app.config.settings import settings

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.get("/")
def health():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.VERSION
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="API para AgroVision"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar todos los routers
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "message": "Bienvenido a AgroVision API"
    }
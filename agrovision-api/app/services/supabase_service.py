
import logging

from supabase import create_client, Client

from app.config.settings import settings


logger = logging.getLogger(__name__)


class SupabaseService:

    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )

    # --------------------------------------------------
    # OBTENER CULTIVO POR ID
    # --------------------------------------------------

    def get_crop_by_id(self, cultivo_id: str):

        try:
            response = (
                self.client
                .table("crops")
                .select(
                    "id, nombre, tipo, variedad, "
                    "fecha_siembra, ubicacion, estado, descripcion"
                )
                .eq("id", cultivo_id)
                .execute()
            )

            if not response.data:
                return None

            return response.data[0]

        except Exception:
            logger.exception(
                "Error al obtener el cultivo."
            )
            raise

    # --------------------------------------------------
    # GUARDAR ANÁLISIS DE ENFERMEDAD
    # --------------------------------------------------

    def save_disease_analysis(
        self,
        crop_id: str,
        image_url: str,
        analysis: dict
    ):

        try:
            data = {
                "crop_id": crop_id,
                "image_url": image_url,
                "cultivo_coincide": analysis["cultivo_coincide"],
                "estado": analysis["estado"],
                "enfermedad": analysis["enfermedad"],
                "tipo_problema": analysis["tipo_problema"],
                "confianza": analysis["confianza"],
                "sintomas": analysis["sintomas"],
                "descripcion": analysis["descripcion"],
                "recomendaciones": analysis["recomendaciones"],
                "prevencion": analysis["prevencion"]
            }

            response = (
                self.client
                .table("disease_analyses")
                .insert(data)
                .execute()
            )

            if not response.data:
                raise ValueError(
                    "No fue posible guardar el análisis."
                )

            return response.data[0]

        except Exception:
            logger.exception(
                "Error al guardar el análisis."
            )
            raise

    # --------------------------------------------------
    # ACTUALIZAR ESTADO DEL CULTIVO
    # --------------------------------------------------

    def update_crop_status(
        self,
        crop_id: str,
        estado: str
    ):

        # Estados permitidos en AgroVision
        allowed_statuses = {
            "Activo",
            "Con enfermedad"
        }

        if estado not in allowed_statuses:
            raise ValueError(
                f"Estado de cultivo no permitido: {estado}"
            )

        try:
            response = (
                self.client
                .table("crops")
                .update({
                    "estado": estado
                })
                .eq("id", crop_id)
                .execute()
            )

            if not response.data:
                raise ValueError(
                    "No se encontró el cultivo "
                    "o no fue posible actualizarlo."
                )

            logger.info(
                "Estado del cultivo %s actualizado a %s",
                crop_id,
                estado
            )

            return response.data[0]

        except Exception:
            logger.exception(
                "Error al actualizar estado del cultivo."
            )
            raise


supabase_service = SupabaseService()

from supabase import create_client, Client

from app.config.settings import settings


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

        except Exception as error:
            print("===== ERROR AL OBTENER CULTIVO =====")
            print(error)
            print("====================================")

            raise error

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
                    "No fue posible guardar el análisis en Supabase."
                )

            return response.data[0]

        except Exception as error:
            print("===== ERROR AL GUARDAR ANÁLISIS =====")
            print(error)
            print("=====================================")

            raise error


supabase_service = SupabaseService()
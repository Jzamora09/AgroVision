
from app.services.classification_service import (
    classification_service
)


def main():

    image_path = "Planta mala.jpeg"

    print("=" * 45)
    print("PRUEBA DEL CLASIFICADOR AGROVISION")
    print("=" * 45)

    result = classification_service.classify_image(
        image_path
    )

    print("\nRESULTADO DEL ANÁLISIS")
    print("-" * 45)

    print("Estado:", result["estado"])
    print("Confianza:", result["confianza"], "%")
    print("Modelo:", result["modelo"])

    print("\nCARACTERÍSTICAS EXTRAÍDAS")

    for name, value in result["caracteristicas"].items():
        print(f"{name}: {value}")

    print("\nClasificación completada.")


if __name__ == "__main__":
    main()

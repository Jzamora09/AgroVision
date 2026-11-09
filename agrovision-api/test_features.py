
from app.services.preprocessing_service import (
    preprocessing_service
)

from app.services.feature_extraction_service import (
    feature_extraction_service
)


# Fotografía de prueba
image_path = "Planta mala.jpeg"

# Procesar fotografía
processed = preprocessing_service.process_image(
    image_path
)

# Extraer características
features = feature_extraction_service.extract_features(
    processed["filtered"],
    processed["mask"]
)

print("\nCARACTERÍSTICAS EXTRAÍDAS")
print("-" * 45)

for name, value in features.items():
    print(f"{name}: {value:.4f}")

print("-" * 45)
print("Extracción completada correctamente.")

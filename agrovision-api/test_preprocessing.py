
import cv2

from app.services.preprocessing_service import (
    preprocessing_service
)

# Coloca una fotografía de prueba en la raíz del proyecto
image_path = "planta mala.jpeg"

result = preprocessing_service.process_image(image_path)

cv2.imwrite("resultado_normalizado.jpg", result["resized"])
cv2.imwrite("resultado_filtrado.jpg", result["filtered"])
cv2.imwrite("resultado_mascara.png", result["mask"])
cv2.imwrite("resultado_segmentado.jpg", result["segmented"])

print("Procesamiento completado correctamente.")
print("Dimensiones:", result["resized"].shape)
print("Rango normalizado:",
      result["normalized"].min(),
      result["normalized"].max())

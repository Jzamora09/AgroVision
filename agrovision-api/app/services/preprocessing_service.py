
import cv2
import numpy as np
from pathlib import Path


class PreprocessingService:

    def process_image(self, image_path: str):
        """
        Normaliza, filtra y segmenta una fotografía.
        Devuelve las imágenes intermedias y una máscara.
        """

        image = cv2.imread(str(image_path))

        if image is None:
            raise ValueError("No se pudo cargar la fotografía.")

        # 1. Normalización del tamaño
        resized = cv2.resize(
            image,
            (256, 256),
            interpolation=cv2.INTER_AREA
        )

        # 2. Normalización de píxeles al intervalo [0, 1]
        normalized = resized.astype(np.float32) / 255.0

        # 3. Filtrado para reducir ruido
        filtered = cv2.GaussianBlur(
            resized,
            (5, 5),
            0
        )

        # 4. Conversión a espacio de color HSV
        hsv = cv2.cvtColor(
            filtered,
            cv2.COLOR_BGR2HSV
        )

        # 5. Segmentación inicial de regiones verdes
        lower_green = np.array([25, 35, 35], dtype=np.uint8)
        upper_green = np.array([95, 255, 255], dtype=np.uint8)

        mask = cv2.inRange(
            hsv,
            lower_green,
            upper_green
        )

        # 6. Limpieza de la máscara
        kernel = np.ones((5, 5), np.uint8)

        mask = cv2.morphologyEx(
            mask,
            cv2.MORPH_OPEN,
            kernel
        )

        mask = cv2.morphologyEx(
            mask,
            cv2.MORPH_CLOSE,
            kernel
        )

        # 7. Aplicar la máscara
        segmented = cv2.bitwise_and(
            filtered,
            filtered,
            mask=mask
        )

        return {
            "original": image,
            "resized": resized,
            "normalized": normalized,
            "filtered": filtered,
            "mask": mask,
            "segmented": segmented
        }


preprocessing_service = PreprocessingService()

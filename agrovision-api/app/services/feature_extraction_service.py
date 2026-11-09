
import cv2
import numpy as np

from skimage.feature import graycomatrix, graycoprops


class FeatureExtractionService:

    def extract_features(self, image, mask=None):
        """
        Extrae características de color, textura y forma.
        Devuelve un diccionario con los valores calculados.
        """

        if image is None:
            raise ValueError("La imagen no es válida.")

        # 1. Preparar máscara
        if mask is None:
            mask = np.full(
                image.shape[:2],
                255,
                dtype=np.uint8
            )

        if mask.shape != image.shape[:2]:
            raise ValueError(
                "La máscara y la imagen deben tener "
                "las mismas dimensiones."
            )

        mask = np.where(mask > 0, 255, 0).astype(np.uint8)

        if cv2.countNonZero(mask) == 0:
            raise ValueError(
                "La máscara no contiene regiones válidas."
            )

        # 2. Características de color (HSV)
        hsv = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2HSV
        )

        mean_hsv = cv2.mean(
            hsv,
            mask=mask
        )[:3]

        # 3. Características de textura (GLCM)
        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        # Reducir niveles de gris de 256 a 32
        gray_quantized = (
            gray // 8
        ).astype(np.uint8)

        # Calcular GLCM en la región delimitada
        x, y, w, h = cv2.boundingRect(mask)

        gray_region = gray_quantized[
            y:y + h,
            x:x + w
        ]

        glcm = graycomatrix(
            gray_region,
            distances=[1],
            angles=[0],
            levels=32,
            symmetric=True,
            normed=True
        )

        contrast = graycoprops(
            glcm, "contrast"
        )[0, 0]

        homogeneity = graycoprops(
            glcm, "homogeneity"
        )[0, 0]

        energy = graycoprops(
            glcm, "energy"
        )[0, 0]

        correlation = graycoprops(
            glcm, "correlation"
        )[0, 0]

        # 4. Características geométricas
        contours, _ = cv2.findContours(
            mask,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        largest_contour = max(
            contours,
            key=cv2.contourArea
        )

        area = cv2.contourArea(
            largest_contour
        )

        perimeter = cv2.arcLength(
            largest_contour,
            True
        )

        circularity = (
            4 * np.pi * area / (perimeter ** 2)
            if perimeter > 0 else 0.0
        )

        # 5. Devolver características
        return {
            "color_h": float(mean_hsv[0]),
            "color_s": float(mean_hsv[1]),
            "color_v": float(mean_hsv[2]),
            "texture_contrast": float(contrast),
            "texture_homogeneity": float(homogeneity),
            "texture_energy": float(energy),
            "texture_correlation": float(correlation),
            "shape_area": float(area),
            "shape_perimeter": float(perimeter),
            "shape_circularity": float(circularity)
        }


feature_extraction_service = FeatureExtractionService()

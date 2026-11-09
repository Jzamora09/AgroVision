
from pathlib import Path

import joblib
import numpy as np

from app.services.preprocessing_service import (
    preprocessing_service
)

from app.services.feature_extraction_service import (
    feature_extraction_service
)


class ClassificationService:

    def __init__(self):

        # Ubicación del modelo entrenado
        self.model_path = (
            Path(__file__).resolve().parents[2]
            / "models"
            / "agrovision_classifier.pkl"
        )

        self.model = None
        self.feature_names = None
        self.classes = None

    def load_model(self):

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"No se encontró el modelo: {self.model_path}"
            )

        # Cargar únicamente modelos generados por nosotros
        data = joblib.load(self.model_path)

        self.model = data["model"]
        self.feature_names = data["feature_names"]
        self.classes = data["classes"]

    def classify_image(self, image_path: str):

        # 1. Cargar modelo
        if self.model is None:
            self.load_model()

        # 2. Procesamiento digital de imágenes
        processed = preprocessing_service.process_image(
            image_path
        )

        # 3. Extracción de características
        features = feature_extraction_service.extract_features(
            processed["filtered"],
            processed["mask"]
        )

        # 4. Construir vector de características
        vector = np.array(
            [
                features[name]
                for name in self.feature_names
            ],
            dtype=np.float64
        ).reshape(1, -1)

        if not np.all(np.isfinite(vector)):
            raise ValueError(
                "Se encontraron características no válidas."
            )

        # 5. Realizar clasificación
        prediction = int(
            self.model.predict(vector)[0]
        )

        probabilities = self.model.predict_proba(
            vector
        )[0]

        # 6. Obtener probabilidad de la clase predicha
        class_index = list(
            self.model.classes_
        ).index(prediction)

        confidence = float(
            probabilities[class_index] * 100
        )

        # 7. Convertir resultado a texto
        labels = {
            value: name.capitalize()
            for name, value in self.classes.items()
        }

        result = {
            "estado": labels[prediction],
            "confianza": round(confidence, 2),
            "caracteristicas": {
                key: round(float(value), 4)
                for key, value in features.items()
            },
            "modelo": "Random Forest",
            "tipo_clasificacion": "Binaria"
        }

        return result


classification_service = ClassificationService()

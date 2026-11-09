
from pathlib import Path

import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from app.services.preprocessing_service import (
    preprocessing_service
)

from app.services.feature_extraction_service import (
    feature_extraction_service
)


# -----------------------------------------
# CONFIGURACION
# -----------------------------------------

DATASET = Path("dataset")
MODEL_DIR = Path("models")

MODEL_DIR.mkdir(exist_ok=True)

FEATURE_NAMES = [
    "color_h",
    "color_s",
    "color_v",
    "texture_contrast",
    "texture_homogeneity",
    "texture_energy",
    "texture_correlation",
    "shape_area",
    "shape_perimeter",
    "shape_circularity"
]

CLASSES = {
    "sana": 0,
    "enferma": 1
}


# -----------------------------------------
# CARGAR Y PROCESAR FOTOGRAFIAS
# -----------------------------------------

def load_dataset():

    X = []
    y = []

    for class_name, label in CLASSES.items():

        folder = DATASET / class_name

        if not folder.exists():
            raise FileNotFoundError(
                f"No existe la carpeta: {folder}"
            )

        print(f"\nProcesando clase: {class_name}")

        for image_path in folder.iterdir():

            if image_path.suffix.lower() not in (
                ".jpg", ".jpeg", ".png"
            ):
                continue

            try:
                processed = preprocessing_service.process_image(
                    str(image_path)
                )

                features = feature_extraction_service.extract_features(
                    processed["filtered"],
                    processed["mask"]
                )

                vector = [
                    features[name]
                    for name in FEATURE_NAMES
                ]

                if not np.all(np.isfinite(vector)):
                    raise ValueError(
                        "Se encontraron valores no finitos."
                    )

                X.append(vector)
                y.append(label)

            except Exception as error:
                print(
                    f"Error procesando {image_path.name}: {error}"
                )

    return np.array(X), np.array(y)


# -----------------------------------------
# ENTRENAR MODELO
# -----------------------------------------

def main():

    print("=" * 50)
    print("ENTRENAMIENTO DEL CLASIFICADOR AGROVISION")
    print("=" * 50)

    X, y = load_dataset()

    print(f"\nFotografias procesadas: {len(X)}")
    print(f"Caracteristicas por imagen: {X.shape[1] if len(X) else 0}")

    if len(X) == 0 or len(set(y)) < 2:
        raise ValueError(
            "Se necesitan fotografias validas de ambas clases."
        )

    # Separar entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    print(f"Fotografias de entrenamiento: {len(X_train)}")
    print(f"Fotografias de prueba: {len(X_test)}")

    # Crear clasificador
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced"
    )

    print("\nEntrenando modelo Random Forest...")

    model.fit(X_train, y_train)

    print("Entrenamiento completado.")

    # Evaluacion
    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print("\n" + "=" * 50)
    print("RESULTADOS DE EVALUACION")
    print("=" * 50)

    print(f"\nExactitud: {accuracy * 100:.2f}%")

    print("\nReporte de clasificacion:")

    print(
        classification_report(
            y_test,
            predictions,
            labels=[0, 1],
            target_names=["Sana", "Enferma"],
            zero_division=0
        )
    )

    print("\nMatriz de confusion:")

    print(
        confusion_matrix(
            y_test,
            predictions,
            labels=[0, 1]
        )
    )

    # Guardar clasificador
    model_path = MODEL_DIR / "agrovision_classifier.pkl"

    joblib.dump(
        {
            "model": model,
            "feature_names": FEATURE_NAMES,
            "classes": CLASSES
        },
        model_path
    )

    print("\nModelo guardado correctamente.")
    print(f"Ubicacion: {model_path}")


if __name__ == "__main__":
    main()


from pathlib import Path
from urllib.parse import quote
import requests
import time

REPO = "spMohanty/PlantVillage-Dataset"
API = f"https://api.github.com/repos/{REPO}/contents/raw/color"

CLASES = {
    "sana": "Tomato___healthy",
    "enferma": "Tomato___Early_blight"
}

CANTIDAD = 100
DESTINO = Path("dataset")

session = requests.Session()
session.headers.update({
    "User-Agent": "AgroVision-Dataset-Downloader"
})

def descargar_clase(etiqueta, carpeta):
    destino = DESTINO / etiqueta
    destino.mkdir(parents=True, exist_ok=True)

    url = f"{API}/{quote(carpeta, safe='')}"

    respuesta = session.get(
        url,
        params={"per_page": 100},
        timeout=60
    )
    respuesta.raise_for_status()

    archivos = [
        archivo for archivo in respuesta.json()
        if archivo["name"].lower().endswith(
            (".jpg", ".jpeg", ".png")
        )
    ]

    print(f"{etiqueta}: {len(archivos)} archivos encontrados")

    descargadas = 0

    for archivo in archivos[:CANTIDAD]:
        ruta = destino / archivo["name"]

        if ruta.exists():
            descargadas += 1
            continue

        for intento in range(3):
            try:
                imagen = session.get(
                    archivo["download_url"],
                    timeout=60
                )
                imagen.raise_for_status()

                ruta.write_bytes(imagen.content)
                descargadas += 1
                print(f"{etiqueta}: {descargadas}/{CANTIDAD}")
                break

            except requests.RequestException as error:
                print(f"Reintento: {error}")
                time.sleep(2)

    print(f"Descargadas en {etiqueta}: {descargadas}")


def main():
    for etiqueta, carpeta in CLASES.items():
        descargar_clase(etiqueta, carpeta)

    print("Proceso de descarga finalizado.")


if __name__ == "__main__":
    main()

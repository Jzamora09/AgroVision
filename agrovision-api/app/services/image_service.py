from pathlib import Path
import shutil
from fastapi import UploadFile


class ImageService:

    UPLOAD_DIR = Path("uploads")

    def __init__(self):
        self.UPLOAD_DIR.mkdir(exist_ok=True)

    def save_image(self, image: UploadFile):

        file_path = self.UPLOAD_DIR / image.filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        return str(file_path)


image_service = ImageService()
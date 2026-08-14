import { supabase } from "@/lib/supabase";

import type {
  DetectionCropOption,
  DetectionResponse,
} from "../types/detection";

const API_URL =
  "http://127.0.0.1:8000/api/detection/analyze";

export const getDetectionCrops =
  async (): Promise<DetectionCropOption[]> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "Usuario no autenticado."
      );
    }

    const { data, error } = await supabase
      .from("crops")
      .select(`
        id,
        nombre,
        tipo,
        variedad
      `)
      .eq("user_id", user.id)
      .order("nombre", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return (
      data ?? []
    ) as DetectionCropOption[];
  };

export const analyzeCropImage = async (
  cropId: string,
  image: File
): Promise<DetectionResponse> => {
  if (!cropId) {
    throw new Error(
      "Selecciona un cultivo."
    );
  }

  if (!image) {
    throw new Error(
      "Selecciona una imagen."
    );
  }

  if (!image.type.startsWith("image/")) {
    throw new Error(
      "El archivo seleccionado debe ser una imagen."
    );
  }

  const maxSize =
    10 * 1024 * 1024;

  if (image.size > maxSize) {
    throw new Error(
      "La imagen no puede superar los 10 MB."
    );
  }

  const formData =
    new FormData();

  formData.append(
    "cultivo_id",
    cropId
  );

  formData.append(
    "image",
    image
  );

  const response = await fetch(
    API_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  let result: unknown;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      "El servidor devolvió una respuesta inválida."
    );
  }

  if (!response.ok) {
    let message =
      "No se pudo analizar la imagen.";

    if (
      typeof result === "object" &&
      result !== null &&
      "detail" in result
    ) {
      const detail = (
        result as {
          detail?: unknown;
        }
      ).detail;

      if (
        typeof detail === "string"
      ) {
        message = detail;
      }
    }

    throw new Error(message);
  }

  return result as DetectionResponse;
};
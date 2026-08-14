import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  analyzeCropImage,
  getDetectionCrops,
} from "../services/detectionService";

import type {
  DetectionCropOption,
  DetectionResponse,
} from "../types/detection";

export function useDetection() {
  const [crops, setCrops] =
    useState<DetectionCropOption[]>([]);

  const [selectedCropId, setSelectedCropId] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [result, setResult] =
    useState<DetectionResponse | null>(
      null
    );

  const [loadingCrops, setLoadingCrops] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadCrops =
    useCallback(async () => {
      try {
        setLoadingCrops(true);
        setError(null);

        const data =
          await getDetectionCrops();

        setCrops(data);
      } catch (error) {
        console.error(
          "Error cargando cultivos:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los cultivos."
        );
      } finally {
        setLoadingCrops(false);
      }
    }, []);

  const analyze = async () => {
    if (!selectedCropId) {
      setError(
        "Selecciona el cultivo que deseas analizar."
      );

      return;
    }

    if (!selectedImage) {
      setError(
        "Selecciona una fotografía de la planta."
      );

      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      setResult(null);

      const detection =
        await analyzeCropImage(
          selectedCropId,
          selectedImage
        );

      setResult(detection);
    } catch (error) {
      console.error(
        "Error analizando cultivo:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo analizar la imagen."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    void loadCrops();
  }, [loadCrops]);

  return {
    crops,

    selectedCropId,
    setSelectedCropId,

    selectedImage,
    setSelectedImage,

    result,

    loadingCrops,
    analyzing,
    error,

    analyze,
    resetAnalysis,
    refreshCrops: loadCrops,
  };
}
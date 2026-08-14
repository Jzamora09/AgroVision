import { useCallback, useEffect, useState } from "react";

import {
  createCrop,
  deleteCrop as deleteCropService,
  getCrops,
  updateCrop as updateCropService,
} from "../services/cropService";

import type {
  Crop,
  CropFormData,
} from "../types/crop";

export function useCrops() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCrops = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCrops();

      setCrops(data);
    } catch (error) {
      console.error("Error cargando cultivos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCrop = async (
    crop: CropFormData
  ): Promise<void> => {
    await createCrop(crop);

    await loadCrops();
  };

  const editCrop = async (
    id: string,
    crop: CropFormData
  ): Promise<void> => {
    await updateCropService(id, crop);

    await loadCrops();
  };

  const removeCrop = async (
    id: string
  ): Promise<void> => {
    await deleteCropService(id);

    await loadCrops();
  };

  useEffect(() => {
    void loadCrops();
  }, [loadCrops]);

  return {
    crops,
    loading,
    saveCrop,
    editCrop,
    removeCrop,
    loadCrops,
  };
}
import { useEffect, useState } from "react";

import {
  createCrop,
  getCrops,
} from "../services/cropService";

import type {
  Crop,
  CropFormData,
} from "../types/crop";

export function useCrops() {

  const [crops, setCrops] = useState<Crop[]>([]);

  const [loading, setLoading] =
    useState(false);

  const loadCrops = async () => {

    try {

      setLoading(true);

      const data = await getCrops();

      setCrops(data);

    } finally {

      setLoading(false);

    }

  };

  const saveCrop = async (
    crop: CropFormData
  ) => {

    await createCrop(crop);

    await loadCrops();

  };

  useEffect(() => {

    loadCrops();

  }, []);

  return {

    crops,

    loading,

    saveCrop,

    loadCrops,

  };
}
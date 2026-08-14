import { useState } from "react";

import {
  CropForm,
  CropGrid,
} from "../components";

import { useCrops } from "../hooks/useCrops";

import type { Crop } from "../types/crop";

export default function CropsPage() {
  const {
    crops,
    loading,
    saveCrop,
    editCrop,
    removeCrop,
  } = useCrops();

  const [editingCrop, setEditingCrop] =
    useState<Crop | null>(null);

  const handleEdit = (
    crop: Crop
  ) => {
    setEditingCrop(crop);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    setEditingCrop(null);
  };

  const handleDelete = async (
    crop: Crop
  ) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el cultivo "${crop.nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeCrop(crop.id);

      if (editingCrop?.id === crop.id) {
        setEditingCrop(null);
      }
    } catch (error) {
      console.error(
        "Error eliminando cultivo:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el cultivo."
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Gestión de cultivos 🌱
        </h1>

        <p className="mt-2 text-slate-500">
          Registra y administra tus cultivos en AgroVision.
        </p>
      </div>

      <CropForm
        onSave={saveCrop}
        onUpdate={editCrop}
        editingCrop={editingCrop}
        onCancelEdit={handleCancelEdit}
      />

      <CropGrid
        crops={crops}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
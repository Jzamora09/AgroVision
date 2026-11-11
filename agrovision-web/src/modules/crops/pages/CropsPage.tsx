
import { useEffect, useMemo, useState } from "react";

import {
  CropForm,
  CropGrid,
} from "../components";

import { useCrops } from "../hooks/useCrops";
import { supabase } from "../../../lib/supabase";

import type { Crop } from "../types/crop";
import type {
  CropAnalysis,
  CropAnalysisMap,
} from "../types/cropAnalysis";

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

  const [analyses, setAnalyses] =
    useState<CropAnalysisMap>({});

  const [loadingAnalyses, setLoadingAnalyses] =
    useState(false);

  const [analysisError, setAnalysisError] =
    useState("");

  // --------------------------------------------------
  // IDENTIFICADORES DE CULTIVOS
  // --------------------------------------------------

  const cropIds = useMemo(
    () =>
      crops
        .map((crop) => String(crop.id))
        .sort()
        .join(","),
    [crops]
  );

  // --------------------------------------------------
  // OBTENER ÚLTIMO ANÁLISIS DE CADA CULTIVO
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    async function loadAnalyses() {
      if (loading) {
        return;
      }

      if (!cropIds) {
        setAnalyses({});
        setLoadingAnalyses(false);
        return;
      }

      setLoadingAnalyses(true);
      setAnalysisError("");

      try {
        const ids = cropIds.split(",");

        const { data, error } = await supabase
          .from("disease_analyses")
          .select(
            "crop_id, estado, enfermedad, descripcion, confianza, created_at"
          )
          .in("crop_id", ids)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        const latest: CropAnalysisMap = {};

        for (const item of (data ?? []) as CropAnalysis[]) {
          const id = String(item.crop_id);

          // La consulta viene ordenada por fecha.
          // Guardamos únicamente el primer análisis
          // encontrado para cada cultivo.
          if (!latest[id]) {
            latest[id] = item;
          }
        }

        if (active) {
          setAnalyses(latest);
        }
      } catch (error) {
        console.error(
          "Error consultando análisis:",
          error
        );

        if (active) {
          setAnalysisError(
            "No fue posible consultar los últimos análisis."
          );
          setAnalyses({});
        }
      } finally {
        if (active) {
          setLoadingAnalyses(false);
        }
      }
    }

    loadAnalyses();

    return () => {
      active = false;
    };
  }, [cropIds, loading]);

  // --------------------------------------------------
  // EDITAR CULTIVO
  // --------------------------------------------------

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // CANCELAR EDICIÓN
  // --------------------------------------------------

  const handleCancelEdit = () => {
    setEditingCrop(null);
  };

  // --------------------------------------------------
  // ELIMINAR CULTIVO
  // --------------------------------------------------

  const handleDelete = async (crop: Crop) => {
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

      // Eliminar también el análisis de la vista.
      setAnalyses((previous) => {
        const updated = { ...previous };

        delete updated[String(crop.id)];

        return updated;
      });
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

  // --------------------------------------------------
  // INTERFAZ
  // --------------------------------------------------

  return (
    <div className="space-y-8">
      <div className="agro-page-heading">
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

      {analysisError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {analysisError}
        </div>
      )}

      <CropGrid
        crops={crops}
        loading={loading}
        analyses={analyses}
        loadingAnalyses={loadingAnalyses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}


import CropCard from "./CropCard";

import type { Crop } from "../types/crop";
import type {
  CropAnalysisMap,
} from "../types/cropAnalysis";

interface CropGridProps {
  crops: Crop[];
  loading: boolean;

  analyses: CropAnalysisMap;
  loadingAnalyses: boolean;

  onEdit: (crop: Crop) => void;
  onDelete: (crop: Crop) => void;
}

export default function CropGrid({
  crops,
  loading,
  analyses,
  loadingAnalyses,
  onEdit,
  onDelete,
}: CropGridProps) {

  // --------------------------------------------------
  // ESTADO DE CARGA
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="agro-surface rounded-3xl p-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

        <p className="mt-4 text-slate-500">
          Cargando cultivos...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // SIN CULTIVOS REGISTRADOS
  // --------------------------------------------------

  if (crops.length === 0) {
    return (
      <div className="agro-surface rounded-3xl p-12 text-center">
        <div className="text-5xl">
          🌱
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-800">
          No hay cultivos registrados
        </h3>

        <p className="mt-2 text-slate-500">
          Registra tu primer cultivo utilizando
          el formulario.
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // MOSTRAR TARJETAS
  // --------------------------------------------------

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800">
          Mis cultivos
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {crops.length}{" "}
          {crops.length === 1
            ? "cultivo registrado"
            : "cultivos registrados"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {crops.map((crop) => {
          const analysis = analyses[String(crop.id)];

          return (
            <CropCard
              key={crop.id}
              crop={crop}
              analysis={analysis}
              loadingAnalysis={loadingAnalyses}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </section>
  );
}

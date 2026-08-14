import CropCard from "./CropCard";

import type { Crop } from "../types/crop";

interface CropGridProps {
  crops: Crop[];
  loading: boolean;
  onEdit: (crop: Crop) => void;
  onDelete: (crop: Crop) => void;
}

export default function CropGrid({
  crops,
  loading,
  onEdit,
  onDelete,
}: CropGridProps) {
  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

        <p className="mt-4 text-slate-500">
          Cargando cultivos...
        </p>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <div className="text-5xl">
          🌱
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-800">
          No hay cultivos registrados
        </h3>

        <p className="mt-2 text-slate-500">
          Registra tu primer cultivo utilizando el formulario.
        </p>
      </div>
    );
  }

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
        {crops.map((crop) => (
          <CropCard
            key={crop.id}
            crop={crop}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
import {
  Bot,
  CalendarDays,
  Leaf,
  MapPin,
  Pencil,
  Ruler,
  Trash2,
} from "lucide-react";

import type { Crop } from "../types/crop";

interface CropCardProps {
  crop: Crop;
  onEdit: (crop: Crop) => void;
  onDelete: (crop: Crop) => void;
}

const getStatusClasses = (
  estado: string
) => {
  switch (estado) {
    case "Con enfermedad":
      return "bg-red-100 text-red-700";

    case "En crecimiento":
      return "bg-amber-100 text-amber-700";

    case "Cosechado":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-green-100 text-green-700";
  }
};

export default function CropCard({
  crop,
  onEdit,
  onDelete,
}: CropCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-green-100 p-2 text-green-700">
                <Leaf size={20} />
              </div>

              <h3 className="text-xl font-bold text-slate-800">
                {crop.nombre}
              </h3>
            </div>

            <p className="mt-2 capitalize text-slate-500">
              {crop.tipo}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
              crop.estado
            )}`}
          >
            {crop.estado}
          </span>
        </div>

        <div className="mt-6 grid gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <Leaf
              size={17}
              className="text-green-600"
            />

            <span>
              <strong>Variedad:</strong>{" "}
              {crop.variedad || "Sin especificar"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin
              size={17}
              className="text-green-600"
            />

            <span>
              <strong>Ubicación:</strong>{" "}
              {crop.ubicacion}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays
              size={17}
              className="text-green-600"
            />

            <span>
              <strong>Siembra:</strong>{" "}
              {crop.fecha_siembra}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Ruler
              size={17}
              className="text-green-600"
            />

            <span>
              <strong>Área:</strong>{" "}
              {crop.area || 0} m²
            </span>
          </div>
        </div>

        {crop.descripcion && (
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
            {crop.descripcion}
          </p>
        )}

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Bot
              size={18}
              className="text-green-600"
            />

            Análisis IA
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Sin análisis todavía.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-[auto_auto_1fr] gap-3">
          <button
            type="button"
            onClick={() => onEdit(crop)}
            title="Editar cultivo"
            className="flex h-11 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(crop)}
            title="Eliminar cultivo"
            className="flex h-11 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
          >
            <Trash2 size={18} />
          </button>

          <button
            type="button"
            title="Disponible en el módulo de detección"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 font-semibold text-white transition hover:bg-green-700"
          >
            <Bot size={18} />

            Analizar
          </button>
        </div>
      </div>
    </article>
  );
}
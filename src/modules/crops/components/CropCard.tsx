import {
  Calendar,
  Leaf,
  MapPin,
  Pencil,
  Trash2,
  Bot,
} from "lucide-react";

import type { Crop } from "../types/crop";

interface Props {
  crop: Crop;
}

export default function CropCard({
  crop,
}: Props) {
  return (
    <div
      className="
      rounded-3xl
      bg-white
      p-6
      shadow-lg
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      "
    >
      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            🌱 {crop.nombre}
          </h2>

          <p className="text-slate-500">
            {crop.tipo}
          </p>

        </div>

        <span
          className="
          rounded-full
          bg-green-100
          px-4
          py-1
          text-sm
          font-semibold
          text-green-700
          "
        >
          {crop.estado}
        </span>

      </div>

      <div className="space-y-3">

        <p className="flex items-center gap-2">

          <Leaf size={18} />

          <strong>Variedad:</strong>

          {crop.variedad || "-"}

        </p>

        <p className="flex items-center gap-2">

          <MapPin size={18} />

          <strong>Ubicación:</strong>

          {crop.ubicacion}

        </p>

        <p className="flex items-center gap-2">

          <Calendar size={18} />

          <strong>Siembra:</strong>

          {crop.fecha_siembra}

        </p>

      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">

        <p className="text-sm font-semibold text-slate-700">

          🤖 IA

        </p>

        <p className="mt-1 text-sm text-slate-500">

          Sin análisis todavía.

        </p>

      </div>

      <div className="mt-6 flex gap-3">

        <button
          className="
          flex-1
          rounded-xl
          bg-blue-600
          py-2
          font-medium
          text-white
          transition
          hover:bg-blue-700
          "
        >
          <Pencil
            size={18}
            className="mx-auto"
          />
        </button>

        <button
          className="
          flex-1
          rounded-xl
          bg-red-600
          py-2
          font-medium
          text-white
          transition
          hover:bg-red-700
          "
        >
          <Trash2
            size={18}
            className="mx-auto"
          />
        </button>

        <button
          className="
          flex-[2]
          rounded-xl
          bg-green-600
          py-2
          font-medium
          text-white
          transition
          hover:bg-green-700
          "
        >
          <div className="flex items-center justify-center gap-2">

            <Bot size={18} />

            Analizar

          </div>

        </button>

      </div>

    </div>
  );
}
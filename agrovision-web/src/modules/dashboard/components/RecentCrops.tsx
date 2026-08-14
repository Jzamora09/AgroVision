import {
  CalendarDays,
  MapPin,
  Sprout,
} from "lucide-react";

import type { RecentCrop } from "../types/dashboard";

interface Props {
  crops: RecentCrop[];
}

const getStatusClass = (
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

export default function RecentCrops({
  crops,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Cultivos recientes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Últimos cultivos registrados en AgroVision.
        </p>
      </div>

      {crops.length === 0 ? (
        <div className="py-12 text-center">
          <Sprout
            size={40}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-slate-400">
            Todavía no hay cultivos registrados.
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-slate-100">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                  <Sprout size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {crop.nombre}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {crop.tipo}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={15} />

                  {crop.ubicacion}
                </span>

                <span className="flex items-center gap-1">
                  <CalendarDays size={15} />

                  {new Date(
                    crop.created_at
                  ).toLocaleDateString()}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    crop.estado
                  )}`}
                >
                  {crop.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
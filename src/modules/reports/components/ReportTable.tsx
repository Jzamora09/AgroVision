import {
  FileSearch,
  MapPin,
} from "lucide-react";

import type {
  ReportCrop,
} from "../types/report";

interface Props {
  crops: ReportCrop[];
}

const getStatusClasses = (
  status: string
) => {
  switch (status) {
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

export default function ReportTable({
  crops,
}: Props) {
  if (crops.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <FileSearch
          size={42}
          className="mx-auto text-slate-300"
        />

        <h3 className="mt-4 text-xl font-bold text-slate-700">
          Sin resultados
        </h3>

        <p className="mt-2 text-slate-500">
          No existen cultivos que coincidan con los filtros seleccionados.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800">
          Resultados del reporte
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {crops.length}{" "}
          {crops.length === 1
            ? "registro encontrado"
            : "registros encontrados"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4">
                Cultivo
              </th>

              <th className="px-6 py-4">
                Tipo
              </th>

              <th className="px-6 py-4">
                Variedad
              </th>

              <th className="px-6 py-4">
                Ubicación
              </th>

              <th className="px-6 py-4">
                Área
              </th>

              <th className="px-6 py-4">
                Siembra
              </th>

              <th className="px-6 py-4">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {crops.map((crop) => (
              <tr
                key={crop.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">
                    {crop.nombre}
                  </p>
                </td>

                <td className="px-6 py-4 capitalize text-slate-600">
                  {crop.tipo}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {crop.variedad ||
                    "Sin especificar"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin
                      size={15}
                      className="text-green-600"
                    />

                    {crop.ubicacion ||
                      "Sin ubicación"}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-slate-700">
                  {Number(
                    crop.area ?? 0
                  ).toLocaleString()}{" "}
                  m²
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {crop.fecha_siembra ||
                    "Sin fecha"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      crop.estado
                    )}`}
                  >
                    {crop.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
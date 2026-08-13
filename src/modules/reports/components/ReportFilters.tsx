import {
  CalendarDays,
  Filter,
  RefreshCcw,
  Search,
} from "lucide-react";

import type {
  ReportCrop,
  ReportFilters as ReportFiltersType,
} from "../types/report";

interface ReportFiltersProps {
  filters: ReportFiltersType;
  crops: ReportCrop[];
  loading: boolean;
  onChange: (
    filters: ReportFiltersType
  ) => void;
  onGenerate: () => Promise<void>;
  onClear: () => Promise<void>;
}

export default function ReportFilters({
  filters,
  crops,
  loading,
  onChange,
  onGenerate,
  onClear,
}: ReportFiltersProps) {
  const handleChange = (
    field: keyof ReportFiltersType,
    value: string
  ) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-green-100 p-3 text-green-700">
          <Filter size={21} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Filtros del reporte
          </h2>

          <p className="text-sm text-slate-500">
            Filtra la información por cultivo o período.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Cultivo
          </label>

          <select
            value={filters.cropId}
            onChange={(event) =>
              handleChange(
                "cropId",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="">
              Todos los cultivos
            </option>

            {crops.map((crop) => (
              <option
                key={crop.id}
                value={crop.id}
              >
                {crop.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarDays size={16} />
            Desde
          </label>

          <input
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              handleChange(
                "startDate",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarDays size={16} />
            Hasta
          </label>

          <input
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              handleChange(
                "endDate",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => void onGenerate()}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search size={18} />

          {loading
            ? "Generando..."
            : "Generar reporte"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => void onClear()}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
        >
          <RefreshCcw size={18} />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
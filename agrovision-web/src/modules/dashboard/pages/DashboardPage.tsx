import { Bot, FileBarChart, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

import {
  CropsByStatusChart,
  CropsByTypeChart,
  DashboardStats,
  RecentCrops,
} from "../components";

import { useDashboardStats } from "../hooks/useDashboardStats";

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

          <p className="mt-4 text-slate-500">
            Cargando estadísticas...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-bold text-red-700">
          No se pudo cargar el Dashboard
        </h2>

        <p className="mt-2 text-red-600">
          {error ??
            "Ocurrió un error inesperado."}
        </p>

        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-5 rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="hidden">
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard estadístico 🌱
        </h1>

        <p className="mt-2 text-slate-500">
          Resumen general de tus cultivos en AgroVision.
        </p>
      </header>

      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-green-800 to-lime-600 p-7 text-white shadow-lg shadow-green-900/15 sm:p-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-50">
              <Leaf size={14} /> AgroVision
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Hola, Gabriel <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 text-sm text-green-50 sm:text-base">
              Aquí tienes el resumen de tus cultivos y actividades recientes.
            </p>
            <p className="mt-4 text-xs font-medium text-green-100">
              {new Intl.DateTimeFormat("es-GT", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/cultivos" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-green-800 shadow-sm transition hover:bg-green-50">
              <Leaf size={17} /> Nuevo cultivo
            </Link>
            <Link to="/deteccion" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
              <Bot size={17} /> Analizar planta
            </Link>
            <Link to="/reportes" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
              <FileBarChart size={17} /> Ver reportes
            </Link>
          </div>
        </div>
      </header>

      <DashboardStats
        stats={data.stats}
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <CropsByStatusChart
          data={data.cropsByStatus}
        />

        <CropsByTypeChart
          data={data.cropsByType}
        />
      </section>

      <RecentCrops
        crops={data.recentCrops}
      />
    </div>
  );
}

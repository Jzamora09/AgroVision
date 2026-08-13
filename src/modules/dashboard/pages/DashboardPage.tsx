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
      <header>
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard estadístico 🌱
        </h1>

        <p className="mt-2 text-slate-500">
          Resumen general de tus cultivos en AgroVision.
        </p>
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
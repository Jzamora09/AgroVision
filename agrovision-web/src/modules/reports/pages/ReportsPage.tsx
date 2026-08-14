import {
  BarChart3,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";

import {
  ReportFilters,
  ReportStats,
  ReportTable,
} from "../components";

import { useReports } from "../hooks/useReports";

import { exportReportToPdf } from "../utils/exportReportPdf";
import { exportReportToExcel } from "../utils/exportReportExcel";

export default function ReportsPage() {
  const {
    data,
    availableCrops,
    filters,
    setFilters,
    loading,
    error,
    generateReport,
    clearFilters,
  } = useReports();

  const selectedCrop =
    availableCrops.find(
      (crop) =>
        crop.id ===
        filters.cropId
    );

  const canExport =
    Boolean(
      data &&
      data.crops.length > 0
    );

  const handleExportPdf = () => {
    if (!data || !canExport) {
      return;
    }

    exportReportToPdf({
      data,
      filters,
      cropName:
        selectedCrop?.nombre,
    });
  };

  const handleExportExcel = () => {
    if (!data || !canExport) {
      return;
    }

    exportReportToExcel({
      data,
      filters,
      cropName:
        selectedCrop?.nombre,
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-3 text-green-700">
            <BarChart3 size={26} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Reportes y análisis
            </h1>

            <p className="mt-1 text-slate-500">
              Consulta, analiza y exporta la información de tus cultivos.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canExport}
            onClick={
              handleExportPdf
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-white
              px-5
              py-3
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <FileDown size={18} />

            Exportar PDF
          </button>

          <button
            type="button"
            disabled={!canExport}
            onClick={
              handleExportExcel
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-green-200
              bg-white
              px-5
              py-3
              font-semibold
              text-green-700
              transition
              hover:bg-green-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <FileSpreadsheet
              size={18}
            />

            Exportar Excel
          </button>
        </div>
      </header>

      <ReportFilters
        filters={filters}
        crops={availableCrops}
        loading={loading}
        onChange={setFilters}
        onGenerate={
          generateReport
        }
        onClear={
          clearFilters
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

            <p className="mt-4 text-slate-500">
              Generando reporte...
            </p>
          </div>
        </div>
      ) : (
        data && (
          <>
            <ReportStats
              stats={data.stats}
            />

            <ReportTable
              crops={data.crops}
            />
          </>
        )
      )}
    </div>
  );
}
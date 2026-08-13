import * as XLSX from "xlsx";

import type {
  ReportData,
  ReportFilters,
} from "../types/report";

interface ExportExcelParams {
  data: ReportData;
  filters: ReportFilters;
  cropName?: string;
}

export const exportReportToExcel = ({
  data,
  filters,
  cropName,
}: ExportExcelParams) => {
  const workbook =
    XLSX.utils.book_new();

  // Hoja 1: resumen
  const summaryData = [
    ["AGROVISION"],
    ["Reporte de cultivos"],
    [],
    ["Filtros"],
    [
      "Cultivo",
      cropName ||
        "Todos los cultivos",
    ],
    [
      "Desde",
      filters.startDate ||
        "Sin límite",
    ],
    [
      "Hasta",
      filters.endDate ||
        "Sin límite",
    ],
    [],
    ["Resumen"],
    [
      "Total de cultivos",
      data.stats.totalCrops,
    ],
    [
      "Área total (m²)",
      data.stats.totalArea,
    ],
    [
      "Activos",
      data.stats.activeCrops,
    ],
    [
      "En crecimiento",
      data.stats.growingCrops,
    ],
    [
      "Con enfermedad",
      data.stats.diseasedCrops,
    ],
    [
      "Cosechados",
      data.stats.harvestedCrops,
    ],
  ];

  const summarySheet =
    XLSX.utils.aoa_to_sheet(
      summaryData
    );

  summarySheet["!cols"] = [
    { wch: 24 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Resumen"
  );

  // Hoja 2: cultivos
  const cropRows =
    data.crops.map(
      (crop) => ({
        Cultivo:
          crop.nombre,

        Tipo:
          crop.tipo,

        Variedad:
          crop.variedad ||
          "Sin especificar",

        Ubicación:
          crop.ubicacion ||
          "Sin ubicación",

        "Área (m²)":
          Number(
            crop.area ?? 0
          ),

        "Fecha de siembra":
          crop.fecha_siembra ||
          "",

        Estado:
          crop.estado,

        Descripción:
          crop.descripcion ||
          "",
      })
    );

  const cropsSheet =
    XLSX.utils.json_to_sheet(
      cropRows
    );

  cropsSheet["!cols"] = [
    { wch: 24 },
    { wch: 20 },
    { wch: 22 },
    { wch: 25 },
    { wch: 14 },
    { wch: 18 },
    { wch: 20 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    cropsSheet,
    "Cultivos"
  );

  const fileDate =
    new Date()
      .toISOString()
      .slice(0, 10);

  XLSX.writeFile(
    workbook,
    `agrovision-reporte-${fileDate}.xlsx`
  );
};
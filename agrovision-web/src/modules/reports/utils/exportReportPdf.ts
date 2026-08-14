import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type {
  ReportData,
  ReportFilters,
} from "../types/report";

interface ExportPdfParams {
  data: ReportData;
  filters: ReportFilters;
  cropName?: string;
}

export const exportReportToPdf = ({
  data,
  filters,
  cropName,
}: ExportPdfParams) => {
  const doc = new jsPDF();

  const generatedAt =
    new Date().toLocaleString("es-GT");

  // Encabezado
  doc.setFontSize(20);
  doc.text(
    "AgroVision",
    14,
    18
  );

  doc.setFontSize(14);
  doc.text(
    "Reporte de cultivos",
    14,
    28
  );

  doc.setFontSize(9);
  doc.setTextColor(100);

  doc.text(
    `Generado: ${generatedAt}`,
    14,
    35
  );

  // Filtros utilizados
  let filterY = 44;

  doc.setFontSize(11);
  doc.setTextColor(0);

  doc.text(
    "Filtros aplicados",
    14,
    filterY
  );

  filterY += 7;

  doc.setFontSize(9);
  doc.setTextColor(90);

  doc.text(
    `Cultivo: ${cropName || "Todos los cultivos"}`,
    14,
    filterY
  );

  filterY += 6;

  doc.text(
    `Desde: ${filters.startDate || "Sin límite"}`,
    14,
    filterY
  );

  filterY += 6;

  doc.text(
    `Hasta: ${filters.endDate || "Sin límite"}`,
    14,
    filterY
  );

  // Resumen
  filterY += 12;

  doc.setFontSize(11);
  doc.setTextColor(0);

  doc.text(
    "Resumen",
    14,
    filterY
  );

  filterY += 7;

  doc.setFontSize(9);

  doc.text(
    `Total de cultivos: ${data.stats.totalCrops}`,
    14,
    filterY
  );

  doc.text(
    `Área total: ${data.stats.totalArea.toLocaleString()} m2`,
    75,
    filterY
  );

  filterY += 6;

  doc.text(
    `Activos: ${data.stats.activeCrops}`,
    14,
    filterY
  );

  doc.text(
    `En crecimiento: ${data.stats.growingCrops}`,
    55,
    filterY
  );

  doc.text(
    `Con enfermedad: ${data.stats.diseasedCrops}`,
    115,
    filterY
  );

  filterY += 6;

  doc.text(
    `Cosechados: ${data.stats.harvestedCrops}`,
    14,
    filterY
  );

  // Tabla
  autoTable(doc, {
    startY: filterY + 10,

    head: [
      [
        "Cultivo",
        "Tipo",
        "Variedad",
        "Ubicación",
        "Área m2",
        "Siembra",
        "Estado",
      ],
    ],

    body: data.crops.map(
      (crop) => [
        crop.nombre,
        crop.tipo,
        crop.variedad ||
          "Sin especificar",
        crop.ubicacion ||
          "Sin ubicación",
        Number(
          crop.area ?? 0
        ).toLocaleString(),
        crop.fecha_siembra ||
          "Sin fecha",
        crop.estado,
      ]
    ),

    styles: {
      fontSize: 8,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [
        22,
        163,
        74,
      ],
    },
  });

  const fileDate =
    new Date()
      .toISOString()
      .slice(0, 10);

  doc.save(
    `agrovision-reporte-${fileDate}.pdf`
  );
};
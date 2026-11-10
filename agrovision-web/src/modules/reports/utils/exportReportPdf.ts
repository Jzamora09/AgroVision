import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { ReportData, ReportFilters } from "../types/report";

interface ExportPdfParams {
  data: ReportData;
  filters: ReportFilters;
  cropName?: string;
}

const COLORS = {
  green: [22, 101, 52] as [number, number, number],
  ink: [22, 55, 42] as [number, number, number],
  muted: [71, 93, 112] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  red: [185, 28, 28] as [number, number, number],
};

type PdfColor = [number, number, number];

export const exportReportToPdf = ({ data, filters, cropName }: ExportPdfParams) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const generatedAt = new Date().toLocaleString("es-GT");

  doc.setFillColor(...COLORS.green);
  doc.rect(0, 0, pageWidth, 43, "F");
  doc.setFillColor(134, 239, 172);
  doc.circle(margin + 6, 17, 6, "F");
  doc.setTextColor(...COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("AV", margin + 1.8, 19.2);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(21);
  doc.text("AgroVision", margin + 17, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Reporte inteligente de cultivos", margin + 17, 23);
  doc.setFontSize(8);
  doc.text(`Generado el ${generatedAt}`, pageWidth - margin, 16, { align: "right" });
  doc.text("Smart Agriculture", pageWidth - margin, 23, { align: "right" });

  doc.setTextColor(...COLORS.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Resumen de cultivos", margin, 57);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text("Consulta el estado actual de tus parcelas registradas.", margin, 64);

  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, 71, pageWidth - margin * 2, 27, 3, 3, "FD");
  doc.setTextColor(...COLORS.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Filtros aplicados", margin + 6, 79);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(`Cultivo: ${cropName || "Todos los cultivos"}`, margin + 6, 88);
  doc.text(`Desde: ${filters.startDate || "Sin limite"}`, margin + 78, 88);
  doc.text(`Hasta: ${filters.endDate || "Sin limite"}`, margin + 139, 88);

  const summary: Array<[string, string, PdfColor]> = [
    ["Cultivos", String(data.stats.totalCrops), COLORS.green],
    ["Area total", `${data.stats.totalArea.toLocaleString()} m2`, [37, 99, 235]],
    ["Activos", String(data.stats.activeCrops), [5, 150, 105]],
    ["Crecimiento", String(data.stats.growingCrops), [180, 83, 9]],
    ["Enfermedad", String(data.stats.diseasedCrops), COLORS.red],
    ["Cosechados", String(data.stats.harvestedCrops), [109, 40, 217]],
  ] as const;
  const cardGap = 4;
  const cardWidth = (pageWidth - margin * 2 - cardGap * 2) / 3;
  const cardHeight = 23;
  const summaryY = 107;

  summary.forEach(([label, value, color], index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = margin + column * (cardWidth + cardGap);
    const y = summaryY + row * (cardHeight + 5);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "FD");
    doc.setFillColor(...color);
    doc.roundedRect(x, y, 2.5, cardHeight, 1, 1, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(label, x + 7, y + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.ink);
    doc.text(value, x + 7, y + 17);
  });

  autoTable(doc, {
    startY: summaryY + cardHeight * 2 + 17,
    margin: { left: margin, right: margin },
    head: [["Cultivo", "Tipo", "Variedad", "Ubicacion", "Area m2", "Siembra", "Estado"]],
    body: data.crops.map((crop) => [
      crop.nombre,
      crop.tipo,
      crop.variedad || "Sin especificar",
      crop.ubicacion || "Sin ubicacion",
      `${Number(crop.area ?? 0).toLocaleString()} m2`,
      crop.fecha_siembra || "Sin fecha",
      crop.estado,
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3.5,
      textColor: COLORS.ink,
      lineColor: [235, 241, 237],
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: COLORS.green,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: { fillColor: [248, 251, 249] },
    columnStyles: { 0: { fontStyle: "bold" }, 4: { halign: "right" } },
  });

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...COLORS.border);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text("AgroVision · Reporte generado automaticamente", margin, pageHeight - 9);
    doc.text(`Pagina ${page} de ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  const fileDate = new Date().toISOString().slice(0, 10);
  doc.save(`agrovision-reporte-${fileDate}.pdf`);
};

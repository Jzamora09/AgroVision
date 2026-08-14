export interface ReportCrop {
  id: string;
  nombre: string;
  tipo: string;
  variedad: string | null;
  fecha_siembra: string | null;
  ubicacion: string | null;
  area: number | null;
  estado: string;
  descripcion: string | null;
  created_at: string;
}

export interface ReportFilters {
  cropId: string;
  startDate: string;
  endDate: string;
}

export interface ReportStats {
  totalCrops: number;
  totalArea: number;
  activeCrops: number;
  growingCrops: number;
  diseasedCrops: number;
  harvestedCrops: number;
}

export interface ReportData {
  crops: ReportCrop[];
  stats: ReportStats;
}
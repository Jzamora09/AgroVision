
export interface CropAnalysis {
  crop_id: string;
  estado: string;
  enfermedad: string;
  descripcion: string;
  confianza: number;
  created_at: string;
}

export type CropAnalysisMap = Record<
  string,
  CropAnalysis
>;

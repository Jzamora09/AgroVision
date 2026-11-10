export interface PredictionAnalysis {
  id: string;
  crop_id: string;
  estado: string;
  enfermedad: string;
  tipo_problema: string;
  confianza: number;
  recomendaciones: string[];
  prevencion: string[];
  created_at: string;
}

export type PredictionRisk =
  | "Bajo"
  | "Moderado"
  | "Alto";

export type PredictionTrend =
  | "Estable"
  | "Requiere monitoreo"
  | "Riesgo recurrente";

export interface CropPredictionResult {
  cropId: string;
  cropName: string;

  totalAnalyses: number;
  affectedAnalyses: number;

  predominantProblem: string;
  predominantDisease: string;

  averageConfidence: number;
  affectedPercentage: number;

  risk: PredictionRisk;
  trend: PredictionTrend;

  summary: string;
  recommendations: string[];
}
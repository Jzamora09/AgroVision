export interface DetectionCrop {
  nombre: string;
  tipo: string;
  variedad: string | null;
}

export interface DetectionAnalysis {
  cultivo_coincide: boolean;
  estado: string;
  enfermedad: string;
  tipo_problema: string;
  confianza: number;
  sintomas: string[];
  descripcion: string;
  recomendaciones: string[];
}

export interface DetectionResponse {
  success: boolean;
  cultivo_id: string;
  cultivo: DetectionCrop;
  image_path: string;
  analysis: DetectionAnalysis;
}

export interface DetectionCropOption {
  id: string;
  nombre: string;
  tipo: string;
  variedad: string | null;
}
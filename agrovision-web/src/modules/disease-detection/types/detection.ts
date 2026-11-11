
/**
 * INFORMACIÓN DEL CULTIVO
 */
export interface DetectionCrop {
  nombre: string;
  tipo: string;
  variedad: string | null;
}

/**
 * RESULTADO DEL ANÁLISIS
 */
export interface DetectionAnalysis {
  cultivo_coincide: boolean;

  estado: string;
  enfermedad: string;
  tipo_problema: string;

  confianza: number;

  sintomas: string[];
  descripcion: string;
  recomendaciones: string[];

  // Medidas preventivas devueltas por el backend
  prevencion: string[];
}

/**
 * RESPUESTA COMPLETA DEL BACKEND
 */
export interface DetectionResponse {
  success: boolean;

  cultivo_id: string;
  cultivo: DetectionCrop;

  image_path: string;

  analysis: DetectionAnalysis;

  // Identifica el origen del resultado
  modelo_utilizado?: string;

  // Indica si NVIDIA falló y se utilizó
  // información agrícola precargada
  respaldo_activado?: boolean;
}

/**
 * OPCIONES DEL SELECTOR DE CULTIVOS
 */
export interface DetectionCropOption {
  id: string;
  nombre: string;
  tipo: string;
  variedad: string | null;
}

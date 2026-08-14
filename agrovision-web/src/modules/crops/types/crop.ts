export interface Crop {
  id: string;

  user_id: string;

  nombre: string;

  tipo: string;

  variedad: string;

  fecha_siembra: string;

  ubicacion: string;

  area: number;

  estado: string;

  descripcion: string;

  imagen_url: string;

  created_at: string;
}

export interface CropFormData {
  nombre: string;

  tipo: string;

  variedad: string;

  fecha_siembra: string;

  ubicacion: string;

  area: number;

  estado: string;

  descripcion: string;

  imagen_url: string;
}
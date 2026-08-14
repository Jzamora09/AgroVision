export interface DashboardStats {
  totalCrops: number;
  totalArea: number;
  activeCrops: number;
  growingCrops: number;
  diseasedCrops: number;
  harvestedCrops: number;
}

export interface CropStatusData {
  name: string;
  value: number;
}

export interface CropTypeData {
  name: string;
  value: number;
}

export interface RecentCrop {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  ubicacion: string;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  cropsByStatus: CropStatusData[];
  cropsByType: CropTypeData[];
  recentCrops: RecentCrop[];
}
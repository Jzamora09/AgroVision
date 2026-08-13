import { supabase } from "@/lib/supabase";

import type {
  CropStatusData,
  CropTypeData,
  DashboardData,
  RecentCrop,
} from "../types/dashboard";

interface CropDashboardRow {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  ubicacion: string;
  area: number | null;
  created_at: string;
}

export const getDashboardData =
  async (): Promise<DashboardData> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "Usuario no autenticado."
      );
    }

    const { data, error } = await supabase
      .from("crops")
      .select(
        `
        id,
        nombre,
        tipo,
        estado,
        ubicacion,
        area,
        created_at
        `
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    const crops =
      (data ?? []) as CropDashboardRow[];

    const totalCrops = crops.length;

    const totalArea = crops.reduce(
      (total, crop) =>
        total + Number(crop.area ?? 0),
      0
    );

    const activeCrops = crops.filter(
      (crop) =>
        crop.estado === "Activo"
    ).length;

    const growingCrops = crops.filter(
      (crop) =>
        crop.estado === "En crecimiento"
    ).length;

    const diseasedCrops = crops.filter(
      (crop) =>
        crop.estado === "Con enfermedad"
    ).length;

    const harvestedCrops = crops.filter(
      (crop) =>
        crop.estado === "Cosechado"
    ).length;

    const statusMap =
      new Map<string, number>();

    crops.forEach((crop) => {
      const status =
        crop.estado || "Sin estado";

      statusMap.set(
        status,
        (statusMap.get(status) ?? 0) + 1
      );
    });

    const cropsByStatus: CropStatusData[] =
      Array.from(
        statusMap.entries()
      ).map(([name, value]) => ({
        name,
        value,
      }));

    const typeMap =
      new Map<string, number>();

    crops.forEach((crop) => {
      const type =
        crop.tipo?.trim() ||
        "Sin especificar";

      typeMap.set(
        type,
        (typeMap.get(type) ?? 0) + 1
      );
    });

    const cropsByType: CropTypeData[] =
      Array.from(
        typeMap.entries()
      ).map(([name, value]) => ({
        name,
        value,
      }));

    const recentCrops: RecentCrop[] =
      crops.slice(0, 5).map((crop) => ({
        id: crop.id,
        nombre: crop.nombre,
        tipo: crop.tipo,
        estado: crop.estado,
        ubicacion: crop.ubicacion,
        created_at: crop.created_at,
      }));

    return {
      stats: {
        totalCrops,
        totalArea,
        activeCrops,
        growingCrops,
        diseasedCrops,
        harvestedCrops,
      },

      cropsByStatus,

      cropsByType,

      recentCrops,
    };
  };
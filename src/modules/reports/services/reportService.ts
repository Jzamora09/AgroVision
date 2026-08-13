import { supabase } from "@/lib/supabase";

import type {
  ReportCrop,
  ReportData,
  ReportFilters,
} from "../types/report";

export const getReportData = async (
  filters: ReportFilters
): Promise<ReportData> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  let query = supabase
    .from("crops")
    .select(`
      id,
      nombre,
      tipo,
      variedad,
      fecha_siembra,
      ubicacion,
      area,
      estado,
      descripcion,
      created_at
    `)
    .eq("user_id", user.id);

  // Filtrar por cultivo
  if (filters.cropId) {
    query = query.eq(
      "id",
      filters.cropId
    );
  }

  // Filtrar desde fecha de siembra
  if (filters.startDate) {
    query = query.gte(
      "fecha_siembra",
      filters.startDate
    );
  }

  // Filtrar hasta fecha de siembra
  if (filters.endDate) {
    query = query.lte(
      "fecha_siembra",
      filters.endDate
    );
  }

  const { data, error } = await query.order(
    "fecha_siembra",
    {
      ascending: false,
    }
  );

  if (error) {
    throw error;
  }

  const crops =
    (data ?? []) as ReportCrop[];

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

  return {
    crops,

    stats: {
      totalCrops: crops.length,
      totalArea,
      activeCrops,
      growingCrops,
      diseasedCrops,
      harvestedCrops,
    },
  };
};
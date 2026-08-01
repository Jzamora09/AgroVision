import { supabase } from "@/lib/supabase";

import type {
  Crop,
  CropFormData,
} from "../types/crop";

export const createCrop = async (
  crop: CropFormData
) => {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  const { data, error } = await supabase
    .from("crops")
    .insert({
      user_id: user.id,

      ...crop,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Crop;
};

export const getCrops = async () => {

  const { data, error } = await supabase
    .from("crops")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data as Crop[];
};
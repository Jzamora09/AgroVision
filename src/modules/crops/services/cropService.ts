import { supabase } from "@/lib/supabase";

import type {
  Crop,
  CropFormData,
} from "../types/crop";

export const createCrop = async (
  crop: CropFormData
): Promise<Crop> => {
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

  if (error) {
    throw error;
  }

  return data as Crop;
};

export const getCrops = async (): Promise<Crop[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  const { data, error } = await supabase
    .from("crops")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as Crop[];
};

export const updateCrop = async (
  id: string,
  crop: CropFormData
): Promise<Crop> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  const { data, error } = await supabase
    .from("crops")
    .update(crop)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Crop;
};

export const deleteCrop = async (
  id: string
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  const { error } = await supabase
    .from("crops")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }
};
import { supabase } from "@/lib/supabase";

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  fullName,
  email,
  password,
}: RegisterData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error("No se pudo crear el usuario.");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name: fullName,
      email,
    });

  if (profileError) throw profileError;

  return data.user;
};

export interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async ({
  email,
  password,
}: LoginData) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};
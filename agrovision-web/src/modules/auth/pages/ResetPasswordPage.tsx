import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/lib/supabase";

import AuthImage from "../components/AuthImage";
import AuthLogo from "../components/AuthLogo";
import AuthCard from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

import LoadingScreen from "@/components/common/LoadingScreen";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      await Promise.all([
        supabase.auth.updateUser({
          password,
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      navigate("/login");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen message="Actualizando contraseña..." />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AuthImage />

      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-md">
          <AuthLogo />

          <div className="mt-8">
            <AuthCard>
              <h2 className="mb-2 text-3xl font-bold text-slate-800">
                Nueva contraseña
              </h2>

              <p className="mb-8 text-slate-500">
                Ingresa una nueva contraseña para tu cuenta.
              </p>

              <PasswordInput
                label="Nueva contraseña"
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                error={error}
              />

              <PasswordInput
                label="Confirmar contraseña"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                error={error}
              />

              <AuthButton
                text="Guardar contraseña"
                onClick={handleResetPassword}
              />

            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}
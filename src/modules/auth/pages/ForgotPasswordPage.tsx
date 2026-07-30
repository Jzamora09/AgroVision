import { useState } from "react";
import { Link } from "react-router-dom";

import { sendPasswordResetEmail } from "../services/authService";

import AuthImage from "../components/AuthImage";
import AuthLogo from "../components/AuthLogo";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

import LoadingScreen from "@/components/common/LoadingScreen";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    try {
      setLoading(true);

      await Promise.all([
        sendPasswordResetEmail(email.trim().toLowerCase()),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen message="Enviando enlace de recuperación..." />
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
                Recuperar contraseña
              </h2>

              <p className="mb-8 text-slate-500">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              {success ? (
                <div className="rounded-xl bg-green-100 p-4 text-green-700">
                  Hemos enviado un enlace de recuperación a tu correo electrónico.
                </div>
              ) : (
                <>
                  <AuthInput
                    label="Correo electrónico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    error={error}
                  />

                  <AuthButton
                    text="Enviar enlace"
                    onClick={handleReset}
                  />
                </>
              )}

              <p className="mt-8 text-center text-sm text-slate-500">
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-700"
                >
                  Volver al inicio de sesión
                </Link>
              </p>

            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}
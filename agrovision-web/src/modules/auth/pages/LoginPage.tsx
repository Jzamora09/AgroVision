import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

import AuthImage from "../components/AuthImage";
import AuthLogo from "../components/AuthLogo";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

import LoadingScreen from "@/components/common/LoadingScreen";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => localStorage.getItem("agrovision-remembered-email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem("agrovision-remembered-email")));
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Completa tu correo y contraseña para continuar.");
      return;
    }

    try {
      setLoading(true);

      await Promise.all([
        loginUser({ email, password }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      navigate("/dashboard");
      if (rememberMe) {
        localStorage.setItem("agrovision-remembered-email", email);
      } else {
        localStorage.removeItem("agrovision-remembered-email");
      }
    } catch {
      setErrorMessage("Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  if (false) {
    return (
      <LoadingScreen
        message="Iniciando sesión..."
      />
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
              {errorMessage && (
                <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              <h2 className="mb-2 text-3xl font-bold text-slate-800">
                Bienvenido
              </h2>

              <p className="mb-8 text-slate-500">
                Inicia sesión para continuar.
              </p>

              <AuthInput
                label="Correo electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
              />

              <PasswordInput
                label="Contraseña"
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
              />

              <div className="mb-8 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-green-600"
                  />

                  Recordarme
                </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              </div>

              <AuthButton
                text={loading ? "Iniciando sesión..." : "Iniciar sesión"}
                onClick={handleLogin}
                disabled={loading}
              />

              <p className="mt-8 text-center text-sm text-slate-500">
                ¿No tienes una cuenta?

                <Link
                  to="/register"
                  className="ml-2 font-semibold text-green-600 hover:text-green-700"
                >
                  Crear cuenta
                </Link>
              </p>
            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}

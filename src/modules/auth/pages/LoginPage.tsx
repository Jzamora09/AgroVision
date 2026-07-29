import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

import AuthImage from "../components/AuthImage";
import AuthLogo from "../components/AuthLogo";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      await loginUser({
        email,
        password,
      });

      alert("Inicio de sesión exitoso.");

      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AuthImage />

      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-md">
          <AuthLogo />

          <div className="mt-8">
            <AuthCard>
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
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                label="Contraseña"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="mb-8 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" />

                  Recordarme
                </label>

                <button
                  type="button"
                  className="
                    text-sm
                    font-medium
                    text-green-600
                    hover:text-green-700
                  "
                >
                  ¿Olvidaste tu contraseña?
                </button>
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
import { Link } from "react-router-dom";

import AuthImage from "../components/AuthImage";
import AuthLogo from "../components/AuthLogo";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Imagen */}
      <AuthImage />

      {/* Formulario */}
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
              />

              <PasswordInput
                label="Contraseña"
                placeholder="********"
              />

              <div className="mb-8 flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-slate-600">

                  <input type="checkbox" />

                  Recordarme

                </label>

                <button
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

              <AuthButton text="Iniciar sesión" />

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
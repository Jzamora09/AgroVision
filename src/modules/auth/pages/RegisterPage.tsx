import { Link } from "react-router-dom";

import AuthImage from "../components/AuthImage";
import AuthLogo from "../components/AuthLogo";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <AuthImage />

      <div className="flex flex-1 items-center justify-center p-10">

        <div className="w-full max-w-md">

          <AuthLogo />

          <div className="mt-8">
            <AuthCard>

              <h2 className="mb-2 text-3xl font-bold text-slate-800">
                Crear cuenta
              </h2>

              <p className="mb-8 text-slate-500">
                Regístrate para comenzar a utilizar AgroVision.
              </p>

              <AuthInput
                label="Nombre completo"
                placeholder="Juan Pérez"
              />

              <AuthInput
                label="Correo electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
              />

              <PasswordInput
                label="Contraseña"
                placeholder="********"
              />

              <PasswordInput
                label="Confirmar contraseña"
                placeholder="********"
              />

              <AuthButton text="Crear cuenta" />

              <p className="mt-8 text-center text-sm text-slate-500">

                ¿Ya tienes una cuenta?

                <Link
                  to="/"
                  className="ml-2 font-semibold text-green-600 hover:text-green-700"
                >
                  Iniciar sesión
                </Link>

              </p>

            </AuthCard>

          </div>

        </div>

      </div>

    </div>
  );
}
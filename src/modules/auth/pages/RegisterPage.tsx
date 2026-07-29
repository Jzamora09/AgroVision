import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

import {
  validateName,
  validateEmail,
  validatePassword,
} from "../utils/validation";

import AuthImage from "../components/AuthImage";
import AuthLogo from "../components/AuthLogo";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";


export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleRegister = async () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const nameValidation = validateName(fullName);

    if (!nameValidation.valid) {
      setNameError(nameValidation.message);
      return;
    }

    const emailValidation = validateEmail(email);

    if (!emailValidation.valid) {
      setEmailError(emailValidation.message);
      return;
    }

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      alert("Cuenta creada correctamente.");

      navigate("/login");
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        setEmailError("Ya existe una cuenta con este correo.");
      } else {
        alert(error.message);
      }
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
                Crear cuenta
              </h2>

              <p className="mb-8 text-slate-500">
                Regístrate para comenzar a utilizar AgroVision.
              </p>

            <AuthInput
              label="Nombre completo"
              placeholder="Juan Pérez"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setNameError("");
              }}
              error={nameError}
            />

              <AuthInput
                label="Correo electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                error={emailError}
              />
              <PasswordInput
                label="Contraseña"
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                error={passwordError}
              />

              <PasswordInput
                label="Confirmar contraseña"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                error={confirmPasswordError}
              />

              <AuthButton
                text={loading ? "Creando cuenta..." : "Crear cuenta"}
                onClick={handleRegister}
                disabled={loading}
              />

              <p className="mt-8 text-center text-sm text-slate-500">
                ¿Ya tienes una cuenta?

                <Link
                  to="/login"
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
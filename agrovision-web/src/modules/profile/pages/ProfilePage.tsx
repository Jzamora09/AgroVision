
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  LockKeyhole,
  Pencil,
  Save,
  X,
  Leaf,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import { supabase } from "../../../lib/supabase";

type Profile = {
  nombre: string;
  correo: string;
  telefono: string;
  ubicacion: string;
  rol: string;
};

const emptyProfile: Profile = {
  nombre: "",
  correo: "",
  telefono: "",
  ubicacion: "",
  rol: "Agricultor",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [form, setForm] = useState<Profile>(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  // ---------------------------------------------
  // CARGAR DATOS REALES DE SUPABASE
  // ---------------------------------------------

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { data, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;
        if (!data.user) {
          throw new Error("No existe una sesión activa.");
        }

        const user = data.user;
        const metadata = user.user_metadata ?? {};

        const userProfile: Profile = {
          nombre:
            metadata.nombre ??
            metadata.full_name ??
            metadata.name ??
            "",
          correo: user.email ?? "",
          telefono: metadata.telefono ?? "",
          ubicacion: metadata.ubicacion ?? "",
          rol: metadata.rol ?? "Agricultor",
        };

        if (active) {
          setProfile(userProfile);
          setForm(userProfile);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el perfil."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // ---------------------------------------------
  // GUARDAR CAMBIOS EN SUPABASE AUTH
  // ---------------------------------------------

  async function handleSave() {
    setError("");
    setMessage("");

    if (!form.nombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    setSaving(true);

    try {
      const { data, error: updateError } =
        await supabase.auth.updateUser({
          data: {
            nombre: form.nombre.trim(),
            telefono: form.telefono.trim(),
            ubicacion: form.ubicacion.trim(),
          },
        });

      if (updateError) throw updateError;

      if (!data.user) {
        throw new Error(
          "Supabase no confirmó la actualización."
        );
      }

      const updated: Profile = {
        ...form,
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        ubicacion: form.ubicacion.trim(),
      };

      setProfile(updated);
      setForm(updated);
      setEditing(false);
      setMessage("Perfil actualizado correctamente.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el perfil."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm(profile);
    setEditing(false);
    setError("");
  }

  // ---------------------------------------------
  // CAMBIAR CONTRASEÑA
  // ---------------------------------------------

  async function handleChangePassword() {
    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setChangingPassword(true);

    try {
      const { error: passwordError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (passwordError) throw passwordError;

      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setMessage("Contraseña actualizada correctamente.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la contraseña."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  const initials = profile.nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "U";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={22} />
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Mi perfil
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Administra tu información personal y la seguridad
          de tu cuenta en AgroVision.
        </p>
      </div>

      {/* MENSAJES */}
      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* TARJETA DE PERFIL */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-600" />

        <div className="px-6 pb-7 sm:px-8">
          {/* SOLO EL AVATAR SE SUPERPONE */}
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-800 shadow-sm">
            {initials}
          </div>

          {/* NOMBRE COMPLETAMENTE SOBRE BLANCO */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {profile.nombre || "Usuario AgroVision"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {profile.correo}
              </p>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={() => {
                  setForm(profile);
                  setEditing(true);
                  setMessage("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Pencil size={16} />
                Editar perfil
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600"
                >
                  <X size={16} />
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}
                  Guardar cambios
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} />
              Cuenta activa
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <Leaf size={14} />
              {profile.rol}
            </span>
          </div>
        </div>
      </section>

      {/* INFORMACIÓN PERSONAL */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <UserRound size={22} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Información personal
            </h3>
            <p className="text-sm text-slate-500">
              Información asociada a tu cuenta.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <ProfileInput
            label="Nombre completo"
            icon={UserRound}
            value={form.nombre}
            disabled={!editing}
            onChange={(value) =>
              setForm({ ...form, nombre: value })
            }
          />

          <ProfileInput
            label="Correo electrónico"
            icon={Mail}
            value={profile.correo}
            disabled
            hint="Correo asociado a tu inicio de sesión."
          />

          <ProfileInput
            label="Teléfono"
            icon={Phone}
            value={form.telefono}
            disabled={!editing}
            onChange={(value) =>
              setForm({ ...form, telefono: value })
            }
          />

          <ProfileInput
            label="Ubicación"
            icon={MapPin}
            value={form.ubicacion}
            disabled={!editing}
            onChange={(value) =>
              setForm({ ...form, ubicacion: value })
            }
          />
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Seguridad de la cuenta
            </h3>
            <p className="text-sm text-slate-500">
              Administra la seguridad de tu acceso.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LockKeyhole
              size={21}
              className="text-slate-500"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Contraseña
              </p>
              <p className="text-xs text-slate-500">
                Actualiza tu contraseña de acceso.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setError("");
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            {showPasswordForm
              ? "Cancelar"
              : "Cambiar contraseña"}
          </button>
        </div>

        {showPasswordForm && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleChangePassword();
            }}
            className="mt-5 max-w-lg space-y-4 rounded-xl border border-slate-200 p-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nueva contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-3 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirmar nueva contraseña
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <p className="text-xs text-slate-500">
              Utiliza una contraseña única y segura.
              Supabase puede solicitar una nueva
              autenticación para cambios sensibles.
            </p>

            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {changingPassword && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}
              Actualizar contraseña
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

// --------------------------------------------------
// COMPONENTE REUTILIZABLE DE CAMPO
// --------------------------------------------------

type ProfileInputProps = {
  label: string;
  icon: typeof UserRound;
  value: string;
  disabled?: boolean;
  hint?: string;
  onChange?: (value: string) => void;
};

function ProfileInput({
  label,
  icon: Icon,
  value,
  disabled = false,
  hint,
  onChange,
}: ProfileInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="absolute left-3 top-3.5 text-slate-400"
        />

        <input
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          className={`w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none transition ${
            disabled
              ? "border-slate-100 bg-slate-50 text-slate-600"
              : "border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          }`}
        />
      </div>

      {hint && (
        <p className="mt-1.5 text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

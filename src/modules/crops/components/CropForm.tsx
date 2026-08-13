import { useEffect, useState } from "react";
import type { Crop, CropFormData } from "../types/crop";

interface CropFormProps {
  onSave: (crop: CropFormData) => Promise<void>;
  onUpdate: (id: string, crop: CropFormData) => Promise<void>;
  editingCrop: Crop | null;
  onCancelEdit: () => void;
}

const initialForm: CropFormData = {
  nombre: "",
  tipo: "",
  variedad: "",
  fecha_siembra: "",
  ubicacion: "",
  area: 0,
  estado: "Activo",
  descripcion: "",
  imagen_url: "",
};

export default function CropForm({
  onSave,
  onUpdate,
  editingCrop,
  onCancelEdit,
}: CropFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("success");

  const [form, setForm] =
    useState<CropFormData>(initialForm);

  useEffect(() => {
    if (editingCrop) {
      setForm({
        nombre: editingCrop.nombre ?? "",
        tipo: editingCrop.tipo ?? "",
        variedad: editingCrop.variedad ?? "",
        fecha_siembra: editingCrop.fecha_siembra ?? "",
        ubicacion: editingCrop.ubicacion ?? "",
        area: editingCrop.area ?? 0,
        estado: editingCrop.estado ?? "Activo",
        descripcion: editingCrop.descripcion ?? "",
        imagen_url: editingCrop.imagen_url ?? "",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setForm(initialForm);
    }
  }, [editingCrop]);

  const showMessage = (
    text: string,
    type: "success" | "error"
  ) => {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "area"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.nombre.trim() ||
      !form.tipo.trim() ||
      !form.fecha_siembra ||
      !form.ubicacion.trim()
    ) {
      showMessage(
        "Completa todos los campos obligatorios.",
        "error"
      );

      return;
    }

    if (form.area < 0) {
      showMessage(
        "El área no puede ser negativa.",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      if (editingCrop) {
        await onUpdate(
          editingCrop.id,
          form
        );

        showMessage(
          "Cultivo actualizado correctamente.",
          "success"
        );

        onCancelEdit();
      } else {
        await onSave(form);

        showMessage(
          "Cultivo registrado correctamente.",
          "success"
        );

        setForm(initialForm);
      }
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar el cultivo.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && (
        <div
          className={`
            fixed
            right-6
            top-24
            z-50
            rounded-2xl
            px-6
            py-4
            font-medium
            text-white
            shadow-xl
            ${
              messageType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }
          `}
        >
          {messageType === "success"
            ? "✓ "
            : "⚠ "}
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-8 shadow-lg"
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {editingCrop
                ? "Editar cultivo ✏️"
                : "Registrar cultivo 🌱"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingCrop
                ? "Modifica la información del cultivo seleccionado."
                : "Ingresa la información del nuevo cultivo."}
            </p>
          </div>

          {editingCrop && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Nombre del cultivo *
            </label>

            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="Ej. Café La Esperanza"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Tipo del cultivo *
            </label>

            <input
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="Ej. Café"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Variedad
            </label>

            <input
              name="variedad"
              value={form.variedad}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="Ej. Bourbon"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Fecha de siembra *
            </label>

            <input
              type="date"
              name="fecha_siembra"
              value={form.fecha_siembra}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Ubicación *
            </label>

            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="Ej. Parcela Norte"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Área (m²)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              name="area"
              value={form.area}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              Estado
            </label>

            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="Activo">
                Activo
              </option>

              <option value="En crecimiento">
                En crecimiento
              </option>

              <option value="Con enfermedad">
                Con enfermedad
              </option>

              <option value="Cosechado">
                Cosechado
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              Descripción
            </label>

            <textarea
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full resize-none rounded-xl border border-slate-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="Describe el cultivo..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Guardando..."
            : editingCrop
              ? "✓ Guardar cambios"
              : "🌱 Registrar cultivo"}
        </button>
      </form>
    </>
  );
}
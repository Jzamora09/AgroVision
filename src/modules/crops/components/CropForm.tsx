import { useState } from "react";
import type { CropFormData } from "../types/crop";

interface CropFormProps {
  onSave: (crop: CropFormData) => Promise<void>;
}

export default function CropForm({ onSave }: CropFormProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CropFormData>({
    nombre: "",
    tipo: "",
    variedad: "",
    fecha_siembra: "",
    ubicacion: "",
    area: 0,
    estado: "Activo",
    descripcion: "",
    imagen_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "area" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.tipo ||
      !form.fecha_siembra ||
      !form.ubicacion
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);

      await onSave(form);

      alert("Cultivo registrado correctamente.");

      setForm({
        nombre: "",
        tipo: "",
        variedad: "",
        fecha_siembra: "",
        ubicacion: "",
        area: 0,
        estado: "Activo",
        descripcion: "",
        imagen_url: "",
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-8 shadow-lg"
    >
      <h2 className="mb-8 text-3xl font-bold text-slate-800">
        Registrar cultivo 🌱
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Nombre del cultivo *
          </label>

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
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
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
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
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
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
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
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
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
            placeholder="Ej. Parcela Norte"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Área (m²)
          </label>

          <input
            type="number"
            name="area"
            value={form.area}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
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
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
          >
            <option value="Activo">Activo</option>
            <option value="En crecimiento">En crecimiento</option>
            <option value="Con enfermedad">Con enfermedad</option>
            <option value="Cosechado">Cosechado</option>
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
            className="w-full rounded-xl border border-slate-300 p-3 focus:border-green-500 focus:outline-none"
            placeholder="Describe el cultivo..."
          />
        </div>

      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
      >
        {loading ? "Guardando..." : "🌱 Guardar cultivo"}
      </button>
    </form>
  );
}
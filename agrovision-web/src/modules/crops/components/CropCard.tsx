
import { useNavigate } from "react-router-dom";

import {
  Bot,
  CalendarDays,
  Leaf,
  MapPin,
  Pencil,
  Ruler,
  Trash2,
} from "lucide-react";

import type { Crop } from "../types/crop";
import type { CropAnalysis } from "../types/cropAnalysis";

interface CropCardProps {
  crop: Crop;
  analysis?: CropAnalysis;
  loadingAnalysis?: boolean;
  onEdit: (crop: Crop) => void;
  onDelete: (crop: Crop) => void;
}

// ------------------------------------------
// ESTILOS SEGÚN ESTADO DEL CULTIVO
// ------------------------------------------

const getStatusClasses = (estado: string) => {
  switch (estado) {
    case "Con enfermedad":
      return "bg-red-100 text-red-700";

    case "En crecimiento":
      return "bg-amber-100 text-amber-700";

    case "Cosechado":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-green-100 text-green-700";
  }
};

// ------------------------------------------
// GENERAR DESCRIPCIÓN BREVE
// ------------------------------------------

const getShortDescription = (
  description: string,
  maxLength = 150
) => {
  const text = description.trim();

  if (text.length <= maxLength) {
    return text;
  }

  const shortened = text.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");

  return (
    shortened.slice(
      0,
      lastSpace > 0 ? lastSpace : maxLength
    ) + "..."
  );
};

export default function CropCard({
  crop,
  analysis,
  loadingAnalysis = false,
  onEdit,
  onDelete,
}: CropCardProps) {
  const navigate = useNavigate();

  // ------------------------------------------
  // REDIRIGIR AL MÓDULO DE DETECCIÓN
  // ------------------------------------------

  const handleAnalyze = () => {
    const cultivoId = encodeURIComponent(
      String(crop.id)
    );

    navigate(`/deteccion?cultivo_id=${cultivoId}`);
  };

  // ------------------------------------------
  // INFORMACIÓN DEL ÚLTIMO ANÁLISIS
  // ------------------------------------------

  const estadoAnalisis = analysis?.estado
    ?.trim()
    .toLowerCase();

  const isSick = estadoAnalisis === "enferma";
  const isHealthy = estadoAnalisis === "sana";

  const enfermedad = analysis?.enfermedad?.trim();

  const enfermedadIdentificada =
    enfermedad &&
    ![
      "no determinada",
      "ninguna visible",
      "no especificada",
    ].includes(enfermedad.toLowerCase());

  return (
    <article className="agro-surface flex h-full flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1">
      <div className="flex flex-1 flex-col p-6">

        {/* ENCABEZADO */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-green-100 p-2 text-green-700">
                <Leaf size={20} />
              </div>

              <h3 className="text-xl font-bold text-slate-800">
                {crop.nombre}
              </h3>
            </div>

            <p className="mt-2 capitalize text-slate-500">
              {crop.tipo}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
              crop.estado
            )}`}
          >
            {crop.estado}
          </span>
        </div>

        {/* INFORMACIÓN DEL CULTIVO */}
        <div className="mt-6 grid gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <Leaf
              size={17}
              className="shrink-0 text-green-600"
            />

            <span>
              <strong>Variedad:</strong>{" "}
              {crop.variedad || "Sin especificar"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin
              size={17}
              className="shrink-0 text-green-600"
            />

            <span>
              <strong>Ubicación:</strong>{" "}
              {crop.ubicacion}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays
              size={17}
              className="shrink-0 text-green-600"
            />

            <span>
              <strong>Siembra:</strong>{" "}
              {crop.fecha_siembra}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Ruler
              size={17}
              className="shrink-0 text-green-600"
            />

            <span>
              <strong>Área:</strong>{" "}
              {crop.area || 0} m²
            </span>
          </div>
        </div>

        {/* DESCRIPCIÓN DEL CULTIVO */}
        {crop.descripcion && (
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
            {crop.descripcion}
          </p>
        )}

        {/* ANÁLISIS INTELIGENTE */}
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Bot
              size={18}
              className="text-green-600"
            />
            Análisis Inteligente
          </div>

          {loadingAnalysis ? (
            <p className="mt-2 text-sm text-slate-500">
              Consultando análisis...
            </p>
          ) : !analysis ? (
            <p className="mt-2 text-sm text-slate-500">
              Consulta el módulo de detección para
              analizar este cultivo.
            </p>
          ) : isSick ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-red-700">
                {enfermedadIdentificada
                  ? `Posible enfermedad: ${enfermedad}`
                  : "Posible problema de salud"}
              </p>

              <p className="text-sm leading-6 text-slate-600">
                {analysis.descripcion
                  ? getShortDescription(
                      analysis.descripcion
                    )
                  : "Se identificaron alteraciones visibles en la planta."}
              </p>

              <p className="text-xs italic text-slate-400">
                Resultado orientativo del último análisis.
              </p>
            </div>
          ) : isHealthy ? (
            <div className="mt-3">
              <p className="text-sm font-semibold text-green-700">
                Planta aparentemente sana
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                No se identificaron señales evidentes
                de enfermedad en el último análisis.
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm font-semibold text-amber-700">
                Análisis no concluyente
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                No fue posible determinar el estado
                de la planta con suficiente evidencia.
              </p>
            </div>
          )}
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="mt-auto grid grid-cols-[auto_auto_1fr] gap-3 pt-6">

          {/* EDITAR */}
          <button
            type="button"
            onClick={() => onEdit(crop)}
            title="Editar cultivo"
            aria-label={`Editar ${crop.nombre}`}
            className="flex h-11 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <Pencil size={18} />
          </button>

          {/* ELIMINAR */}
          <button
            type="button"
            onClick={() => onDelete(crop)}
            title="Eliminar cultivo"
            aria-label={`Eliminar ${crop.nombre}`}
            className="flex h-11 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
          >
            <Trash2 size={18} />
          </button>

          {/* ANALIZAR */}
          <button
            type="button"
            onClick={handleAnalyze}
            title={`Analizar ${crop.nombre}`}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 font-semibold text-white transition hover:bg-green-700"
          >
            <Bot size={18} />
            Analizar
          </button>
        </div>
      </div>
    </article>
  );
}

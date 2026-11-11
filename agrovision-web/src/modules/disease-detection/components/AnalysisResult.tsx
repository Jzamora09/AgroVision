
import {
  Activity,
  Bot,
  CheckCircle2,
  CircleAlert,
  Leaf,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
  Target,
  BookOpen,
} from "lucide-react";

import SymptomsList from "./SymptomsList";
import RecommendationsList from "./RecommendationsList";

import type { DetectionResponse } from "../types/detection";

interface AnalysisResultProps {
  result: DetectionResponse;
  onReset: () => void;
}

// ------------------------------------------
// ESTILOS SEGÚN EL PORCENTAJE
// ------------------------------------------

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 80) {
    return {
      bar: "bg-green-500",
      text: "text-green-700",
      background: "bg-green-50",
    };
  }

  if (confidence >= 50) {
    return {
      bar: "bg-amber-500",
      text: "text-amber-700",
      background: "bg-amber-50",
    };
  }

  return {
    bar: "bg-red-500",
    text: "text-red-700",
    background: "bg-red-50",
  };
};

// ------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------

export default function AnalysisResult({
  result,
  onReset,
}: AnalysisResultProps) {
  const analysis = result.analysis;

  const isFallback = result.respaldo_activado === true;

  // Confianza devuelta por NVIDIA
  const realConfidence = Math.max(
    0,
    Math.min(100, Number(analysis.confianza) || 0)
  );

  // Valor exclusivo para demostración visual.
  // No representa confianza de un análisis.
  const demoConfidence = 75;

  const displayedConfidence = isFallback
    ? demoConfidence
    : realConfidence;

  const confidenceStyle = getConfidenceClass(
    displayedConfidence
  );

  const displayStatus = isFallback
    ? "Enferma"
    : analysis.estado;

  return (
    <section className="space-y-6">

      {/* RESULTADO PRINCIPAL */}
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

        {/* ENCABEZADO */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-2 text-green-700">
              <Bot size={20} />

              <span className="text-sm font-semibold uppercase tracking-wide">
                Resultado del análisis
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {result.cultivo.nombre}
            </h2>

            <p className="mt-1 text-slate-500">
              {result.cultivo.tipo}
              {result.cultivo.variedad
                ? ` · ${result.cultivo.variedad}`
                : ""}
            </p>
          </div>

          {/* VERIFICACIÓN DEL CULTIVO */}
          {!isFallback ? (
            <div
              className={`rounded-2xl px-5 py-3 ${
                analysis.cultivo_coincide
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {analysis.cultivo_coincide ? (
                  <CheckCircle2 size={19} />
                ) : (
                  <CircleAlert size={19} />
                )}

                {analysis.cultivo_coincide
                  ? "Cultivo verificado"
                  : "El cultivo no coincide"}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-5 py-3 font-semibold text-amber-800">
              <BookOpen size={19} />
            </div>
          )}
        </div>

        {/* TARJETAS DE RESULTADOS */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {/* ESTADO */}
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Activity size={17} />
              Estado
            </div>

            <p
              className={`mt-2 font-bold ${
                isFallback
                  ? "text-amber-700"
                  : analysis.estado === "Enferma"
                  ? "text-red-700"
                  : analysis.estado === "Sana"
                  ? "text-green-700"
                  : "text-slate-800"
              }`}
            >
              {displayStatus}
            </p>
          </div>

          {/* ENFERMEDAD */}
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Stethoscope size={17} />
              {isFallback
                ? "Enfermedades de referencia"
                : "Enfermedad"}
            </div>

            <p className="mt-2 font-bold text-slate-800">
              {isFallback
                ? "Consultar descripción"
                : analysis.enfermedad}
            </p>
          </div>

          {/* TIPO DE PROBLEMA */}
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Leaf size={17} />
              Tipo de problema
            </div>

            <p className="mt-2 font-bold text-slate-800">
              {analysis.tipo_problema}
            </p>
          </div>
        </div>

        {/* BARRA DE CONFIANZA */}
        <div
          className={`mt-6 rounded-2xl p-5 ${confidenceStyle.background}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Target
                size={19}
                className={confidenceStyle.text}
              />

              <span className="font-semibold text-slate-700">
                {isFallback
                  ? "Indicador de demostración"
                  : "Nivel de confianza"}
              </span>
            </div>

            <span
              className={`text-2xl font-bold ${confidenceStyle.text}`}
            >
              {displayedConfidence}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
            <div
              className={`h-full rounded-full transition-all duration-700 ${confidenceStyle.bar}`}
              style={{
                width: `${displayedConfidence}%`,
              }}
            />
          </div>

        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
            <ShieldCheck size={20} />
          </div>

          <h3 className="text-xl font-bold text-slate-800">
            {isFallback
              ? "Información agrícola del cultivo"
              : "Descripción del diagnóstico"}
          </h3>
        </div>

        <p className="mt-5 leading-7 text-slate-600">
          {analysis.descripcion}
        </p>
      </div>

      {/* SÍNTOMAS Y RECOMENDACIONES */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* SÍNTOMAS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h3 className="mb-5 text-xl font-bold text-slate-800">
            {isFallback
              ? "Síntomas de referencia"
              : "Síntomas observados"}
          </h3>

          <SymptomsList
            symptoms={analysis.sintomas}
          />
        </div>

        {/* RECOMENDACIONES */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h3 className="mb-5 text-xl font-bold text-slate-800">
            Recomendaciones agrícolas
          </h3>

          <RecommendationsList
            recommendations={analysis.recomendaciones}
          />
        </div>
      </div>

      {/* BOTÓN REINICIAR */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <RefreshCcw size={18} />
        Realizar otro análisis
      </button>
    </section>
  );
}

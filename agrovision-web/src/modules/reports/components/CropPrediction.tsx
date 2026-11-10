import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Loader2,
} from "lucide-react";

import type {
  CropPredictionResult,
} from "../types/prediction";

interface CropOption {
  id: string;
  nombre: string;
}

interface CropPredictionProps {
  crops: CropOption[];
  selectedCropId: string;
  prediction: CropPredictionResult | null;
  loading: boolean;
  error: string | null;
  onCropChange: (
    cropId: string
  ) => void;
  onGenerate: () => void;
}

export default function CropPrediction({
  crops,
  selectedCropId,
  prediction,
  loading,
  error,
  onCropChange,
  onGenerate,
}: CropPredictionProps) {
  const getRiskClasses = () => {
    if (!prediction) {
      return "";
    }

    if (prediction.risk === "Alto") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (
      prediction.risk ===
      "Moderado"
    ) {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-green-200 bg-green-50 text-green-700";
  };

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-3 text-green-700">
            <BrainCircuit
              size={24}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Análisis predictivo
            </h2>

            <p className="mt-1 text-slate-500">
              Estimación básica basada
              en el historial de análisis
              registrados para el cultivo.
            </p>
          </div>
        </div>
      </div>

      <div className="agro-surface rounded-2xl p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label
              htmlFor="prediction-crop"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Cultivo a analizar
            </label>

            <select
              id="prediction-crop"
              value={selectedCropId}
              onChange={(event) =>
                onCropChange(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">
                Selecciona un cultivo
              </option>

              {crops.map((crop) => (
                <option
                  key={crop.id}
                  value={crop.id}
                >
                  {crop.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={
              loading ||
              !selectedCropId
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Analizando...
              </>
            ) : (
              <>
                <BrainCircuit
                  size={18}
                />
                Generar predicción
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle
              className="mt-0.5 shrink-0"
              size={18}
            />

            <p>{error}</p>
          </div>
        )}
      </div>

      {prediction && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Análisis históricos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {
                  prediction.totalAnalyses
                }
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Registros afectados
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {
                  prediction.affectedPercentage
                }
                %
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 ${getRiskClasses()}`}
            >
              <p className="text-sm font-medium">
                Nivel estimado de riesgo
              </p>

              <p className="mt-2 text-3xl font-bold">
                {prediction.risk}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Tendencia
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {prediction.trend}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Activity
                size={20}
                className="text-green-600"
              />

              <h3 className="text-lg font-bold text-slate-800">
                Resultado de la
                predicción
              </h3>
            </div>

            <p className="leading-7 text-slate-600">
              {prediction.summary}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Problema predominante
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {
                    prediction.predominantProblem
                  }
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Enfermedad predominante
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {
                    prediction.predominantDisease
                  }
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <BarChart3
                    size={16}
                    className="text-green-600"
                  />

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Confianza promedio
                  </p>
                </div>

                <p className="mt-2 font-semibold text-slate-800">
                  {
                    prediction.averageConfidence
                  }
                  %
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-400">
              La predicción es una
              estimación basada en el
              historial disponible y no
              representa un diagnóstico
              ni un resultado futuro
              garantizado.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

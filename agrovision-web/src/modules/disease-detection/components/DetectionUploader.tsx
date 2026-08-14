import {
  Bot,
  Camera,
  LoaderCircle,
  Sprout,
  Upload,
} from "lucide-react";

import type {
  ChangeEvent,
} from "react";

import type {
  DetectionCropOption,
} from "../types/detection";

interface DetectionUploaderProps {
  crops: DetectionCropOption[];

  selectedCropId: string;

  selectedImage: File | null;

  loadingCrops: boolean;

  analyzing: boolean;

  onCropChange: (
    cropId: string
  ) => void;

  onImageChange: (
    file: File | null
  ) => void;

  onAnalyze: () => Promise<void>;
}

export default function DetectionUploader({
  crops,
  selectedCropId,
  selectedImage,
  loadingCrops,
  analyzing,
  onCropChange,
  onImageChange,
  onAnalyze,
}: DetectionUploaderProps) {
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    onImageChange(file ?? null);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-3 text-green-700">
            <Camera size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Analizar planta
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Selecciona el cultivo y sube una fotografía clara de la planta.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Sprout size={16} />

          Cultivo
        </label>

        <select
          value={selectedCropId}
          disabled={
            loadingCrops ||
            analyzing
          }
          onChange={(event) =>
            onCropChange(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
        >
          <option value="">
            {loadingCrops
              ? "Cargando cultivos..."
              : "Selecciona un cultivo"}
          </option>

          {crops.map((crop) => (
            <option
              key={crop.id}
              value={crop.id}
            >
              {crop.nombre}
              {" — "}
              {crop.tipo}
              {crop.variedad
                ? ` (${crop.variedad})`
                : ""}
            </option>
          ))}
        </select>

        {!loadingCrops &&
          crops.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              Primero debes registrar un cultivo en el módulo de Cultivos.
            </p>
          )}
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Fotografía de la planta
        </label>

        <label
          className={`
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            p-8
            text-center
            transition
            ${
              selectedImage
                ? "border-green-300 bg-green-50"
                : "border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-green-50"
            }
          `}
        >
          <div className="rounded-2xl bg-white p-4 text-green-600 shadow-sm">
            <Upload size={28} />
          </div>

          <p className="mt-4 font-semibold text-slate-700">
            {selectedImage
              ? selectedImage.name
              : "Seleccionar fotografía"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            JPG, PNG o WEBP · Máximo 10 MB
          </p>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={analyzing}
            onChange={
              handleImageChange
            }
            className="hidden"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={
          analyzing ||
          !selectedCropId ||
          !selectedImage
        }
        onClick={() =>
          void onAnalyze()
        }
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {analyzing ? (
          <>
            <LoaderCircle
              size={20}
              className="animate-spin"
            />

            Analizando con IA...
          </>
        ) : (
          <>
            <Bot size={20} />

            Analizar cultivo
          </>
        )}
      </button>

      {analyzing && (
        <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-center">
          <p className="text-sm font-medium text-blue-700">
            La inteligencia artificial está analizando la fotografía.
          </p>

          <p className="mt-1 text-xs text-blue-500">
            Este proceso puede tardar algunos segundos.
          </p>
        </div>
      )}
    </section>
  );
}
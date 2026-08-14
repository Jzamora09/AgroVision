import {
  Bot,
  ScanSearch,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  AnalysisResult,
  DetectionUploader,
  ImagePreview,
} from "../components";

import {
  useDetection,
} from "../hooks/useDetection";

export default function DetectionPage() {
  const {
    crops,

    selectedCropId,
    setSelectedCropId,

    selectedImage,
    setSelectedImage,

    result,

    loadingCrops,
    analyzing,
    error,

    analyze,
    resetAnalysis,
  } = useDetection();

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);

      return;
    }

    const url =
      URL.createObjectURL(
        selectedImage
      );

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage]);

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleReset = () => {
    resetAnalysis();
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-3 text-green-700">
            <ScanSearch size={27} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Detección inteligente
            </h1>

            <p className="mt-1 text-slate-500">
              Analiza fotografías de tus cultivos mediante inteligencia artificial.
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <div className="flex items-center gap-2 font-semibold">
            <Bot size={19} />

            No se pudo completar el análisis
          </div>

          <p className="mt-2 text-sm">
            {error}
          </p>
        </div>
      )}

      {!result ? (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <DetectionUploader
            crops={crops}
            selectedCropId={
              selectedCropId
            }
            selectedImage={
              selectedImage
            }
            loadingCrops={
              loadingCrops
            }
            analyzing={
              analyzing
            }
            onCropChange={
              setSelectedCropId
            }
            onImageChange={
              setSelectedImage
            }
            onAnalyze={
              analyze
            }
          />

          <div>
            {selectedImage ? (
              <ImagePreview
                file={
                  selectedImage
                }
                previewUrl={
                  previewUrl
                }
                onRemove={
                  handleRemoveImage
                }
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <ScanSearch
                      size={30}
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-700">
                    Vista previa
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Selecciona una fotografía clara de hojas, tallos o zonas afectadas de la planta.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <AnalysisResult
          result={result}
          onReset={
            handleReset
          }
        />
      )}
    </div>
  );
}
import {
  Image as ImageIcon,
  X,
} from "lucide-react";

interface ImagePreviewProps {
  file: File | null;
  previewUrl: string | null;
  onRemove: () => void;
}

export default function ImagePreview({
  file,
  previewUrl,
  onRemove,
}: ImagePreviewProps) {
  if (!file || !previewUrl) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <img
        src={previewUrl}
        alt="Vista previa de la planta"
        className="h-72 w-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        title="Eliminar imagen"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-red-600"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-3 bg-white p-4">
        <div className="rounded-xl bg-green-100 p-2 text-green-700">
          <ImageIcon size={18} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-700">
            {file.name}
          </p>

          <p className="text-xs text-slate-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    </div>
  );
}
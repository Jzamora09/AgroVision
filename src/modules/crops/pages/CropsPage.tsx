import { CropForm, CropGrid } from "../components";
import { useCrops } from "../hooks/useCrops";

export default function CropsPage() {
  const {
    crops,
    loading,
    saveCrop,
  } = useCrops();

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-slate-800">
          Gestión de cultivos 🌱
        </h1>

        <p className="mt-2 text-slate-500">
          Administra los cultivos registrados en AgroVision.
        </p>

      </div>

      <CropForm onSave={saveCrop} />

      <CropGrid
        crops={crops}
        loading={loading}
      />

    </div>
  );
}
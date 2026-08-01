import CropCard from "./CropCard";

import type { Crop } from "../types/crop";

interface Props {
  crops: Crop[];

  loading: boolean;
}

export default function CropGrid({
  crops,
  loading,
}: Props) {

  if (loading) {
    return (
      <p>Cargando cultivos...</p>
    );
  }

  if (crops.length === 0) {
    return (
      <div
        className="
        rounded-3xl
        bg-white
        p-12
        text-center
        shadow-lg
        "
      >
        <h2 className="text-2xl font-bold">

          🌱

        </h2>

        <p className="mt-4 text-slate-500">

          No hay cultivos registrados.

        </p>

      </div>
    );
  }

  return (
    <div
      className="
      grid
      gap-6
      md:grid-cols-2
      xl:grid-cols-3
      "
    >

      {crops.map((crop) => (

        <CropCard
          key={crop.id}
          crop={crop}
        />

      ))}

    </div>
  );
}
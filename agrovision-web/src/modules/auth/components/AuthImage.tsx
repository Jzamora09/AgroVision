import loginImage from "../../../assets/images/imagenlogin.jpg";
import { Camera, ChartNoAxesCombined, Sprout } from "lucide-react";

export default function AuthImage() {
  return (
    <div className="relative hidden lg:flex w-1/2 overflow-hidden">

      <img
        src={loginImage}
        alt="AgroVision"
        className="h-screen w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-green-950/45 to-green-800/10" />

      <div className="absolute bottom-14 left-10 right-10 text-white sm:left-16 sm:right-auto">
        <div className="mb-8 grid max-w-xl gap-3 sm:grid-cols-3">
          <div>
            <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Camera size={18} /></span>
            <p className="text-sm font-semibold leading-5">Detecta enfermedades con una foto</p>
          </div>
          <div>
            <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><ChartNoAxesCombined size={18} /></span>
            <p className="text-sm font-semibold leading-5">Métricas y reportes en PDF/Excel</p>
          </div>
          <div>
            <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Sprout size={18} /></span>
            <p className="text-sm font-semibold leading-5">Predicciones y recomendaciones</p>
          </div>
        </div>

        <h1 className="text-5xl font-bold">
          AgroVision
        </h1>

        <p className="mt-4 max-w-sm text-lg">
          Monitoreo inteligente para una agricultura más eficiente.
        </p>

      </div>

    </div>
  );
}

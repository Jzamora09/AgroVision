import { Leaf } from "lucide-react";

export default function AuthLogo() {
  return (
    <div className="mb-8 flex flex-col items-center">

      <div
        className="
        mb-4
        rounded-2xl
        bg-green-600
        p-5
        shadow-lg
        "
      >
        <Leaf
          size={38}
          className="text-white"
        />
      </div>

      <h1
        className="
        text-4xl
        font-bold
        text-slate-800
        "
      >
        AgroVision
      </h1>

      <p className="mt-2 text-slate-500">
        Agricultura Inteligente
      </p>

    </div>
  );
}
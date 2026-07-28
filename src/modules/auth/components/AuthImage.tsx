import loginImage from "../../../assets/images/imagenlogin.jpg";

export default function AuthImage() {
  return (
    <div className="relative hidden lg:flex w-1/2 overflow-hidden">

      <img
        src={loginImage}
        alt="AgroVision"
        className="h-screen w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-green-700/40 to-green-500/20" />

      <div className="absolute bottom-16 left-16 text-white">

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
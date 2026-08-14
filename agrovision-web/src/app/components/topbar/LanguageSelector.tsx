import { Languages } from "lucide-react";

export default function LanguageSelector() {
  return (
    <button
      className="
      rounded-xl
      p-3
      transition
      hover:bg-slate-100
      "
    >
      <Languages size={20} />
    </button>
  );
}
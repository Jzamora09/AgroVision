import { Moon } from "lucide-react";

export default function ThemeToggle() {
  return (
    <button
      className="
      rounded-xl
      p-3
      transition
      hover:bg-slate-100
      "
    >
      <Moon size={20} />
    </button>
  );
}
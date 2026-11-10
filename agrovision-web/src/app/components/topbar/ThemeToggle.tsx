import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className="
      rounded-xl
      p-3
      transition
      text-slate-600
      hover:bg-green-50
      hover:text-green-700
      dark:text-green-200
      dark:hover:bg-green-900/40
      "
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

import { ChevronDown, UserCircle2 } from "lucide-react";

export default function UserMenu() {
  return (
    <button
      className="
      flex
      items-center
      gap-3
      rounded-xl
      px-3
      py-2
      transition
      hover:bg-slate-100
      "
    >
      <UserCircle2
        size={36}
        className="text-green-600"
      />

      <div className="text-left">
        <p className="text-sm font-semibold">
          Gabriel
        </p>

        <p className="text-xs text-gray-500">
          Administrador
        </p>
      </div>

      <ChevronDown size={18} />
    </button>
  );
}
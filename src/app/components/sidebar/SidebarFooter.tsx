import { LogOut, UserCircle2 } from "lucide-react";

interface Props {
  collapsed: boolean;
}

export default function SidebarFooter({ collapsed }: Props) {
  return (
    <div className="border-t border-green-800 p-5">

      <div className="mb-5 flex items-center gap-3">

        <UserCircle2
          size={45}
          className="text-green-300"
        />

        {!collapsed && (
          <div>

            <h3 className="font-semibold text-white">
              Usuario
            </h3>

            <p className="text-xs text-green-300">
              Administrador
            </p>

          </div>
        )}

      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700"
      >
        <LogOut size={20} />

        {!collapsed && "Cerrar sesión"}

      </button>

    </div>
  );
}
import { LogOut, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/modules/auth/context/AuthContext";

interface Props {
  collapsed: boolean;
}

export default function SidebarFooter({ collapsed }: Props) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );

    if (!confirmLogout) return;

    await signOut();
    navigate("/login", { replace: true });
  };

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
              {user?.user_metadata?.full_name || "Usuario"}
            </h3>

            <p className="text-xs text-green-300">
              {user?.email}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700"
      >
        <LogOut size={20} />

        {!collapsed && "Cerrar sesión"}
      </button>
    </div>
  );
}
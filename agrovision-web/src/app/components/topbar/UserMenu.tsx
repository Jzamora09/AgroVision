import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/modules/auth/context/AuthContext";

export default function UserMenu() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const fullName =
    user?.user_metadata?.full_name || "Usuario";

  const initials = fullName
    .split(" ")
    .map((word: string) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = async () => {
    setOpen(false);

    await signOut();

    navigate("/login", { replace: true });
  };

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
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
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-green-600
            font-semibold
            text-white
          "
        >
          {initials}
        </div>

        <div className="text-left">
          <p className="text-sm font-semibold">
            {fullName}
          </p>

          <p className="text-xs text-gray-500">
            {user?.email}
          </p>
        </div>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-72
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >
          <div className="p-6 text-center">
            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-green-600
                text-2xl
                font-bold
                text-white
              "
            >
              {initials}
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              {fullName}
            </h3>

            <p className="text-sm text-slate-500">
              {user?.email}
            </p>
          </div>

          <div className="border-t border-slate-200">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/perfil");
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                px-5
                py-4
                transition
                hover:bg-slate-100
              "
            >
              <User size={20} />

              Mi perfil
            </button>

            <button
              className="
                flex
                w-full
                items-center
                gap-3
                px-5
                py-4
                transition
                hover:bg-slate-100
              "
            >
              <Settings size={20} />

              Configuración
            </button>
          </div>

          <div className="border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                px-5
                py-4
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <LogOut size={20} />

              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
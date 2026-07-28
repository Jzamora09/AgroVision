import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebarData";

import { useSidebar } from "../../context/SidebarContext";

export default function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebar();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-green-700 p-2 text-white shadow-lg lg:hidden"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Fondo oscuro */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <motion.aside
        animate={{
          width: collapsed ? 110 : 280,
        }}
        transition={{
          duration: .3,
        }}
        className={`
          fixed
          top-0
          left-0
          z-40
          flex
          h-screen
          flex-col
          justify-between
          border-r
          border-green-800
          bg-gradient-to-b
          from-green-900
          via-green-800
          to-green-900
          shadow-2xl
          transition-transform

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        <div>

          <SidebarHeader />


          <nav
            className={`mt-6 ${
              collapsed ? "px-2" : "px-4"
            }`}
          >
            {!collapsed && (
              <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-green-300">
                Menú Principal
              </p>
            )}

            <div className="flex flex-col gap-2">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  title={item.title}
                  path={item.path}
                  icon={item.icon}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </nav>
        </div>

        <SidebarFooter collapsed={collapsed} />
      </motion.aside>
    </>
  );
}
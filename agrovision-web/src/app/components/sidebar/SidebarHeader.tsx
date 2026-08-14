import { Leaf, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion } from "framer-motion";

import { useSidebar } from "../../context/SidebarContext";

export default function SidebarHeader() {
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-green-800 p-5"
    >
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-green-500 p-3 shadow-md">
            <Leaf size={24} className="text-white" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">
                AgroVision
              </h1>

              <p className="text-xs text-green-300">
                Smart Agriculture
              </p>
            </div>
          )}

        </div>

        <button
          onClick={toggleSidebar}
          className="
          rounded-lg
          p-2
          text-white
          transition-all
          duration-300
          hover:bg-green-700
          "
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

      </div>
    </motion.div>
  );
}
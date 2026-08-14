import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function SidebarToggle({
  collapsed,
  onToggle,
}: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="
      absolute
      -right-4
      top-8
      z-50
      rounded-full
      bg-white
      p-2
      shadow-xl
      border
      border-gray-200
      transition
      hover:bg-green-600
      hover:text-white
      "
    >
      {collapsed ? (
        <PanelLeftOpen size={18} />
      ) : (
        <PanelLeftClose size={18} />
      )}
    </motion.button>
  );
}
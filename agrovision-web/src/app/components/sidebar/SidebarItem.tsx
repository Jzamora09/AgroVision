import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: React.ElementType;
  collapsed: boolean;
}

export default function SidebarItem({
  title,
  path,
  icon: Icon,
  collapsed,
}: SidebarItemProps) {
  return (
    <NavLink to={path}>
      {({ isActive }) => (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={collapsed ? title : ""}
          className={`
            relative flex items-center rounded-xl
            transition-all duration-300

            ${
              collapsed
                ? "justify-center px-2 py-3"
                : "gap-3 px-4 py-3"
            }

            ${
              isActive
                ? "bg-lime-500 text-white shadow-lg"
                : "text-green-100 hover:bg-green-700"
            }
          `}
        >
          {isActive && (
            <span className="absolute left-0 h-8 w-1 rounded-r-full bg-lime-300"></span>
          )}

          <Icon size={22} />

          {!collapsed && (
            <span className="font-medium">
              {title}
            </span>
          )}
        </motion.div>
      )}
    </NavLink>
  );
}
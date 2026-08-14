import {
  LayoutDashboard,
  Sprout,
  ScanSearch,
  BarChart3,
  User,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cultivos",
    path: "/cultivos",
    icon: Sprout,
  },
  {
    title: "Detección",
    path: "/deteccion",
    icon: ScanSearch,
  },
  {
    title: "Reportes",
    path: "/reportes",
    icon: BarChart3,
  },
  {
    title: "Perfil",
    path: "/perfil",
    icon: User,
  },
];
import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import { useSidebar } from "../context/SidebarContext";

export default function DashboardLayout() {

  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main
        className="transition-all duration-300"
        style={{
          marginLeft: collapsed ? 90 : 280,
        }}
      >
        <div className="min-h-screen p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
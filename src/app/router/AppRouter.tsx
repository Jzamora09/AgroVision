import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "../../modules/auth/pages/LoginPage";
import RegisterPage from "../../modules/auth/pages/RegisterPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import CropsPage from "../../modules/crops/pages/CropsPage";
import DetectionPage from "../../modules/disease-detection/pages/DetectionPage";
import ReportsPage from "../../modules/reports/pages/ReportsPage";
import ProfilePage from "../../modules/profile/pages/ProfilePage";

import DashboardLayout from "../layouts/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Rutas que compartirán el Sidebar
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/cultivos",
        element: <CropsPage />,
      },
      {
        path: "/deteccion",
        element: <DetectionPage />,
      },
      {
        path: "/reportes",
        element: <ReportsPage />,
      },
      {
        path: "/perfil",
        element: <ProfilePage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import LoginPage from "../../modules/auth/pages/LoginPage";
import RegisterPage from "../../modules/auth/pages/RegisterPage";

import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import CropsPage from "../../modules/crops/pages/CropsPage";
import DetectionPage from "../../modules/disease-detection/pages/DetectionPage";
import ReportsPage from "../../modules/reports/pages/ReportsPage";
import ProfilePage from "../../modules/profile/pages/ProfilePage";

import DashboardLayout from "../layouts/DashboardLayout";

const router = createBrowserRouter([
  // Redirección inicial
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Autenticación
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Dashboard
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

  // Ruta no encontrada
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import LoginPage from "../../modules/auth/pages/LoginPage";
import RegisterPage from "../../modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "../../modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../../modules/auth/pages/ResetPasswordPage"

import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import CropsPage from "../../modules/crops/pages/CropsPage";
import DetectionPage from "../../modules/disease-detection/pages/DetectionPage";
import ReportsPage from "../../modules/reports/pages/ReportsPage";
import ProfilePage from "../../modules/profile/pages/ProfilePage";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },

    {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
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

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
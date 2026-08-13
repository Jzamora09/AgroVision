import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getDashboardData } from "../services/dashboardService";

import type { DashboardData } from "../types/dashboard";

export function useDashboardStats() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const dashboardData =
          await getDashboardData();

        setData(dashboardData);
      } catch (error) {
        console.error(
          "Error cargando dashboard:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las estadísticas."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    loading,
    error,
    refresh: loadDashboard,
  };
}
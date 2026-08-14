import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getReportData,
} from "../services/reportService";

import type {
  ReportCrop,
  ReportData,
  ReportFilters,
} from "../types/report";

const initialFilters: ReportFilters = {
  cropId: "",
  startDate: "",
  endDate: "",
};

export function useReports() {
  const [data, setData] =
    useState<ReportData | null>(null);

  const [availableCrops, setAvailableCrops] =
    useState<ReportCrop[]>([]);

  const [filters, setFilters] =
    useState<ReportFilters>(
      initialFilters
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadReport = useCallback(
    async (
      reportFilters: ReportFilters
    ) => {
      try {
        setLoading(true);
        setError(null);

        const report =
          await getReportData(
            reportFilters
          );

        setData(report);

        return report;
      } catch (error) {
        console.error(
          "Error cargando reporte:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "No se pudo generar el reporte."
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const initializeReports =
    useCallback(async () => {
      const initialReport =
        await loadReport(
          initialFilters
        );

      if (initialReport) {
        setAvailableCrops(
          initialReport.crops
        );
      }
    }, [loadReport]);

  const generateReport =
    async () => {
      await loadReport(filters);
    };

  const clearFilters =
    async () => {
      setFilters(initialFilters);

      await loadReport(
        initialFilters
      );
    };

  useEffect(() => {
    void initializeReports();
  }, [initializeReports]);

  return {
    data,
    availableCrops,
    filters,
    setFilters,
    loading,
    error,
    generateReport,
    clearFilters,
  };
}
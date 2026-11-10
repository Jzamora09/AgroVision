import { supabase } from "@/lib/supabase";

import type {
  CropPredictionResult,
  PredictionAnalysis,
  PredictionRisk,
  PredictionTrend,
} from "../types/prediction";

interface CropData {
  id: string;
  nombre: string;
}

const getMostFrequentValue = (
  values: string[]
): string => {
  const validValues = values.filter(
    (value) =>
      value &&
      value.trim() !== "" &&
      value.toLowerCase() !==
        "no determinada"
  );

  if (validValues.length === 0) {
    return "Sin información suficiente";
  }

  const frequencies =
    new Map<string, number>();

  validValues.forEach((value) => {
    frequencies.set(
      value,
      (frequencies.get(value) ?? 0) +
        1
    );
  });

  let mostFrequent =
    validValues[0];

  let highestFrequency = 0;

  frequencies.forEach(
    (frequency, value) => {
      if (
        frequency >
        highestFrequency
      ) {
        highestFrequency =
          frequency;

        mostFrequent = value;
      }
    }
  );

  return mostFrequent;
};

const calculateRisk = (
  affectedPercentage: number
): PredictionRisk => {
  if (affectedPercentage >= 60) {
    return "Alto";
  }

  if (affectedPercentage >= 30) {
    return "Moderado";
  }

  return "Bajo";
};

const calculateTrend = (
  risk: PredictionRisk,
  totalAnalyses: number
): PredictionTrend => {
  if (totalAnalyses < 2) {
    return "Requiere monitoreo";
  }

  if (risk === "Alto") {
    return "Riesgo recurrente";
  }

  if (risk === "Moderado") {
    return "Requiere monitoreo";
  }

  return "Estable";
};

const buildRecommendations = (
  analyses: PredictionAnalysis[],
  risk: PredictionRisk,
  predominantProblem: string
): string[] => {
  const recommendations =
    analyses
      .flatMap(
        (analysis) =>
          analysis.recomendaciones ?? []
      )
      .filter(
        (recommendation) =>
          recommendation &&
          recommendation.trim() !== ""
      );

  const uniqueRecommendations = [
    ...new Set(recommendations),
  ];

  const result =
    uniqueRecommendations.slice(0, 3);

  if (risk === "Alto") {
    result.unshift(
      "Incrementar la frecuencia de monitoreo del cultivo durante el próximo ciclo."
    );
  }

  if (risk === "Moderado") {
    result.unshift(
      "Mantener un seguimiento preventivo periódico para detectar cambios de forma temprana."
    );
  }

  if (risk === "Bajo") {
    result.unshift(
      "Mantener las prácticas actuales de monitoreo y registrar nuevos análisis para ampliar el historial."
    );
  }

  if (
    predominantProblem !==
    "Sin información suficiente"
  ) {
    result.push(
      `Prestar especial atención a signos relacionados con: ${predominantProblem}.`
    );
  }

  return [...new Set(result)].slice(
    0,
    5
  );
};

export const generateCropPrediction =
  async (
    cropId: string
  ): Promise<CropPredictionResult> => {
    if (!cropId) {
      throw new Error(
        "Selecciona un cultivo para generar la predicción."
      );
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "Usuario no autenticado."
      );
    }

    const {
      data: cropData,
      error: cropError,
    } = await supabase
      .from("crops")
      .select("id, nombre")
      .eq("id", cropId)
      .eq("user_id", user.id)
      .single();

    if (cropError || !cropData) {
      throw new Error(
        "No se pudo obtener el cultivo seleccionado."
      );
    }

    const crop =
      cropData as CropData;

    const {
      data: analysisData,
      error: analysisError,
    } = await supabase
      .from("disease_analyses")
      .select(`
        id,
        crop_id,
        estado,
        enfermedad,
        tipo_problema,
        confianza,
        recomendaciones,
        prevencion,
        created_at
      `)
      .eq("crop_id", cropId)
      .order("created_at", {
        ascending: true,
      });

    if (analysisError) {
      throw new Error(
        "No se pudo consultar el historial de análisis."
      );
    }

    const analyses =
      (analysisData ??
        []) as PredictionAnalysis[];

    if (analyses.length === 0) {
      throw new Error(
        "Este cultivo todavía no posee análisis históricos suficientes para generar una predicción."
      );
    }

    const affectedAnalyses =
      analyses.filter((analysis) => {
        const estado =
          analysis.estado
            ?.trim()
            .toLowerCase();

        return (
          estado !== "saludable" &&
          estado !== "sano" &&
          estado !== "sin problemas"
        );
      });

    const affectedPercentage =
      Math.round(
        (affectedAnalyses.length /
          analyses.length) *
          100
      );

    const averageConfidence =
      Math.round(
        analyses.reduce(
          (total, analysis) =>
            total +
            Number(
              analysis.confianza ?? 0
            ),
          0
        ) / analyses.length
      );

    const predominantProblem =
      getMostFrequentValue(
        affectedAnalyses.map(
          (analysis) =>
            analysis.tipo_problema
        )
      );

    const predominantDisease =
      getMostFrequentValue(
        affectedAnalyses.map(
          (analysis) =>
            analysis.enfermedad
        )
      );

    const risk = calculateRisk(
      affectedPercentage
    );

    const trend = calculateTrend(
      risk,
      analyses.length
    );

    const recommendations =
      buildRecommendations(
        analyses,
        risk,
        predominantProblem
      );

    const summary =
      analyses.length < 2
        ? `El cultivo ${crop.nombre} posee únicamente ${analyses.length} análisis histórico. La estimación es preliminar y se recomienda registrar más análisis antes de interpretar una tendencia.`
        : `Con base en ${analyses.length} análisis históricos, el cultivo ${crop.nombre} presenta un nivel de riesgo ${risk.toLowerCase()} y una tendencia clasificada como "${trend}". El resultado utiliza la frecuencia de registros afectados y los problemas observados anteriormente.`;

    return {
      cropId: crop.id,
      cropName: crop.nombre,

      totalAnalyses:
        analyses.length,

      affectedAnalyses:
        affectedAnalyses.length,

      predominantProblem,
      predominantDisease,

      averageConfidence,
      affectedPercentage,

      risk,
      trend,

      summary,
      recommendations,
    };
  };
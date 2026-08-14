import {
  CheckCircle2,
} from "lucide-react";

interface RecommendationsListProps {
  recommendations: string[];
}

export default function RecommendationsList({
  recommendations,
}: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No hay recomendaciones disponibles.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map(
        (recommendation, index) => (
          <div
            key={`${recommendation}-${index}`}
            className="flex items-start gap-3 rounded-xl bg-green-50 p-4"
          >
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-green-600"
            />

            <p className="text-sm leading-6 text-slate-700">
              {recommendation}
            </p>
          </div>
        )
      )}
    </div>
  );
}
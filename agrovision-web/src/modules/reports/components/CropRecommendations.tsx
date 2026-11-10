import {
  CheckCircle2,
  Sprout,
} from "lucide-react";

interface CropRecommendationsProps {
  recommendations: string[];
}

export default function CropRecommendations({
  recommendations,
}: CropRecommendationsProps) {
  if (
    recommendations.length === 0
  ) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-green-200 bg-green-50/50 p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-green-100 p-2 text-green-700">
          <Sprout size={22} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Recomendaciones para
            futuras cosechas
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Sugerencias generadas a
            partir del historial del
            cultivo y los resultados
            registrados anteriormente.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {recommendations.map(
          (
            recommendation,
            index
          ) => (
            <div
              key={`${recommendation}-${index}`}
              className="flex items-start gap-3 rounded-xl border border-green-100 bg-white p-4"
            >
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <p className="leading-6 text-slate-700">
                {recommendation}
              </p>
            </div>
          )
        )}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Estas recomendaciones son
        información de apoyo basada en
        los registros disponibles y no
        sustituyen la evaluación de un
        profesional agrícola.
      </p>
    </section>
  );
}
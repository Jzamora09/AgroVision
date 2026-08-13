import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Ruler,
  Sprout,
  Wheat,
} from "lucide-react";

import type {
  ReportStats as ReportStatsType,
} from "../types/report";

interface Props {
  stats: ReportStatsType;
}

const cards = [
  {
    key: "totalCrops",
    title: "Cultivos",
    subtitle: "En el reporte",
    icon: Sprout,
    className:
      "bg-green-100 text-green-700",
  },
  {
    key: "totalArea",
    title: "Área total",
    subtitle: "Metros cuadrados",
    icon: Ruler,
    className:
      "bg-blue-100 text-blue-700",
  },
  {
    key: "activeCrops",
    title: "Activos",
    subtitle: "Actualmente activos",
    icon: CheckCircle2,
    className:
      "bg-emerald-100 text-emerald-700",
  },
  {
    key: "growingCrops",
    title: "Crecimiento",
    subtitle: "En desarrollo",
    icon: Activity,
    className:
      "bg-amber-100 text-amber-700",
  },
  {
    key: "diseasedCrops",
    title: "Enfermedad",
    subtitle: "Requieren atención",
    icon: AlertTriangle,
    className:
      "bg-red-100 text-red-700",
  },
  {
    key: "harvestedCrops",
    title: "Cosechados",
    subtitle: "Ciclo completado",
    icon: Wheat,
    className:
      "bg-violet-100 text-violet-700",
  },
] as const;

export default function ReportStats({
  stats,
}: Props) {
  const getValue = (
    key: (typeof cards)[number]["key"]
  ) => {
    if (key === "totalArea") {
      return `${stats.totalArea.toLocaleString()} m²`;
    }

    return stats[key];
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {getValue(card.key)}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 ${card.className}`}
              >
                <Icon size={20} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
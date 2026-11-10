import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Minus,
  Ruler,
  Sprout,
  Wheat,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { DashboardStats as DashboardStatsType } from "../types/dashboard";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

interface StatItemProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
  iconBackground: string;
  trendLabel: string;
  trendTone?: "positive" | "neutral" | "warning";
  attention?: boolean;
}

function StatItem({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  iconBackground,
  trendLabel,
  trendTone = "neutral",
  attention = false,
}: StatItemProps) {
  const trendStyles = {
    positive: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    warning: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  }[trendTone];

  return (
    <div className={`agro-surface rounded-2xl p-6 transition duration-300 hover:-translate-y-1 ${attention ? "border-red-200 bg-red-50/40 hover:border-red-400 dark:border-red-900 dark:bg-red-950/20" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`rounded-2xl p-3 ${iconBackground}`}
        >
          <Icon
            size={24}
            className={iconClass}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trendStyles}`}>
          {trendTone === "neutral" ? <Minus size={13} /> : <ArrowUpRight size={13} />}
          {trendLabel}
        </span>

        {attention && (
          <Link to="/cultivos" className="inline-flex items-center gap-1 text-xs font-bold text-red-700 transition hover:text-red-900 dark:text-red-300 dark:hover:text-red-200">
            Ver detalle <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatItem
          title="Total de cultivos"
          value={stats.totalCrops}
          subtitle="Cultivos registrados"
          icon={Sprout}
          iconClass="text-green-700"
          iconBackground="bg-green-100"
          trendLabel="Registro actual"
          trendTone="positive"
        />

        <StatItem
          title="Área registrada"
          value={`${stats.totalArea.toLocaleString()} m²`}
          subtitle="Área total cultivada"
          icon={Ruler}
          iconClass="text-blue-700"
          iconBackground="bg-blue-100"
          trendLabel="Área monitoreada"
        />

        <StatItem
          title="Activos"
          value={stats.activeCrops}
          subtitle="Cultivos activos"
          icon={CheckCircle2}
          iconClass="text-emerald-700"
          iconBackground="bg-emerald-100"
          trendLabel="Activos ahora"
          trendTone="positive"
        />

        <StatItem
          title="En crecimiento"
          value={stats.growingCrops}
          subtitle="En desarrollo"
          icon={Activity}
          iconClass="text-amber-700"
          iconBackground="bg-amber-100"
          trendLabel="En seguimiento"
          trendTone="warning"
        />

        <StatItem
          title="Con enfermedad"
          value={stats.diseasedCrops}
          subtitle="Requieren atención"
          icon={AlertTriangle}
          iconClass="text-red-700"
          iconBackground="bg-red-100"
          trendLabel={stats.diseasedCrops > 0 ? "Requiere atención" : "Sin casos"}
          trendTone={stats.diseasedCrops > 0 ? "warning" : "positive"}
          attention
        />

        <StatItem
          title="Cosechados"
          value={stats.harvestedCrops}
          subtitle="Ciclo completado"
          icon={Wheat}
          iconClass="text-violet-700"
          iconBackground="bg-violet-100"
          trendLabel="Ciclo completado"
        />
      </div>
    </section>
  );
}

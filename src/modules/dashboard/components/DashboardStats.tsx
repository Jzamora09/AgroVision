import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Ruler,
  Sprout,
  Wheat,
} from "lucide-react";

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
}

function StatItem({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  iconBackground,
}: StatItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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
    </div>
  );
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatItem
          title="Total de cultivos"
          value={stats.totalCrops}
          subtitle="Cultivos registrados"
          icon={Sprout}
          iconClass="text-green-700"
          iconBackground="bg-green-100"
        />

        <StatItem
          title="Área registrada"
          value={`${stats.totalArea.toLocaleString()} m²`}
          subtitle="Área total cultivada"
          icon={Ruler}
          iconClass="text-blue-700"
          iconBackground="bg-blue-100"
        />

        <StatItem
          title="Activos"
          value={stats.activeCrops}
          subtitle="Cultivos activos"
          icon={CheckCircle2}
          iconClass="text-emerald-700"
          iconBackground="bg-emerald-100"
        />

        <StatItem
          title="En crecimiento"
          value={stats.growingCrops}
          subtitle="En desarrollo"
          icon={Activity}
          iconClass="text-amber-700"
          iconBackground="bg-amber-100"
        />

        <StatItem
          title="Con enfermedad"
          value={stats.diseasedCrops}
          subtitle="Requieren atención"
          icon={AlertTriangle}
          iconClass="text-red-700"
          iconBackground="bg-red-100"
        />

        <StatItem
          title="Cosechados"
          value={stats.harvestedCrops}
          subtitle="Ciclo completado"
          icon={Wheat}
          iconClass="text-violet-700"
          iconBackground="bg-violet-100"
        />
      </div>
    </section>
  );
}
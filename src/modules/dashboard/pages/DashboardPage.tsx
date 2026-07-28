import {
  Sprout,
  Bug,
  FileBarChart,
  Activity,
} from "lucide-react";

import { StatCard } from "../../../app/components/ui";

export default function DashboardPage() {
  return (
    <div>

      <h1 className="text-4xl font-bold text-slate-800">
        Bienvenido a AgroVision 🌱
      </h1>

      <p className="mt-2 text-slate-500">
        Sistema inteligente para el monitoreo agrícola.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Cultivos"
          value="24"
          subtitle="+4 registrados este mes"
          icon={Sprout}
          color="#16A34A"
        />

        <StatCard
          title="Alertas"
          value="3"
          subtitle="Enfermedades detectadas"
          icon={Bug}
          color="#DC2626"
        />

        <StatCard
          title="Reportes"
          value="14"
          subtitle="Generados"
          icon={FileBarChart}
          color="#2563EB"
        />

        <StatCard
          title="Estado"
          value="92%"
          subtitle="Salud promedio"
          icon={Activity}
          color="#F59E0B"
        />

      </div>

    </div>
  );
}
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CropTypeData } from "../types/dashboard";

interface Props {
  data: CropTypeData[];
}

export default function CropsByTypeChart({
  data,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Cultivos por tipo
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Cantidad registrada por tipo de cultivo.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-slate-400">
          No hay información disponible.
        </div>
      ) : (
        <div className="mt-5 h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="value"
                name="Cultivos"
                fill="#16a34a"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
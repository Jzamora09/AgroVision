import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { CropStatusData } from "../types/dashboard";

interface Props {
  data: CropStatusData[];
}

const COLORS = [
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#64748b",
  "#2563eb",
];

export default function CropsByStatusChart({
  data,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Cultivos por estado
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribución actual de tus cultivos.
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
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {data.map((item, index) => (
                  <Cell
                    key={`${item.name}-${index}`}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
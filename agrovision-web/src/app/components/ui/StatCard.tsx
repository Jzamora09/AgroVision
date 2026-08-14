import type { LucideIcon } from "lucide-react";
import Card from "./Card";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: Props) {
  return (
    <Card>
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-800">
            {value}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {subtitle}
          </p>

        </div>

        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: color }}
        >
          <Icon
            className="text-white"
            size={26}
          />
        </div>

      </div>
    </Card>
  );
}
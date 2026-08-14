import {
  CircleAlert,
} from "lucide-react";

interface SymptomsListProps {
  symptoms: string[];
}

export default function SymptomsList({
  symptoms,
}: SymptomsListProps) {
  if (symptoms.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No se identificaron síntomas visibles.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {symptoms.map(
        (symptom, index) => (
          <div
            key={`${symptom}-${index}`}
            className="flex items-start gap-3 rounded-xl bg-amber-50 p-4"
          >
            <CircleAlert
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <p className="text-sm leading-6 text-slate-700">
              {symptom}
            </p>
          </div>
        )
      )}
    </div>
  );
}
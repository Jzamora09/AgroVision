import type { InputHTMLAttributes } from "react";
import { Mail } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AuthInput({
  label,
  error,
  ...props
}: Props) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          {...props}
          className={`
          w-full
          rounded-xl
          border
          px-4
          pl-11
          py-3
          outline-none
          transition
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
          }
          `}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

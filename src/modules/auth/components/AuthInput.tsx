import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthInput({
  label,
  ...props
}: Props) {
  return (
    <div className="mb-5">

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="
        w-full
        rounded-xl
        border
        border-slate-300
        px-4
        py-3
        outline-none
        transition
        focus:border-green-500
        focus:ring-2
        focus:ring-green-200
        "
      />

    </div>
  );
}
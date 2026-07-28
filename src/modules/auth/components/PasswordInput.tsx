import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  label: string;
  placeholder?: string;
}

export default function PasswordInput({
  label,
  placeholder,
}: Props) {

  const [show, setShow] = useState(false);

  return (
    <div className="mb-5">

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          pr-12
          outline-none
          transition
          focus:border-green-500
          focus:ring-2
          focus:ring-green-200
          "
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

      </div>

    </div>
  );
}
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function AuthButton({
  text,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className="
        w-full
        rounded-xl
        bg-green-600
        py-3
        font-semibold
        text-white
        transition
        hover:bg-green-700
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {props.disabled && <Loader2 size={18} className="mr-2 inline animate-spin" />}
      {text}
    </button>
  );
}

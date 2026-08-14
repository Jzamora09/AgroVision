import type { ButtonHTMLAttributes } from "react";

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
      {text}
    </button>
  );
}
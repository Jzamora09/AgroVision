import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div
      className="
      w-full
      max-w-md
      rounded-3xl
      bg-white
      p-10
      shadow-2xl
      border
      border-slate-200
      "
    >
      {children}
    </div>
  );
}
import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div className="auth-card-shell w-full max-w-md rounded-3xl p-[2px]">
      <div className="auth-card-inner rounded-[calc(1.5rem-2px)] bg-white p-10">
        {children}
      </div>
    </div>
  );
}

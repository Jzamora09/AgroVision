import { Bell } from "lucide-react";

export default function NotificationButton() {
  return (
    <button
      className="
      relative
      rounded-xl
      p-3
      transition
      hover:bg-slate-100
      "
    >
      <Bell size={20} />

      <span
        className="
        absolute
        right-2
        top-2
        h-2
        w-2
        rounded-full
        bg-red-500
        "
      />
    </button>
  );
}
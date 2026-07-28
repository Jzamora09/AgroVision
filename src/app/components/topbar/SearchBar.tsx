import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Buscar cultivos..."
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-slate-50
          py-3
          pl-11
          pr-4
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
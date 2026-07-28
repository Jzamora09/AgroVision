import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import UserMenu from "./UserMenu";

export default function Topbar() {
  return (
    <header
      className="
      sticky
      top-0
      z-20
      flex
      h-20
      items-center
      justify-between
      border-b
      border-slate-200
      bg-white
      px-8
      shadow-sm
      "
    >
      {/* Buscador */}
      <SearchBar />

      {/* Acciones */}
      <div className="flex items-center gap-2">

        <LanguageSelector />

        <ThemeToggle />

        <NotificationButton />

        <UserMenu />

      </div>
    </header>
  );
}
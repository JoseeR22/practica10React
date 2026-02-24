import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useFavorites } from "../context/FavoritesContext";

export default function Header() {
  const navigate = useNavigate();
  const { count } = useFavorites();

  const onSearch = (q) => navigate(`/search?q=${encodeURIComponent(q)}`);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">GameHub</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300">
            RAWG
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm text-zinc-300">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-white" : "hover:text-white"}>
            Home
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? "text-white" : "hover:text-white"}>
            Buscar
          </NavLink>
          <NavLink to="/publishers" className={({ isActive }) => isActive ? "text-white" : "hover:text-white"}>
            Publishers
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? "text-white" : "hover:text-white"}>
            <span className="inline-flex items-center gap-2">
              Favoritos
              {count > 0 && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-200">
                  {count}
                </span>
              )}
            </span>
          </NavLink>
        </nav>

        <div className="ml-auto w-full max-w-lg">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </header>
  );
}
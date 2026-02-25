import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";

export default function Header() {
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.games.favorites);
  const count = favorites.length;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
          <NavLink to="/events" className={({ isActive }) => isActive ? "text-white" : "hover:text-white"}>
            Eventos
          </NavLink>
        </nav>

        <div className="ml-auto w-full max-w-md">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300 transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-lg shadow-xl overflow-hidden py-1">
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-sm font-medium text-white">Usuario Demo</p>
                <p className="text-xs text-zinc-400">usuario@demo.com</p>
              </div>
              <Link
                to="/favorites"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Mis Favoritos
                {count > 0 && (
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                    {count}
                  </span>
                )}
              </Link>
              <Link
                to="/my-events"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Mis Eventos
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
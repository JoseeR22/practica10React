import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import GameCard from "../components/GameCard";

export default function Favorites() {
  const { favorites, count } = useFavorites();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Favoritos</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {count ? `${count} juego(s) guardado(s).` : "Aún no has añadido favoritos."}
          </p>
        </div>

        <Link
          to="/"
          className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
        >
          Seguir explorando
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
          Añade juegos a favoritos desde Home o Buscar (botón ⭐).
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
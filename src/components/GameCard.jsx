import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function GameCard({ game }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(game.id);

  function onFavClick(e) {
    e.preventDefault(); // evita navegar
    e.stopPropagation();
    // guardamos lo necesario para pintar cards
    toggleFavorite({
      id: game.id,
      name: game.name,
      rating: game.rating,
      released: game.released,
      background_image: game.background_image,
    });
  }

  return (
    <Link
      to={`/games/${game.id}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:border-white/20 transition"
    >
      <div className="aspect-[16/10] w-full bg-black/30">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />

      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
          ⭐ {game.rating?.toFixed?.(1) ?? game.rating ?? "—"}
        </span>
        {game.released && (
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
            {game.released}
          </span>
        )}
      </div>

      {/* botón favoritos */}
      <button
        onClick={onFavClick}
        className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur hover:bg-black/60"
        aria-label={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
        title={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        {fav ? "★" : "☆"}
      </button>

      <div className="absolute bottom-0 w-full p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">
          {game.name}
        </h3>
        <p className="mt-1 text-xs text-zinc-300/90">Ver detalles →</p>
      </div>
    </Link>
  );
}
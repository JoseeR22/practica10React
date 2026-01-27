import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchGames } from "../services/rawg";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import GameCard from "../components/GameCard";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const title = useMemo(() => (q ? `Resultados para “${q}”` : "Buscar juegos"), [q]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!q.trim()) {
        setResults([]);
        setStatus("idle");
        setError("");
        return;
      }

      try {
        setStatus("loading");
        setError("");
        const data = await searchGames(q, { page: 1, pageSize: 24 });
        if (cancelled) return;
        setResults(data.results || []);
        setStatus("ok");
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Error desconocido");
        setStatus("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Escribe en el buscador de arriba para encontrar videojuegos.
        </p>
      </div>

      {status === "loading" && <Loading label="Buscando..." />}
      {status === "error" && <ErrorState message={error} />}
      {status !== "loading" && status !== "error" && q.trim() && results.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
          No se encontraron resultados.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </div>
  );
}
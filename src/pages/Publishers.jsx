import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPublishers, searchPublishers } from "../services/rawg";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";

export default function Publishers() {
    const [params, setParams] = useSearchParams();
    const q = params.get("q") || "";
    const page = parseInt(params.get("page") || "1", 10);

    const [results, setResults] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [searchInput, setSearchInput] = useState(q);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            try {
                setStatus("loading");
                setError("");

                const data = q.trim()
                    ? await searchPublishers(q, { page, pageSize: 24 })
                    : await getPublishers({ page, pageSize: 24 });

                if (cancelled) return;
                setResults(data.results || []);
                setHasNext(!!data.next);
                setHasPrev(!!data.previous);
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
    }, [q, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(params);
        newParams.set("q", searchInput);
        newParams.set("page", "1");
        setParams(newParams);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    Publishers
                </h1>
                <p className="mt-2 text-sm text-zinc-300 max-w-2xl">
                    Explora o busca tus publishers de videojuegos favoritos.
                </p>

                <form onSubmit={handleSearch} className="mt-6 flex max-w-md gap-2">
                    <input
                        type="text"
                        placeholder="Buscar publisher..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                    />
                    <button
                        type="submit"
                        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            {status === "loading" && <Loading label="Cargando publishers..." />}
            {status === "error" && <ErrorState message={error} />}
            {status !== "loading" && status !== "error" && results.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
                    No se encontraron publishers.
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((p) => (
                    <Link key={p.id} to={`/publishers/${p.id}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                        <div className="aspect-video w-full bg-black/30">
                            {p.image_background ? (
                                <img
                                    src={p.image_background}
                                    alt={p.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : null}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-white truncate">{p.name}</h3>
                            <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                                <span>Juegos: {p.games_count}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {results.length > 0 && (
                <Pagination hasNext={hasNext} hasPrev={hasPrev} />
            )}
        </div>
    );
}

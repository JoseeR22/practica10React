import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getGames } from "../services/rawg";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import GameCard from "../components/GameCard";
import Pagination from "../components/Pagination";

export default function FilteredGames({ type }) {
    const { slug } = useParams();
    const [params] = useSearchParams();
    const page = parseInt(params.get("page") || "1", 10);

    const [results, setResults] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    const title = useMemo(() => {
        const typeLabel = type === "tags" ? "Tag" : "Género";
        return `Juegos por ${typeLabel}: ${slug}`;
    }, [type, slug]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            try {
                setStatus("loading");
                setError("");

                const filterParams = { page, pageSize: 24 };
                if (type === "tags") filterParams.tags = slug;
                if (type === "genres") filterParams.genres = slug;

                const data = await getGames(filterParams);
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
    }, [type, slug, page]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold capitalize">{title}</h1>
            </div>

            {status === "loading" && <Loading label={`Cargando juegos de ${slug}...`} />}
            {status === "error" && <ErrorState message={error} />}
            {status !== "loading" && status !== "error" && results.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
                    No se encontraron juegos.
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((g) => (
                    <GameCard key={g.id} game={g} />
                ))}
            </div>

            {results.length > 0 && (
                <Pagination hasNext={hasNext} hasPrev={hasPrev} />
            )}
        </div>
    );
}

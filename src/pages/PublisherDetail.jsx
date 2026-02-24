import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getPublisherDetails, getGames } from "../services/rawg";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import GameCard from "../components/GameCard";
import Pagination from "../components/Pagination";

export default function PublisherDetail() {
    const { id } = useParams();
    const [params] = useSearchParams();
    const page = parseInt(params.get("page") || "1", 10);

    const [publisher, setPublisher] = useState(null);
    const [games, setGames] = useState([]);

    const [statusInfo, setStatusInfo] = useState("loading");
    const [statusGames, setStatusGames] = useState("loading");
    const [error, setError] = useState("");

    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    async function loadInfo() {
        try {
            setStatusInfo("loading");
            const data = await getPublisherDetails(id);
            setPublisher(data);
            setStatusInfo("ok");
        } catch (e) {
            setError(e?.message || "Error desconocido");
            setStatusInfo("error");
        }
    }

    async function loadGames() {
        try {
            setStatusGames("loading");
            const data = await getGames({ publishers: id, page, pageSize: 24 });
            setGames(data.results || []);
            setHasNext(!!data.next);
            setHasPrev(!!data.previous);
            setStatusGames("ok");
        } catch (e) {
            setStatusGames("error");
        }
    }

    useEffect(() => {
        loadInfo();
    }, [id]);

    useEffect(() => {
        loadGames();
    }, [id, page]);

    if (statusInfo === "loading" && !publisher) return <Loading label="Cargando publisher..." />;
    if (statusInfo === "error") return <ErrorState message={error} onRetry={loadInfo} />;
    if (!publisher) return null;

    return (
        <div className="space-y-6">
            <Link to="/publishers" className="text-sm text-zinc-300 hover:text-white">
                ← Volver a Publishers
            </Link>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="aspect-21/9 w-full bg-black/30">
                    {publisher.image_background ? (
                        <img src={publisher.image_background} alt={publisher.name} className="h-full w-full object-cover opacity-60" />
                    ) : null}
                </div>

                <div className="p-6">
                    <h1 className="text-3xl font-semibold tracking-tight">{publisher.name}</h1>
                    <div className="mt-6 text-sm text-zinc-300" dangerouslySetInnerHTML={{ __html: publisher.description || "Sin descripción disponible." }} />
                </div>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-4">Juegos de {publisher.name}</h2>

                {statusGames === "loading" && <Loading label="Cargando juegos..." />}
                {statusGames === "error" && <div className="text-sm text-red-400">Error cargando juegos.</div>}
                {statusGames !== "loading" && statusGames !== "error" && games.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
                        No se encontraron juegos para este publisher.
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {games.map((g) => (
                        <GameCard key={g.id} game={g} />
                    ))}
                </div>

                {games.length > 0 && (
                    <Pagination hasNext={hasNext} hasPrev={hasPrev} />
                )}
            </section>
        </div>
    );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGameDetails } from "../services/rawg";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

export default function GameDetail() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    async function load() {
        try {
            setStatus("loading");
            setError("");
            const data = await getGameDetails(id);
            setGame(data);
            setStatus("ok");
        } catch (e) {
            setError(e?.message || "Error desconocido");
            setStatus("error");
        }
    }

    useEffect(() => {
        load();
    }, [id]);

    if (status === "loading") return <Loading label="Cargando detalle..." />;
    if (status === "error") return <ErrorState message={error} onRetry={load} />;
    if (!game) return null;

    const platforms = (game.platforms || []).map((p) => ({ label: p.platform?.name })).filter((p) => p.label);
    const genres = (game.genres || []).map((g) => ({ label: g.name, url: `/genres/${g.slug}` })).filter((g) => g.label);
    const tags = (game.tags || []).map((t) => ({ label: t.name, url: `/tags/${t.slug}` })).filter((t) => t.label);
    const publishers = (game.publishers || []).map((p) => ({ label: p.name, url: `/publishers/${p.id}` })).filter((p) => p.label);

    return (
        <div className="space-y-6">
            <Link to="/" className="text-sm text-zinc-300 hover:text-white">
                ← Volver
            </Link>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="aspect-21/9 w-full bg-black/30">
                    {game.background_image ? (
                        <img src={game.background_image} alt={game.name} className="h-full w-full object-cover" />
                    ) : null}
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">{game.name}</h1>
                            <p className="mt-1 text-sm text-zinc-400">
                                {game.released ? `Lanzamiento: ${game.released}` : "Sin fecha"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 px-4 py-2">
                            <div className="text-xs text-zinc-300">Rating</div>
                            <div className="text-lg font-semibold">⭐ {game.rating?.toFixed?.(1) ?? game.rating ?? "—"}</div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <InfoBlock title="Plataformas" items={platforms} />
                        <InfoBlock title="Géneros" items={genres} />
                        <InfoBlock title="Tags" items={tags} />
                        <InfoBlock title="Publishers" items={publishers} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-zinc-200">Descripción</h2>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                            {game.description_raw || "Sin descripción disponible."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ title, items }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs font-semibold text-zinc-200">{title}</div>
            <div className="mt-2 flex flex-wrap gap-2">
                {items.length ? (
                    items.map((x, i) => {
                        const content = (
                            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200 hover:bg-white/20 transition-colors">
                                {x.label}
                            </span>
                        );
                        return x.url ? (
                            <Link key={i} to={x.url}>
                                {content}
                            </Link>
                        ) : (
                            <span key={i}>{content}</span>
                        );
                    })
                ) : (
                    <span className="text-xs text-zinc-400">No disponible</span>
                )}
            </div>
        </div>
    );
}
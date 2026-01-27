import { useEffect, useState } from "react";
import { getGames } from "../services/rawg";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import GameCarousel from "../components/GameCarrousel";
import GameCard from "../components/GameCard";

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [list, setList] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | loading | error | ok
    const [error, setError] = useState("");

    async function load() {
        try {
            setStatus("loading");
            setError("");

            const data = await getGames({ page: 1, pageSize: 24, ordering: "-rating" });
            const results = data.results || [];
            setFeatured(results.slice(0, 8));
            setList(results.slice(8));
            setStatus("ok");
        } catch (e) {
            setError(e?.message || "Error desconocido");
            setStatus("error");
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (status === "loading") return <Loading label="Cargando juegos..." />;
    if (status === "error") return <ErrorState message={error} onRetry={load} />;

    return (

        <div className="space-y-10">
            <section className="mb-8">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                        Descubre tu próximo juego
                    </h1>
                    <p className="mt-2 text-sm text-zinc-300 max-w-2xl">
                        Explora los mejor valorados, busca por nombre y entra al detalle con plataformas, géneros y descripción.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">Carrusel</span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">Buscador</span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">Detalle</span>
                    </div>
                </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Descubre videojuegos</h1>
                        <p className="mt-1 text-sm text-zinc-400">Top valorados y recomendaciones para ti.</p>
                    </div>

                   
                </div>

                <div className="relative -mx-1 px-1">
                    <GameCarousel games={featured} />
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                    <h2 className="text-lg font-semibold">Más juegos</h2>
                    <span className="text-xs text-zinc-400">Ordenado por rating</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((g) => (
                        <GameCard key={g.id} game={g} />
                    ))}
                </div>
            </section>
        </div>
    );
}
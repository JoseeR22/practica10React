import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsThunk, toggleEventParticipation } from "../store/slices/eventsSlice";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

export default function Events() {
    const dispatch = useDispatch();
    const { data: events, status, error } = useSelector((state) => state.events.list);
    const myEvents = useSelector((state) => state.events.myEvents);

    useEffect(() => {
        dispatch(fetchEventsThunk());
    }, [dispatch]);

    if (status === "loading") return <Loading label="Cargando eventos..." />;
    if (status === "error") return <ErrorState message={error} onRetry={() => dispatch(fetchEventsThunk())} />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Eventos Destacados</h1>
                <p className="mt-1 text-sm text-zinc-400">Próximos eventos de la industria de los videojuegos.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                    const isParticipating = myEvents.some((e) => e.id === event.id);

                    return (
                        <div key={event.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:border-white/20 transition">
                            <div className="aspect-video w-full bg-black/30">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.06]"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="line-clamp-1 text-lg font-semibold leading-snug">{event.title}</h3>
                                <p className="mt-1 text-sm text-zinc-400">📍 {event.location}</p>
                                <button
                                    onClick={() => dispatch(toggleEventParticipation(event))}
                                    className={`mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium transition-colors ${isParticipating
                                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                        : "bg-indigo-600 text-white hover:bg-indigo-500"
                                        }`}
                                >
                                    {isParticipating ? "Cancelar participación" : "Apuntarse al evento"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

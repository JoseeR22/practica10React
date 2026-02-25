import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleEventParticipation } from "../store/slices/eventsSlice";

export default function MyEvents() {
    const dispatch = useDispatch();
    const myEvents = useSelector((state) => state.events.myEvents);

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Mis Eventos</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        {myEvents.length ? `Estás apuntado a ${myEvents.length} evento(s).` : "Aún no te has apuntado a ningún evento."}
                    </p>
                </div>

                <Link
                    to="/events"
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                >
                    Explorar eventos
                </Link>
            </div>

            {myEvents.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
                    Encuentra eventos interesantes y apúntate desde la sección de Eventos.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {myEvents.map((event) => (
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
                                    className="mt-4 w-full rounded-xl px-4 py-2 text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                >
                                    Cancelar participación
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

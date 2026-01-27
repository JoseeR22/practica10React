export default function Loading({ label = "Cargando..." }) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-300">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm">
          {label}
        </div>
      </div>
    );
  }
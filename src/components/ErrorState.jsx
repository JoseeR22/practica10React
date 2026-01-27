export default function ErrorState({ title = "Ups…", message, onRetry }) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
        <div className="font-semibold">{title}</div>
        {message && <p className="mt-1 text-sm text-zinc-200/90">{message}</p>}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }
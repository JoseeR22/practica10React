import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  function submit(e) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-white/20">
        <span className="text-zinc-400 text-xs">⌕</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar videojuegos..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
        />
      </div>
      <button className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200">
        Buscar
      </button>
    </form>
  );
}
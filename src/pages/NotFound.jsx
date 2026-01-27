import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const err = useRouteError();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="text-sm text-zinc-400">
        {err?.statusText || err?.message || "Ruta inválida."}
      </p>
      <Link to="/" className="inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200">
        Ir al inicio
      </Link>
    </div>
  );
}
console.log("ENV BASE", import.meta.env.VITE_RAWG_BASE_URL);
console.log("ENV KEY", import.meta.env.VITE_RAWG_API_KEY ? "OK" : "MISSING");

const RAW_BASE = import.meta.env.VITE_RAWG_BASE_URL || "https://api.rawg.io/api";
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// Limpia espacios y posibles ; al final, y quita trailing /
const BASE_URL = RAW_BASE.trim().replace(/;$/, "").replace(/\/$/, "");

if (!API_KEY) {
  throw new Error("Falta VITE_RAWG_API_KEY en .env");
}

export async function request(endpoint, params = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${BASE_URL}${cleanEndpoint}`);

  url.searchParams.set("key", API_KEY);

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }

  console.log("RAWG URL =>", url.toString());

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`RAWG error ${res.status}: ${text}`);
  }
  return res.json();
}

export function getGames({ page = 1, pageSize = 20, ordering = "-rating" } = {}) {
  return request("/games", { page, page_size: pageSize, ordering });
}

export function searchGames(query, { page = 1, pageSize = 20 } = {}) {
  return request("/games", { search: query, page, page_size: pageSize });
}

export function getGameDetails(id) {
  return request(`/games/${id}`);
}
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "gamehub:favorites";

export function FavoritesProvider({ children }) {
    const [favoritesMap, setFavoritesMap] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesMap));
    }, [favoritesMap]);

    const favorites = useMemo(() => Object.values(favoritesMap), [favoritesMap]);
    const count = favorites.length;

    function isFavorite(id) {
        return Boolean(favoritesMap[id]);
    }

    function addFavorite(game) {
        setFavoritesMap((prev) => ({ ...prev, [game.id]: game }));
    }

    function removeFavorite(id) {
        setFavoritesMap((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    }

    function toggleFavorite(game) {
        setFavoritesMap((prev) => {
            if (prev[game.id]) {
                const copy = { ...prev };
                delete copy[game.id];
                return copy;
            }
            return { ...prev, [game.id]: game };
        });
    }

    const value = useMemo(
        () => ({ favorites, count, isFavorite, addFavorite, removeFavorite, toggleFavorite }),
        [favorites, count, favoritesMap]
    );

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
    return ctx;
}
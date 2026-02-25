import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGames, searchGames, getGameDetails } from "../../services/rawg";

const loadFavorites = () => {
    try {
        const saved = localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
};

const saveFavorites = (favorites) => {
    try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (e) {
        console.error("Error saving favorites to localStorage", e);
    }
};

export const fetchGamesThunk = createAsyncThunk(
    "games/fetchGames",
    async (params) => {
        const response = await getGames(params);
        return { ...response, page: params?.page || 1 };
    }
);

export const searchGamesThunk = createAsyncThunk(
    "games/searchGames",
    async ({ query, params }) => {
        const response = await searchGames(query, params);
        return response;
    }
);

export const fetchGameDetailsThunk = createAsyncThunk(
    "games/fetchGameDetails",
    async (id) => {
        const response = await getGameDetails(id);
        return response;
    }
);


const gamesSlice = createSlice({
    name: "games",
    initialState: {
        list: {
            data: [],
            featured: [],
            status: "idle",
            error: null,
            hasNext: false,
            hasPrev: false,
        },
        searchResults: {
            data: [],
            status: "idle",
            error: null,
            hasNext: false,
            hasPrev: false,
        },
        gameDetails: {
            data: null,
            status: "idle",
            error: null,
        },
        favorites: loadFavorites(),
    },
    reducers: {
        toggleFavorite: (state, action) => {
            const game = action.payload;
            const index = state.favorites.findIndex((g) => g.id === game.id);
            if (index >= 0) {
                state.favorites.splice(index, 1);
            } else {
                state.favorites.push(game);
            }
            saveFavorites(state.favorites);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchGamesThunk
            .addCase(fetchGamesThunk.pending, (state) => {
                state.list.status = "loading";
                state.list.error = null;
            })
            .addCase(fetchGamesThunk.fulfilled, (state, action) => {
                state.list.status = "ok";
                const results = action.payload.results || [];
                if (action.payload.page === 1) {
                    state.list.featured = results.slice(0, 8);
                    state.list.data = results.slice(8);
                } else {
                    state.list.featured = [];
                    state.list.data = results;
                }
                state.list.hasNext = !!action.payload.next;
                state.list.hasPrev = !!action.payload.previous;
            })
            .addCase(fetchGamesThunk.rejected, (state, action) => {
                state.list.status = "error";
                state.list.error = action.error.message;
            })

            // searchGamesThunk
            .addCase(searchGamesThunk.pending, (state) => {
                state.searchResults.status = "loading";
                state.searchResults.error = null;
            })
            .addCase(searchGamesThunk.fulfilled, (state, action) => {
                state.searchResults.status = "ok";
                state.searchResults.data = action.payload.results || [];
                state.searchResults.hasNext = !!action.payload.next;
                state.searchResults.hasPrev = !!action.payload.previous;
            })
            .addCase(searchGamesThunk.rejected, (state, action) => {
                state.searchResults.status = "error";
                state.searchResults.error = action.error.message;
            })

            // fetchGameDetailsThunk
            .addCase(fetchGameDetailsThunk.pending, (state) => {
                state.gameDetails.status = "loading";
                state.gameDetails.error = null;
            })
            .addCase(fetchGameDetailsThunk.fulfilled, (state, action) => {
                state.gameDetails.status = "ok";
                state.gameDetails.data = action.payload;
            })
            .addCase(fetchGameDetailsThunk.rejected, (state, action) => {
                state.gameDetails.status = "error";
                state.gameDetails.error = action.error.message;
            });
    },
});

export const { toggleFavorite } = gamesSlice.actions;
export default gamesSlice.reducer;

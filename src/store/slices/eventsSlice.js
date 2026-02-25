import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEventsApi } from "../../services/events";

const loadMyEvents = () => {
    try {
        const saved = localStorage.getItem("myEvents");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
};

const saveMyEvents = (myEvents) => {
    try {
        localStorage.setItem("myEvents", JSON.stringify(myEvents));
    } catch (e) {
        console.error("Error saving myEvents to localStorage", e);
    }
};

export const fetchEventsThunk = createAsyncThunk(
    "events/fetchEvents",
    async () => {
        const response = await fetchEventsApi();
        return response;
    }
);

const eventsSlice = createSlice({
    name: "events",
    initialState: {
        list: {
            data: [],
            status: "idle",
            error: null,
        },
        myEvents: loadMyEvents(),
    },
    reducers: {
        toggleEventParticipation: (state, action) => {
            const event = action.payload;
            const index = state.myEvents.findIndex((e) => e.id === event.id);
            if (index >= 0) {
                state.myEvents.splice(index, 1);
            } else {
                state.myEvents.push(event);
            }
            saveMyEvents(state.myEvents);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventsThunk.pending, (state) => {
                state.list.status = "loading";
                state.list.error = null;
            })
            .addCase(fetchEventsThunk.fulfilled, (state, action) => {
                state.list.status = "ok";
                state.list.data = action.payload;
            })
            .addCase(fetchEventsThunk.rejected, (state, action) => {
                state.list.status = "error";
                state.list.error = action.error.message;
            });
    },
});

export const { toggleEventParticipation } = eventsSlice.actions;
export default eventsSlice.reducer;

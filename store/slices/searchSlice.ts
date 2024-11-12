import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Place {
  description: string;
  place_id: string;
}

export interface HistoryItem {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
}

interface SearchState {
  loading: boolean;
  places: Place[];
  error: string | null;
  searchHistory: HistoryItem[];
  favList: HistoryItem[];
}

const initialState: SearchState = {
  loading: false,
  places: [],
  error: null,
  searchHistory: [],
  favList: [],
};

const API_KEY = "AIzaSyAX7glUBU6bLO2UUGYwUxEfeGCEapfJpM0";

export const fetchPlaces = createAsyncThunk<
  Place[],
  string,
  { rejectValue: string }
>("search/fetchPlaces", async (query, { rejectWithValue }) => {
  if (query.trim() === "") {
    return [];
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: query,
          key: API_KEY,
          types: "geocode",
          components: "country:my",
        },
      }
    );

    if (response.data.status !== "OK") {
      return rejectWithValue(response.data.error_message || "Unknown error");
    }

    const predictions: Place[] = response.data.predictions
      .slice(0, 5)
      .map((place: any) => ({
        description: place.description,
        place_id: place.place_id,
      }));

    return predictions;
  } catch (err) {
    console.error("Error fetching places:", err);
    return rejectWithValue("Unable to fetch results.");
  }
});

export const fetchPlaceDetails = createAsyncThunk<
  { lat: number; lng: number },
  string,
  { rejectValue: string }
>("search/fetchPlaceDetails", async (place_id, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: place_id,
          key: API_KEY,
        },
      }
    );

    if (response.data.status !== "OK") {
      return rejectWithValue(response.data.error_message || "Unknown error");
    }

    const location = response.data.result.geometry.location;
    return { lat: location.lat, lng: location.lng };
  } catch (err) {
    console.error("Error fetching place details:", err);
    return rejectWithValue("Unable to fetch place details.");
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    fetchPlacesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPlacesSuccess(state, action: PayloadAction<Place[]>) {
      state.loading = false;
      state.places = action.payload;
      state.error = null;
    },
    fetchPlacesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.places = [];
      state.error = action.payload;
    },
    addToSearchHistory(state, action: PayloadAction<HistoryItem>) {
      state.searchHistory.unshift(action.payload);
      if (state.searchHistory.length > 10) {
        state.searchHistory.pop();
      }
    },
    clearSearchHistory(state) {
      state.searchHistory = [];
    },
    addToFav(state, action: PayloadAction<HistoryItem>) {
      const itemExists = state.favList.some(
        (item) => item.id === action.payload.id
      );
      if (!itemExists) {
        state.favList.unshift(action.payload);
        if (state.favList.length > 10) {
          state.favList.pop();
        }
      }
    },
    removeFromFav(state, action: PayloadAction<string>) {
      state.favList = state.favList.filter(
        (item) => item.id !== action.payload
      );
    },
    clearFav(state) {
      state.favList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.places = [];
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;
        if (action.payload.length === 0) {
          state.error = "No results found.";
        }
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.places = [];
        state.error = action.payload || "Unable to fetch results.";
      });

    builder
      .addCase(fetchPlaceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchPlaceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch place details.";
      });
  },
});

export const {
  fetchPlacesRequest,
  fetchPlacesSuccess,
  fetchPlacesFailure,
  addToSearchHistory,
  clearSearchHistory,
  removeFromFav,
  addToFav,
  clearFav,
} = searchSlice.actions;

export default searchSlice.reducer;

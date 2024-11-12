import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

interface PlaceDetails {
  lat: number;
  lng: number;
}

interface SearchState {
  loading: boolean;
  places: Place[];
  error: string | null;
  searchHistory: HistoryItem[];
  favList: HistoryItem[];
  selectedPlaceDetails: PlaceDetails | null;
}

const initialState: SearchState = {
  loading: false,
  places: [],
  error: null,
  searchHistory: [],
  favList: [],
  selectedPlaceDetails: null,
};

export const fetchPlacesRequest = createAction<string>(
  "search/fetchPlacesRequest"
);
export const fetchPlacesSuccess = createAction<Place[]>(
  "search/fetchPlacesSuccess"
);
export const fetchPlacesFailure = createAction<string>(
  "search/fetchPlacesFailure"
);

export const fetchPlaceDetailsRequest = createAction<string>(
  "search/fetchPlaceDetailsRequest"
);
export const fetchPlaceDetailsSuccess = createAction<{
  lat: number;
  lng: number;
}>("search/fetchPlaceDetailsSuccess");
export const fetchPlaceDetailsFailure = createAction<string>(
  "search/fetchPlaceDetailsFailure"
);
export const clearSelectedPlaceDetails = createAction(
  "search/clearSelectedPlaceDetails"
);
export const clearError = createAction("search/clearError");

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
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
    clearSelectedPlaceDetails(state) {
      state.selectedPlaceDetails = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlacesRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.places = [];
      })
      .addCase(fetchPlacesSuccess, (state, action) => {
        state.loading = false;
        state.places = action.payload;
        state.error = null;
      })
      .addCase(fetchPlacesFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPlaceDetailsRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPlaceDetails = null;
      })
      .addCase(fetchPlaceDetailsSuccess, (state, action) => {
        state.loading = false;
        state.selectedPlaceDetails = action.payload;
      })
      .addCase(fetchPlaceDetailsFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearSelectedPlaceDetails, (state) => {
        state.selectedPlaceDetails = null;
      })
      .addCase(clearError, (state) => {
        state.error = null;
      });
  },
});

export const {
  addToSearchHistory,
  clearSearchHistory,
  removeFromFav,
  addToFav,
  clearFav,
  // clearSelectedPlaceDetails,
  // clearError,
} = searchSlice.actions;

export default searchSlice.reducer;

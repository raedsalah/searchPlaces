import { combineEpics, Epic } from "redux-observable";
import { ofType } from "redux-observable";
import { from, of } from "rxjs";
import {
  mergeMap,
  map,
  catchError,
  debounceTime,
  filter,
} from "rxjs/operators";
import axios from "axios";

import {
  fetchPlacesRequest,
  fetchPlacesSuccess,
  fetchPlacesFailure,
  fetchPlaceDetailsRequest,
  fetchPlaceDetailsSuccess,
  fetchPlaceDetailsFailure,
  Place,
} from "../slices/searchSlice";
import { Action } from "@reduxjs/toolkit";
import { RootState } from "../slices";

const API_KEY = "AIzaSyAX7glUBU6bLO2UUGYwUxEfeGCEapfJpM0";

const fetchPlacesEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(fetchPlacesRequest.type),
    debounceTime(500),
    filter((action: any) => action.payload.trim().length > 0),
    mergeMap((action) =>
      from(
        axios.get(
          "https://maps.googleapis.com/maps/api/place/autocomplete/json",
          {
            params: {
              input: action.payload,
              key: API_KEY,
              types: "geocode",
              components: "country:my",
            },
          }
        )
      ).pipe(
        map((response) => {
          if (response.data.status !== "OK") {
            throw new Error(response.data.error_message || "Unknown error");
          }
          const predictions: Place[] = response.data.predictions
            .slice(0, 5)
            .map((place: any) => ({
              description: place.description,
              place_id: place.place_id,
            }));
          return fetchPlacesSuccess(predictions);
        }),
        catchError((error) => {
          console.error("Error fetching places:", error);
          // return of(
          //   fetchPlacesFailure(error.message || "Unable to fetch results.")
          // );
          return of(fetchPlacesSuccess([]));
        })
      )
    )
  );

const fetchPlaceDetailsEpic: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(fetchPlaceDetailsRequest.type),
    mergeMap((action: any) =>
      from(
        axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
          params: {
            place_id: action.payload,
            key: API_KEY,
          },
        })
      ).pipe(
        map((response) => {
          if (response.data.status !== "OK") {
            throw new Error(response.data.error_message || "Unknown error");
          }
          const location = response.data.result.geometry.location;
          return fetchPlaceDetailsSuccess({
            lat: location.lat,
            lng: location.lng,
          });
        }),
        catchError((error) => {
          console.error("Error fetching place details:", error);
          // return of(
          //   fetchPlaceDetailsFailure(
          //     error.message || "Unable to fetch place details."
          //   )
          // );
          return of(fetchPlacesSuccess([]));
        })
      )
    )
  );

export const rootEpic = combineEpics(fetchPlacesEpic, fetchPlaceDetailsEpic);

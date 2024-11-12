import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Dropdown, { DropdownItem } from "./Dropdown";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchPlaces,
  fetchPlaceDetails,
  addToSearchHistory,
} from "@/store/slices/searchSlice";

interface PlacesAutocompleteProps {
  onPlaceSelected: (latitude: number, longitude: number) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = React.memo(
  ({ onPlaceSelected }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { places, loading, error } = useSelector(
      (state: RootState) => state.search
    );

    const debouncedFetchPlaces = useMemo(
      () => debounce((query: string) => dispatch(fetchPlaces(query)), 500),
      [dispatch]
    );

    useEffect(() => {
      return () => {
        debouncedFetchPlaces.cancel();
      };
    }, [debouncedFetchPlaces]);

    const handleSelectPlace = useCallback(
      async (place: DropdownItem) => {
        dispatch(fetchPlaceDetails(place.value))
          .unwrap()
          .then(({ lat, lng }) => {
            onPlaceSelected(lat, lng);
            dispatch(
              addToSearchHistory({ id: place.value, label: place.label })
            );
          })
          .catch((err: string) => {
            Alert.alert("Error", err);
          });
      },
      [dispatch, onPlaceSelected]
    );

    const dropdownItems: DropdownItem[] = useMemo(() => {
      if (places.length > 0) {
        return places.map((place) => ({
          label: place.description,
          value: place.place_id,
          selectable: true,
        }));
      } else if (error) {
        return [
          {
            label:
              error === "No results found."
                ? "No results found."
                : "Error fetching results.",
            value: "no_result",
            selectable: false,
          },
        ];
      }
      return [];
    }, [places, error]);

    const handleDropdownSelect = useCallback(
      (item: DropdownItem) => {
        if (item.value !== "no_result") {
          handleSelectPlace(item);
        }
      },
      [handleSelectPlace]
    );

    const handleSearch = useCallback(
      (query: string) => {
        debouncedFetchPlaces(query);
      },
      [debouncedFetchPlaces]
    );

    console.log(dropdownItems);

    return (
      <View style={styles.container}>
        <Dropdown
          loading={loading}
          items={dropdownItems}
          placeholder="Search for a place..."
          onSelect={handleDropdownSelect}
          onTextChange={handleSearch}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    zIndex: 100,
  },
});

export default PlacesAutocomplete;

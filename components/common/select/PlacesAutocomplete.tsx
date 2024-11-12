import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Dropdown from "./Dropdown";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchPlaces,
  fetchPlaceDetails,
  addToSearchHistory,
  addToFav,
  removeFromFav,
} from "@/store/slices/searchSlice";
import { DropdownItem } from "./DropdownItem";
import { AntDesign } from "@expo/vector-icons";

interface PlacesAutocompleteProps {
  onPlaceSelected: (latitude: number, longitude: number, label: string) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = React.memo(
  ({ onPlaceSelected }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { places, loading, error, favList } = useSelector(
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
            onPlaceSelected(lat, lng, place.label);
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
        return places.map((place) => {
          const isFavorite = favList.some(
            (favItem) => favItem.id === place.place_id
          );
          return {
            label: place.description,
            value: place.place_id,
            selectable: true,
            isFavorite: isFavorite,
          };
        });
      } else if (error) {
        return [
          {
            label: "No results found.",
            value: "no_result",
            selectable: false,
          },
        ];
      }
      return [];
    }, [places, error, favList]);

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

    const handlePrefixPress = (item: DropdownItem) => {
      if (item.isFavorite) {
        dispatch(removeFromFav(item.value));
      } else {
        dispatch(addToFav({ id: item.value, label: item.label }));
      }
    };

    return (
      <View style={styles.container}>
        <Dropdown
          loading={loading}
          items={dropdownItems}
          placeholder="Search for a place..."
          onSelect={handleDropdownSelect}
          onTextChange={handleSearch}
          onPrefixPress={handlePrefixPress}
          prefixComponent={(item) => (
            <AntDesign
              name={item.isFavorite ? "star" : "staro"}
              size={20}
              color={item.isFavorite ? "gold" : "gray"}
            />
          )}
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

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Dropdown from "./Dropdown";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlacesRequest,
  fetchPlaceDetailsRequest,
  addToSearchHistory,
  addToFav,
  removeFromFav,
  clearSelectedPlaceDetails,
  clearError,
} from "@/store/slices/searchSlice";
import { DropdownItem } from "./DropdownItem";
import { AntDesign } from "@expo/vector-icons";
import { RootState } from "@/store/slices";

interface PlacesAutocompleteProps {
  onPlaceSelected: (latitude: number, longitude: number, label: string) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = React.memo(
  ({ onPlaceSelected }) => {
    const dispatch = useDispatch();
    const { places, loading, error, favList, selectedPlaceDetails } =
      useSelector((state: RootState) => state.search);

    const [selectedPlace, setSelectedPlace] = useState<DropdownItem | null>(
      null
    );
    const [pendingAction, setPendingAction] = useState<
      "select" | "favorite" | null
    >(null);

    const debouncedFetchPlaces = useMemo(
      () =>
        debounce((query: string) => {
          if (query.length > 0) {
            dispatch(fetchPlacesRequest(query));
          }
        }, 500),
      [dispatch]
    );

    useEffect(() => {
      return () => {
        debouncedFetchPlaces.cancel();
      };
    }, [debouncedFetchPlaces]);

    useEffect(() => {
      if (error) {
        Alert.alert("Error", error);
        dispatch(clearError());
        setPendingAction(null);
        setSelectedPlace(null);
      }
    }, [error, dispatch]);

    useEffect(() => {
      if (selectedPlace && selectedPlaceDetails && pendingAction) {
        const { lat, lng } = selectedPlaceDetails;

        if (pendingAction === "select") {
          onPlaceSelected(lat, lng, selectedPlace.label);
          dispatch(
            addToSearchHistory({
              id: selectedPlace.value,
              label: selectedPlace.label,
              longitude: lng,
              latitude: lat,
            })
          );
        } else if (pendingAction === "favorite") {
          dispatch(
            addToFav({
              id: selectedPlace.value,
              label: selectedPlace.label,
              longitude: lng,
              latitude: lat,
            })
          );
        }

        setSelectedPlace(null);
        setPendingAction(null);
        dispatch(clearSelectedPlaceDetails());
      }
    }, [
      selectedPlace,
      selectedPlaceDetails,
      pendingAction,
      onPlaceSelected,
      dispatch,
    ]);

    const handleSelectPlace = useCallback(
      (place: DropdownItem) => {
        setSelectedPlace(place);
        setPendingAction("select");
        dispatch(fetchPlaceDetailsRequest(place.value));
      },
      [dispatch]
    );

    const handlePrefixPress = useCallback(
      (item: DropdownItem) => {
        if (item.isFavorite) {
          dispatch(removeFromFav(item.value));
        } else {
          setSelectedPlace(item);
          setPendingAction("favorite");
          dispatch(fetchPlaceDetailsRequest(item.value));
        }
      },
      [dispatch]
    );

    const dropdownItems: DropdownItem[] = useMemo(() => {
      if (places.length === 0) {
        return [
          {
            label: "No results found.",
            value: "no_result",
            selectable: false,
          },
        ];
      }

      const favoriteIds = new Set(favList.map((favItem) => favItem.id));

      const favoriteItems: DropdownItem[] = [];
      const nonFavoriteItems: DropdownItem[] = [];

      places.forEach((place) => {
        const isFavorite = favoriteIds.has(place.place_id);
        const item: DropdownItem = {
          label: place.description,
          value: place.place_id,
          selectable: true,
          isFavorite: isFavorite,
        };
        if (isFavorite) {
          favoriteItems.push(item);
        } else {
          nonFavoriteItems.push(item);
        }
      });

      return [...favoriteItems, ...nonFavoriteItems];
    }, [places, error, favList, loading]);

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

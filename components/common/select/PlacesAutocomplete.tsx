import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Dropdown from "./Dropdown";
import axios from "axios";
import debounce from "lodash/debounce";

interface Place {
  description: string;
  place_id: string;
}

interface DropdownItem {
  label: string;
  value: string;
  selectable?: boolean;
}

interface PlacesAutocompleteProps {
  onPlaceSelected: (latitude: number, longitude: number) => void;
}

const API_KEY = "API_KEY";

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = React.memo(
  ({ onPlaceSelected }) => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaces = useCallback(
      async (query: string) => {
        if (query.trim() === "") {
          setPlaces([]);
          setError(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            "https://maps.googleapis.com/maps/api/place/autocomplete/json",
            {
              params: {
                input: query,
                key: API_KEY,
                types: "geocode",
                components: "country:my", // limiting to malaysia only
              },
            }
          );

          if (response.data.status !== "OK") {
            throw new Error(response.data.error_message || "Unknown error");
          }

          console.log("res places ===>", response.data);

          const predictions: Place[] = response.data.predictions
            .slice(0, 5)
            .map((place: any) => ({
              description: place.description,
              place_id: place.place_id,
            }));

          setPlaces(predictions);

          if (predictions.length === 0) {
            setError("No results found.");
          }
        } catch (err) {
          console.error("Error fetching places:", err);
          setError("Unable to fetch results.");
          setPlaces([]);
        } finally {
          setLoading(false);
        }
      },
      [API_KEY]
    );

    const debouncedFetchPlaces = useMemo(
      () => debounce(fetchPlaces, 500),
      [fetchPlaces]
    );

    useEffect(() => {
      return () => {
        debouncedFetchPlaces.cancel();
      };
    }, [debouncedFetchPlaces]);

    const handleSelectPlace = useCallback(
      async (place_id: string) => {
        setLoading(true);
        setError(null);

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
            throw new Error(response.data.error_message || "unknown error");
          }

          const location = response.data.result.geometry.location;
          onPlaceSelected(location.lat, location.lng);
          setPlaces([]);
          setError(null);
        } catch (err) {
          console.error("error fetching place details:", err);
          setError("Unable to fetch place details.");
        } finally {
          setLoading(false);
        }
      },
      [API_KEY, onPlaceSelected]
    );

    const dropdownItems: DropdownItem[] = useMemo(() => {
      console.log("====>", places);
      if (places.length > 0) {
        return places.map((place) => ({
          label: place.description,
          value: place.place_id,
          selectable: true,
        }));
      } else if (error) {
        return [
          {
            label: "No result!",
            value: "no_result",
            selectable: false,
          },
        ];
      }
      return [];
    }, [places, error]);

    const handleDropdownSelect = useCallback(
      (place_id: string) => {
        if (place_id !== "no_result") {
          handleSelectPlace(place_id);
        }
      },
      [handleSelectPlace]
    );

    const handleSearch = useCallback(
      (query: string) => {
        setError(null);
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

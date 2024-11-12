import { Dropdown, TextInput } from "@/components/common";
import PlacesAutocomplete from "@/components/common/select/PlacesAutocomplete";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";

export default function HomeScreen() {
  const [region, setRegion] = useState<Region>();
  const [marker, setMarker] = useState<LatLng>();

  const handlePlaceSelected = (latitude: number, longitude: number) => {
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
    setMarker({ latitude, longitude });
  };

  return (
    <ThemedView
      edges={["left", "top", "right"]}
      mode="padding"
      isSafeArea
      style={styles.container}
    >
      <ThemedText type="title" style={{ marginBottom: 4, marginTop: 32 }}>
        Search Location.
      </ThemedText>
      <ThemedText type="subtitle" style={{ marginBottom: 24 }}>
        In this demo, you can search and select a location. The selected
        location will display on the map below.
      </ThemedText>

      <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.2105, // center of my
          longitude: 101.9758,
          latitudeDelta: 4.5,
          longitudeDelta: 4.5,
        }}
        region={region}
      >
        {marker && (
          <Marker
            coordinate={marker}
            title="San Francisco" //TODO
            description="This is a marker in San Francisco" //TODO
          />
        )}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
  },
  map: {
    flex: 1,
    marginTop: 20,
    borderRadius: 8,
  },
});

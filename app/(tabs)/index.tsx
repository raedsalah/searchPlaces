import { Dropdown, TextInput } from "@/components/common";
import PlacesAutocomplete from "@/components/common/select/PlacesAutocomplete";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export const dropdownItems = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export default function HomeScreen() {
  const [val, setVal] = useState<string>("");

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedItem(value);
    console.log(value);
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

      <TextInput
        withClearInput
        value={val}
        onChangeText={(value) => setVal(value)}
      />

      <Dropdown items={dropdownItems} onSelect={handleSelect} />
      <PlacesAutocomplete
        onPlaceSelected={(lat, long) => {
          console.log("lat => ", lat, "\nlong => ", long);
        }}
      />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
          title="San Francisco"
          description="This is a marker in San Francisco"
        />
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

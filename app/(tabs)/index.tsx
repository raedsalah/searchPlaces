import { TextInput } from "@/components/common";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  const [val, setVal] = useState<string>("");
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {},
});

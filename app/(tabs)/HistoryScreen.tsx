import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function HistoryScreen() {
  return (
    <ThemedView
      edges={["left", "top", "right"]}
      mode="padding"
      isSafeArea
      style={styles.container}
    >
      <ThemedText>History</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

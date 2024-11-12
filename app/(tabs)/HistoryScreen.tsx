import SearchHistory from "@/components/SearchHistory";
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
      <SearchHistory />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

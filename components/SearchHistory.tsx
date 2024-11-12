import { RootState } from "@/store";
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useSelector } from "react-redux";
import { ThemedText } from "./ThemedText";

const SearchHistory: React.FC = () => {
  const { searchHistory } = useSelector((state: RootState) => state.search);

  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme === "dark");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Search History</ThemedText>
      {searchHistory.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => console.log("history item=>", item)}
        >
          <ThemedText style={styles.item}>{item.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      backgroundColor: isDark ? "#191919" : "#fafafa",
      padding: 10,
      borderRadius: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    item: {
      fontSize: 14,
      paddingVertical: 5,
    },
  });

export default SearchHistory;

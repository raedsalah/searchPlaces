import { RootState } from "@/store";
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { ThemedText } from "./ThemedText";
import { AntDesign } from "@expo/vector-icons";

const FavList: React.FC = () => {
  const { favList } = useSelector((state: RootState) => state.search);

  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Favorites</ThemedText>
      <View style={{ flex: 1, gap: 8 }}>
        {favList.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => console.log("history item=>", item)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: isDark ? "#323232" : "#fafafa",
              borderRadius: 8,
            }}
          >
            <ThemedText style={styles.item}>{item.label}</ThemedText>
            <AntDesign
              name="right"
              size={18}
              color={isDark ? "#fff" : "black"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 12,
    },
    item: {
      fontSize: 14,
      paddingVertical: 5,
    },
  });

export default FavList;

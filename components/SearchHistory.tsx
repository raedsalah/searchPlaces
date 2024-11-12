import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Text,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { ThemedText } from "./ThemedText";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { clearSearchHistory, HistoryItem } from "@/store/slices/searchSlice";
import { RootState } from "@/store/slices";

const SearchHistory: React.FC = () => {
  const { searchHistory } = useSelector((state: RootState) => state.search);
  const [selectedLocation, setSelectedLocation] = useState<HistoryItem | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();

  const isDark = useColorScheme() === "dark";
  const styles = getStyles(isDark);

  const handleItemPress = (item: HistoryItem) => {
    setSelectedLocation(item);
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => dispatch(clearSearchHistory()),
        },
      ],
      { cancelable: true }
    );
  };

  const closeModal = () => {
    setSelectedLocation(null);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
          marginBottom: 12,
        }}
      >
        <ThemedText style={styles.title}>Search History</ThemedText>
        {searchHistory.length > 0 && (
          <Text style={{ color: "red" }} onPress={handleClearHistory}>
            Clear all
          </Text>
        )}
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        {searchHistory.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleItemPress(item)}
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
      <Modal
        visible={!!selectedLocation}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedLocation && (
              <>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    title={selectedLocation.label}
                  />
                </MapView>
                <Text style={styles.locationName}>
                  {selectedLocation.label}
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    },
    item: {
      fontSize: 14,
      paddingVertical: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      height: "50%",
      backgroundColor: isDark ? "#333" : "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      alignItems: "center",
    },
    map: {
      width: "100%",
      height: "70%",
      borderRadius: 8,
    },
    locationName: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 12,
      color: isDark ? "#fff" : "#000",
    },
    closeButton: {
      marginTop: 16,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: isDark ? "#555" : "#ddd",
      borderRadius: 8,
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
    },
  });

export default SearchHistory;

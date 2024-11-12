import React, { useEffect, useState, memo, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { TextInput } from "..";
import { AntDesign } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

interface DropdownItem {
  label: string;
  value: string;
  selectable?: boolean;
  isFavorite?: boolean;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  onSelect: (value: string) => void;
  onTextChange?: (query: string) => void;
  loading?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder = "Select...",
  onSelect,
  onTextChange,
  loading,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(items);
  const [selectedLabel, setSelectedLabel] = useState("");
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme === "dark");

  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [items, searchQuery]);

  const handleFocus = useCallback(() => {
    setIsDropdownVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 100);
  }, []);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onTextChange) {
      onTextChange(query);
    }
    setIsDropdownVisible(true);
  };

  const handleSelectItem = (item: DropdownItem) => {
    setSelectedLabel(item.label);
    onSelect(item.value);
    setIsDropdownVisible(false);
    setSearchQuery(item.label);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleSearch}
        withClearInput
        loading={loading}
      />
      {isDropdownVisible && filteredItems.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectItem(item)}
                style={styles.itemWrapper}
              >
                {item.selectable && (
                  <TouchableOpacity
                    onPress={() => console.log("pressed")}
                    style={styles.starContainer}
                  >
                    <AntDesign
                      name={item.isFavorite ? "star" : "staro"}
                      size={20}
                      color={item.isFavorite ? "gold" : "gray"}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleSelectItem(item)}
                  style={[
                    styles.itemContainer,
                    !item.selectable && styles.nonSelectableItem,
                  ]}
                  disabled={!item.selectable}
                >
                  <ThemedText style={[!item.selectable && styles.centeredText]}>
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      width: "100%",
      zIndex: 100,
    },
    input: {
      padding: 12,
      flex: 1,
      color: isDark ? "#fff" : "#333",
    },
    dropdownContainer: {
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      backgroundColor: isDark ? "#191919" : "#e8e8e8",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? "#2f2f2f" : "#d1d1d1",
      maxHeight: 150,
      zIndex: 100,
      elevation: 100,
    },
    itemWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    itemContainer: {
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    starContainer: {
      paddingLeft: 12,
    },
    centeredText: {
      textAlign: "center",
      color: "gray",
    },
    nonSelectableItem: {
      backgroundColor: "transparent",
    },
  });

export default memo(CustomDropdown);

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { TextInput } from "..";

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder = "Select...",
  onSelect,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedLabel, setSelectedLabel] = useState("");

  const styles = getStyles(useColorScheme() === "dark");

  const handleFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleBlur = () => {
    setIsDropdownVisible(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
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
      />
      {isDropdownVisible && filteredItems.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectItem(item)}
                style={styles.itemContainer}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
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
    itemContainer: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    itemText: {
      fontSize: 16,
      color: isDark ? "#fff" : "#333",
    },
  });

export default CustomDropdown;

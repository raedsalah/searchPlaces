import React, { useEffect, useState, memo, useRef, useCallback } from "react";
import { View, FlatList, StyleSheet, useColorScheme } from "react-native";
import { TextInput } from "../input";
import { AntDesign } from "@expo/vector-icons";
import DropdownItemComponent, { DropdownItem } from "./DropdownItem";

export interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  onSelect: (item: DropdownItem) => void;
  onTextChange?: (query: string) => void;
  loading?: boolean;
  onPrefixPress?: (item: DropdownItem) => void;
  onSuffixPress?: (item: DropdownItem) => void;
  prefixComponent?: (item: DropdownItem) => React.ReactNode;
  suffixComponent?: (item: DropdownItem) => React.ReactNode;
}

const Dropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder = "Select...",
  onSelect,
  onTextChange,
  onPrefixPress,
  onSuffixPress,
  prefixComponent,
  suffixComponent,
  loading,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(items);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getStyles(isDark);

  useEffect(() => {
    setFilteredItems(items);
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
    if (item.selectable) {
      onSelect(item);
      setIsDropdownVisible(false);
      setSearchQuery(item.label);
    }
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
            renderItem={({ item }) => {
              console.log("should render");
              return (
                <DropdownItemComponent
                  item={item}
                  onSelect={handleSelectItem}
                  onPrefixPress={onPrefixPress}
                  onSuffixPress={onSuffixPress}
                  prefixComponent={prefixComponent}
                  suffixComponent={suffixComponent}
                  isDark={isDark}
                />
              );
            }}
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
      maxHeight: 200,
      zIndex: 100,
      elevation: 100,
    },
  });

export default memo(Dropdown);

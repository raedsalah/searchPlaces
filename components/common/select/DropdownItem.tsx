import React, { memo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export interface DropdownItemProps {
  item: DropdownItem;
  onSelect: (item: DropdownItem) => void;
  onPrefixPress?: (item: DropdownItem) => void;
  onSuffixPress?: (item: DropdownItem) => void;
  prefixComponent?: (item: DropdownItem) => React.ReactNode;
  suffixComponent?: (item: DropdownItem) => React.ReactNode;
  isDark: boolean;
}

export interface DropdownItem {
  label: string;
  value: string;
  selectable?: boolean;
  isFavorite?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  item,
  onSelect,
  onPrefixPress,
  onSuffixPress,
  prefixComponent,
  suffixComponent,
  isDark,
}) => {
  const handleSelect = () => {
    if (item.selectable && onSelect) {
      onSelect(item);
    }
  };

  const handlePrefixPress = () => {
    if (onPrefixPress) {
      onPrefixPress(item);
    }
  };

  const handleSuffixPress = () => {
    if (onSuffixPress) {
      onSuffixPress(item);
    }
  };

  return (
    <View style={styles.itemWrapper}>
      {prefixComponent && item.selectable && (
        <TouchableOpacity onPress={handlePrefixPress} style={styles.prefix}>
          {prefixComponent(item)}
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleSelect}
        style={[styles.itemContainer, !item.selectable && styles.disabledItem]}
        disabled={!item.selectable}
      >
        <ThemedText style={!item.selectable && styles.centeredText}>
          {item.label}
        </ThemedText>
      </TouchableOpacity>
      {suffixComponent && item.selectable && (
        <TouchableOpacity onPress={handleSuffixPress} style={styles.suffix}>
          {suffixComponent(item)}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  prefix: {
    marginRight: 8,
  },
  suffix: {
    marginLeft: 8,
  },
  itemContainer: {
    flex: 1,
    paddingVertical: 12,
  },
  disabledItem: {
    opacity: 0.6,
  },
  centeredText: {
    textAlign: "center",
    color: "gray",
  },
});

export default memo(DropdownItem);

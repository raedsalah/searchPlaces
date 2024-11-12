import { AntDesign } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TextInputProps,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  ColorSchemeName,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
  placeholder?: string;
  loading?: boolean;
  withClearInput?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = React.memo(
  ({ placeholder, loading, withClearInput, value, onChangeText, ...props }) => {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme === "dark");

    const handleChange = useCallback(
      (text: string) => {
        onChangeText && onChangeText(text);
      },
      [onChangeText]
    );

    const onClear = useCallback(() => {
      onChangeText && onChangeText("");
    }, [onChangeText]);

    return (
      <View style={styles.container}>
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor="#888"
          value={value}
          onChangeText={handleChange}
          {...props}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={styles.icon} />
        ) : withClearInput && value ? (
          <TouchableOpacity onPress={onClear} style={styles.iconButton}>
            <AntDesign name="closecircle" size={20} color="#ccc" />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
);

const getStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      borderColor: isDark ? "#2f2f2f" : "#d1d1d1",
      borderWidth: 1,
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 10,
      backgroundColor: isDark ? "#191919" : "#e8e8e8",
    },
    input: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      fontSize: 16,
      color: isDark ? "#fff" : "#333",
      borderWidth: 0,
      backgroundColor: isDark ? "#191919" : "#e8e8e8",
      flex: 1,
    },
    icon: {
      marginLeft: 10,
    },
    iconButton: {
      marginLeft: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
export default CustomTextInput;

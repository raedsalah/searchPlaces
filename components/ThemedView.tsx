import React, { memo } from "react";
import {
  View,
  type ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isSafeArea?: boolean;
  edges?: Edge[];
  mode?: "padding" | "margin";
};

const ThemedViewComponent: React.FC<ThemedViewProps> = ({
  style,
  lightColor,
  darkColor,
  isSafeArea = false,
  mode,
  edges,
  children,
  ...otherProps
}) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const combinedStyle: StyleProp<ViewStyle> = [
    { backgroundColor, ...styles.container },
    style,
  ];

  if (isSafeArea) {
    return (
      <SafeAreaView
        style={combinedStyle}
        mode={mode}
        edges={edges}
        {...otherProps}
      >
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View style={combinedStyle} {...otherProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
});

export const ThemedView = memo(ThemedViewComponent);

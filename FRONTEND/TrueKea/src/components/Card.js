import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { ThemeContext } from "../contexts/ThemeContext";

export default function Card({
  children,
  style = {},
  onPress,
  padding = "medium",
  elevation = "medium",
}) {
  const { theme } = useContext(ThemeContext);

  const getPaddingStyle = () => {
    switch (padding) {
      case "small":
        return { padding: 12 };
      case "large":
        return { padding: 20 };
      default:
        return { padding: 16 };
    }
  };

  const getElevationStyle = () => {
    switch (elevation) {
      case "low":
        return {
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 1,
          elevation: 2,
        };
      case "high":
        return {
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.32,
          shadowRadius: 5,
          elevation: 8,
        };
      default:
        return {
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        };
    }
  };

  const cardStyles = [
    styles.card,
    {
      backgroundColor: theme.surface,
      shadowColor: Colors.cardShadow,
    },
    getPaddingStyle(),
    getElevationStyle(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 4,
  },
});

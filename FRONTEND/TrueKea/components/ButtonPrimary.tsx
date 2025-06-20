import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import type { ColorValue } from "react-native";

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: sizes[size].borderRadius,
      paddingHorizontal: sizes[size].paddingHorizontal,
      paddingVertical: sizes[size].paddingVertical,
      minHeight: sizes[size].minHeight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      ...Colors.shadow,
    };

    if (fullWidth) {
      baseStyle.width = "100%";
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return {
      fontSize: sizes[size].fontSize,
      fontWeight: "600",
      color: variants[variant].textColor,
      marginLeft: icon && iconPosition === "left" ? 8 : 0,
      marginRight: icon && iconPosition === "right" ? 8 : 0,
    };
  };

  const variants = {
    primary: {
      background: Colors.gradientPrimary as [
        ColorValue,
        ColorValue,
        ...ColorValue[]
      ],
      textColor: "#FFFFFF",
      borderColor: "transparent",
    },
    secondary: {
      background: Colors.gradientSecondary as [
        ColorValue,
        ColorValue,
        ...ColorValue[]
      ],
      textColor: "#FFFFFF",
      borderColor: "transparent",
    },
    outline: {
      background: ["transparent", "transparent"] as [ColorValue, ColorValue],
      textColor: Colors.primary,
      borderColor: Colors.primary,
    },
    danger: {
      background: Colors.gradientAccent as [
        ColorValue,
        ColorValue,
        ...ColorValue[]
      ],
      textColor: "#FFFFFF",
      borderColor: "transparent",
    },
  };

  const sizes = {
    small: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 36,
      fontSize: 14,
      borderRadius: 8,
    },
    medium: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 44,
      fontSize: 16,
      borderRadius: 12,
    },
    large: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      minHeight: 52,
      fontSize: 18,
      borderRadius: 16,
    },
  };

  const ButtonContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator size="small" color={variants[variant].textColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={sizes[size].fontSize}
              color={variants[variant].textColor}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={sizes[size].fontSize}
              color={variants[variant].textColor}
            />
          )}
        </>
      )}
    </View>
  );

  if (variant === "outline") {
    return (
      <TouchableOpacity
        style={[
          getButtonStyle(),
          {
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: variants[variant].borderColor,
          },
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        <ButtonContent />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={variants[variant].background}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <ButtonContent />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

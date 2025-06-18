import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { ThemeContext } from "../contexts/ThemeContext";

export default function CustomButton({ 
  title, 
  onPress, 
  disabled, 
  variant = "primary", 
  size = "medium",
  icon,
  loading = false,
  style = {} 
}) {
  const { theme } = useContext(ThemeContext);
  
  const getButtonStyle = () => {
    const baseStyle = [styles.btn, styles[size]];
    
    switch (variant) {
      case "secondary":
        return [...baseStyle, { backgroundColor: "transparent", borderWidth: 2, borderColor: Colors.primary }];
      case "accent":
        return [...baseStyle, { backgroundColor: Colors.accent }];
      case "eco":
        return [...baseStyle, { backgroundColor: Colors.eco }];
      default:
        return baseStyle;
    }
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.txt, styles[`${size}Text`]];
    
    if (variant === "secondary") {
      return [...baseStyle, { color: Colors.primary }];
    }
    return baseStyle;
  };

  const ButtonContent = () => (
    <View style={styles.content}>
      {icon && !loading && (
        <Ionicons 
          name={icon} 
          size={size === "small" ? 16 : size === "large" ? 24 : 20} 
          color={variant === "secondary" ? Colors.primary : Colors.white} 
          style={styles.icon}
        />
      )}
      {loading && (
        <Ionicons 
          name="refresh" 
          size={size === "small" ? 16 : size === "large" ? 24 : 20} 
          color={variant === "secondary" ? Colors.primary : Colors.white} 
          style={[styles.icon, styles.spinning]}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </View>
  );

  if (variant === "primary" && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={style}>
        <LinearGradient
          colors={Colors.primaryGradient}
          style={[...getButtonStyle(), disabled && styles.dis]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[...getButtonStyle(), disabled && styles.dis, style]} 
      onPress={onPress} 
      disabled={disabled || loading}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  small: { paddingVertical: 8, paddingHorizontal: 16 },
  medium: { paddingVertical: 12, paddingHorizontal: 24 },
  large: { paddingVertical: 16, paddingHorizontal: 32 },
  dis: { 
    backgroundColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  spinning: {
    // Agregar animaciÃ³n de rotaciÃ³n si es necesario
  },
  txt: { 
    color: Colors.white, 
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
  },
  smallText: { fontSize: 14 },
  mediumText: { fontSize: 16 },
  largeText: { fontSize: 18 },
});

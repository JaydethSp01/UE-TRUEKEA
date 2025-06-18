import React, { useContext, useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { ThemeContext } from "../contexts/ThemeContext";

export default function FormInput({ 
  label, 
  error, 
  icon,
  secureTextEntry,
  style = {},
  ...props 
}) {
  const { theme } = useContext(ThemeContext);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: theme.surface,
          borderColor: error ? Colors.error : isFocused ? Colors.primary : Colors.lightGray,
        }
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={isFocused ? Colors.primary : Colors.gray} 
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.text,
              flex: 1,
            }
          ]}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginVertical: 8 
  },
  label: { 
    fontSize: 14, 
    marginBottom: 6, 
    fontFamily: "Inter-SemiBold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: { 
    color: Colors.error, 
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Inter-Regular",
  }
});

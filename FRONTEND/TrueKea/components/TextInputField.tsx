import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface TextInputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  /** Nueva prop para controlar edición */
  editable?: boolean;
  /** deprecated: mapea editable internamente */
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  /** Si se pasa `editable`, lo invertimos para `disabled`. */
  editable = true,
  disabled = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  required = false,
}) => {
  // combinamos ambas props
  const isDisabled = disabled || !editable;

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const animatedValue = new Animated.Value(value ? 1 : 0);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((v) => !v);
  };

  const getBorderColor = () => {
    if (error) return Colors.accent;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  const getBackgroundColor = () => {
    if (isDisabled) return Colors.divider;
    return Colors.background;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            minHeight: multiline ? 80 : 48,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? Colors.primary : Colors.textSecondary}
            />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            inputStyle,
            {
              textAlignVertical: multiline ? "top" : "center",
              paddingTop: multiline ? 12 : 0,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!isDisabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={
              secureTextEntry ? togglePasswordVisibility : onRightIconPress
            }
          >
            <Ionicons
              name={
                secureTextEntry
                  ? isPasswordVisible
                    ? "eye-off"
                    : "eye"
                  : rightIcon!
              }
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {maxLength && (
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {value.length}/{maxLength}
            </Text>
          </View>
        )}
      </View>

      {(error || helperText) && (
        <View style={styles.messageContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color={Colors.accent} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  required: {
    color: Colors.accent,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    ...Colors.shadow,
  },
  leftIconContainer: {
    paddingRight: 12,
    paddingTop: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
  },
  rightIconContainer: {
    paddingLeft: 12,
    paddingTop: 14,
  },
  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
  },
  characterCountText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  messageContainer: {
    marginTop: 6,
    paddingLeft: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: Colors.accent,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

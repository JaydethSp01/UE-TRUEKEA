# PowerShell Script: Crear estructura y código base de TrueKea (React Native) - VERSIÓN MEJORADA

# Ajusta esta ruta a tu entorno
$projectPath = "."

# 1. Crear carpeta raíz
New-Item -ItemType Directory -Path $projectPath -Force | Out-Null

# 2. Definir todas las carpetas por feature y capas
$folders = @(
  "src",
  "src/navigation",
  "src/contexts",
  "src/services",
  "src/components",
  "src/validation",
  "src/constants",
  "src/hooks",
  "src/utils",
  "src/assets/images",
  "src/assets/icons",
  "src/components/animated",

  # Auth
  "src/features/auth/screens",
  "src/features/auth/services",

  # Profile
  "src/features/profile/screens",
  "src/features/profile/services",

  # Objects
  "src/features/objects/screens",
  "src/features/objects/services",

  # Search
  "src/features/search/screens",
  "src/features/search/services",

  # Exchange
  "src/features/exchange/screens",
  "src/features/exchange/services",

  # Rating
  "src/features/rating/screens",
  "src/features/rating/services",

  # Chat
  "src/features/chat/screens",
  "src/features/chat/services",

  # Preferences
  "src/features/preferences/screens",
  "src/features/preferences/services",

  # Admin
  "src/features/admin/screens",
  "src/features/admin/services",

  # CO2
  "src/features/co2/screens",
  "src/features/co2/services"
)
foreach ($f in $folders) {
  New-Item -ItemType Directory -Path (Join-Path $projectPath $f) -Force | Out-Null
}

# Helper para Set-Content con encoding
function Write-File($relativePath, $content) {
  $full = Join-Path $projectPath $relativePath
  # Si existe una carpeta con el mismo nombre, elimínala
  if (Test-Path $full -PathType Container) {
    Remove-Item -Path $full -Recurse -Force
  }
  # Ahora escribe el archivo (lo reemplaza si ya existe)
  Set-Content -Path $full -Value $content -Encoding UTF8
}

# 3. App.js - Mejorado con StatusBar y fuentes
Write-File "App.js" @'
import React from "react";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthProvider from "./src/contexts/AuthContext";
import ThemeProvider from "./src/contexts/ThemeContext";
import BottomTabs from "./src/navigation/BottomTabs";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./src/assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("./src/assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("./src/assets/fonts/Inter-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <BottomTabs />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
'@

# 4. Navigation - BottomTabs.js - Mejorado con íconos y animaciones
Write-File "src/navigation/BottomTabs.js" @'
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import ObjectListScreen from "../features/objects/screens/ObjectListScreen";
import SearchScreen from "../features/search/screens/SearchScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import ChatScreen from "../features/chat/screens/ChatScreen";
import RatingScreen from "../features/rating/screens/RatingScreen";
import PreferencesScreen from "../features/preferences/screens/PreferencesScreen";
import AdminScreen from "../features/admin/screens/AdminScreen";
import CO2Screen from "../features/co2/screens/CO2Screen";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import Colors from "../constants/Colors";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color, size, badgeCount }) => (
  <View style={{ position: "relative" }}>
    <Ionicons name={name} size={size} color={color} />
    {badgeCount > 0 && (
      <View style={{
        position: "absolute",
        right: -6,
        top: -3,
        backgroundColor: Colors.accent,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text style={{ color: Colors.white, fontSize: 10, fontWeight: "bold" }}>
          {badgeCount > 99 ? "99+" : badgeCount}
        </Text>
      </View>
    )}
  </View>
);

export default function BottomTabs() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: Colors.textDark,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter-SemiBold",
        },
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontFamily: "Inter-Bold",
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={ObjectListScreen}
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Buscar" 
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "search" : "search-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="CO2" 
        component={CO2Screen}
        options={{
          title: "Impacto",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "leaf" : "leaf-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "chatbubbles" : "chatbubbles-outline"} color={color} size={size} badgeCount={3} />
          ),
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calificar" 
        component={RatingScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "star" : "star-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Preferencias" 
        component={PreferencesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? "settings" : "settings-outline"} color={color} size={size} />
          ),
        }}
      />
      {user?.isAdmin && (
        <Tab.Screen 
          name="Admin" 
          component={AdminScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon name={focused ? "shield-checkmark" : "shield-checkmark-outline"} color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
'@

# 5. Context - AuthContext.js - Sin cambios
Write-File "src/contexts/AuthContext.js" @'
import React, { createContext, useState } from "react";
export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState({ id:1, name:"Test User", email:"user@truekea.com", isAdmin:true });
  const login = data => setUser(data);
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
'@

# 6. Context - ThemeContext.js - NUEVO
Write-File "src/contexts/ThemeContext.js" @'
import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import Colors from "../constants/Colors";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDark(colorScheme === "dark");
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === "dark");
    });
    
    return () => subscription?.remove();
  }, []);

  const theme = {
    isDark,
    background: isDark ? Colors.darkBackground : Colors.background,
    surface: isDark ? Colors.darkSurface : Colors.white,
    text: isDark ? Colors.white : Colors.textDark,
    textSecondary: isDark ? Colors.lightGray : Colors.gray,
    card: isDark ? Colors.darkCard : Colors.lightCard,
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
'@

# 7. Constants - Colors.js - Mejorado con más colores y tema oscuro
Write-File "src/constants/Colors.js" @'
export default {
  // Colores principales de marca
  primary: "#2E7D32",        // Verde principal más profesional
  primaryLight: "#4CAF50",   // Verde claro
  primaryDark: "#1B5E20",    // Verde oscuro
  secondary: "#66BB6A",      // Verde secundario
  accent: "#FF8F00",         // Naranja para CTAs
  accentLight: "#FFB300",    // Naranja claro
  
  // Colores de sostenibilidad
  eco: "#4CAF50",            // Verde eco
  ecoLight: "#C8E6C9",       // Verde eco claro
  ecoDark: "#2E7D32",        // Verde eco oscuro
  co2Green: "#00C853",       // Verde para CO2 ahorrado
  co2Red: "#D32F2F",         // Rojo para CO2 emitido
  
  // Neutrales
  background: "#F8FDF9",     // Verde muy claro para fondo
  surface: "#FFFFFF",        // Blanco puro
  white: "#FFFFFF",
  black: "#000000",
  
  // Grises
  gray: "#9E9E9E",
  lightGray: "#E0E0E0",
  darkGray: "#424242",
  
  // Textos
  textDark: "#1A1A1A",       // Casi negro para texto principal
  textSecondary: "#666666",   // Gris para texto secundario
  textLight: "#FFFFFF",       // Blanco para texto en fondos oscuros
  
  // Estados
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",
  
  // Tema oscuro
  darkBackground: "#121212",
  darkSurface: "#1E1E1E",
  darkCard: "#2D2D2D",
  
  // Colores adicionales para tarjetas
  lightCard: "#FFFFFF",
  cardShadow: "rgba(0, 0, 0, 0.08)",
  
  // Gradientes (como strings para usar en estilos)
  primaryGradient: ["#2E7D32", "#4CAF50"],
  ecoGradient: ["#4CAF50", "#66BB6A"],
  co2Gradient: ["#00C853", "#4CAF50"],
  
  // Transparencias
  overlay: "rgba(0, 0, 0, 0.5)",
  lightOverlay: "rgba(255, 255, 255, 0.9)",
};
'@

# 8. Services - apiClient.js - Sin cambios
Write-File "src/services/apiClient.js" @'
import axios from "axios";
export default axios.create({ baseURL: "https://api.truekea.test", timeout: 5000 });
'@

# 9. Validation index - index.js - Sin cambios
Write-File "src/validation/index.js" @'
import * as yup from "yup";
export { yup };
'@

# 10. Hooks - useFetch.js - Sin cambios
Write-File "src/hooks/useFetch.js" @'
import { useState, useEffect } from "react";
export default function useFetch(fn, params = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fn(...params).then(res => { setData(res); setLoading(false); });
  }, []);
  return { data, loading };
}
'@

# 11. Hook personalizado para animaciones - NUEVO
Write-File "src/hooks/useAnimatedValue.js" @'
import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useAnimatedValue = (initialValue = 0) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;
  return animatedValue;
};

export const usePulseAnimation = (duration = 1000) => {
  const pulseAnim = useAnimatedValue(1);
  
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    
    pulse();
  }, []);
  
  return pulseAnim;
};

export const useScaleAnimation = (trigger, scale = 1.05) => {
  const scaleAnim = useAnimatedValue(1);
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: trigger ? scale : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [trigger]);
  
  return scaleAnim;
};
'@

# 12. Components - Mejorados con mejor diseño

Write-File "src/components/CustomButton.js" @'
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
    // Agregar animación de rotación si es necesario
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
'@

Write-File "src/components/FormInput.js" @'
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
'@

Write-File "src/components/ImagePreview.js" @'
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function ImagePreview({ uri, onRemove, size = "medium" }) {
  const getSizeStyle = () => {
    switch (size) {
      case "small": return { width: 60, height: 60 };
      case "large": return { width: 150, height: 150 };
      default: return { width: 100, height: 100 };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, getSizeStyle()]}>
        <Image source={{ uri }} style={styles.image} />
        {onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Ionicons name="close-circle" size={24} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginVertical: 8,
    marginHorizontal: 4,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: { 
    width: "100%", 
    height: "100%",
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  }
});
'@

Write-File "src/components/StarRating.js" @'
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function StarRating({ 
  maxStars = 5, 
  rating = 0, 
  onChange, 
  size = "medium",
  readonly = false 
}) {
  const [currentRating, setCurrentRating] = useState(rating);

  const handlePress = (starIndex) => {
    if (readonly) return;
    const newRating = starIndex + 1;
    setCurrentRating(newRating);
    onChange && onChange(newRating);
  };

  const getStarSize = () => {
    switch (size) {
      case "small": return 16;
      case "large": return 32;
      default: return 24;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxStars }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            disabled={readonly}
            style={styles.starButton}
          >
            <Ionicons
              name={currentRating > index ? "star" : "star-outline"}
              size={getStarSize()}
              color={currentRating > index ? Colors.accent : Colors.lightGray}
            />
          </TouchableOpacity>
        ))}
      </View>
      {!readonly && (
        <Text style={styles.ratingText}>
          {currentRating} de {maxStars} estrellas
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 8,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  starButton: {
    paddingHorizontal: 2,
  },
  ratingText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "Inter-Regular",
  }
});
'@

# 13. Componente Card mejorado - NUEVO
Write-File "src/components/Card.js" @'
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
'@
# 14. Componente animado - NUEVO
# src/components/animated/FadeInView.js
Write-File -Path "src/components/animated/FadeInView.js" -Value @'
import React, { useEffect } from "react";
import { Animated } from "react-native";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";

export default function FadeInView({ children, duration = 500, delay = 0, style = {} }) {
  const fadeAnim = useAnimatedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, style]}>
      {children}
    </Animated.View>
  );
}
'@

# 15. Utils - dateUtils.js
# src/utils/dateUtils.js
Write-File -Path "src/utils/dateUtils.js" -Value @'
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTimeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return "Hace un momento";
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
  return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
};
'@

# 16. Utils - formatUtils.js
# src/utils/formatUtils.js
Write-File -Path "src/utils/formatUtils.js" -Value @'
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("es-CO").format(number);
};

export const formatKg = (kg) => {
  if (kg < 1) return `${(kg * 1000).toFixed(0)}g`;
  return `${kg.toFixed(1)}kg`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
'@

# 17. Pantallas de Features
# src/features/objects/screens/ObjectListScreen.js
Write-File -Path "src/features/objects/screens/ObjectListScreen.js" -Value @'
import React, { useContext, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../components/Card";
import CustomButton from "../../../components/CustomButton";
import ImagePreview from "../../../components/ImagePreview";
import { ThemeContext } from "../../../contexts/ThemeContext";
import Colors from "../../../constants/Colors";
import { formatCurrency, formatKg } from "../../../utils/formatUtils";
import { getTimeAgo } from "../../../utils/dateUtils";

const mockObjects = [
  {
    id: 1,
    title: "Mesa de Madera Maciza",
    description: "Mesa de comedor en excelente estado, madera de roble",
    images: ["https://picsum.photos/300/200?random=1"],
    estimatedValue: 250000,
    co2Saved: 45.5,
    location: "Chapinero, Bogotá",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    owner: "María González",
  },
  {
    id: 2,
    title: "Bicicleta de Montaña",
    description: "Bicicleta Trek en buen estado, ideal para ciclomontañismo",
    images: ["https://picsum.photos/300/200?random=2"],
    estimatedValue: 800000,
    co2Saved: 120.3,
    location: "Zona Rosa, Bogotá",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    owner: "Carlos Mendoza",
  },
];

export default function ObjectListScreen() {
  const { theme } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [objects, setObjects] = useState(mockObjects);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderObject = ({ item }) => (
    <Card onPress={() => console.log("Object pressed:", item.id)}>
      <View style={styles.objectContainer}>
        <View style={styles.objectHeader}>
          <Text style={[styles.objectTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.objectPrice, { color: Colors.primary }]}>
            {formatCurrency(item.estimatedValue)}
          </Text>
        </View>
        
        {item.images && item.images.length > 0 && (
          <ImagePreview uri={item.images[0]} size="large" />
        )}
        
        <Text style={[styles.objectDescription, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
        
        <View style={styles.objectFooter}>
          <View style={styles.co2Container}>
            <Text style={[styles.co2Text, { color: Colors.co2Green }]}>
              🌱 {formatKg(item.co2Saved)} CO₂ ahorrado
            </Text>
          </View>
          <Text style={[styles.timeText, { color: theme.textSecondary }]}>
            {getTimeAgo(item.createdAt)}
          </Text>
        </View>
        
        <View style={styles.locationContainer}>
          <Text style={[styles.locationText, { color: theme.textSecondary }]}>
            📍 {item.location} • {item.owner}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Ver Detalles"
            onPress={() => console.log("Ver detalles:", item.id)}
            size="small"
            icon="eye-outline"
            style={{ flex: 1, marginRight: 8 }}
          />
          <CustomButton
            title="Intercambiar"
            onPress={() => console.log("Intercambiar:", item.id)}
            variant="accent"
            size="small"
            icon="swap-horizontal-outline"
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Objetos Disponibles
        </Text>
        <CustomButton
          title="Agregar"
          size="small"
          icon="add-outline"
          onPress={() => console.log("Agregar objeto")}
        />
      </View>
      
      <FlatList
        data={objects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderObject}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  objectContainer: {
    padding: 4,
  },
  objectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  objectTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    flex: 1,
    marginRight: 12,
  },
  objectPrice: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  objectDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginVertical: 8,
    lineHeight: 20,
  },
  objectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  co2Container: {
    backgroundColor: Colors.ecoLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  co2Text: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
  },
  timeText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
'@

# 18. Otras pantallas básicas
# src/features/search/screens/SearchScreen.js
Write-File -Path "src/features/search/screens/SearchScreen.js" -Value @'
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from "../../../components/FormInput";
import CustomButton from "../../../components/CustomButton";
import { ThemeContext } from "../../../contexts/ThemeContext";

export default function SearchScreen() {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Buscar Objetos</Text>
      <FormInput
        placeholder="¿Qué estás buscando?"
        value={searchQuery}
        onChangeText={setSearchQuery}
        icon="search-outline"
      />
      <CustomButton
        title="Buscar"
        onPress={() => console.log("Buscar:", searchQuery)}
        icon="search-outline"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 20 },
});
'@

# src/features/profile/screens/ProfileScreen.js
Write-File -Path "src/features/profile/screens/ProfileScreen.js" -Value @'
import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../components/Card";
import CustomButton from "../../../components/CustomButton";
import { AuthContext } from "../../../contexts/AuthContext";
import { ThemeContext } from "../../../contexts/ThemeContext";
import Colors from "../../../constants/Colors";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Mi Perfil</Text>
        
        <Card>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
          </View>
        </Card>

        <Card>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Intercambios</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.co2Green }]}>156kg</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>CO₂ Ahorrado</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.accent }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Calificación</Text>
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Editar Perfil"
            icon="person-outline"
            onPress={() => console.log("Editar perfil")}
          />
          <CustomButton
            title={isDark ? "Modo Claro" : "Modo Oscuro"}
            icon={isDark ? "sunny-outline" : "moon-outline"}
            variant="secondary"
            onPress={toggleTheme}
          />
          <CustomButton
            title="Cerrar Sesión"
            icon="log-out-outline"
            variant="accent"
            onPress={logout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 20 },
  userInfo: { alignItems: "center", padding: 16 },
  userName: { fontSize: 20, fontFamily: "Inter-Bold", marginBottom: 4 },
  userEmail: { fontSize: 14, fontFamily: "Inter-Regular" },
  statsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 4 },
  statLabel: { fontSize: 12, fontFamily: "Inter-Regular" },
  buttonContainer: { marginTop: 20 },
});
'@

# Pantallas restantes (básicas)
# src/features/chat/screens/ChatScreen.js
Write-File -Path "src/features/chat/screens/ChatScreen.js" -Value @'
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../../contexts/ThemeContext";

export default function ChatScreen() {
  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Mensajes</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Aquí aparecerán tus conversaciones
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 8 },
  subtitle: { fontSize: 16, fontFamily: "Inter-Regular" },
});
'@

# src/features/rating/screens/RatingScreen.js
Write-File -Path "src/features/rating/screens/RatingScreen.js" -Value @'
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../../contexts/ThemeContext";

export default function RatingScreen() {
  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Calificar</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Califica tus intercambios recientes
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 8 },
  subtitle: { fontSize: 16, fontFamily: "Inter-Regular" },
});
'@

# src/features/preferences/screens/PreferencesScreen.js
Write-File -Path "src/features/preferences/screens/PreferencesScreen.js" -Value @'
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../../contexts/ThemeContext";

export default function PreferencesScreen() {
  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Preferencias</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Configura tus preferencias de la app
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 8 },
  subtitle: { fontSize: 16, fontFamily: "Inter-Regular" },
});
'@

# src/features/admin/screens/AdminScreen.js
Write-File -Path "src/features/admin/screens/AdminScreen.js" -Value @'
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../../contexts/ThemeContext";

export default function AdminScreen() {
  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Administración</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Panel de administración
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 8 },
  subtitle: { fontSize: 16, fontFamily: "Inter-Regular" },
});
'@

# src/features/co2/screens/CO2Screen.js
Write-File -Path "src/features/co2/screens/CO2Screen.js" -Value @'
import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../components/Card";
import { ThemeContext } from "../../../contexts/ThemeContext";
import Colors from "../../../constants/Colors";
import { formatKg } from "../../../utils/formatUtils";

export default function CO2Screen() {
  const { theme } = useContext(ThemeContext);

  const co2Stats = {
    totalSaved: 156.8,
    thisMonth: 45.2,
    treesEquivalent: 7,
    rank: 5,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Impacto Ambiental</Text>
        
        <Card padding="large">
          <View style={styles.mainStat}>
            <Text style={[styles.mainNumber, { color: Colors.co2Green }]}>
              {formatKg(co2Stats.totalSaved)}
            </Text>
            <Text style={[styles.mainLabel, { color: theme.text }]}>
              CO₂ Total Ahorrado
            </Text>
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.primary }]}>
              {formatKg(co2Stats.thisMonth)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Este mes
            </Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.eco }]}>
              {co2Stats.treesEquivalent}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Árboles equiv.
            </Text>
          </Card>
        </View>

        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Tu Contribución
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Has evitado la emisión de {formatKg(co2Stats.totalSaved)} de CO₂ 
            reutilizando objetos. ¡Esto equivale a plantar {co2Stats.treesEquivalent} árboles!
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 20 },
  mainStat: { alignItems: "center", paddingVertical: 20 },
  mainNumber: { fontSize: 48, fontFamily: "Inter-Bold", marginBottom: 8 },
  mainLabel: { fontSize: 18, fontFamily: "Inter-SemiBold" },
  statsGrid: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginVertical: 12,
  },
  statCard: { flex: 1, marginHorizontal: 6, alignItems: "center" },
  statNumber: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 4 },
  statLabel: { fontSize: 12, fontFamily: "Inter-Regular", textAlign: "center" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter-Bold", marginBottom: 12 },
  description: { 
    fontSize: 14, 
    fontFamily: "Inter-Regular", 
    lineHeight: 20,
  },
});
'@

# 19. Package.json básico
Write-File -Path "package.json" -Value @'
{
  "name": "truekea-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-gesture-handler": "~2.12.0",
    "@expo/vector-icons": "^13.0.0",
    "expo-linear-gradient": "~12.3.0",
    "expo-font": "~11.4.0",
    "expo-app-loading": "~2.1.0",
    "axios": "^1.5.0",
    "yup": "^1.3.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
'@
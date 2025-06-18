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

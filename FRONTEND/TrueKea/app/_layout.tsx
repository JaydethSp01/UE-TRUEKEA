// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../hooks/useAuth";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Puedes agregar fuentes personalizadas aquí si lo deseas
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-item" />
        <Stack.Screen name="item/[id]" />
        <Stack.Screen name="chat/[userId]" />
        <Stack.Screen name="profile/[userId]" />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Notificaciones",
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Buscar",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

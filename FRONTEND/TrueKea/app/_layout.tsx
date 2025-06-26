// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../hooks/useAuth";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/*
          Aquí el name es el nombre de la pantalla (el nombre del archivo .tsx
          en tu carpeta app/). No es el path ni la URL.
        */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="AddItem" />
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

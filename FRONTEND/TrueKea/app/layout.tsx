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
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="AddItem" />
        <Stack.Screen name="item/[id]" />
        <Stack.Screen name="chat/[userId]" />
        <Stack.Screen name="profile/[userId]" />
        <Stack.Screen name="requests" />
        <Stack.Screen name="rating" />

        {/* Admin routes */}
        <Stack.Screen
          name="admin"
          options={{
            headerShown: true,
            title: "Panel de Administración",
          }}
        />
        <Stack.Screen
          name="admin/users"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin/categories"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin/items"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin/roles"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin/swaps"
          options={{
            headerShown: false,
          }}
        />

        {/* Modal screens */}
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

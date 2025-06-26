// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="preferences"
          options={{
            title: "Preferencias",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "Mi Perfil",
          }}
        />
        <Stack.Screen
          name="publish"
          options={{
            title: "Publicar Objeto",
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            title: "Buscar",
          }}
        />
        <Stack.Screen
          name="requests"
          options={{
            title: "Mis Solicitudes",
          }}
        />
        <Stack.Screen
          name="rating"
          options={{
            title: "Calificación",
          }}
        />
        <Stack.Screen
          name="admin"
          options={{
            title: "Administración",
          }}
        />
        <Stack.Screen
          name="chat/index"
          options={{
            title: "Chats",
          }}
        />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen
          name="item/[id]"
          options={{
            title: "Detalle del Objeto",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

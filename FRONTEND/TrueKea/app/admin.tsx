// app/admin.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "../constants/Colors";

const stats = {
  total: 42,
  users: 20,
  categories: { Ropa: 10, Libros: 5, Tecnología: 8 },
};

export default function Admin() {
  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: "Administración" }} />
      <Text style={s.label}>Total trueques</Text>
      <Text style={s.value}>{stats.total}</Text>
      <Text style={s.label}>Usuarios activos</Text>
      <Text style={s.value}>{stats.users}</Text>
      <Text style={s.label}>Objetos por categoría</Text>
      <FlatList
        data={Object.entries(stats.categories)}
        keyExtractor={([k]) => k}
        renderItem={({ item: [k, v] }) => (
          <View style={s.row}>
            <Text style={s.key}>{k}</Text>
            <Text style={s.value}>{v}</Text>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginTop: 16,
  },
  value: { fontSize: 20, fontWeight: "600", color: Colors.text, marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  key: { fontSize: 16, color: Colors.text },
});

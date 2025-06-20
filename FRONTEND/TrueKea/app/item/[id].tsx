// app/item/[id].tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import { useItems } from "../../hooks/useItems";
import { Colors } from "../../constants/Colors";

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items } = useItems();
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: item.title }} />
      {item.images[0] && (
        <Image source={{ uri: item.images[0] }} style={s.image} />
      )}
      <Text style={s.title}>{item.title}</Text>
      <ButtonPrimary
        title="Solicitar intercambio"
        onPress={() => router.push("/requests")}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  desc: { fontSize: 16, color: Colors.textSecondary, marginBottom: 16 },
});

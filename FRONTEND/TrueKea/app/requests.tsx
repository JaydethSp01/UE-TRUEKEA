// app/requests.tsx
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { Colors } from "../constants/Colors";

type Request = {
  id: string;
  title: string;
  from: string;
  status: "pending" | "accepted" | "rejected";
};

export default function Requests() {
  const [data, setData] = useState<Request[]>([
    { id: "r1", title: "Camisa azul", from: "user2", status: "pending" },
  ]);
  const handle = (id: string, status: Request["status"]) =>
    setData((d) => d.map((r) => (r.id === id ? { ...r, status } : r)));
  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: "Solicitudes" }} />
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.sub}>De: {item.from}</Text>
            <View style={s.actions}>
              <ButtonPrimary
                title="Aceptar"
                onPress={() => handle(item.id, "accepted")}
              />
              <ButtonPrimary
                title="Rechazar"
                onPress={() => handle(item.id, "rejected")}
              />
            </View>
            {item.status !== "pending" && (
              <Text
                style={[s.status, item.status === "accepted" ? s.ok : s.err]}
              >
                {item.status.toUpperCase()}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: {
    backgroundColor: Colors.card,
    margin: 12,
    padding: 16,
    borderRadius: 8,
    ...Colors.cardShadow,
  },
  title: { fontSize: 18, fontWeight: "500", color: Colors.text },
  sub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  status: { marginTop: 12, fontSize: 14, fontWeight: "600" },
  ok: { color: Colors.success },
  err: { color: Colors.destructive },
});

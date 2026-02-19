// app/requests.tsx – Solicitudes de intercambio conectadas al backend
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Stack } from "expo-router";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { Colors } from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

type Request = {
  id: number;
  requester: { id: number; name: string };
  respondent: { id: number; name: string };
  requestedItem: { id: number; title: string };
  offeredItem: { id: number; title: string };
  status: string;
};

export default function Requests() {
  const { user } = useAuth();
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get("/admin/swaps");
      const swaps = (response.data ?? []) as Request[];
      const pending = swaps.filter(
        (s) =>
          s.status === "pending" &&
          (s.requester?.id === user.id || s.respondent?.id === user.id)
      );
      setData(pending);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user?.id]);

  const handleRespond = async (id: number, status: "accepted" | "rejected") => {
    const swap = data.find((s) => s.id === id);
    if (!swap || !user) return;
    try {
      await api.post("/swaps/respond", {
        id: String(id),
        requesterId: swap.requester.id,
        respondentId: swap.respondent.id,
        requestedItemId: swap.requestedItem.id,
        offeredItemId: swap.offeredItem.id,
        status,
      });
      await loadRequests();
      Alert.alert(
        status === "accepted" ? "Aceptado" : "Rechazado",
        status === "accepted"
          ? "Intercambio aceptado"
          : "Solicitud rechazada"
      );
    } catch {
      Alert.alert("Error", "No se pudo actualizar la solicitud");
    }
  };

  if (loading) {
    return (
      <View style={[s.container, s.centered]}>
        <Stack.Screen options={{ title: "Solicitudes" }} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: "Solicitudes" }} />
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadRequests();
            }}
          />
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.title}>{item.requestedItem?.title ?? "Producto"}</Text>
            <Text style={s.sub}>
              De: {item.requester?.name ?? "Usuario"} · Ofrece:{" "}
              {item.offeredItem?.title ?? "—"}
            </Text>
            <View style={s.actions}>
              <ButtonPrimary
                title="Aceptar"
                onPress={() => handleRespond(item.id, "accepted")}
              />
              <ButtonPrimary
                title="Rechazar"
                onPress={() => handleRespond(item.id, "rejected")}
              />
            </View>
            {item.status !== "pending" && (
              <Text style={[s.status, item.status === "accepted" ? s.ok : s.err]}>
                {item.status.toUpperCase()}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>No hay solicitudes pendientes</Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: "center", alignItems: "center" },
  empty: { padding: 24, alignItems: "center" },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
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

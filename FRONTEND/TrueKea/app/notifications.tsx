import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

interface Notification {
  id: string;
  type: "message" | "swap" | string;
  title: string;
  body: string;
  createdAt: string;
  data?: any;
  isRead?: boolean;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${user.id}/notifications`);

      // Mapea mensajes a tu interfaz Notification
      const messageNotifs: Notification[] = data.messages.map((m: any) => ({
        id: String(m.id),
        type: "message",
        title: `De ${m.sender.name}`, // o como prefieras mostrarlo
        body: m.content,
        createdAt: m.createdAt,
        data: {
          chatUserId: m.sender.id,
          itemId: m.item.id,
        },
        isRead: false,
      }));

      // (Opcional) si luego quieres también los swaps:
      const swapNotifs: Notification[] = data.swaps.map((s: any) => ({
        id: String(s.id),
        type: "swap",
        title: `Intercambio con ${s.requester.name}`,
        body: `Artículo: ${s.requestedItem.title}`,
        createdAt: s.updatedAt,
        data: { swapId: s.id },
        isRead: false,
      }));

      // Finalmente puebla el estado con todos
      setNotifications([...messageNotifs, ...swapNotifs]);
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handlePress = (notification: Notification) => {
    if (
      notification.type === "message" &&
      notification.data?.chatUserId &&
      notification.data?.itemId
    ) {
      router.push(
        `/chat/${notification.data.chatUserId}?itemId=${notification.data.itemId}`
      );
    } else if (notification.type === "swap" && notification.data?.swapId) {
      router.push(`/swaps?swapId=${notification.data.swapId}`);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notification, !item.isRead && styles.unreadNotification]}
      onPress={() => handlePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={
            item.type === "message"
              ? "chatbubble-ellipses"
              : item.type === "swap"
              ? "swap-horizontal"
              : "notifications"
          }
          size={24}
          color={
            item.type === "message"
              ? Colors.primary
              : item.type === "swap"
              ? Colors.accent
              : Colors.textSecondary
          }
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes notificaciones.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notification: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  unreadNotification: {
    backgroundColor: Colors.primaryLight,
  },
  iconContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

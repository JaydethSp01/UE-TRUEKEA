import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface Conversation {
  id: string;
  otherUser: {
    id: number;
    name: string;
    avatar?: string;
  };
  item: {
    id: number;
    name: string;
    image?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: number;
  };
  unreadCount: number;
}

export default function MessagesTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Llama a la API para obtener las conversaciones del usuario
      const response = await api.getUserConversations(user.id);
      setConversations(response);
    } catch (error) {
      setConversations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const goToChat = (conversation: Conversation) => {
    // Navega al chat, pasando el id del otro usuario y el itemId como query string
    router.push(`/chat/${conversation.otherUser.id}?itemId=${conversation.item.id}`);
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const isUnread = item.unreadCount > 0;
    return (
      <TouchableOpacity
        style={styles.conversationContainer}
        onPress={() => goToChat(item)}
      >
        <View style={styles.avatarContainer}>
          {item.otherUser.avatar ? (
            <Image source={{ uri: item.otherUser.avatar }} style={styles.avatar} />
          ) : (
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {item.otherUser.name.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.otherUser.name}</Text>
          <Text style={styles.itemTitle}>{item.item.name}</Text>
          <Text
            style={[
              styles.lastMessage,
              isUnread && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.senderId === user?.id ? "Tú: " : ""}
            {item.lastMessage.content}
          </Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.time}>
            {new Date(item.lastMessage.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {isUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
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
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes conversaciones aún.</Text>
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
  conversationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  itemTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lastMessageUnread: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  metaContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  time: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    marginTop: 4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
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
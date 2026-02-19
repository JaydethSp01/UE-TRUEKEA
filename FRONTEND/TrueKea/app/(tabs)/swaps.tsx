// app/(tabs)/swaps.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface Swap {
  id: number;
  requester: {
    id: number;
    name: string;
  };
  respondent: {
    id: number;
    name: string;
  };
  requestedItem: {
    id: number;
    title: string;
    img_item: string;
    value: number;
  };
  offeredItem: {
    id: number;
    title: string;
    img_item: string;
    value: number;
  };
  status: "pending" | "accepted" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function SwapsTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [activeTab, setActiveTab] = useState<"sent" | "received">("received");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSwaps();
  }, []);

  const loadSwaps = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await api.get("/admin/swaps");
      const userSwaps = response.data.filter(
        (swap: Swap) =>
          swap.requester.id === user.id || swap.respondent.id === user.id
      );
      setSwaps(userSwaps);
    } catch (error) {
      console.error("Error loading swaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSwaps();
    setRefreshing(false);
  };

  const handleSwapAction = async (
    swap: Swap,
    action: "accepted" | "rejected"
  ) => {
    try {
      await api.post("/swaps/respond", {
        id: swap.id.toString(),
        requesterId: swap.requester.id,
        respondentId: swap.respondent.id,
        requestedItemId: swap.requestedItem.id,
        offeredItemId: swap.offeredItem.id,
        status: action,
      });

      await loadSwaps();
    } catch (error) {
      console.error("Error updating swap:", error);
    }
  };

  const handleCompleteSwap = async (swap: Swap) => {
    try {
      await api.post("/swaps/complete", {
        requestedItemId: swap.requestedItem.id,
      });

      await loadSwaps();
    } catch (error) {
      console.error("Error completing swap:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return Colors.warning;
      case "accepted":
        return Colors.primary;
      case "completed":
        return Colors.success;
      case "rejected":
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "accepted":
        return "Aceptado";
      case "completed":
        return "Completado";
      case "rejected":
        return "Rechazado";
      default:
        return status;
    }
  };

  const filteredSwaps = swaps.filter((swap) => {
    if (activeTab === "sent") {
      return swap.requester.id === user?.id;
    } else {
      return swap.respondent.id === user?.id;
    }
  });

  const renderSwapItem = ({ item }: { item: Swap }) => {
    const isSent = item.requester.id === user?.id;
    const otherUser = isSent ? item.respondent : item.requester;
    const totalCO2 = item.requestedItem.value + item.offeredItem.value;

    return (
      <View style={styles.swapCard}>
        <View style={styles.swapHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {otherUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{otherUser.name}</Text>
              <Text style={styles.swapDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.swapContent}>
          <View style={styles.itemSection}>
            <Image
              source={{
                uri:
                  item.offeredItem.img_item || "https://via.placeholder.com/80",
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.offeredItem.title}
              </Text>
              <View style={styles.itemCO2}>
                <Ionicons name="leaf" size={14} color={Colors.success} />
                <Text style={styles.itemCO2Text}>
                  {item.offeredItem.value} kg CO₂
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.swapIcon}>
            <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
          </View>

          <View style={styles.itemSection}>
            <Image
              source={{
                uri:
                  item.requestedItem.img_item ||
                  "https://via.placeholder.com/80",
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.requestedItem.title}
              </Text>
              <View style={styles.itemCO2}>
                <Ionicons name="leaf" size={14} color={Colors.success} />
                <Text style={styles.itemCO2Text}>
                  {item.requestedItem.value} kg CO₂
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.swapFooter}>
          <View style={styles.totalCO2}>
            <Text style={styles.totalCO2Label}>Total CO₂ ahorrado:</Text>
            <Text style={styles.totalCO2Value}>{totalCO2} kg</Text>
          </View>

          {!isSent && item.status === "pending" && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleSwapAction(item, "accepted")}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.actionButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleSwapAction(item, "rejected")}
              >
                <Ionicons name="close" size={20} color="white" />
                <Text style={styles.actionButtonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          )}

          {item.status === "accepted" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleCompleteSwap(item)}
            >
              <Ionicons name="checkmark-done" size={20} color="white" />
              <Text style={styles.actionButtonText}>
                Marcar como completado
              </Text>
            </TouchableOpacity>
          )}

          {item.status === "completed" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.rateButton]}
              onPress={() => router.push(`/rating?swapId=${item.id}`)}
            >
              <Ionicons name="star" size={20} color="white" />
              <Text style={styles.actionButtonText}>Calificar intercambio</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[Colors.primaryLight + "20", Colors.secondaryLight + "20"]}
        style={styles.emptyGradient}
      >
        <Ionicons
          name="swap-horizontal"
          size={64}
          color={Colors.textSecondary}
        />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No tienes intercambios</Text>
      <Text style={styles.emptyText}>
        {activeTab === "sent"
          ? "Propón intercambios desde los productos"
          : "Aquí verás las propuestas que recibas"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Intercambios</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "received" && styles.activeTab]}
          onPress={() => setActiveTab("received")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "received" && styles.activeTabText,
            ]}
          >
            Recibidos (
            {swaps.filter((s) => s.respondent.id === user?.id).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "sent" && styles.activeTab]}
          onPress={() => setActiveTab("sent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sent" && styles.activeTabText,
            ]}
          >
            Enviados ({swaps.filter((s) => s.requester.id === user?.id).length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSwaps}
        renderItem={renderSwapItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={<EmptyComponent />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  swapCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Colors.cardShadow,
  },
  swapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  swapDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  swapContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  itemCO2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemCO2Text: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: "500",
  },
  swapIcon: {
    marginHorizontal: 16,
  },
  swapFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  totalCO2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalCO2Label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalCO2Value: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.success,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  completeButton: {
    backgroundColor: Colors.primary,
  },
  rateButton: {
    backgroundColor: Colors.warning,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

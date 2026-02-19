// app/admin/swaps/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/Colors";
import api from "../../../services/api";

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
    name: string;
    images: { url: string }[];
    co2: number;
  };
  offeredItem: {
    id: number;
    name: string;
    images: { url: string }[];
    co2: number;
  };
  status: "pending" | "accepted" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function AdminSwapsScreen() {
  const router = useRouter();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [filteredSwaps, setFilteredSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | Swap["status"]>(
    "all"
  );

  useEffect(() => {
    loadSwaps();
  }, []);

  useEffect(() => {
    filterSwaps();
  }, [swaps, filterStatus]);

  const loadSwaps = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/swaps");
      setSwaps(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los intercambios");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSwaps();
    setRefreshing(false);
  };

  const filterSwaps = () => {
    if (filterStatus === "all") {
      setFilteredSwaps(swaps);
    } else {
      setFilteredSwaps(swaps.filter((swap) => swap.status === filterStatus));
    }
  };

  const handleUpdateStatus = async (swap: Swap, newStatus: Swap["status"]) => {
    Alert.alert(
      "Actualizar estado",
      `¿Estás seguro de cambiar el estado a "${getStatusText(newStatus)}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await api.put(`/admin/swaps/${swap.id}`, { status: newStatus });
              await loadSwaps();
              Alert.alert("Éxito", "Estado actualizado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo actualizar el estado");
            }
          },
        },
      ]
    );
  };

  const handleDeleteSwap = async (swap: Swap) => {
    Alert.alert(
      "Eliminar intercambio",
      "¿Estás seguro de que deseas eliminar este intercambio? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/admin/swaps/${swap.id}`);
              await loadSwaps();
              Alert.alert("Éxito", "Intercambio eliminado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el intercambio");
            }
          },
        },
      ]
    );
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "accepted":
        return "checkmark-circle-outline";
      case "completed":
        return "checkmark-done-circle";
      case "rejected":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const renderSwapItem = ({ item }: { item: Swap }) => {
    const totalCO2 = item.requestedItem.co2 + item.offeredItem.co2;

    return (
      <TouchableOpacity style={styles.swapCard} activeOpacity={0.7}>
        <View style={styles.swapHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Ionicons
              name={getStatusIcon(item.status) as any}
              size={16}
              color={getStatusColor(item.status)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={styles.swapDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.swapContent}>
          {/* Requester */}
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>
                  {item.requester.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userName}>{item.requester.name}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Image
                source={{
                  uri:
                    item.offeredItem.images.length > 0
                      ? item.offeredItem.images[0].url
                      : "https://via.placeholder.com/60",
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.offeredItem.name}
                </Text>
                <View style={styles.co2Badge}>
                  <Ionicons name="leaf" size={12} color={Colors.success} />
                  <Text style={styles.co2Text}>
                    {item.offeredItem.co2} kg
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.swapIcon}>
            <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
          </View>

          {/* Respondent */}
          <View style={styles.userSection}>
            <View style={styles.itemInfo}>
              <Image
                source={{
                  uri:
                    item.requestedItem.images.length > 0
                      ? item.requestedItem.images[0].url
                      : "https://via.placeholder.com/60",
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.requestedItem.name}
                </Text>
                <View style={styles.co2Badge}>
                  <Ionicons name="leaf" size={12} color={Colors.success} />
                  <Text style={styles.co2Text}>
                    {item.requestedItem.co2} kg
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>
                  {item.respondent.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userName}>{item.respondent.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.swapFooter}>
          <View style={styles.totalCO2}>
            <Text style={styles.totalCO2Label}>CO₂ Total:</Text>
            <Text style={styles.totalCO2Value}>{totalCO2} kg</Text>
          </View>

          <View style={styles.swapActions}>
            {item.status === "pending" && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleUpdateStatus(item, "accepted")}
                >
                  <Ionicons name="checkmark" size={18} color={Colors.success} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleUpdateStatus(item, "rejected")}
                >
                  <Ionicons name="close" size={18} color={Colors.error} />
                </TouchableOpacity>
              </>
            )}
            {item.status === "accepted" && (
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleUpdateStatus(item, "completed")}
              >
                <Ionicons
                  name="checkmark-done"
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteSwap(item)}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const statusCounts = {
    all: swaps.length,
    pending: swaps.filter((s) => s.status === "pending").length,
    accepted: swaps.filter((s) => s.status === "accepted").length,
    completed: swaps.filter((s) => s.status === "completed").length,
    rejected: swaps.filter((s) => s.status === "rejected").length,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Intercambios</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Stats */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsContainer}
        contentContainerStyle={styles.statsContent}
      >
        <View style={[styles.statCard, { borderColor: Colors.primary }]}>
          <Text style={styles.statValue}>{swaps.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.warning }]}>
          <Text style={[styles.statValue, { color: Colors.warning }]}>
            {statusCounts.pending}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.success }]}>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {statusCounts.completed}
          </Text>
          <Text style={styles.statLabel}>Completados</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.error }]}>
          <Text style={[styles.statValue, { color: Colors.error }]}>
            {statusCounts.rejected}
          </Text>
          <Text style={styles.statLabel}>Rechazados</Text>
        </View>
      </ScrollView>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {(["all", "pending", "accepted", "completed", "rejected"] as const).map(
          (status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filterStatus === status && styles.filterTabActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterStatus === status && styles.filterTabTextActive,
                ]}
              >
                {status === "all" ? "Todos" : getStatusText(status)} (
                {statusCounts[status]})
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Swaps List */}
      <FlatList
        data={filteredSwaps}
        renderItem={renderSwapItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="swap-horizontal"
              size={64}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>No hay intercambios</Text>
          </View>
        }
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  headerRight: {
    width: 32,
  },
  statsContainer: {
    paddingVertical: 16,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 100,
    borderWidth: 2,
    ...Colors.cardShadow,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: "white",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  swapCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Colors.cardShadow,
  },
  swapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  swapDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  swapContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userSection: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  userInitial: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  userName: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 12,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 2,
  },
  co2Badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  co2Text: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: "500",
  },
  swapIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  swapFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalCO2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  totalCO2Label: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  totalCO2Value: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.success,
  },
  swapActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: Colors.successLight,
  },
  rejectButton: {
    backgroundColor: Colors.errorLight,
  },
  completeButton: {
    backgroundColor: Colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: Colors.errorLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});

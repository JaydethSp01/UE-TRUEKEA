// app/admin/users/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";
import api from "../../../services/api";
import { ScrollView } from "react-native";

interface User {
  id: number;
  name: string;
  email: string;
  roleId: {
    id: number;
    name: string;
  };
  status_user: string;
  createdAt: string;
  items?: any[];
  requestedSwaps?: any[];
  respondentSwaps?: any[];
}

export default function AdminUsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status_user === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status_user === "active" ? "inactive" : "active";
    const action = newStatus === "inactive" ? "desactivar" : "activar";

    Alert.alert(
      "Confirmar acción",
      `¿Estás seguro de que deseas ${action} al usuario ${user.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: newStatus === "inactive" ? "destructive" : "default",
          onPress: async () => {
            try {
              if (newStatus === "inactive") {
                await api.patch(`/users/${user.id}/deactivate`);
              } else {
                await api.patch(`/users/${user.id}/activate`);
              }
              await loadUsers();
              Alert.alert(
                "Éxito",
                `Usuario ${
                  action === "desactivar" ? "desactivado" : "activado"
                } correctamente`
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo actualizar el estado del usuario"
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = async (user: User) => {
    Alert.alert(
      "Eliminar usuario",
      `¿Estás seguro de que deseas eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/users/${user.id}`);
              await loadUsers();
              Alert.alert("Éxito", "Usuario eliminado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el usuario");
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isActive = item.status_user === "active";
    const userStats = {
      items: item.items?.length || 0,
      swaps:
        (item.requestedSwaps?.length || 0) +
        (item.respondentSwaps?.length || 0),
    };

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => router.push(`/admin/users/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.userHeader}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.userMeta}>
              <View
                style={[
                  styles.statusBadge,
                  isActive ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isActive
                      ? styles.statusTextActive
                      : styles.statusTextInactive,
                  ]}
                >
                  {isActive ? "Activo" : "Inactivo"}
                </Text>
              </View>
              <Text style={styles.roleText}>{item.roleId.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Ionicons
              name="cube-outline"
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={styles.statText}>{userStats.items} productos</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="swap-horizontal"
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={styles.statText}>{userStats.swaps} intercambios</Text>
          </View>
          <Text style={styles.joinDate}>
            Desde {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isActive ? styles.deactivateButton : styles.activateButton,
            ]}
            onPress={() => handleToggleStatus(item)}
          >
            <Ionicons
              name={
                isActive ? "close-circle-outline" : "checkmark-circle-outline"
              }
              size={20}
              color={isActive ? Colors.error : Colors.success}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteUser(item)}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "all" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("all")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === "all" && styles.filterTextActive,
              ]}
            >
              Todos ({users.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "active" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("active")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === "active" && styles.filterTextActive,
              ]}
            >
              Activos ({users.filter((u) => u.status_user === "active").length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "inactive" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("inactive")}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === "inactive" && styles.filterTextActive,
              ]}
            >
              Inactivos (
              {users.filter((u) => u.status_user === "inactive").length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={64}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
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
  searchContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: "white",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  userCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Colors.cardShadow,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitial: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: Colors.successLight,
  },
  statusInactive: {
    backgroundColor: Colors.errorLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTextActive: {
    color: Colors.success,
  },
  statusTextInactive: {
    color: Colors.error,
  },
  roleText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  joinDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: "auto",
  },
  userActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  activateButton: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  deactivateButton: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warningLight,
  },
  deleteButton: {
    borderColor: Colors.error,
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

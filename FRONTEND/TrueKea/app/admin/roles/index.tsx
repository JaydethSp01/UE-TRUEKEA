// app/admin/roles/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonPrimary } from "../../../components/ButtonPrimary";
import { Colors } from "../../../constants/Colors";
import api from "../../../services/api";

interface Role {
  id: number;
  name: string;
  users?: any[];
}

const roleIcons: { [key: string]: string } = {
  Admin: "shield-checkmark",
  Usuario: "person",
  Moderador: "eye",
  Premium: "star",
};

const roleColors: { [key: string]: string } = {
  Admin: Colors.error,
  Usuario: Colors.primary,
  Moderador: Colors.warning,
  Premium: Colors.accent,
};

export default function AdminRolesScreen() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/roles");
      setRoles(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRoles();
    setRefreshing(false);
  };

  const validateForm = () => {
    const errors = {
      name: "",
    };

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    } else if (formData.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    }

    setFormErrors(errors);
    return !errors.name;
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
      });
    }
    setFormErrors({ name: "" });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingRole(null);
    setFormData({ name: "" });
    setFormErrors({ name: "" });
  };

  const handleSaveRole = async () => {
    if (!validateForm()) return;

    try {
      if (editingRole) {
        await api.put(`/admin/roles/${editingRole.id}`, { name: formData.name });
        Alert.alert("Éxito", "Rol actualizado correctamente");
      } else {
        await api.post("/admin/roles", { name: formData.name });
        Alert.alert("Éxito", "Rol creado correctamente");
      }

      handleCloseModal();
      await loadRoles();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "No se pudo guardar el rol";
      Alert.alert("Error", message);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    // Prevenir eliminación de roles críticos
    if (role.name === "Admin" || role.name === "Usuario") {
      Alert.alert("Acción no permitida", "Este rol no puede ser eliminado");
      return;
    }

    Alert.alert(
      "Eliminar rol",
      `¿Estás seguro de que deseas eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/admin/roles/${role.id}`);
              await loadRoles();
              Alert.alert("Éxito", "Rol eliminado correctamente");
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo eliminar el rol. Puede que tenga usuarios asignados."
              );
            }
          },
        },
      ]
    );
  };

  const renderRoleItem = ({ item }: { item: Role }) => {
    const icon = roleIcons[item.name] || "shield";
    const color = roleColors[item.name] || Colors.primary;
    const isSystemRole = item.name === "Admin" || item.name === "Usuario";

    return (
      <TouchableOpacity
        style={styles.roleCard}
        onPress={() => !isSystemRole && handleOpenModal(item)}
        activeOpacity={isSystemRole ? 1 : 0.7}
      >
        <View style={styles.roleHeader}>
          <View style={[styles.roleIcon, { backgroundColor: color + "20" }]}>
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
          <View style={styles.roleInfo}>
            <View style={styles.roleNameContainer}>
              <Text style={styles.roleName}>{item.name}</Text>
              {isSystemRole && (
                <View style={styles.systemBadge}>
                  <Text style={styles.systemBadgeText}>Sistema</Text>
                </View>
              )}
            </View>
            <Text style={styles.roleDescription}>
              {item.users?.length || 0} usuarios asignados
            </Text>
          </View>
          {!isSystemRole && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteRole(item)}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rolePermissions}>
          <Text style={styles.permissionsTitle}>Permisos:</Text>
          <View style={styles.permissionsList}>
            {getPermissionsByRole(item.name).map((permission, index) => (
              <View key={index} style={styles.permissionChip}>
                <Ionicons name="checkmark-circle" size={14} color={color} />
                <Text style={styles.permissionText}>{permission}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getPermissionsByRole = (roleName: string) => {
    switch (roleName) {
      case "Admin":
        return [
          "Todos los permisos",
          "Gestión de usuarios",
          "Gestión de contenido",
          "Reportes",
        ];
      case "Usuario":
        return ["Publicar productos", "Intercambiar", "Mensajes", "Calificar"];
      case "Moderador":
        return ["Moderar contenido", "Gestionar reportes", "Bloquear usuarios"];
      case "Premium":
        return [
          "Productos ilimitados",
          "Prioridad en búsquedas",
          "Estadísticas avanzadas",
        ];
      default:
        return ["Permisos básicos"];
    }
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
        <Text style={styles.headerTitle}>Gestión de Roles</Text>
        <TouchableOpacity
          onPress={() => handleOpenModal()}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{roles.length}</Text>
          <Text style={styles.statLabel}>Roles Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {
              roles.filter((r) => r.name === "Admin" || r.name === "Usuario")
                .length
            }
          </Text>
          <Text style={styles.statLabel}>Roles del Sistema</Text>
        </View>
      </View>

      {/* Roles List */}
      <FlatList
        data={roles}
        renderItem={renderRoleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="shield-outline"
              size={64}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>No hay roles creados</Text>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRole ? "Editar Rol" : "Nuevo Rol"}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del rol</Text>
                <TextInput
                  style={[styles.input, formErrors.name && styles.inputError]}
                  placeholder="Ej: Moderador"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
                {formErrors.name ? (
                  <Text style={styles.errorText}>{formErrors.name}</Text>
                ) : null}
              </View>

              <View style={styles.permissionsInfo}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.permissionsInfoText}>
                  Los permisos se configurarán posteriormente en el sistema
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <ButtonPrimary
                title={editingRole ? "Actualizar" : "Crear"}
                onPress={handleSaveRole}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
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
    textAlign: "center",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  roleCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Colors.cardShadow,
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roleInfo: {
    flex: 1,
  },
  roleNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roleName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  systemBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  systemBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.primary,
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.errorLight,
    justifyContent: "center",
    alignItems: "center",
  },
  rolePermissions: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  permissionsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  permissionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  permissionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  permissionText: {
    fontSize: 12,
    color: Colors.text,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  modalForm: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  permissionsInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight + "20",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  permissionsInfoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
  },
});

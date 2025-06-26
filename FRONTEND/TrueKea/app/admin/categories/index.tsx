// app/admin/categories/index.tsx
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

interface Category {
  id: number;
  name: string;
  co2: number;
}

const categoryIcons: { [key: string]: string } = {
  Electrónica: "phone-portrait",
  Hogar: "home",
  Ropa: "shirt",
  Libros: "book",
  Deportes: "fitness",
  Juguetes: "game-controller",
  Herramientas: "construct",
  Música: "musical-notes",
  Arte: "color-palette",
  Jardín: "leaf",
};

export default function AdminCategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    co2: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    co2: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const validateForm = () => {
    const errors = {
      name: "",
      co2: "",
    };

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (!formData.co2) {
      errors.co2 = "El valor de CO₂ es requerido";
    } else if (isNaN(Number(formData.co2)) || Number(formData.co2) < 0) {
      errors.co2 = "Debe ser un número válido mayor o igual a 0";
    }

    setFormErrors(errors);
    return !errors.name && !errors.co2;
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        co2: category.co2.toString(),
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        co2: "",
      });
    }
    setFormErrors({ name: "", co2: "" });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCategory(null);
    setFormData({ name: "", co2: "" });
    setFormErrors({ name: "", co2: "" });
  };

  const handleSaveCategory = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        name: formData.name,
        co2: Number(formData.co2),
      };

      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, data);
        Alert.alert("Éxito", "Categoría actualizada correctamente");
      } else {
        await api.post("/admin/categories", data);
        Alert.alert("Éxito", "Categoría creada correctamente");
      }

      handleCloseModal();
      await loadCategories();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la categoría");
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    Alert.alert(
      "Eliminar categoría",
      `¿Estás seguro de que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/admin/categories/${category.id}`);
              await loadCategories();
              Alert.alert("Éxito", "Categoría eliminada correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la categoría");
            }
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const icon = categoryIcons[item.name] || "pricetag";

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleOpenModal(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIcon}>
            <Ionicons name={icon as any} size={24} color={Colors.primary} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.co2Container}>
              <Ionicons name="leaf" size={16} color={Colors.success} />
              <Text style={styles.co2Text}>{item.co2} kg CO₂</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCategory(item)}
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
        <Text style={styles.headerTitle}>Gestión de Categorías</Text>
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
          <Text style={styles.statValue}>{categories.length}</Text>
          <Text style={styles.statLabel}>Categorías Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {Math.round(
              categories.reduce((sum, cat) => sum + cat.co2, 0) /
                categories.length || 0
            )}
          </Text>
          <Text style={styles.statLabel}>CO₂ Promedio (kg)</Text>
        </View>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="pricetags-outline"
              size={64}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>No hay categorías creadas</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => handleOpenModal()}
            >
              <Text style={styles.emptyButtonText}>
                Crear primera categoría
              </Text>
            </TouchableOpacity>
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
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre de la categoría</Text>
                <TextInput
                  style={[styles.input, formErrors.name && styles.inputError]}
                  placeholder="Ej: Electrónica"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
                {formErrors.name ? (
                  <Text style={styles.errorText}>{formErrors.name}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Valor de CO₂ (kg)</Text>
                <TextInput
                  style={[styles.input, formErrors.co2 && styles.inputError]}
                  placeholder="Ej: 45"
                  value={formData.co2}
                  onChangeText={(text) =>
                    setFormData({ ...formData, co2: text })
                  }
                  keyboardType="numeric"
                />
                {formErrors.co2 ? (
                  <Text style={styles.errorText}>{formErrors.co2}</Text>
                ) : null}
                <Text style={styles.helperText}>
                  Cantidad promedio de CO₂ ahorrado por producto en esta
                  categoría
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
                title={editingCategory ? "Actualizar" : "Crear"}
                onPress={handleSaveCategory}
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
  categoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Colors.cardShadow,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  co2Container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  co2Text: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: "500",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.errorLight,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import api from "../services/api";
import { ItemCard, Item as RawItem } from "../components/ItemCard";
import { useAuth } from "../hooks/useAuth";
import { useSegments } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { routes } from "../utils/navigation";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

type Category = {
  id: number;
  name: string;
  co2: number;
  icon?: string;
};

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

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [items, setItems] = useState<RawItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showingPreferences, setShowingPreferences] = useState(true);

  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (segments) {
      setIsReady(true);
    }
  }, [segments]);

  useEffect(() => {
    if (isReady && !user) {
      router.replace(routes.login);
    }
  }, [user, isReady]);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get<Category[]>("/categories");
      const categoriesWithIcons = res.data.map((cat) => ({
        ...cat,
        icon: categoryIcons[cat.name] || "pricetag",
      }));
      setCategories(categoriesWithIcons);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [selectedCategory, showingPreferences, user?.preferences]);

  const loadItems = async () => {
    setLoading(true);

    let categoryIds: number[] | undefined;

    if (selectedCategory === null) {
      if (
        showingPreferences &&
        user?.preferences &&
        user.preferences.length > 0
      ) {
        categoryIds = user.preferences;
      } else {
        categoryIds = undefined;
      }
    } else {
      categoryIds = [selectedCategory];
    }

    const filters = {
      categoryIds,
      minCo2: undefined,
      maxCo2: undefined,
      nameRegex: undefined,
    };

    try {
      const res = await api.post<RawItem[]>("/items/list", filters);
      setItems(res.data);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const handleShowAllProducts = () => {
    setSelectedCategory(null);
    setShowingPreferences(false);
  };

  const handleShowPreferences = () => {
    setSelectedCategory(null);
    setShowingPreferences(true);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setShowingPreferences(false);
  };

  const hasActiveFilters =
    selectedCategory !== null ||
    (showingPreferences && user?.preferences && user.preferences.length > 0);

  const getFilterTitle = () => {
    if (selectedCategory !== null) {
      const cat = categories.find((c) => c.id === selectedCategory);
      return cat ? cat.name : "Productos";
    }
    if (
      showingPreferences &&
      user?.preferences &&
      user.preferences.length > 0
    ) {
      return "Mis Preferencias";
    }
    return "Todos los Productos";
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>¡Hola, {user.name}! 👋</Text>
              <Text style={styles.subtitle}>¿Qué vas a intercambiar hoy?</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => router.push(routes.notifications)}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>3</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  logout();
                  router.replace(routes.login);
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickActions}>
            {user?.preferences && user.preferences.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.quickActionButton,
                  showingPreferences &&
                    selectedCategory === null &&
                    styles.quickActionActive,
                ]}
                onPress={handleShowPreferences}
              >
                <Ionicons
                  name="heart"
                  size={20}
                  color={
                    showingPreferences && selectedCategory === null
                      ? Colors.primary
                      : "white"
                  }
                />
                <Text
                  style={[
                    styles.quickActionText,
                    showingPreferences &&
                      selectedCategory === null &&
                      styles.quickActionTextActive,
                  ]}
                >
                  Para ti
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.quickActionButton,
                !showingPreferences &&
                  selectedCategory === null &&
                  styles.quickActionActive,
              ]}
              onPress={handleShowAllProducts}
            >
              <Ionicons
                name="grid"
                size={20}
                color={
                  !showingPreferences && selectedCategory === null
                    ? Colors.primary
                    : "white"
                }
              />
              <Text
                style={[
                  styles.quickActionText,
                  !showingPreferences &&
                    selectedCategory === null &&
                    styles.quickActionTextActive,
                ]}
              >
                Explorar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push(routes.search)}
            >
              <Ionicons name="search" size={20} color="white" />
              <Text style={styles.quickActionText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearChip}>
              <Text style={styles.clearChipText}>Limpiar</Text>
              <Ionicons name="close-circle" size={16} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                selectedCategory === cat.id && styles.categoryCardActive,
              ]}
              onPress={() => {
                setSelectedCategory(
                  selectedCategory === cat.id ? null : cat.id
                );
                setShowingPreferences(false);
              }}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  selectedCategory === cat.id && styles.categoryIconActive,
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={24}
                  color={selectedCategory === cat.id ? "white" : Colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === cat.id && styles.categoryNameActive,
                ]}
              >
                {cat.name}
              </Text>
              <Text style={styles.categoryCo2}>{cat.co2} kg CO₂</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.productsSection}>
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>{getFilterTitle()}</Text>
          <Text style={styles.productCount}>
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando productos...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.grid}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="cube-outline"
                  size={64}
                  color={Colors.textSecondary}
                />
                <Text style={styles.emptyTitle}>No hay productos</Text>
                <Text style={styles.emptyText}>
                  {hasActiveFilters
                    ? "No se encontraron productos con los filtros aplicados"
                    : "Sé el primero en publicar un producto"}
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => router.push(routes.addItem)}
                >
                  <Text style={styles.emptyButtonText}>Publicar ahora</Text>
                </TouchableOpacity>
              </View>
            ) : (
              items.map((item) => (
                <View key={item.id} style={styles.itemWrapper}>
                  <ItemCard
                    item={item}
                    onPress={() => router.push(routes.item(item.id))}
                  />
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(routes.addItem)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  logoutButton: {
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    gap: 8,
  },
  quickActionActive: {
    backgroundColor: "white",
  },
  quickActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionTextActive: {
    color: Colors.primary,
  },
  categoriesSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  clearChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primaryLight + "20",
    borderRadius: 16,
    gap: 4,
  },
  clearChipText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryScrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  categoryCard: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    minWidth: 100,
  },
  categoryCardActive: {
    backgroundColor: Colors.primaryLight + "20",
    borderColor: Colors.primary,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconActive: {
    backgroundColor: Colors.primary,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  categoryNameActive: {
    color: Colors.primary,
  },
  categoryCo2: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: "500",
  },
  productsSection: {
    flex: 1,
    marginTop: 24,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  productCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 16,
  },
  itemWrapper: {
    width: CARD_WIDTH,
  },
  emptyContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

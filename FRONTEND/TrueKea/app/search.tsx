// app/search.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";
import { Categories } from "../constants/Categories";
import { TextInputField } from "../components/TextInputField";
import { ItemCard } from "../components/ItemCard";
import { Item } from "../types/Item";

const { width } = Dimensions.get("window");

const mockItems = [
  {
    id: "1",
    title: "Libro de React Native",
    description: "Libro en excelente estado para aprender React Native.",
    category: "books",
    condition: "like-new",
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794"],
    userId: "u1",
    userName: "Ana Pérez",
    userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    location: "Ciudad de México",
    estimatedValue: 200,
    co2Saved: 2.5,
    isAvailable: true,
    createdAt: "2025-06-20T10:00:00Z",
    tags: ["programación", "educación"],
    interestedUsers: [],
    userRating: 5,
    status: "available", // <-- cambió de "disponible"
  },
  {
    id: "2",
    title: "Silla ergonómica",
    description: "Silla de oficina cómoda, poco uso.",
    category: "furniture",
    condition: "good",
    images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4"],
    userId: "u2",
    userName: "Luis Gómez",
    userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
    location: "Guadalajara",
    estimatedValue: 800,
    co2Saved: 25,
    isAvailable: true,
    createdAt: "2025-06-18T15:30:00Z",
    tags: ["hogar", "oficina"],
    interestedUsers: ["u3"],
    userRating: 4,
    status: "available",
  },
  {
    id: "3",
    title: "Camiseta deportiva",
    description: "Camiseta Nike talla M, ideal para correr.",
    category: "clothes",
    condition: "good",
    images: ["https://images.unsplash.com/photo-1526178613658-3f1622045557"],
    userId: "u3",
    userName: "María López",
    userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
    location: "Monterrey",
    estimatedValue: 150,
    co2Saved: 8,
    isAvailable: false,
    createdAt: "2025-06-15T09:20:00Z",
    tags: ["deporte", "ropa"],
    interestedUsers: [],
    userRating: 5,
    status: "exchanged", // <-- cambió de "intercambiado"
  },
  {
    id: "4",
    title: "Laptop Lenovo",
    description: "Laptop Lenovo i5, 8GB RAM, buen estado.",
    category: "technology",
    condition: "good",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8"],
    userId: "u4",
    userName: "Carlos Ruiz",
    userAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
    location: "Puebla",
    estimatedValue: 6000,
    co2Saved: 15,
    isAvailable: true,
    createdAt: "2025-06-10T12:00:00Z",
    tags: ["tecnología", "computadora"],
    interestedUsers: ["u1", "u2"],
    userRating: 3,
    status: "available",
  },
] as Item[];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(mockItems);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    location: "",
    minValue: "",
    maxValue: "",
  });

  const { user } = useAuth();
  const router = useRouter();

  const locations = [
    "Bogotá Norte",
    "Bogotá Sur",
    "Bogotá Centro",
    "Bogotá Occidente",
    "Bogotá Oriente",
  ];
  const conditions = [
    { id: "new", label: "Nuevo" },
    { id: "like-new", label: "Como nuevo" },
    { id: "good", label: "Buen estado" },
    { id: "fair", label: "Estado regular" },
  ];
  const sortOptions = [
    { id: "recent", label: "Más recientes" },
    { id: "oldest", label: "Más antiguos" },
    { id: "price-high", label: "Mayor valor" },
    { id: "price-low", label: "Menor valor" },
    { id: "co2-impact", label: "Mayor impacto CO₂" },
  ];

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, sortBy]);

  const applyFilters = () => {
    let filtered = mockItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !filters.category || item.category === filters.category;
      const matchesCondition =
        !filters.condition || item.condition === filters.condition;
      const matchesLocation =
        !filters.location || item.location === filters.location;
      const matchesMinValue =
        !filters.minValue ||
        item.estimatedValue >= parseInt(filters.minValue, 10);
      const matchesMaxValue =
        !filters.maxValue ||
        item.estimatedValue <= parseInt(filters.maxValue, 10);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCondition &&
        matchesLocation &&
        matchesMinValue &&
        matchesMaxValue
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-high":
          return b.estimatedValue - a.estimatedValue;
        case "price-low":
          return a.estimatedValue - b.estimatedValue;
        case "co2-impact":
          return b.co2Saved - a.co2Saved;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      condition: "",
      location: "",
      minValue: "",
      maxValue: "",
    });
    setSearchQuery("");
  };

  const getActiveFiltersCount = () =>
    Object.values(filters).filter((v) => v !== "").length;

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.modalCancel}>❌</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filtros</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.modalClear}>Limpiar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          {/* Categoría */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {Categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.filterChip,
                      filters.category === cat.id && styles.filterChipSelected,
                    ]}
                    onPress={() =>
                      setFilters((f) => ({ ...f, category: cat.id }))
                    }
                  >
                    <Text style={styles.filterChipEmoji}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.category === cat.id &&
                          styles.filterChipTextSelected,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Estado */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Estado</Text>
            <View style={styles.filterGrid}>
              {conditions.map((cond) => (
                <TouchableOpacity
                  key={cond.id}
                  style={[
                    styles.conditionChip,
                    filters.condition === cond.id &&
                      styles.conditionChipSelected,
                  ]}
                  onPress={() =>
                    setFilters((f) => ({ ...f, condition: cond.id }))
                  }
                >
                  <Text
                    style={[
                      styles.conditionChipText,
                      filters.condition === cond.id &&
                        styles.conditionChipTextSelected,
                    ]}
                  >
                    {cond.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Ubicación</Text>
            <View style={styles.filterGrid}>
              {locations.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.locationChip,
                    filters.location === loc && styles.locationChipSelected,
                  ]}
                  onPress={() => setFilters((f) => ({ ...f, location: loc }))}
                >
                  <Text
                    style={[
                      styles.locationChipText,
                      filters.location === loc &&
                        styles.locationChipTextSelected,
                    ]}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rango de valor */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Rango de valor (COP)</Text>
            <View style={styles.priceRange}>
              <TextInputField
                placeholder="Mínimo"
                value={filters.minValue}
                onChangeText={(t) => setFilters((f) => ({ ...f, minValue: t }))}
                keyboardType="numeric"
                style={styles.priceInput}
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInputField
                placeholder="Máximo"
                value={filters.maxValue}
                onChangeText={(t) => setFilters((f) => ({ ...f, maxValue: t }))}
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
          </View>

          {/* Ordenar por */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Ordenar por</Text>
            <View style={styles.sortOptions}>
              {sortOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.sortOption,
                    sortBy === opt.id && styles.sortOptionSelected,
                  ]}
                  onPress={() => setSortBy(opt.id)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === opt.id && styles.sortOptionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  type ItemType = (typeof mockItems)[number];

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard
      item={item}
      onPress={() => router.push(`/item/${item.id}`)}
      style={styles.itemCard}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header de búsqueda */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <TextInputField
            placeholder="🔍 Buscar objetos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterButtonText}>🎛️</Text>
            {getActiveFiltersCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {getActiveFiltersCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredItems.length} objetos encontrados
          </Text>
          <TouchableOpacity onPress={() => setShowFilters(true)}>
            <Text style={styles.sortText}>
              Ordenar: {sortOptions.find((o) => o.id === sortBy)?.label}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de resultados */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔍</Text>
            <Text style={styles.emptyStateTitle}>
              No se encontraron objetos
            </Text>
            <Text style={styles.emptyStateText}>
              Intenta ajustar tus filtros
            </Text>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  // contenedor general
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // header búsqueda
  searchHeader: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    margin: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterButtonText: {
    fontSize: 20,
  },
  filterBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    alignItems: "center",
  },
  filterBadgeText: {
    color: Colors.card,
    fontSize: 10,
    fontWeight: "600",
  },
  resultsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  resultsText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  sortText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  // lista
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  itemCard: {
    flex: 1,
    margin: 6,
  },

  // empty
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginVertical: 8,
    textAlign: "center",
  },
  clearFiltersButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: Colors.card,
    fontWeight: "600",
  },

  // modal filtros
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalCancel: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  modalClear: {
    fontSize: 16,
    color: Colors.accent,
  },
  modalContent: {
    paddingHorizontal: 16,
  },

  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },

  // chips de categoría
  filterOptions: {
    flexDirection: "row",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipEmoji: {
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  filterChipTextSelected: {
    color: Colors.card,
  },

  // grid para estado y ubicación
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  conditionChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  conditionChipTextSelected: {
    color: Colors.primaryDark,
  },
  locationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationChipSelected: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.secondary,
  },
  locationChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  locationChipTextSelected: {
    color: Colors.secondaryDark,
  },

  // rango de precio
  priceRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceInput: {
    flex: 1,
    margin: 0,
  },
  priceSeparator: {
    fontSize: 16,
    color: Colors.textSecondary,
  },

  // ordenar por
  sortOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  sortOptionTextSelected: {
    color: Colors.card,
  },
});

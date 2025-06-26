// app/search.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import { ItemCard, Item } from "../components/ItemCard";
import api from "../services/api";

const { width } = Dimensions.get("window");

interface SearchFilters {
  minCO2: number;
  maxCO2: number;
  categoryIds: number[];
  location?: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minCO2: 0,
    maxCO2: 1000,
    categoryIds: [],
  });

  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Bicicleta",
    "Laptop",
    "Libros",
    "Ropa deportiva",
  ]);

  const [popularCategories] = useState([
    { name: "Electrónica", icon: "phone-portrait", color: Colors.primary },
    { name: "Hogar", icon: "home", color: Colors.secondary },
    { name: "Ropa", icon: "shirt", color: Colors.accent },
    { name: "Deportes", icon: "fitness", color: Colors.warning },
  ]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const searchItems = useCallback(async () => {
    if (!searchQuery.trim() && filters.categoryIds.length === 0) return;

    setLoading(true);
    try {
      const searchFilters = {
        nameRegex: searchQuery.trim() || undefined,
        categoryIds:
          filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
        minCo2: filters.minCO2 > 0 ? filters.minCO2 : undefined,
        maxCo2: filters.maxCO2 < 1000 ? filters.maxCO2 : undefined,
      };

      const res = await api.post("/items/list", searchFilters);
      setResults(res.data);

      // Agregar a búsquedas recientes
      if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
        setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
      }
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  const handleCategoryFilter = (categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      minCO2: 0,
      maxCO2: 1000,
      categoryIds: [],
    });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemWrapper}>
      <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
    </View>
  );

  const FilterSection = () => (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filtros</Text>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={styles.clearButton}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryFilters}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  filters.categoryIds.includes(category.id) &&
                    styles.categoryChipActive,
                ]}
                onPress={() => handleCategoryFilter(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    filters.categoryIds.includes(category.id) &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Rango de CO₂ (kg)</Text>
        <View style={styles.rangeContainer}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            value={filters.minCO2 > 0 ? filters.minCO2.toString() : ""}
            onChangeText={(text) =>
              setFilters({ ...filters, minCO2: Number(text) || 0 })
            }
            keyboardType="numeric"
          />
          <Text style={styles.rangeSeparator}>-</Text>
          <TextInput
            style={styles.rangeInput}
            placeholder="Max"
            value={filters.maxCO2 < 1000 ? filters.maxCO2.toString() : ""}
            onChangeText={(text) =>
              setFilters({ ...filters, maxCO2: Number(text) || 1000 })
            }
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const EmptyResults = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[Colors.primaryLight + "20", Colors.secondaryLight + "20"]}
        style={styles.emptyGradient}
      >
        <Ionicons name="search" size={64} color={Colors.textSecondary} />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No encontramos resultados</Text>
      <Text style={styles.emptyText}>
        Intenta con otros términos o ajusta los filtros
      </Text>
    </View>
  );

  const InitialScreen = () => (
    <ScrollView style={styles.initialContainer}>
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
          <View style={styles.recentSearches}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentChip}
                onPress={() => {
                  setSearchQuery(search);
                  searchItems();
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías populares</Text>
        <View style={styles.popularGrid}>
          {popularCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.popularCard}
              onPress={() => {
                const cat = categories.find((c) => c.name === category.name);
                if (cat) {
                  handleCategoryFilter(cat.id);
                  searchItems();
                }
              }}
            >
              <LinearGradient
                colors={[category.color + "20", category.color + "10"]}
                style={styles.popularGradient}
              >
                <Ionicons
                  name={category.icon as any}
                  size={32}
                  color={category.color}
                />
                <Text style={styles.popularText}>{category.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchItems}
            returnKeyType="search"
            autoFocus
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

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="options"
            size={24}
            color={
              filters.categoryIds.length > 0 ? Colors.primary : Colors.text
            }
          />
          {filters.categoryIds.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {filters.categoryIds.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showFilters && <FilterSection />}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery || filters.categoryIds.length > 0 ? (
        <EmptyResults />
      ) : (
        <InitialScreen />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    marginLeft: 12,
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  filterSection: {
    backgroundColor: Colors.card,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  clearButton: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  categoryFilters: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: "white",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rangeSeparator: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
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
  },
  initialContainer: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  recentSearches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    gap: 6,
  },
  recentText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  popularCard: {
    width: (width - 52) / 2,
    aspectRatio: 1.2,
  },
  popularGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  popularText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 12,
  },
});

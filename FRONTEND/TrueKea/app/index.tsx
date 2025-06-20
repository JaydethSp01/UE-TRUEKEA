import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Colors } from "../constants/Colors";
import { Categories } from "../constants/Categories";
import { useItems } from "../hooks/useItems";
import { useCO2 } from "../hooks/useCO2";
import { ItemCard } from "../components/ItemCard";
import { ButtonPrimary } from "../components/ButtonPrimary";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { items, loading } = useItems();
  const { co2Data } = useCO2();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola! 👋</Text>
            <Text style={styles.subtitle}>¿Qué quieres intercambiar hoy?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person-circle" size={32} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* CO2 Impact Card */}
        <LinearGradient
          colors={Colors.gradientSecondary as [string, string, ...string[]]}
          style={styles.impactCard}
        >
          <View style={styles.impactContent}>
            <View>
              <Text style={styles.impactTitle}>Tu Impacto</Text>
              <Text style={styles.impactValue}>{co2Data.totalSaved}kg CO₂</Text>
              <Text style={styles.impactSubtitle}>ahorrados este mes</Text>
            </View>
            <View style={styles.impactIcon}>
              <Ionicons name="leaf" size={40} color="white" />
            </View>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryText,
                  !selectedCategory && styles.categoryTextActive,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>
            {Categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/publish")}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: Colors.primaryLight },
                ]}
              >
                <Ionicons name="add" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Publicar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/search")}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: Colors.secondaryLight },
                ]}
              >
                <Ionicons name="search" size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.quickActionText}>Buscar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/requests")}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: Colors.accentLight },
                ]}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={24}
                  color={Colors.accent}
                />
              </View>
              <Text style={styles.quickActionText}>Intercambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/chat")}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: Colors.warningLight },
                ]}
              >
                <Ionicons name="chatbubbles" size={24} color={Colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Chats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Items Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? "Items Filtrados" : "Últimos Items"}
            </Text>
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsGrid}>
            {filteredItems.slice(0, 6).map((item) => (
              <View key={item.id} style={styles.itemWrapper}>
                <ItemCard
                  item={item}
                  onPress={() => router.push(`/item/${item.id}`)}
                />
              </View>
            ))}
          </View>

          {filteredItems.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyStateText}>
                No hay items en esta categoría
              </Text>
              <ButtonPrimary
                title="Explorar todos"
                onPress={() => setSelectedCategory(null)}
                style={styles.emptyStateButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  profileButton: {
    padding: 8,
  },
  impactCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    ...Colors.cardShadow,
  },
  impactContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  impactTitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  impactSubtitle: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  impactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "white",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  quickAction: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  itemWrapper: {
    width: (width - 52) / 2,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 120,
  },
});

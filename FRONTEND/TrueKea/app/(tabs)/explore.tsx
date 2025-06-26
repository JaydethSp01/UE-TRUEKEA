// app/(tabs)/explore.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Item } from "../../components/ItemCard";
import { Colors } from "../../constants/Colors";
import api from "../../services/api";

const { width } = Dimensions.get("window");

export default function ExploreTab() {
  const router = useRouter();
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);

      // Cargar items destacados
      const itemsRes = await api.post("/items/list", {});
      setFeaturedItems(itemsRes.data.slice(0, 6));

      // Cargar categorías
      const categoriesRes = await api.get("/categories");
      setCategories(categoriesRes.data);

      // Simular usuarios destacados
      setTopUsers([
        { id: 1, name: "María G.", swaps: 45, co2: 520, avatar: "MG" },
        { id: 2, name: "Carlos R.", swaps: 38, co2: 420, avatar: "CR" },
        { id: 3, name: "Ana S.", swaps: 32, co2: 380, avatar: "AS" },
      ]);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explorar</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push("/search")}
          >
            <Ionicons name="search" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>🌿 Mes del Medio Ambiente</Text>
              <Text style={styles.heroSubtitle}>
                Intercambia y reduce tu huella de carbono
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Ver más</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.heroImage}
            />
          </LinearGradient>
        </View>

        {/* Categorías Populares */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías Populares</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.slice(0, 5).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push("/search")}
              >
                <LinearGradient
                  colors={[
                    Colors.primaryLight + "40",
                    Colors.secondaryLight + "40",
                  ]}
                  style={styles.categoryGradient}
                >
                  <Ionicons name="cube" size={32} color={Colors.primary} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCO2}>{category.co2} kg CO₂</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Productos Destacados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos Destacados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver más</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredGrid}>
            {featuredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() => router.push(`/item/${item.id}`)}
              >
                <Image
                  source={{
                    uri: item.img_item || "https://via.placeholder.com/150",
                  }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredOverlay}>
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.featuredGradient}
                  >
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.featuredMeta}>
                      <View style={styles.featuredCO2}>
                        <Ionicons name="leaf" size={14} color="white" />
                        <Text style={styles.featuredCO2Text}>
                          {item.value} kg
                        </Text>
                      </View>
                      <View style={styles.featuredOwner}>
                        <Text style={styles.featuredOwnerText}>
                          {item.owner.name}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Usuarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Usuarios Destacados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.usersContainer}>
            {topUsers.map((user, index) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => router.push(`/profile/${user.id}` as `/profile/[userId]`)}
              >
                <View style={styles.userRank}>
                  <Text style={styles.userRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{user.avatar}</Text>
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.userStats}>
                  <View style={styles.userStat}>
                    <Text style={styles.userStatValue}>{user.swaps}</Text>
                    <Text style={styles.userStatLabel}>Swaps</Text>
                  </View>
                  <View style={styles.userStatDivider} />
                  <View style={styles.userStat}>
                    <Text style={styles.userStatValue}>{user.co2}</Text>
                    <Text style={styles.userStatLabel}>kg CO₂</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips de Sostenibilidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips de Sostenibilidad</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsScroll}
          >
            <View
              style={[
                styles.tipCard,
                { backgroundColor: Colors.primaryLight + "20" },
              ]}
            >
              <Ionicons name="bulb" size={24} color={Colors.primary} />
              <Text style={styles.tipTitle}>Ahorra Energía</Text>
              <Text style={styles.tipText}>
                Apaga las luces cuando no las uses
              </Text>
            </View>
            <View
              style={[
                styles.tipCard,
                { backgroundColor: Colors.secondaryLight + "20" },
              ]}
            >
              <Ionicons name="water" size={24} color={Colors.secondary} />
              <Text style={styles.tipTitle}>Cuida el Agua</Text>
              <Text style={styles.tipText}>
                Cierra el grifo mientras te cepillas
              </Text>
            </View>
            <View
              style={[
                styles.tipCard,
                { backgroundColor: Colors.accentLight + "20" },
              ]}
            >
              <Ionicons name="bicycle" size={24} color={Colors.accent} />
              <Text style={styles.tipTitle}>Transporte Eco</Text>
              <Text style={styles.tipText}>
                Usa la bici para distancias cortas
              </Text>
            </View>
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...Colors.shadow,
  },
  heroBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  heroGradient: {
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    ...Colors.cardShadow,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 4,
  },
  heroButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginLeft: 16,
  },
  section: {
    marginBottom: 32,
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
    fontWeight: "700",
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    marginRight: 12,
  },
  categoryGradient: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  categoryCO2: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: "500",
  },
  featuredGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 16,
  },
  featuredCard: {
    width: (width - 48) / 2,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  featuredGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  featuredMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredCO2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featuredCO2Text: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  featuredOwner: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredOwnerText: {
    fontSize: 11,
    color: "white",
    fontWeight: "500",
  },
  usersContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  userCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    ...Colors.cardShadow,
  },
  userRank: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userRankText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.secondary,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  userStat: {
    alignItems: "center",
  },
  userStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  userStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  userStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  tipsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tipCard: {
    width: 160,
    padding: 20,
    borderRadius: 16,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

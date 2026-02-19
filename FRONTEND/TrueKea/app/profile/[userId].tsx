// app/profile/[userId].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { Item } from "../../components/ItemCard";

const { width } = Dimensions.get("window");

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  items: Item[];
  stats: {
    totalItems: number;
    completedSwaps: number;
    totalCO2Saved: number;
    rating: number;
  };
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"items" | "reviews">("items");

  const isOwnProfile = currentUser?.id === Number(userId);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      // Cargar datos del usuario
      const [userRes, itemsRes, statsRes] = await Promise.all([
        api.get(`/users/${userId}`),
        api.post("/items/list", { ownerId: Number(userId) }),
        api.getUserStatsByUserId(Number(userId)),
      ]);

      const stats = {
        totalItems: statsRes.totalItems ?? itemsRes.data.length,
        completedSwaps: statsRes.completedSwaps ?? 0,
        totalCO2Saved: statsRes.totalCO2Saved ?? 0,
        rating: statsRes.rating ?? 0,
      };

      setProfile({
        ...userRes.data,
        items: itemsRes.data,
        stats,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    if (profile) {
      router.push(`/chat/${profile.id}`);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => router.push(`/item/${item.id}`)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.img_item || "https://via.placeholder.com/150" }}
        style={styles.itemImage}
      />
      <View style={styles.itemOverlay}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.itemGradient}
        >
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.itemFooter}>
            <View style={styles.itemCO2}>
              <Ionicons name="leaf" size={12} color="white" />
              <Text style={styles.itemCO2Text}>{item.value} kg</Text>
            </View>
            <View style={styles.itemStatus}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      item.status === "available"
                        ? Colors.success
                        : Colors.warning,
                  },
                ]}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
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

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Usuario no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con imagen de fondo */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.headerGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[Colors.secondary, Colors.secondaryDark]}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>
                    {profile.name.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
                {profile.stats.rating >= 4.5 && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={16} color="white" />
                  </View>
                )}
              </View>

              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.memberSince}>
                Miembro desde {new Date(profile.createdAt).getFullYear()}
              </Text>

              {!isOwnProfile && (
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={handleMessage}
                >
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={18}
                    color="white"
                  />
                  <Text style={styles.messageButtonText}>Enviar mensaje</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.stats.totalItems}</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.stats.completedSwaps}</Text>
            <Text style={styles.statLabel}>Intercambios</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.stats.totalCO2Saved}</Text>
            <Text style={styles.statLabel}>kg CO₂</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <Text style={styles.ratingTitle}>Calificación</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={
                      star <= Math.floor(profile.stats.rating)
                        ? "star"
                        : "star-outline"
                    }
                    size={20}
                    color={Colors.warning}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.ratingValue}>
              {profile.stats.rating.toFixed(1)} / 5.0
            </Text>
            <Text style={styles.ratingSubtext}>
              Basado en {profile.stats.completedSwaps} intercambios
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "items" && styles.activeTab]}
            onPress={() => setActiveTab("items")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "items" && styles.activeTabText,
              ]}
            >
              Productos ({profile.items.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reviews" && styles.activeTabText,
              ]}
            >
              Reseñas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido según tab activo */}
        {activeTab === "items" ? (
          <View style={styles.itemsContainer}>
            {profile.items.length > 0 ? (
              <FlatList
                data={profile.items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.itemsRow}
                scrollEnabled={false}
                contentContainerStyle={styles.itemsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="cube-outline"
                  size={48}
                  color={Colors.textSecondary}
                />
                <Text style={styles.emptyText}>
                  {isOwnProfile
                    ? "Aún no has publicado productos"
                    : "Este usuario no tiene productos"}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.reviewsContainer}>
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={Colors.textSecondary}
              />
              <Text style={styles.emptyText}>Aún no hay reseñas</Text>
            </View>
          </View>
        )}
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerContainer: {
    position: "relative",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "700",
    color: "white",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  messageButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    ...Colors.cardShadow,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  ratingContainer: {
    padding: 20,
  },
  ratingCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    ...Colors.cardShadow,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  ratingStars: {
    flexDirection: "row",
    gap: 4,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  ratingSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  itemsContainer: {
    padding: 20,
  },
  itemsRow: {
    justifyContent: "space-between",
  },
  itemsList: {
    gap: 16,
  },
  itemCard: {
    width: (width - 52) / 2,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  itemGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCO2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemCO2Text: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  itemStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reviewsContainer: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});

// app/admin/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ColorValue,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import api from "../../services/api";

const { width } = Dimensions.get("window");

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalItems: number;
  availableItems: number;
  totalSwaps: number;
  completedSwaps: number;
  totalCategories: number;
  totalCO2Saved: number;
}

interface QuickAction {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  gradient: ColorValue[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalItems: 0,
    availableItems: 0,
    totalSwaps: 0,
    completedSwaps: 0,
    totalCategories: 0,
    totalCO2Saved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const quickActions: QuickAction[] = [
    {
      title: "Usuarios",
      icon: "people",
      route: "/admin/users",
      color: Colors.primary,
      gradient: [Colors.primary, Colors.primaryDark],
    },
    {
      title: "Productos",
      icon: "cube",
      route: "/admin/items",
      color: Colors.secondary,
      gradient: [Colors.secondary, Colors.secondaryDark],
    },
    {
      title: "Categorías",
      icon: "pricetags",
      route: "/admin/categories",
      color: Colors.accent,
      gradient: [Colors.accent, Colors.accentDark],
    },
    {
      title: "Intercambios",
      icon: "swap-horizontal",
      route: "/admin/swap",
      color: Colors.warning,
      gradient: [Colors.warning, "#C19A3A"],
    },
    {
      title: "Roles",
      icon: "shield-checkmark",
      route: "/admin/roles",
      color: "#8B5CF6",
      gradient: ["#8B5CF6", "#6B21A8"],
    },
  ];

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      const [usersRes, itemsRes, swapsRes, categoriesRes] = await Promise.all([
        api.get("/users"),
        api.post("/items/list"),
        api.get("/admin/swaps/"),
        api.get("/categories"),
      ]);

      const users = usersRes.data;
      const items = itemsRes.data;
      const swaps = swapsRes.data;
      const categories = categoriesRes.data;

      const activeUsers = users.filter(
        (u: any) => u.status_user === "active"
      ).length;
      const availableItems = items.filter(
        (i: any) => i.status === "available"
      ).length;
      const completedSwaps = swaps.filter(
        (s: any) => s.status === "completed"
      ).length;
      const totalCO2 = items.reduce(
        (sum: number, item: any) => sum + (item.co2 || 0),
        0
      );

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalItems: items.length,
        availableItems,
        totalSwaps: swaps.length,
        completedSwaps,
        totalCategories: categories.length,
        totalCO2Saved: Math.round(totalCO2),
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
  }: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <View
          style={[styles.statIconContainer, { backgroundColor: color + "20" }]}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Panel de Administración</Text>
            <Text style={styles.subtitle}>
              Gestiona todos los aspectos de TrueKea
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient as any}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon} size={32} color="white" />
                  <Text style={styles.quickActionText}>{action.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumen General</Text>

          <View style={styles.statsGrid}>
            <StatCard
              title="Usuarios Totales"
              value={stats.totalUsers}
              subtitle={`${stats.activeUsers} activos`}
              icon="people"
              color={Colors.primary}
            />
            <StatCard
              title="Productos"
              value={stats.totalItems}
              subtitle={`${stats.availableItems} disponibles`}
              icon="cube"
              color={Colors.secondary}
            />
            <StatCard
              title="Intercambios"
              value={stats.totalSwaps}
              subtitle={`${stats.completedSwaps} completados`}
              icon="swap-horizontal"
              color={Colors.warning}
            />
            <StatCard
              title="Categorías"
              value={stats.totalCategories}
              icon="pricetags"
              color={Colors.accent}
            />
          </View>
        </View>

        {/* Environmental Impact */}
        <View style={styles.impactContainer}>
          <LinearGradient
            colors={[Colors.success, Colors.successLight]}
            style={styles.impactGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="leaf" size={40} color="white" />
            <View style={styles.impactContent}>
              <Text style={styles.impactTitle}>Impacto Ambiental</Text>
              <Text style={styles.impactValue}>
                {stats.totalCO2Saved} kg CO₂
              </Text>
              <Text style={styles.impactSubtitle}>
                Total ahorrado en la plataforma
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            <ActivityItem
              icon="person-add"
              text="Nuevo usuario registrado"
              time="Hace 5 min"
              color={Colors.primary}
            />
            <ActivityItem
              icon="cube"
              text="Producto publicado"
              time="Hace 15 min"
              color={Colors.secondary}
            />
            <ActivityItem
              icon="checkmark-circle"
              text="Intercambio completado"
              time="Hace 1 hora"
              color={Colors.success}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ActivityItem = ({
  icon,
  text,
  time,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  time: string;
  color: string;
}) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIcon, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityText}>{text}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

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
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...Colors.shadow,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: (width - 52) / 3,
    marginBottom: 12,
  },
  quickActionGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
  quickActionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...Colors.cardShadow,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  impactContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  impactGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    ...Colors.cardShadow,
  },
  impactContent: {
    marginLeft: 20,
    flex: 1,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    opacity: 0.9,
  },
  impactValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginVertical: 4,
  },
  impactSubtitle: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 32,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  activityList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    ...Colors.cardShadow,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { getCategoryById, getConditionById } from "@/constants/Categories";
import { Item } from "../types/Item";
import { ViewStyle, StyleProp } from "react-native";
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
  variant?: "grid" | "list";
  showUserInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onPress,
  variant = "grid",
  showUserInfo = true,
}) => {
  const category = getCategoryById(item.category);
  const condition = getConditionById(item.condition);

  // valores por defecto si vienen undefined
  const status = item.status ?? "available";
  const rating = item.userRating ?? 0;

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return Colors.success;
      case "pending":
        return Colors.warning;
      case "exchanged":
        return Colors.textLight;
      default:
        return Colors.textLight;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "available":
        return "Disponible";
      case "pending":
        return "Pendiente";
      case "exchanged":
        return "Intercambiado";
      default:
        return "Desconocido";
    }
  };

  const GridCard = () => (
    <TouchableOpacity
      style={[styles.gridCard, Colors.cardShadow]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images[0] }}
          style={styles.gridImage}
          resizeMode="cover"
        />
        <View style={styles.statusBadge}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
        </View>
        {category && (
          <View
            style={[styles.categoryBadge, { backgroundColor: category.color }]}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.conditionContainer}>
          {condition && (
            <View
              style={[
                styles.conditionBadge,
                { backgroundColor: condition.color + "20" },
              ]}
            >
              <Text style={[styles.conditionText, { color: condition.color }]}>
                {condition.name}
              </Text>
            </View>
          )}
        </View>

        {showUserInfo && (
          <View style={styles.userInfo}>
            <Ionicons
              name="person-circle"
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={styles.userName} numberOfLines={1}>
              {item.userName}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          </View>
        )}

        <View style={styles.locationContainer}>
          <Ionicons name="location" size={12} color={Colors.textLight} />
          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListCard = () => (
    <TouchableOpacity
      style={[styles.listCard, Colors.cardShadow]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.listImage}
        resizeMode="cover"
      />

      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.listMeta}>
          {category && (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: category.color },
              ]}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          )}
          {condition && (
            <View
              style={[
                styles.conditionBadge,
                { backgroundColor: condition.color + "20" },
              ]}
            >
              <Text style={[styles.conditionText, { color: condition.color }]}>
                {condition.name}
              </Text>
            </View>
          )}
        </View>

        {showUserInfo && (
          <View style={styles.listUserInfo}>
            <View style={styles.userInfo}>
              <Ionicons
                name="person-circle"
                size={14}
                color={Colors.textSecondary}
              />
              <Text style={styles.userName}>{item.userName}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color={Colors.warning} />
                <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={12} color={Colors.textLight} />
              <Text style={styles.location} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return variant === "grid" ? <GridCard /> : <ListCard />;
};

const styles = StyleSheet.create({
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    height: 120,
  },
  imageContainer: {
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: 140,
  },
  listImage: {
    width: 100,
    height: 120,
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardContent: {
    padding: 12,
    flex: 1,
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
    flex: 1,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  conditionContainer: {
    marginBottom: 8,
  },
  conditionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: "500",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  userName: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  rating: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 10,
    color: Colors.textLight,
    marginLeft: 4,
    flex: 1,
  },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  listUserInfo: {
    gap: 4,
  },
});

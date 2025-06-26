// components/ItemCard.tsx
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
import { Colors } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export interface Item {
  id: number;
  title: string;
  description: string;
  value: number;
  img_item: string;
  category: {
    id: number;
    name: string;
  };
  owner: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.img_item || "https://via.placeholder.com/150" }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            style={styles.imageGradient}
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.name}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.ownerRow}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerInitial}>
                {item.owner.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.ownerName} numberOfLines={1}>
              {item.owner.name}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.valueContainer}>
              <Ionicons name="leaf" size={14} color={Colors.success} />
              <Text style={styles.co2Text}>{item.value} kg CO₂</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    ...Colors.cardShadow,
  },
  imageContainer: {
    position: "relative",
    height: CARD_WIDTH * 1.2,
    backgroundColor: Colors.surface,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    ...Colors.shadow,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  ownerInitial: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  ownerName: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  co2Text: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.success,
  },
});

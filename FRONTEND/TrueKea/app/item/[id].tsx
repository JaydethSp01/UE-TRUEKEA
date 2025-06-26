import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../constants/Colors";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { Item } from "../../components/ItemCard";

const { width, height } = Dimensions.get("window");

export default function ItemDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedItemForSwap, setSelectedItemForSwap] = useState<Item | null>(
    null
  );
  const [swapLoading, setSwapLoading] = useState(false);

  if (!id || id === "undefined" || id === "null") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>ID de producto inválido</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  useEffect(() => {
    if (user?.id) {
      loadMyItems();
    }
  }, [user?.id, id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const res = await api.get<Item>(`/items/${id}`);
      setItem(res.data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const loadMyItems = async () => {
    if (!user?.id) return;

    try {
      const res = await api.post<Item[]>("/items/list", { ownerId: user.id });
      setMyItems(
        res.data.filter(
          (item) => item.owner.id === user.id && item.id !== Number(id)
        )
      );
    } catch (error) {}
  };

  const handleRequestSwap = () => {
    if (myItems.length === 0) {
      Alert.alert(
        "Sin productos",
        "Necesitas publicar al menos un producto para poder hacer intercambios",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Publicar ahora",
            onPress: () => router.push("/add-item" as Href),
          },
        ]
      );
      return;
    }
    setShowSwapModal(true);
  };

  const handleConfirmSwap = async () => {
    if (!selectedItemForSwap || !item || !user?.id) return;

    setSwapLoading(true);
    try {
      await api.post("/swaps/request", {
        requesterId: user.id,
        respondentId: item.owner?.id,
        requestedItemId: item.id,
        offeredItemId: selectedItemForSwap.id,
      });

      Alert.alert(
        "¡Solicitud enviada!",
        "El dueño del producto recibirá tu propuesta de intercambio",
        [{ text: "OK", onPress: () => router.push("/swaps" as Href) }]
      );
      setShowSwapModal(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar la solicitud");
    } finally {
      setSwapLoading(false);
    }
  };

  const handleChat = () => {
    if (!item?.owner?.id) return;
    const chatRoute = `/chat/${item.owner.id}?itemId=${item.id}` as Href;
    router.push(chatRoute);
  };

  const handleProfilePress = () => {
    if (!item?.owner?.id) return;
    const profileRoute = `/profile/${item.owner.id}` as Href;
    router.push(profileRoute);
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

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró el producto</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isMyItem = user?.id && item?.owner?.id && item.owner.id === user.id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons
              name="share-social-outline"
              size={24}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.img_item || "https://via.placeholder.com/400" }}
            style={styles.image}
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {item.category?.name || "Sin categoría"}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.title || "Sin título"}</Text>

          <View style={styles.co2Container}>
            <Ionicons name="leaf" size={20} color={Colors.success} />
            <Text style={styles.co2Text}>
              Ahorro de CO₂: {item.value || 0} kg
            </Text>
          </View>

          {item.owner && (
            <TouchableOpacity
              style={styles.ownerCard}
              onPress={handleProfilePress}
            >
              <View style={styles.ownerAvatar}>
                <Text style={styles.ownerInitial}>
                  {item.owner.name?.charAt(0)?.toUpperCase() || "?"}
                </Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>
                  {item.owner.name || "Usuario desconocido"}
                </Text>
                <View style={styles.ownerStats}>
                  <Ionicons name="star" size={14} color={Colors.warning} />
                  <Text style={styles.ownerRating}>4.8</Text>
                  <Text style={styles.ownerDivider}>•</Text>
                  <Text style={styles.ownerSwaps}>23 intercambios</Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>
              {item.description || "Sin descripción disponible"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles</Text>
            <View style={styles.detailRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailText}>
                Publicado{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "Fecha desconocida"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailText}>Bogotá, Colombia</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {user && !isMyItem && item.owner && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.swapButton}
            onPress={handleRequestSwap}
          >
            <LinearGradient
              colors={Colors.gradientPrimary}
              style={styles.swapButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="swap-horizontal" size={20} color="white" />
              <Text style={styles.swapButtonText}>Proponer intercambio</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showSwapModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSwapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecciona un producto para intercambiar
              </Text>
              <TouchableOpacity onPress={() => setShowSwapModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {myItems.map((myItem) => (
                <TouchableOpacity
                  key={myItem.id}
                  style={[
                    styles.swapItem,
                    selectedItemForSwap?.id === myItem.id &&
                      styles.swapItemSelected,
                  ]}
                  onPress={() => setSelectedItemForSwap(myItem)}
                >
                  <Image
                    source={{
                      uri: myItem.img_item || "https://via.placeholder.com/60",
                    }}
                    style={styles.swapItemImage}
                  />
                  <View style={styles.swapItemInfo}>
                    <Text style={styles.swapItemTitle} numberOfLines={1}>
                      {myItem.title || "Sin título"}
                    </Text>
                    <Text style={styles.swapItemCategory}>
                      {myItem.category?.name || "Sin categoría"}
                    </Text>
                    <View style={styles.swapItemCo2}>
                      <Ionicons name="leaf" size={12} color={Colors.success} />
                      <Text style={styles.swapItemCo2Text}>
                        {myItem.value || 0} kg CO₂
                      </Text>
                    </View>
                  </View>
                  {selectedItemForSwap?.id === myItem.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowSwapModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirmButton,
                  !selectedItemForSwap && styles.modalConfirmButtonDisabled,
                ]}
                onPress={handleConfirmSwap}
                disabled={!selectedItemForSwap || swapLoading}
              >
                {swapLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalConfirmText}>
                    Confirmar intercambio
                  </Text>
                )}
              </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    ...Colors.shadow,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    ...Colors.shadow,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width,
    height: 300,
    backgroundColor: Colors.surface,
    resizeMode: "cover",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Colors.shadow,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  co2Container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.successLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 20,
    gap: 8,
  },
  co2Text: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.success,
  },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ownerInitial: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  ownerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ownerRating: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text,
  },
  ownerDivider: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  ownerSwaps: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
    ...Colors.shadow,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.primaryLight,
    borderRadius: 24,
    gap: 8,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  swapButton: {
    flex: 1,
  },
  swapButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  swapButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
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
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  modalScroll: {
    maxHeight: height * 0.5,
  },
  swapItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  swapItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  swapItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  swapItemInfo: {
    flex: 1,
  },
  swapItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  swapItemCategory: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  swapItemCo2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  swapItemCo2Text: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.success,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  modalConfirmButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
});

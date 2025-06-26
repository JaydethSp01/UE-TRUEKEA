// app/add-item.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../constants/Colors";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";

interface Category {
  id: number;
  name: string;
  co2: number;
}

export default function AddItemScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
    categoryId: "",
  });

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get<Category[]>("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu galería para continuar"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu cámara para continuar"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.title.trim()) {
      Alert.alert("Error", "El título es requerido");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "La descripción es requerida");
      return;
    }
    if (!formData.value || parseFloat(formData.value) <= 0) {
      Alert.alert("Error", "El valor de CO₂ debe ser mayor a 0");
      return;
    }
    if (!formData.categoryId) {
      Alert.alert("Error", "Debes seleccionar una categoría");
      return;
    }
    if (!image) {
      Alert.alert("Error", "Debes agregar una imagen del producto");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("value", formData.value);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("ownerId", user?.id?.toString() || "");

      if (Platform.OS === "web") {
        // En web convertimos la URI en Blob
        const resp = await fetch(image);
        const blob = await resp.blob();
        formDataToSend.append("image", blob, "item-image.jpg");
      } else {
        // En iOS/Android seguimos usando el objeto {uri, type, name}
        formDataToSend.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "item-image.jpg",
        } as any);
      }

      const response = await api.post("/items", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("¡Éxito!", "Tu producto ha sido publicado", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo publicar el producto. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Publicar Producto</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Image Section */}
          <View style={styles.imageSection}>
            {image ? (
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageContainer}
              >
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.changeImageText}>Cambiar imagen</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={Colors.textSecondary}
                />
                <Text style={styles.imagePlaceholderText}>
                  Agrega una foto del producto
                </Text>
                <View style={styles.imageButtons}>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={takePhoto}
                  >
                    <Ionicons name="camera" size={20} color={Colors.primary} />
                    <Text style={styles.imageButtonText}>Cámara</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.imageButton}
                    onPress={pickImage}
                  >
                    <Ionicons name="images" size={20} color={Colors.primary} />
                    <Text style={styles.imageButtonText}>Galería</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título del producto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Bicicleta de montaña"
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
                maxLength={50}
              />
              <Text style={styles.charCount}>{formData.title.length}/50</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el estado del producto, características especiales, etc."
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={4}
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {formData.description.length}/500
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        formData.categoryId === cat.id.toString() &&
                          styles.categoryChipActive,
                      ]}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          categoryId: cat.id.toString(),
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          formData.categoryId === cat.id.toString() &&
                            styles.categoryChipTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Valor estimado de CO₂ ahorrado (kg)
              </Text>
              <View style={styles.co2InputContainer}>
                <Ionicons name="leaf" size={20} color={Colors.success} />
                <TextInput
                  style={[styles.input, styles.co2Input]}
                  placeholder="0"
                  value={formData.value}
                  onChangeText={(text) =>
                    setFormData({ ...formData, value: text })
                  }
                  keyboardType="numeric"
                />
                <Text style={styles.co2Unit}>kg CO₂</Text>
              </View>
              <Text style={styles.helperText}>
                Estima el CO₂ que se ahorraría al reutilizar este producto
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={Colors.gradientPrimary}
              style={styles.submitButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="white" />
                  <Text style={styles.submitButtonText}>Publicar producto</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  imageSection: {
    margin: 20,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  changeImageText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  imagePlaceholder: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 20,
  },
  imageButtons: {
    flexDirection: "row",
    gap: 16,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    gap: 6,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
  },
  categoryList: {
    flexDirection: "row",
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.primary,
  },
  co2InputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  co2Input: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  co2Unit: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.success,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

// app/publish.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";
import { Categories } from "../constants/Categories";
import { TextInputField } from "../components/TextInputField";
import { ButtonPrimary } from "../components/ButtonPrimary";

const { width } = Dimensions.get("window");

export default function PublishScreen() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    estimatedValue: "",
    location: "",
    availableUntil: "",
    preferredExchange: "",
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const conditions = [
    { id: "new", label: "Nuevo", emoji: "✨" },
    { id: "like-new", label: "Como nuevo", emoji: "⭐" },
    { id: "good", label: "Buen estado", emoji: "👍" },
    { id: "fair", label: "Estado regular", emoji: "⚠️" },
    { id: "poor", label: "Necesita reparación", emoji: "🔧" },
  ];

  const mockImages = [
    "https://picsum.photos/300/200?random=1",
    "https://picsum.photos/300/200?random=2",
    "https://picsum.photos/300/200?random=3",
  ];

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  const handleImagePicker = () => {
    // Simular selección de imágenes
    Alert.alert("Agregar Fotos", "Selecciona una opción:", [
      { text: "Cámara", onPress: () => addMockImage() },
      { text: "Galería", onPress: () => addMockImage() },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const addMockImage = () => {
    if (selectedImages.length < 5) {
      const newImage = mockImages[selectedImages.length % mockImages.length];
      setSelectedImages([...selectedImages, newImage]);
    } else {
      Alert.alert("Límite alcanzado", "Máximo 5 fotos por objeto");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Error", "Agrega al menos una foto del objeto");
      return;
    }

    setLoading(true);

    // Simular publicación
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "¡Publicación exitosa!",
        "Tu objeto ha sido publicado correctamente",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 2000);
  };

  const updateFormData = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Publicar Objeto</Text>
        <Text style={styles.subtitle}>
          Comparte un objeto que ya no uses y encuentra algo que necesites
        </Text>
      </View>

      <View style={styles.content}>
        {/* Fotos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Fotos del objeto *</Text>
          <Text style={styles.sectionDescription}>
            Agrega hasta 5 fotos. La primera será la principal.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imagesContainer}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageItem}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.mainImageBadge}>
                      <Text style={styles.mainImageText}>Principal</Text>
                    </View>
                  )}
                </View>
              ))}

              {selectedImages.length < 5 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImagePicker}
                >
                  <Text style={styles.addImageText}>+</Text>
                  <Text style={styles.addImageLabel}>Agregar foto</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Información básica</Text>

          <TextInputField
            placeholder="Título del objeto *"
            value={formData.title}
            onChangeText={(text) => updateFormData("title", text)}
            style={styles.input}
          />

          <TextInputField
            placeholder="Descripción detallada *"
            value={formData.description}
            onChangeText={(text) => updateFormData("description", text)}
            multiline
            numberOfLines={4}
            style={{ ...styles.input, ...styles.textArea }}
          />

          <TextInputField
            placeholder="Valor estimado (opcional)"
            value={formData.estimatedValue}
            onChangeText={(text) => updateFormData("estimatedValue", text)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Categoría */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Categoría *</Text>

          <View style={styles.categoriesGrid}>
            {Categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  formData.category === category.id &&
                    styles.categoryItemSelected,
                ]}
                onPress={() => updateFormData("category", category.id)}
              >
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    formData.category === category.id &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estado del objeto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Estado del objeto</Text>

          <View style={styles.conditionsContainer}>
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionItem,
                  formData.condition === condition.id &&
                    styles.conditionItemSelected,
                ]}
                onPress={() => updateFormData("condition", condition.id)}
              >
                <Text style={styles.conditionEmoji}>{condition.emoji}</Text>
                <Text
                  style={[
                    styles.conditionText,
                    formData.condition === condition.id &&
                      styles.conditionTextSelected,
                  ]}
                >
                  {condition.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferencias de intercambio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🔄 Preferencias de intercambio
          </Text>

          <TextInputField
            placeholder="¿Qué te gustaría recibir a cambio?"
            value={formData.preferredExchange}
            onChangeText={(text) => updateFormData("preferredExchange", text)}
            multiline
            numberOfLines={3}
            style={{ ...styles.input, ...styles.textArea }}
          />

          <TextInputField
            placeholder="Ubicación para intercambio"
            value={formData.location}
            onChangeText={(text) => updateFormData("location", text)}
            style={styles.input}
          />
        </View>

        {/* Impacto ambiental */}
        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>🌱 Impacto Ambiental</Text>
          <Text style={styles.impactText}>
            Al publicar este objeto, contribuyes a reducir el desperdicio y
            fomentas la economía circular. ¡Cada intercambio cuenta!
          </Text>
          <View style={styles.impactStats}>
            <Text style={styles.impactStat}>• Reduces residuos</Text>
            <Text style={styles.impactStat}>• Ahorras recursos</Text>
            <Text style={styles.impactStat}>• Conectas con tu comunidad</Text>
          </View>
        </View>

        <ButtonPrimary
          title="Publicar Objeto"
          onPress={handlePublish}
          loading={loading}
          style={styles.publishButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  imagesContainer: {
    flexDirection: "row",
    paddingRight: 20,
  },
  imageItem: {
    marginRight: 12,
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },
  mainImageBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainImageText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: "500",
  },
  addImageButton: {
    width: 120,
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addImageText: {
    fontSize: 32,
    color: Colors.textLight,
    marginBottom: 4,
  },
  addImageLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryItem: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    width: (width - 64) / 3,
  },
  categoryItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "500",
    textAlign: "center",
  },
  categoryTextSelected: {
    color: Colors.background,
  },
  conditionsContainer: {
    gap: 8,
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionItemSelected: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.secondary,
  },
  conditionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  conditionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  conditionTextSelected: {
    color: Colors.secondary,
  },
  impactCard: {
    backgroundColor: Colors.successLight,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  impactText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  impactStats: {
    gap: 4,
  },
  impactStat: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: "500",
  },
  publishButton: {
    marginBottom: 20,
  },
});

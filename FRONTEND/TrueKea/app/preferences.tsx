// app/preferences.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";
import { Categories } from "../constants/Categories";
import { ButtonPrimary } from "../components/ButtonPrimary";

const { width } = Dimensions.get("window");

export default function PreferencesScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const locations = [
    "Bogotá Norte",
    "Bogotá Sur",
    "Bogotá Centro",
    "Bogotá Occidente",
    "Bogotá Oriente",
    "Soacha",
    "Chía",
    "Cajicá",
    "La Calera",
    "Zipaquirá",
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    // Guardar preferencias en el contexto o AsyncStorage
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryLight, Colors.background]}
        style={styles.header}
      >
        <Text style={styles.title}>¡Personaliza tu experiencia!</Text>
        <Text style={styles.subtitle}>
          Selecciona tus categorías favoritas y ubicación
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Tu ubicación</Text>
          <Text style={styles.sectionDescription}>
            Esto nos ayuda a mostrarte objetos cercanos
          </Text>

          <View style={styles.locationGrid}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location}
                style={[
                  styles.locationItem,
                  selectedLocation === location && styles.locationItemSelected,
                ]}
                onPress={() => setSelectedLocation(location)}
              >
                <Text
                  style={[
                    styles.locationText,
                    selectedLocation === location &&
                      styles.locationTextSelected,
                  ]}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Categorías de interés</Text>
          <Text style={styles.sectionDescription}>
            Selecciona las categorías que más te interesan
          </Text>

          <View style={styles.categoriesGrid}>
            {Categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(category.id) &&
                    styles.categoryItemSelected,
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category.id) &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen de tus preferencias</Text>
          <Text style={styles.summaryText}>
            📍 Ubicación: {selectedLocation || "No seleccionada"}
          </Text>
          <Text style={styles.summaryText}>
            🎯 Categorías: {selectedCategories.length} seleccionadas
          </Text>
        </View>

        <ButtonPrimary
          title="Continuar a TrueKea"
          onPress={handleContinue}
          style={styles.continueButton}
          disabled={!selectedLocation || selectedCategories.length === 0}
        />

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.skipText}>Omitir por ahora</Text>
        </TouchableOpacity>
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
    padding: 30,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  locationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  locationItem: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: (width - 60) / 2,
    alignItems: "center",
  },
  locationItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  locationTextSelected: {
    color: Colors.background,
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
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
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
  summary: {
    backgroundColor: Colors.primaryLight,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  continueButton: {
    marginBottom: 16,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: "underline",
  },
});

// app/onboarding.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { Colors } from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export default function OnboardingScreen() {
  const { user, categoriesIfNoPrefs } = useAuth();
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    await api.setUserPreferencesBulk(user!.id, selected);
    router.replace('/' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elige tus categorías</Text>
      <ScrollView>
        {categoriesIfNoPrefs.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.chip, selected.includes(c.id) && styles.chipActive]}
            onPress={() => toggle(c.id)}
          >
            <Text
              style={[
                styles.chipText,
                selected.includes(c.id) && styles.chipTextActive,
              ]}
            >
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ButtonPrimary title="Continuar" onPress={submit} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  chip: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.text },
  chipTextActive: { color: "white" },
  button: { marginTop: 20 },
});

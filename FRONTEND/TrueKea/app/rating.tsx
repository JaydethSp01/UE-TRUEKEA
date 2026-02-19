// app/rating.tsx – Conectado al backend POST /ratings
import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { Colors } from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export default function Rating() {
  const params = useLocalSearchParams<{ swapId?: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const swapId = params.swapId ? Number(params.swapId) : null;

  const submit = async () => {
    if (rating === 0)
      return Alert.alert("Error", "Selecciona una calificación");
    if (!user?.id) return Alert.alert("Error", "Debes iniciar sesión");
    if (!swapId) return Alert.alert("Error", "No se encontró el intercambio");
    try {
      setSending(true);
      await api.rateSwap({
        swapId,
        raterId: user.id,
        score: rating,
        comment: comment || undefined,
      });
      Alert.alert("Gracias", "Calificación enviada", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo enviar la calificación");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: "Calificar trueque" }} />
      <View style={s.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <FontAwesome
            key={n}
            name={n <= rating ? "star" : "star-o"}
            size={32}
            color={Colors.accent}
            onPress={() => setRating(n)}
            style={{ marginHorizontal: 4 }}
          />
        ))}
      </View>
      <TextInput
        style={s.input}
        placeholder="Comentario (opcional)"
        placeholderTextColor={Colors.textSecondary}
        multiline
        maxLength={250}
        value={comment}
        onChangeText={setComment}
      />
      <ButtonPrimary
        title={sending ? "Enviando…" : "Enviar"}
        onPress={submit}
        disabled={sending}
      />
      {sending && (
        <View style={s.loader}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  stars: { flexDirection: "row", justifyContent: "center", marginVertical: 24 },
  loader: { marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    height: 120,
    marginBottom: 24,
  },
});

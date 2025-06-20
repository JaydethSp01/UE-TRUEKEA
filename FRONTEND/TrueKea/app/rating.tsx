// app/rating.tsx
import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Alert } from "react-native";
import { Stack } from "expo-router";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { Colors } from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

export default function Rating() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const submit = () => {
    if (rating === 0)
      return Alert.alert("Error", "Selecciona una calificación");
    Alert.alert("Gracias", "Calificación enviada");
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
      <ButtonPrimary title="Enviar" onPress={submit} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  stars: { flexDirection: "row", justifyContent: "center", marginVertical: 24 },
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

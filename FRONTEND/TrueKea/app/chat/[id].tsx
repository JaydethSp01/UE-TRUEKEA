// app/chat/[id].tsx
import React, { useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Text,
} from "react-native";
import { Stack, useSearchParams } from "expo-router";
import { Colors } from "../../constants/Colors";

type Msg = { id: string; sender: "me" | "them"; text: string };

export default function Chat() {
  const { id } = useSearchParams<{ id: string }>();
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m1", sender: "them", text: "Hola, ¿aún disponible?" },
  ]);
  const [text, setText] = useState("");
  const send = () => {
    if (!text) return;
    setMsgs((m) => [...m, { id: Date.now().toString(), sender: "me", text }]);
    setText("");
  };
  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: `Chat ${id}` }} />
      <FlatList
        data={msgs}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={[s.bubble, item.sender === "me" ? s.right : s.left]}>
            <Text style={s.text}>{item.text}</Text>
          </View>
        )}
      />
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          value={text}
          onChangeText={setText}
          placeholder="Escribe..."
          placeholderTextColor={Colors.textSecondary}
          maxLength={500}
        />
        <Button title="Enviar" onPress={send} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  bubble: { maxWidth: "75%", padding: 12, borderRadius: 8, margin: 8 },
  left: { backgroundColor: Colors.surface, alignSelf: "flex-start" },
  right: { backgroundColor: Colors.primaryLight, alignSelf: "flex-end" },
  text: { color: Colors.text },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
});

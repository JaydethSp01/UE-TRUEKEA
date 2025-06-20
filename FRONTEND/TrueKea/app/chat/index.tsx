// app/chat/index.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";

const chats = [{ id: "c1", user: "user2", last: "¿Sigues interesado?" }];

export default function ChatList() {
  const router = useRouter();
  return (
    <View style={s.container}>
      <Stack.Screen options={{ title: "Chats" }} />
      <FlatList
        data={chats}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.item}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Text style={s.user}>{item.user}</Text>
            <Text style={s.last}>{item.last}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={s.sep} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  item: { padding: 16 },
  user: { fontSize: 18, fontWeight: "500", color: Colors.text },
  last: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  sep: { height: 1, backgroundColor: Colors.divider },
});

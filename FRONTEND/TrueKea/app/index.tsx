import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import UserHomeScreen from "../components/UserHomeScreen";
import { Colors } from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../utils/navigation";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (segments) {
      setIsReady(true);
    }
  }, [segments]);

  useEffect(() => {
    if (isReady && !user) {
      router.replace(routes.login);
    }
  }, [user, isReady]);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <UserHomeScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});

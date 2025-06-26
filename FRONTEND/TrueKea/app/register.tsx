import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";
import { TextInputField } from "../components/TextInputField";
import { ButtonPrimary } from "../components/ButtonPrimary";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      await register(name.trim(), email.trim(), password);
      Alert.alert("¡Listo!", "Cuenta creada con éxito", [
        { text: "Ir a login", onPress: () => router.replace("/login") },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo crear la cuenta");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={Colors.gradientSecondary} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>¡Únete a TrueKea!</Text>
            <Text style={styles.subtitle}>
              Comienza tu viaje hacia un consumo más sostenible
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Crear Cuenta</Text>
            <TextInputField
              placeholder="Nombre completo"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInputField
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInputField
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TextInputField
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />
            <ButtonPrimary
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={false}
              style={styles.registerButton}
            />
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.back()}
            >
              <Text style={styles.linkText}>
                ¿Ya tienes cuenta?
                <Text style={styles.linkTextBold}> Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.background,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryLight,
    textAlign: "center",
    opacity: 0.9,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    ...Colors.cardShadow,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    marginBottom: 20,
    marginTop: 10,
  },
  linkContainer: {
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  linkTextBold: {
    fontWeight: "600",
    color: Colors.secondary,
  },
});

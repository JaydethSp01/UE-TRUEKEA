// app/login.tsx
import React, { useState, useEffect } from "react";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.preferences?.length === 0) {
        router.replace("/onboarding");
      } else {
        router.replace("/");
      }
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      let msg = "Error desconocido";
      if (error.response) {
        switch (error.response.status) {
          case 401:
            msg = "Credenciales inválidas";
            break;
          case 404:
            msg = "Usuario no encontrado";
            break;
          case 500:
            msg = "Error del servidor";
            break;
          default:
            msg = error.response.data?.message || msg;
        }
      } else if (error.request) {
        msg = "Error de conexión. Verifica tu internet";
      } else {
        msg = error.message || msg;
      }
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
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
      <LinearGradient colors={Colors.gradientPrimary} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>TrueKea</Text>
            <Text style={styles.subtitle}>
              Intercambia objetos de forma sostenible
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>
            <TextInputField
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              editable={!loading}
            />
            <TextInputField
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              editable={!loading}
            />
            <ButtonPrimary
              title="Ingresar"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
            <TouchableOpacity
              style={[styles.linkContainer, loading && styles.disabled]}
              onPress={() => !loading && router.push("/register")}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                ¿No tienes cuenta?
                <Text style={styles.linkTextBold}> Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🌱 Contribuye al medio ambiente intercambiando objetos
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.background,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primaryLight,
    textAlign: "center",
    opacity: 0.9,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    ...Colors.cardShadow,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 30,
  },
  input: { marginBottom: 20 },
  loginButton: { marginBottom: 20 },
  linkContainer: { alignItems: "center" },
  linkText: { fontSize: 14, color: Colors.textSecondary },
  linkTextBold: { fontWeight: "600", color: Colors.primary },
  footer: { alignItems: "center" },
  footerText: {
    fontSize: 14,
    color: Colors.primaryLight,
    textAlign: "center",
    opacity: 0.8,
  },
  disabled: { opacity: 0.5 },
});

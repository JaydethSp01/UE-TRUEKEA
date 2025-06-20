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
      router.replace("/");
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

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
            />

            <TextInputField
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <ButtonPrimary
              title="Ingresar"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.push("/register")}
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
    marginBottom: 40,
  },
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
  input: {
    marginBottom: 20,
  },
  loginButton: {
    marginBottom: 20,
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
    color: Colors.primary,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.primaryLight,
    textAlign: "center",
    opacity: 0.8,
  },
});

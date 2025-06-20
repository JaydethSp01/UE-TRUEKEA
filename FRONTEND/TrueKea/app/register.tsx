// app/register.tsx
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
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";
import { TextInputField } from "../components/TextInputField";
import { ButtonPrimary } from "../components/ButtonPrimary";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
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

    setLoading(true);
    try {
      await register(email, password);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

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
              loading={loading}
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

          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>¿Por qué TrueKea?</Text>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>♻️</Text>
              <Text style={styles.benefitText}>
                Contribuye al medio ambiente
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>💰</Text>
              <Text style={styles.benefitText}>
                Ahorra dinero intercambiando
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>🤝</Text>
              <Text style={styles.benefitText}>Conecta con tu comunidad</Text>
            </View>
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
  benefits: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    opacity: 0.95,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
});

// app/profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../constants/Colors";
import { TextInputField } from "../components/TextInputField";
import { ButtonPrimary } from "../components/ButtonPrimary";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+57 300 123 4567",
    location: "Bogotá Norte",
    bio: "Me encanta intercambiar objetos y contribuir al medio ambiente. Siempre busco darle una segunda vida a las cosas.",
    rating: 4.8,
    completedExchanges: 23,
    co2Saved: 145.5,
    joinDate: "2024-01-15",
  });

  const [notifications, setNotifications] = useState({
    newMessages: true,
    exchangeUpdates: true,
    recommendations: false,
    marketing: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Éxito", "Perfil actualizado correctamente");
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", onPress: logout, style: "destructive" },
    ]);
  };

  // Helper para el estilo de inputs
  const inputStyle = isEditing
    ? styles.input
    : { ...styles.input, ...styles.inputDisabled };

  return (
    <ScrollView style={styles.container}>
      {/* Header con foto de perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarText}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{profile.name}</Text>
        <Text style={styles.userEmail}>{profile.email}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.completedExchanges}</Text>
            <Text style={styles.statLabel}>Intercambios</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>⭐ {profile.rating}</Text>
            <Text style={styles.statLabel}>Calificación</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.co2Saved}kg</Text>
            <Text style={styles.statLabel}>CO₂ Ahorrado</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Información Personal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? "❌" : "✏️"}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInputField
            placeholder="Nombre completo"
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            editable={isEditing}
            style={inputStyle}
          />

          <TextInputField
            placeholder="Teléfono"
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            editable={isEditing}
            keyboardType="phone-pad"
            style={inputStyle}
          />

          <TextInputField
            placeholder="Ubicación"
            value={profile.location}
            onChangeText={(text) => setProfile({ ...profile, location: text })}
            editable={isEditing}
            style={inputStyle}
          />

          <TextInputField
            placeholder="Cuéntanos sobre ti..."
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            editable={isEditing}
            multiline
            numberOfLines={4}
            style={
              isEditing
                ? styles.bioCombined
                : { ...styles.bioCombined, ...styles.inputDisabled }
            }
          />

          {isEditing && (
            <ButtonPrimary
              title="Guardar Cambios"
              onPress={handleSave}
              style={styles.saveButton}
            />
          )}
        </View>

        {/* Configuración de Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>

          {Object.entries(notifications).map(([key, value]) => (
            <View key={key} style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>
                {key === "newMessages"
                  ? "Nuevos mensajes"
                  : key === "exchangeUpdates"
                  ? "Actualizaciones de intercambio"
                  : key === "recommendations"
                  ? "Recomendaciones"
                  : "Marketing y promociones"}
              </Text>
              <Switch
                value={value}
                onValueChange={(val) =>
                  setNotifications({ ...notifications, [key]: val })
                }
              />
            </View>
          ))}
        </View>

        {/* Botón de Cerrar Sesión */}
        <View style={styles.section}>
          <ButtonPrimary
            title="Cerrar sesión"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.primaryLight,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.accent,
    borderRadius: 20,
    padding: 6,
  },
  editAvatarText: {
    fontSize: 16,
    color: Colors.surface,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: 10,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 18,
    color: Colors.accentDark,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: Colors.card,
    color: Colors.text,
  },
  bioCombined: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: Colors.card,
    color: Colors.text,
    height: 100,
    textAlignVertical: "top",
  },
  inputDisabled: {
    backgroundColor: Colors.surface,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: Colors.secondary,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  notificationLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    backgroundColor: Colors.destructive,
  },
});

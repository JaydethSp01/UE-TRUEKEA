import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TEST_EMAIL = "testtruekea.com";
const TEST_PASS = "password123";
const USER_KEY = "@truekea_user";

const initialAuthContext: AuthContextType = {
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem(USER_KEY);
        if (json) {
          const parsed = JSON.parse(json) as User;
          setUser(parsed);
        }
      } catch (e) {
        console.error("Error loading user from storage", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    if (email !== TEST_EMAIL || password !== TEST_PASS) {
      return Alert.alert("Error", "Credenciales inválidas");
    }
    const simulatedUser: User = { email };
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(simulatedUser));
      setUser(simulatedUser);
      router.replace("/preferences");
    } catch (e) {
      console.error("Error on login", e);
      Alert.alert("Error", "No se pudo iniciar sesión");
    }
  };

  const register = async (email: string, password: string) => {
    // Registro deshabilitado para este demo
    return Alert.alert(
      "Registro",
      "Registro no disponible en esta versión de prueba"
    );
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      setUser(null);
      router.replace("/login");
    } catch (e) {
      console.error("Error on logout", e);
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

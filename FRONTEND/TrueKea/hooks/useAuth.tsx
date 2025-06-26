import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

type AuthResponse = {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    roleId: number;
    statusUser: string;
    preferences: number[];
  };
  categoriesIfNoPrefs: { id: number; name: string }[];
  initialItems: {
    id: number;
    title: string;
    categoryId: number;
    co2Unit: number;
    co2Total: number;
  }[];
  initialCO2: {
    totalCO2: number;
    treesNeeded: number;
    carKilometers: number;
    lightBulbHours: number;
    flightMinutes: number;
  };
};

type AuthContextType = {
  user: AuthResponse["user"] | null;
  items: AuthResponse["initialItems"];
  co2: AuthResponse["initialCO2"];
  categoriesIfNoPrefs: AuthResponse["categoriesIfNoPrefs"];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [items, setItems] = useState<AuthResponse["initialItems"]>([]);
  const [co2, setCO2] = useState<AuthResponse["initialCO2"]>({
    totalCO2: 0,
    treesNeeded: 0,
    carKilometers: 0,
    lightBulbHours: 0,
    flightMinutes: 0,
  });
  const [categoriesIfNoPrefs, setCategoriesIfNoPrefs] = useState<
    AuthResponse["categoriesIfNoPrefs"]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          try {
            const res = await api.post<AuthResponse>("/auth/refresh");
            await AsyncStorage.setItem("token", res.data.token);
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.token}`;
            setUser(res.data.user);
            setItems(res.data.initialItems);
            setCO2(res.data.initialCO2);
            setCategoriesIfNoPrefs(res.data.categoriesIfNoPrefs);
          } catch {
            await AsyncStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
          }
        }
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (!response.data || !response.data.token) {
      throw new Error("Respuesta inválida del servidor");
    }
    await AsyncStorage.setItem("token", response.data.token);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser(response.data.user);
    setItems(response.data.initialItems || []);
    setCO2(
      response.data.initialCO2 || {
        totalCO2: 0,
        treesNeeded: 0,
        carKilometers: 0,
        lightBulbHours: 0,
        flightMinutes: 0,
      }
    );
    setCategoriesIfNoPrefs(response.data.categoriesIfNoPrefs || []);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/users", { name, email, password, roleId: 2 });
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setItems([]);
    setCO2({
      totalCO2: 0,
      treesNeeded: 0,
      carKilometers: 0,
      lightBulbHours: 0,
      flightMinutes: 0,
    });
    setCategoriesIfNoPrefs([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        items,
        co2,
        categoriesIfNoPrefs,
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { AuthResponse } from "../services/api";

type AuthContextType = {
  user: AuthResponse["user"] | null;
  items: AuthResponse["initialItems"];
  co2: AuthResponse["initialCO2"];
  categoriesIfNoPrefs: AuthResponse["categoriesIfNoPrefs"];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  resetInactivityTimer: () => void;
};

const AuthContext = createContext<AuthContextType>({} as any);

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

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
  const [inactivityTimer, setInactivityTimer] = useState<number | null>(null);
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    const timer = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
    setInactivityTimer(timer);
  };

  const initializeAuth = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        const data = await api.refreshAuth(refreshToken);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);
        setUser(data.user);
        setItems(data.initialItems || []);
        setCO2(
          data.initialCO2 || {
            totalCO2: 0,
            treesNeeded: 0,
            carKilometers: 0,
            lightBulbHours: 0,
            flightMinutes: 0,
          }
        );
        setCategoriesIfNoPrefs(data.categoriesIfNoPrefs || []);
        resetInactivityTimer();
      }
    } catch {
      await AsyncStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setItems(data.initialItems || []);
    setCO2(
      data.initialCO2 || {
        totalCO2: 0,
        treesNeeded: 0,
        carKilometers: 0,
        lightBulbHours: 0,
        flightMinutes: 0,
      }
    );
    setCategoriesIfNoPrefs(data.categoriesIfNoPrefs || []);
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("refreshToken", data.refreshToken);
    resetInactivityTimer();
  };

  const register = async (name: string, email: string, password: string) => {
    await api.register({ name, email, password });
  };

  const logout = async () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    await AsyncStorage.clear();
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
        resetInactivityTimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

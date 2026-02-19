import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export interface CO2Data {
  totalSaved: number;
  itemsSaved: number;
  ranking: number;
  monthlyProgress: number;
  co2ByCategory: {
    category: string;
    amount: number;
    color: string;
  }[];
}

const DEFAULT_CO2: CO2Data = {
  totalSaved: 0,
  itemsSaved: 0,
  ranking: 0,
  monthlyProgress: 0,
  co2ByCategory: [],
};

const CATEGORY_COLORS: Record<string, string> = {
  Electrónica: "#4A90E2",
  Ropa: "#50C878",
  Libros: "#FF6B6B",
  Deportes: "#FFA726",
  Hogar: "#AB47BC",
  Juguetes: "#26A69A",
  Música: "#EF5350",
  Arte: "#66BB6A",
  Jardín: "#42A5F5",
};

export function useCO2(userId: number | null) {
  const [co2Data, setCO2Data] = useState<CO2Data>(DEFAULT_CO2);
  const [loading, setLoading] = useState(Boolean(userId));

  const load = useCallback(async () => {
    if (!userId) {
      setCO2Data(DEFAULT_CO2);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const stats = await api.getUserStatsByUserId(userId);
      const totalSaved = Number(stats.totalCO2Saved) || 0;
      const itemsSaved = Number(stats.totalItems) || 0;
      const currentDate = new Date();
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      const monthlyProgress = Math.min(
        (currentDate.getDate() / daysInMonth) * 100,
        100
      );
      setCO2Data({
        totalSaved,
        itemsSaved,
        ranking: 0,
        monthlyProgress,
        co2ByCategory: [],
      });
    } catch {
      setCO2Data(DEFAULT_CO2);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const getCO2Impact = useCallback((co2Amount: number) => {
    const treesEquivalent = Math.round(co2Amount / 22);
    const kmDriving = Math.round(co2Amount * 4.6);
    const phonesCharged = Math.round(co2Amount * 121);
    return { trees: treesEquivalent, kmDriving, phonesCharged };
  }, []);

  return {
    co2Data,
    loading,
    refresh: load,
    getCO2Impact,
  };
}

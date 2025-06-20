import { useState, useCallback } from "react";

interface CO2Data {
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

const mockCO2Data: CO2Data = {
  totalSaved: 450,
  itemsSaved: 15,
  ranking: 23,
  monthlyProgress: 75,
  co2ByCategory: [
    { category: "Electrónicos", amount: 180, color: "#4A90E2" },
    { category: "Ropa", amount: 120, color: "#50C878" },
    { category: "Libros", amount: 80, color: "#FF6B6B" },
    { category: "Deportes", amount: 70, color: "#FFA726" },
  ],
};

export function useCO2() {
  const [co2Data, setCO2Data] = useState<CO2Data>(mockCO2Data);
  const [loading, setLoading] = useState(false);

  const calculateCO2Saved = useCallback(
    (category: string, estimatedValue: number) => {
      // Fórmula simplificada para calcular CO2 ahorrado basado en categoría y valor
      const co2PerCategory: Record<string, number> = {
        electronics: 0.8, // kg CO2 por cada $1000 COP
        clothing: 0.6,
        books: 0.3,
        sports: 0.5,
        home: 0.4,
        toys: 0.4,
        other: 0.3,
      };

      const multiplier = co2PerCategory[category] || 0.3;
      return Math.round((estimatedValue / 1000) * multiplier);
    },
    []
  );

  const addCO2Saved = useCallback((category: string, amount: number) => {
    setCO2Data((prev) => ({
      ...prev,
      totalSaved: prev.totalSaved + amount,
      itemsSaved: prev.itemsSaved + 1,
      co2ByCategory: prev.co2ByCategory.map((cat) =>
        cat.category.toLowerCase() === category.toLowerCase()
          ? { ...cat, amount: cat.amount + amount }
          : cat
      ),
    }));
  }, []);

  const getCO2Impact = useCallback((co2Amount: number) => {
    // Convertir kg de CO2 a equivalencias comprensibles
    const treesEquivalent = Math.round(co2Amount / 22); // 1 árbol absorbe ~22kg CO2/año
    const kmDriving = Math.round(co2Amount * 4.6); // 1kg CO2 = ~4.6km conduciendo
    const phonesCharged = Math.round(co2Amount * 121); // 1kg CO2 = ~121 cargas de teléfono

    return {
      trees: treesEquivalent,
      kmDriving,
      phonesCharged,
    };
  }, []);

  const updateMonthlyProgress = useCallback(() => {
    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const currentDay = currentDate.getDate();
    const progressPercentage = (currentDay / daysInMonth) * 100;

    setCO2Data((prev) => ({
      ...prev,
      monthlyProgress: Math.min(progressPercentage, 100),
    }));
  }, []);

  return {
    co2Data,
    loading,
    calculateCO2Saved,
    addCO2Saved,
    getCO2Impact,
    updateMonthlyProgress,
  };
}

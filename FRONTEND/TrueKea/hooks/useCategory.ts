import { useEffect, useState } from "react";
import api from "../services/api";

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  co2Factor: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/categories");
        const mapped = res.data.map((cat: any, index: number) => ({
          id: cat.id,
          name: cat.name,
          icon: "cube", // Puedes mapear por nombre si deseas íconos diferentes
          color: getRandomColor(index),
          co2Factor: cat.co2,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error("Error fetching categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { categories, loading };
}

const colors = [
  "#8B5CF6",
  "#3B82F6",
  "#F59E0B",
  "#EC4899",
  "#10B981",
  "#F97316",
  "#EF4444",
  "#6366F1",
  "#22C55E",
  "#6B7280",
];

function getRandomColor(index: number): string {
  return colors[index % colors.length];
}

import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export interface ApiItem {
  id: number;
  title: string;
  description?: string;
  categoryId?: number;
  owner?: { id: number; name: string };
  img_item?: string;
  value?: number;
  status?: string;
  co2Total?: number;
  [key: string]: unknown;
}

export function useItems(filters?: {
  categoryIds?: number[];
  ownerId?: number;
  nameRegex?: string;
}) {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.filterItems(
        filters
          ? {
              categoryIds: filters.categoryIds,
              ownerId: filters.ownerId,
              nameRegex: filters.nameRegex,
            }
          : {}
      );
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar ítems");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters?.categoryIds?.join(","),
    filters?.ownerId,
    filters?.nameRegex,
  ]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const getItemById = useCallback(
    (id: number | string) => {
      const numId = typeof id === "string" ? parseInt(id, 10) : id;
      return items.find((item) => item.id === numId) ?? null;
    },
    [items]
  );

  const getItemsByUser = useCallback(
    (userId: number | string) => {
      const id = typeof userId === "string" ? parseInt(userId, 10) : userId;
      return items.filter((item) => item.owner?.id === id);
    },
    [items]
  );

  return {
    items,
    loading,
    error,
    refresh: loadItems,
    getItemById,
    getItemsByUser,
  };
}

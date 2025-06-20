import { useState, useEffect, useCallback } from "react";

import { Item, ItemRequest } from "../types/Item";

const mockItems: Item[] = [
  {
    id: "1",
    title: "iPhone 13 Pro",
    description:
      "Excelente estado, incluye cargador y caja original. Perfecto para intercambiar por laptop.",
    category: "electronics",
    condition: "like-new",
    images: ["https://picsum.photos/400/300?random=1"],
    userId: "user1",
    userName: "María González",
    userAvatar: "https://picsum.photos/100/100?random=10",
    location: "Bogotá, Colombia",
    estimatedValue: 2500000,
    co2Saved: 45,
    isAvailable: true,
    createdAt: "2024-01-15T10:30:00Z",
    tags: ["smartphone", "apple", "tecnología"],
    interestedUsers: ["user2", "user3"],
  },
  {
    id: "2",
    title: "Bicicleta de Montaña Trek",
    description:
      "Bicicleta en excelente estado, ideal para aventuras. Poco uso, siempre guardada en garage.",
    category: "sports",
    condition: "good",
    images: ["https://picsum.photos/400/300?random=2"],
    userId: "user2",
    userName: "Carlos Rodríguez",
    userAvatar: "https://picsum.photos/100/100?random=11",
    location: "Medellín, Colombia",
    estimatedValue: 1200000,
    co2Saved: 120,
    isAvailable: true,
    createdAt: "2024-01-14T15:45:00Z",
    tags: ["bicicleta", "montaña", "deporte"],
    interestedUsers: ["user1"],
  },
  {
    id: "3",
    title: "Juego de Libros de Programación",
    description:
      "Colección completa de libros de desarrollo web y móvil. Perfecto para estudiantes.",
    category: "books",
    condition: "good",
    images: ["https://picsum.photos/400/300?random=3"],
    userId: "user3",
    userName: "Ana Silva",
    userAvatar: "https://picsum.photos/100/100?random=12",
    location: "Cali, Colombia",
    estimatedValue: 300000,
    co2Saved: 25,
    isAvailable: true,
    createdAt: "2024-01-13T09:20:00Z",
    tags: ["libros", "programación", "educación"],
    interestedUsers: [],
  },
];

const mockRequests: ItemRequest[] = [
  {
    id: "1",
    itemId: "1",
    requesterId: "user2",
    requesterName: "Carlos Rodríguez",
    requesterAvatar: "https://picsum.photos/100/100?random=11",
    message:
      "Hola! Me interesa mucho tu iPhone. Tengo una laptop HP que podría interesarte.",
    status: "pending",
    createdAt: "2024-01-16T14:30:00Z",
    offeredItems: ["laptop-hp-pavilion"],
  },
  {
    id: "2",
    itemId: "2",
    requesterId: "user1",
    requesterName: "María González",
    requesterAvatar: "https://picsum.photos/100/100?random=10",
    message:
      "Me encanta tu bicicleta! Tengo unos auriculares Sony que están nuevos.",
    status: "accepted",
    createdAt: "2024-01-15T11:15:00Z",
    offeredItems: ["auriculares-sony"],
  },
];

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setItems(mockItems);
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getItemById = useCallback(
    (id: string) => {
      return items.find((item) => item.id === id);
    },
    [items]
  );

  const getItemsByUser = useCallback(
    (userId: string) => {
      return items.filter((item) => item.userId === userId);
    },
    [items]
  );

  const searchItems = useCallback(
    (query: string, category?: string) => {
      return items.filter((item) => {
        const matchesQuery =
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          );

        const matchesCategory = !category || item.category === category;

        return matchesQuery && matchesCategory && item.isAvailable;
      });
    },
    [items]
  );

  const addItem = useCallback((newItem: Omit<Item, "id" | "createdAt">) => {
    const item: Item = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addRequest = useCallback(
    (request: Omit<ItemRequest, "id" | "createdAt">) => {
      const newRequest: ItemRequest = {
        ...request,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    },
    []
  );

  const updateRequestStatus = useCallback(
    (id: string, status: ItemRequest["status"]) => {
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    },
    []
  );

  const getRequestsByItem = useCallback(
    (itemId: string) => {
      return requests.filter((req) => req.itemId === itemId);
    },
    [requests]
  );

  const getRequestsByUser = useCallback(
    (userId: string) => {
      return requests.filter((req) => req.requesterId === userId);
    },
    [requests]
  );

  return {
    items,
    requests,
    loading,
    error,
    getItemById,
    getItemsByUser,
    searchItems,
    addItem,
    updateItem,
    deleteItem,
    addRequest,
    updateRequestStatus,
    getRequestsByItem,
    getRequestsByUser,
  };
}

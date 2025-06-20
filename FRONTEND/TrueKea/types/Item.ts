export interface ItemRequest {
  id: string;
  itemId: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
  offeredItems?: string[];
}
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  images: string[];
  userId: string;
  userName: string;
  userAvatar: string;
  location: string;
  estimatedValue: number;
  co2Saved: number;
  isAvailable: boolean;
  createdAt: string;
  tags: string[];
  interestedUsers?: string[];
  userRating?: number; // Valoración del usuario (opcional)
  status?: "available" | "pending" | "exchanged"; // Estado del ítem
}

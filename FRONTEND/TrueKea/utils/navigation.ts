// utils/navigation.ts
import { Href } from "expo-router";

export const routes = {
  // Auth routes
  home: "/" as Href,
  login: "/login" as Href,
  register: "/register" as Href,
  onboarding: "/onboarding" as Href,

  // Main routes
  addItem: "/AddItem" as Href,
  profile: "/profile" as Href,
  admin: "/admin" as Href,
  requests: "/requests" as Href,
  rating: "/rating" as Href,
  search: "/search" as Href,
  notifications: "/notifications" as Href,

  // Dynamic routes
  item: (id: number | string) => `/item/${id}` as Href,
  chat: (id: number | string) => `/chat/${id}` as Href,
  profileUser: (userId: number | string) => `/profile/${userId}` as Href,
};

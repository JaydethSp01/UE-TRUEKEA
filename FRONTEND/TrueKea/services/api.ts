// services/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "../constants/env";

class ApiService {
  private api: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor para agregar token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para manejar errores y refresh token
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Redirigir a login
            await AsyncStorage.clear();
            // navigation.navigate('Login');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.performRefresh();
    }

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.api.post("/auth/refresh", { refreshToken });
    const { token, refreshToken: newRefreshToken } = response.data;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", newRefreshToken);

    return token;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password });
    const { token, refreshToken } = response.data;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    return response.data;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    roleId?: number;
  }) {
    const response = await this.api.post("/users", {
      ...data,
      roleId: data.roleId || 2, // Default to user role
    });
    return response.data;
  }

  // Items endpoints
  async createItem(data: FormData) {
    const response = await this.api.post("/items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async getItems() {
    const response = await this.api.get("/items");
    return response.data;
  }

  async getItem(id: string | number) {
    const response = await this.api.get(`/items/${id}`);
    return response.data;
  }

  async updateItem(id: string | number, data: any) {
    const response = await this.api.put(`/items/${id}`, data);
    return response.data;
  }

  async deleteItem(id: string | number) {
    const response = await this.api.delete(`/items/${id}`);
    return response.data;
  }

  async filterItems(filters: {
    categoryIds?: number[];
    minCo2?: number;
    maxCo2?: number;
    nameRegex?: string;
    ownerId?: number;
  }) {
    const response = await this.api.post("/items/list", filters);
    return response.data;
  }

  // Swaps endpoints
  async requestSwap(data: {
    requesterId: number;
    respondentId: number;
    requestedItemId: number;
    offeredItemId: number;
  }) {
    const response = await this.api.post("/swaps/request", data);
    return response.data;
  }

  async respondToSwap(data: {
    id: string;
    requesterId: number;
    respondentId: number;
    requestedItemId: number;
    offeredItemId: number;
    status: "accepted" | "rejected";
  }) {
    const response = await this.api.post("/swaps/respond", data);
    return response.data;
  }

  async completeSwap(data: { requestedItemId: number }) {
    const response = await this.api.post("/swaps/complete", data);
    return response.data;
  }

  // Messages endpoints
  async sendMessage(data: {
    senderId: number;
    receiverId: number;
    content: string;
  }) {
    const response = await this.api.post("/messages", data);
    return response.data;
  }

  // Ratings endpoints
  async rateSwap(data: {
    swapId: number;
    raterId: number;
    score: number;
    comment?: string;
  }) {
    const response = await this.api.post("/ratings", data);
    return response.data;
  }

  // Categories endpoints
  async getCategories() {
    const response = await this.api.get("/categories");
    return response.data;
  }

  // User endpoints
  async getUserStats() {
    const response = await this.api.get("/users/stats");
    return response.data;
  }

  async updateProfile(
    data: Partial<{
      name: string;
      email: string;
      password: string;
    }>
  ) {
    const response = await this.api.put("/users", data);
    return response.data;
  }

  // Generic methods
  get<T = any>(url: string) {
    return this.api.get<T>(url);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.api.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any) {
    return this.api.put<T>(url, data);
  }

  delete<T = any>(url: string) {
    return this.api.delete<T>(url);
  }
}

export default new ApiService();

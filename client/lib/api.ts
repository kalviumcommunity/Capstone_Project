// API service utilities for backend communication

const API_BASE_URL = "/api";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Network error");
    }
  }

  // Authentication methods
  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<ApiResponse> {
    const response = await this.makeRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse> {
    return this.makeRequest("/auth/profile");
  }

  async trackMood(
    mood: string,
    intensity: number,
    notes?: string,
  ): Promise<ApiResponse> {
    return this.makeRequest("/auth/mood", {
      method: "POST",
      body: JSON.stringify({ mood, intensity, notes }),
    });
  }

  async saveConversation(messages: any[]): Promise<ApiResponse> {
    return this.makeRequest("/auth/conversation", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });
  }

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
}

export const apiService = new ApiService();

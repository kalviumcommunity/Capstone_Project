// Shared types for authentication API

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MoodEntry {
  mood: string;
  intensity: number;
  time: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  text: string;
  time: string;
  category?: string;
  suggestions?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  moodHistory: MoodEntry[];
  conversationHistory: ChatMessage[];
}

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login failed with status:", response.status, errorText);
        setIsLoading(false);
        return false;
      }

      // Clone response to avoid "body already read" error
      const responseClone = response.clone();
      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON, trying text:", jsonError);
        const textData = await responseClone.text();
        console.log("Response as text:", textData);
        setIsLoading(false);
        return false;
      }

      console.log("Login response data:", data);

      if (data.success && data.user && data.token) {
        console.log("Login successful, setting user data");
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("authToken", data.token);
        setIsLoading(false);
        return true;
      } else {
        console.log("Login failed:", data.message || "Unknown error");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      console.log("Attempting signup with:", { name, email });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Signup response status:", response.status);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Signup failed with status:", response.status, errorText);
        setIsLoading(false);
        return false;
      }

      // Clone response to avoid "body already read" error
      const responseClone = response.clone();
      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON, trying text:", jsonError);
        const textData = await responseClone.text();
        console.log("Response as text:", textData);
        setIsLoading(false);
        return false;
      }

      console.log("Signup response data:", data);

      if (data.success && data.user && data.token) {
        console.log("Signup successful, setting user data");
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("authToken", data.token);
        setIsLoading(false);
        return true;
      } else {
        console.log("Signup failed:", data.message || "Unknown error");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");

    if (savedUser && authToken) {
      // Validate token with backend
      fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            // Invalid token, clear storage
            logout();
          }
        })
        .catch(() => {
          // Network error or invalid token
          logout();
        });
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

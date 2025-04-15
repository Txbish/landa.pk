"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "@/lib/axios";

// Define user interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Define AuthContext shape
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Props for the provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// The provider itself
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me");
        setUser(response.data.user);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post("/auth/login", { email, password });
    setUser(response.data.user);
    setIsLoggedIn(true);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    await axios.post("/auth/logout");
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // Context value memoized
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn,
      loading,
      login,
      logout,
    }),
    [user, isLoggedIn, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

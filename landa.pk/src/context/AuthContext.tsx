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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/users/profile");

      console.log("Fetch user response:", response.data);

      setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        address: response.data.address || "",
        phone: response.data.phone || "",
        profileImage: response.data.profileImage || "",
      });

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post("/users/login", { email, password });

      console.log("Login response:", response.data);

      setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        address: response.data.address || "",
        phone: response.data.phone || "",
        profileImage: response.data.profileImage || "",
      });

      setIsLoggedIn(true);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }, []);

  const logout = useCallback(async () => {
    await axios.post("/users/logout");
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateProfile = useCallback(async (updatedData: Partial<User>) => {
    try {
      const response = await axios.put("/users/profile", updatedData);
      setUser(response.data.user);
    } catch (error: any) {
      console.error(
        "Failed to update profile:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }, []);

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await axios.put("/users/profile/password", {
          currentPassword,
          newPassword,
        });
      } catch (error: any) {
        console.error(
          "Failed to update password:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message || "Failed to update password"
        );
      }
    },
    []
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn,
      loading,
      login,
      logout,
      updateProfile,
      updatePassword,
    }),
    [user, isLoggedIn, loading, login, logout, updateProfile, updatePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

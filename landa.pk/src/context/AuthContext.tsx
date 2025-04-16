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
  fetchUser: () => Promise<void>; // Add fetchUser to the context type
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export async function fetchUser(): Promise<User | null> {
  try {
    const response = await axios.get("/users/profile");
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserAndSetState = useCallback(async () => {
    const fetchedUser = await fetchUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []); // Empty dependency array to ensure this function is stable

  useEffect(() => {
    fetchUserAndSetState();
  }, [fetchUserAndSetState]); // Only run once on mount

  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post("/users/login", { email, password });
    console.log(response.data);
    setUser(response.data.user);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    await axios.post("/users/logout");
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateProfile = useCallback(async (updatedData: Partial<User>) => {
    try {
      const response = await axios.put("/users/profile", updatedData);
      setUser(response.data);
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
      fetchUser: fetchUserAndSetState,
    }),
    [user, isLoggedIn, loading, login, logout, updateProfile, updatePassword]
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

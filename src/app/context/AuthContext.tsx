"use client";

import { init } from "next/dist/compiled/webpack/webpack";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Utility function to refresh the access token
  const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access", data.access);
      return data.access;
    } else {
      // Refresh token is also invalid, clear everything
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
  useEffect(() => {
    const initAuth = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // Try with current token first
        let response = await fetch("http://127.0.0.1:8000/api/auth/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If token is expired (401), try to refresh it
        if (!response.ok && response.status === 401) {
          const newToken = await refreshAccessToken();
          
          if (newToken) {
            // Retry with new token
            response = await fetch("http://127.0.0.1:8000/api/auth/me/", {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            });
          }
        }

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
    }
    catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally  {
      setLoading(false);
    }
  };
  
    initAuth();
    }, []);
    const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

"use client";

import { createContext, useContext, useEffect, useState } from "react";

// 1. ENVIRONMENT VARIABLE (Critical for Vercel/Mobile)
const API_URL = process.env.NEXT_PUBLIC_NOT_OUR_VULNERABLE_API_URL || 'http://127.0.0.1:8000';

// 2. HEADERS (Critical for Ngrok)
const COMMON_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

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
  login: (email: string, password: string) => Promise<boolean>;
  refreshAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Helper: Fetch User Data ---
  // We use this in useEffect AND after a successful login
  const fetchUserMe = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me/`, {
        headers: {
          ...COMMON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching me:", error);
      return null;
    }
  };

  // --- 1. REFRESH TOKEN ---
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
        method: "POST",
        headers: COMMON_HEADERS,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access", data.access);
        return data.access;
      } else {
        logout(); 
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // --- 2. LOGIN FUNCTION (Implemented) ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: COMMON_HEADERS,
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 1. Save Tokens
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        
        // 2. Update User State immediately
        // If your login endpoint returns the user object, use: setUser(data.user);
        // If it only returns tokens, we fetch the user manually:
        const userData = await fetchUserMe(data.access);
        if (userData) {
          setUser(userData);
        }

        return true;
      } else {
        console.error("Login failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Login network error:", error);
      return false;
    }
  };

  // --- 3. LOGOUT FUNCTION ---
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  // --- 4. INITIALIZATION (On Page Load) ---
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }

      // Try fetching user with current token
      let userData = await fetchUserMe(token);

      // If failed (likely expired), try refreshing
      if (!userData) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          userData = await fetchUserMe(newToken);
        }
      }

      if (userData) {
        setUser(userData);
      } else {
        // If refresh failed too, user is logged out
        setUser(null); 
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshAccessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
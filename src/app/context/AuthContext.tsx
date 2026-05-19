"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService, otpService } from "@/lib/services";
import type { MeResponse } from "@/lib/services";

/* ── Types ────────────────────────────────────────────────────────── */

export type User = MeResponse;

type AuthContextType = {
  user: User | null;
  loading: boolean;

  // auth
  login: (username: string, password: string) => Promise<boolean>;
  register: (data: {
    username: string;
    password: string;
    email: string;
    full_name?: string;
    phone?: string;
  }) => Promise<{ success: boolean; email?: string; error?: string }>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<string>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;

  // OTP password reset
  requestOTP: (email: string) => Promise<string>;
  verifyOTP: (email: string, code: string) => Promise<string>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<string>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* ── Provider ─────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── helpers ──────────────────────────────────────────────── */

  const fetchMe = useCallback(async (): Promise<User | null> => {
    try {
      return await authService.me();
    } catch {
      return null;
    }
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return null;
    try {
      const data = await authService.refresh(refresh);
      localStorage.setItem("access", data.access);
      if (data.refresh) localStorage.setItem("refresh", data.refresh);
      return data.access;
    } catch {
      logout();
      return null;
    }
  }, []);

  /* ── login ───────────────────────────────────────────────── */

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const tokens = await authService.login(username, password);
        localStorage.setItem("access", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);

        const me = await fetchMe();
        if (me) setUser(me);
        return true;
      } catch {
        return false;
      }
    },
    [fetchMe],
  );

  /* ── register (returns email for OTP step, no auto-login) ── */

  const register = useCallback(
    async (data: {
      username: string;
      password: string;
      email: string;
      full_name?: string;
      phone?: string;
    }): Promise<{ success: boolean; email?: string; error?: string }> => {
      try {
        const res = await authService.register(data);
        return { success: true, email: res.email };
      } catch (err: any) {
        return { success: false, error: err.detail || "Registration failed." };
      }
    },
    [],
  );

  /* ── verify email (final step — activates + logs in) ─────── */

  const verifyEmail = useCallback(
    async (email: string, code: string): Promise<boolean> => {
      try {
        const res = await authService.verifyEmail(email, code);
        localStorage.setItem("access", res.access);
        localStorage.setItem("refresh", res.refresh);

        const me = await fetchMe();
        if (me) setUser(me);
        return true;
      } catch {
        return false;
      }
    },
    [fetchMe],
  );

  /* ── resend verification code ────────────────────────────── */

  const resendVerification = useCallback(
    async (email: string): Promise<string> => {
      const res = await authService.resendVerification(email);
      return res.detail;
    },
    [],
  );

  /* ── logout ──────────────────────────────────────────────── */

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }, []);

  /* ── OTP password reset ──────────────────────────────────── */

  const requestOTP = useCallback(async (email: string): Promise<string> => {
    const res = await otpService.requestOTP(email);
    return res.detail;
  }, []);

  const verifyOTP = useCallback(
    async (email: string, code: string): Promise<string> => {
      const res = await otpService.verifyOTP(email, code);
      return res.reset_token;
    },
    [],
  );

  const resetPassword = useCallback(
    async (resetToken: string, newPassword: string): Promise<string> => {
      const res = await otpService.resetPassword(resetToken, newPassword);
      return res.detail;
    },
    [],
  );

  /* ── init on mount ───────────────────────────────────────── */

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }

      let me = await fetchMe();
      if (!me) {
        const newToken = await refreshAccessToken();
        if (newToken) me = await fetchMe();
      }

      if (me) setUser(me);
      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyEmail,
        resendVerification,
        logout,
        refreshAccessToken,
        requestOTP,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

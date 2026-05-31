/**
 * Auth & OTP service — login, register with email verification, password reset.
 */
import api, { publicPost } from "@/lib/api";

/* ── Types ────────────────────────────────────────────────────────── */

export interface AuthTokens {
  user_id: number;
  customer_id: number | null;
  access: string;
  refresh: string;
}

export interface RegistrationResponse {
  user_id: number;
  email: string;
  detail: string;
  needs_verification: boolean;
}

export interface VerifyEmailResponse extends AuthTokens {
  detail: string;
}

export interface MeResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  customer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  role: string;
}

/* ── Auth ─────────────────────────────────────────────────────────── */

export const authService = {
  login: (username: string, password: string) =>
    publicPost<AuthTokens>("/api/auth/login/", { username, password }),

  /** Creates inactive user + sends OTP email. Does NOT return tokens. */
  register: (data: {
    username: string;
    password: string;
    email: string;
    full_name?: string;
    phone?: string;
  }) => publicPost<RegistrationResponse>("/api/auth/registration/", data),

  /** Verify the 6-digit email code → activates user → returns JWT tokens. */
  verifyEmail: (email: string, code: string) =>
    publicPost<VerifyEmailResponse>("/api/auth/verify-email/", { email, code }),

  /** Re-send the verification OTP (rate-limited). */
  resendVerification: (email: string) =>
    publicPost<{ detail: string }>("/api/auth/resend-verification/", { email }),

  refresh: (refreshToken: string) =>
    publicPost<{ access: string; refresh?: string }>("/api/auth/refresh/", {
      refresh: refreshToken,
    }),

  me: () => api.get<MeResponse>("/api/auth/me/"),
};

/* ── OTP Password Reset ──────────────────────────────────────────── */

export const otpService = {
  /** Step 1: request a 6-digit code via email */
  requestOTP: (email: string) =>
    publicPost<{ detail: string }>("/api/auth/password/request-otp/", {
      email,
    }),

  /** Step 2: verify the code → get a reset token */
  verifyOTP: (email: string, code: string) =>
    publicPost<{ reset_token: string }>("/api/auth/password/verify-otp/", {
      email,
      code,
    }),

  /** Step 3: set the new password */
  resetPassword: (resetToken: string, newPassword: string) =>
    publicPost<{ detail: string }>("/api/auth/password/reset/", {
      reset_token: resetToken,
      new_password: newPassword,
    }),
};

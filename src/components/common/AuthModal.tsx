"use client";

import { errorMessage } from '@/lib/errors';
import Dialog from './Dialog';
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, X, User as UserIcon, Lock, Mail, Shield, RotateCcw } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLogin?: boolean;
}

type Step = "form" | "otp";

export default function AuthModal({ isOpen, onClose, initialLogin = true }: AuthModalProps) {
  const { login, register, verifyEmail, resendVerification } = useAuth();

  const [isLogin, setIsLogin] = useState(initialLogin);
  const [step, setStep] = useState<Step>("form");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  // OTP state
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  /* ── OTP input handlers ────────────────────────────────── */

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // single digit
    setOtpDigits(newDigits);

    // auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    // focus last filled or the next empty
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  /* ── Registration + Login handler ──────────────────────── */

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in required fields");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          onClose();
        } else {
          setError("Invalid credentials.");
        }
      } else {
        // Registration → sends OTP email
        const result = await register({
          username: username || email.split("@")[0],
          email,
          password,
          full_name: fullName,
        });
        if (result.success) {
          setStep("otp");
          setResendCooldown(60);
          setSuccess("Verification code sent to your email.");
        } else {
          setError(result.error || "Registration failed.");
        }
      }
    } catch (err: unknown) {
      setError(errorMessage(err, "Operation failed."));
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP verification handler ──────────────────────────── */

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const code = otpDigits.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      setLoading(false);
      return;
    }

    try {
      const ok = await verifyEmail(email, code);
      if (ok) {
        onClose();
      } else {
        setError("Invalid code. Please try again.");
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err: unknown) {
      setError(errorMessage(err, "Verification failed."));
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend handler ────────────────────────────────────── */

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await resendVerification(email);
      setResendCooldown(60);
      setSuccess("New code sent!");
    } catch (err: unknown) {
      setError(errorMessage(err, "Failed to resend. Try again."));
    }
  };

  /* ── Header info ───────────────────────────────────────── */

  const headerIcon = step === "otp" ? <Shield size={16} /> : isLogin ? <Lock size={16} /> : <UserIcon size={16} />;
  const headerText = step === "otp" ? "Verify your email" : isLogin ? "Welcome back" : "Create your account";

  return (
    <Dialog label={step === "otp" ? "Verify your email" : isLogin ? "Log in" : "Create account"} onClose={onClose}>
      {/* Modal */}
      <div className="auth-panel">
        {/* Header */}
        <div className="auth-heading">
          <div className="flex items-center gap-2">
            {headerIcon}
            <span className="text-[0.8rem] font-black uppercase tracking-widest">
              {headerText}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication"
            className="button button-secondary icon-button"
          >
            <X size="1.2rem" strokeWidth={3} />
          </button>
        </div>

        {/* ═══════════ STEP: OTP VERIFICATION ═══════════ */}
        {step === "otp" ? (
          <form className="p-[1.5rem] flex flex-col gap-[1rem]" onSubmit={handleVerify}>
            <div className="text-center">
              <p className="text-[0.75rem] font-bold text-[#666] uppercase">
                Code sent to
              </p>
              <p className="text-[0.9rem] font-black mt-1">{email}</p>
            </div>

            {/* 6-digit OTP input */}
            <div className="auth-otp" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  aria-label={`Verification digit ${i + 1}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                  className="w-[3rem] h-[3.5rem] bg-white border-[0.15rem] border-[#6b6b6b] text-center font-black text-[1.5rem] focus:border-black outline-none transition-colors"
                />
              ))}
            </div>

            {/* Messages */}
            <div className="auth-message" aria-live="polite">
              {error && (
                <span className="text-[0.7rem] font-black text-red-600 bg-red-50 px-2 py-1 border border-red-200 block text-center">
                  {error}
                </span>
              )}
              {success && !error && (
                <span className="text-[0.7rem] font-black text-green-700 bg-green-50 px-2 py-1 border border-green-200 block text-center">
                  {success}
                </span>
              )}
            </div>

            {/* Verify button */}
            <button
              type="submit"
              disabled={loading}
              className={`group flex items-center justify-center gap-[0.75rem] bg-black text-white py-[1rem] mt-[0.5rem] font-black text-[0.9rem] uppercase tracking-wider hover:bg-[#333] active:translate-y-[0.1rem] transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "VERIFYING..." : "Verify Code"}
              {!loading && (
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>

            {/* Resend */}
            <div className="flex items-center justify-center gap-2 mt-[0.25rem]">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className={`text-[0.7rem] font-bold uppercase flex items-center gap-1 ${
                  resendCooldown > 0
                    ? "text-[#aaa] cursor-not-allowed"
                    : "text-[#6b6b6b] hover:text-black hover:underline cursor-pointer"
                }`}
              >
                <RotateCcw size={12} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        ) : (
          /* ═══════════ STEP: LOGIN / REGISTER FORM ═══════════ */
          <form className="p-[1.5rem] flex flex-col gap-[1rem]" onSubmit={handleAuth}>
            {/* Registration-only fields */}
            {!isLogin && (
              <>
                <div className="flex flex-col gap-[0.25rem]">
                  <label htmlFor="auth-full-name" className="text-[0.65rem] font-black uppercase text-[#666]">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="auth-full-name" placeholder="FULL NAME"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-[0.25rem]">
                  <label htmlFor="auth-username" className="text-[0.65rem] font-black uppercase text-[#666]">
                    Username
                  </label>
                  <input
                    type="text"
                    id="auth-username" placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                  />
                </div>
              </>
            )}

            {/* Common fields */}
            <div className="flex flex-col gap-[0.25rem]">
              <label htmlFor="auth-email" className="text-[0.65rem] font-black uppercase text-[#666]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  id="auth-email" placeholder="USER@DOMAIN.COM"
                  className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] pl-[2.5rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[0.25rem]">
              <label htmlFor="auth-password" className="text-[0.65rem] font-black uppercase text-[#666]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="auth-password" type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] pl-[2.5rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                />
              </div>
            </div>

            {/* Messages */}
            <div className="auth-message" aria-live="polite">
              {error && (
                <span className="text-[0.7rem] font-black text-red-600 bg-red-50 px-2 py-1 border border-red-200 block text-center">
                  {error}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`group flex items-center justify-center gap-[0.75rem] bg-black text-white py-[1rem] mt-[0.5rem] font-black text-[0.9rem] uppercase tracking-wider hover:bg-[#333] active:translate-y-[0.1rem] transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "PROCESSING..." : isLogin ? "Log in" : "Create account"}
              {!loading && (
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>

            {/* Toggle login/register */}
            <button type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[0.7rem] font-bold text-[#6b6b6b] text-center cursor-pointer hover:text-black hover:underline uppercase mt-[0.25rem]"
            >
              {isLogin ? "Create an account" : "Back to log in"}
            </button>
          </form>
        )}

      </div>
    </Dialog>
  );
}

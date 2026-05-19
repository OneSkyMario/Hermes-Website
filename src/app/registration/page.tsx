"use client";

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

  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
    setIsLogin(initialLogin);
    setStep("form");
    setError("");
    setSuccess("");
    setOtpDigits(["", "", "", "", "", ""]);
  }, [initialLogin, isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!mounted || !isOpen) return null;

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
    } catch (err: any) {
      setError(err.message || "Operation failed.");
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
    } catch (err: any) {
      setError(err.detail || "Verification failed.");
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
    } catch (err: any) {
      setError(err.detail || "Failed to resend. Try again.");
    }
  };

  /* ── Header info ───────────────────────────────────────── */

  const headerIcon = step === "otp" ? <Shield size={16} /> : isLogin ? <Lock size={16} /> : <UserIcon size={16} />;
  const headerText = step === "otp" ? "Email.Verify()" : isLogin ? "System.Access()" : "Unit.Registration()";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[1rem] font-mono">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Decorative layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[-1]" />

      {/* Modal */}
      <div className="relative w-full max-w-[26rem] bg-[#f5f5f5] border-[0.2rem] border-[#4a4a4a] shadow-[0.6rem_0.6rem_0_#222] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-[1rem] border-b-[0.2rem] border-[#4a4a4a] bg-white">
          <div className="flex items-center gap-2">
            {headerIcon}
            <span className="text-[0.8rem] font-black uppercase tracking-widest">
              {headerText}
            </span>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-red-500 hover:text-white transition-colors p-1 border-[2px] border-transparent hover:border-black"
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
            <div className="flex justify-center gap-[0.5rem] mt-[0.5rem]" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
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
            <div className="h-[1rem]">
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
                  <label className="text-[0.65rem] font-black uppercase text-[#666]">
                    Identity Name
                  </label>
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-[0.25rem]">
                  <label className="text-[0.65rem] font-black uppercase text-[#666]">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                  />
                </div>
              </>
            )}

            {/* Common fields */}
            <div className="flex flex-col gap-[0.25rem]">
              <label className="text-[0.65rem] font-black uppercase text-[#666]">
                Operator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  placeholder="USER@DOMAIN.COM"
                  className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] pl-[2.5rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[0.25rem]">
              <label className="text-[0.65rem] font-black uppercase text-[#666]">
                Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] pl-[2.5rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                />
              </div>
            </div>

            {/* Messages */}
            <div className="h-[1rem]">
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
              {loading ? "PROCESSING..." : isLogin ? "Initiate Link" : "Enroll Unit"}
              {!loading && (
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>

            {/* Toggle login/register */}
            <div
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[0.7rem] font-bold text-[#6b6b6b] text-center cursor-pointer hover:text-black hover:underline uppercase mt-[0.25rem]"
            >
              {isLogin ? ">> Request New Credentials" : ">> Back to Login"}
            </div>
          </form>
        )}

        {/* Decorative footer */}
        <div className="flex border-t-[0.2rem] border-[#4a4a4a]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex-1 h-[0.5rem] border-r-[0.15rem] border-[#4a4a4a] last:border-r-0 odd:bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

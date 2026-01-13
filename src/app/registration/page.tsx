"use client";

import React, { useState, useEffect } from "react";
import { Coffee, ArrowRight, Lock, Mail, User, ChevronLeft, X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLogin?: boolean;
}

export default function AuthModal({ isOpen, onClose, initialLogin = true }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(initialLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  }, [initialLogin, isOpen]);

  if (!mounted || !isOpen) return null;
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "login/" : "registration/";
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password,
          ...(isLogin ? {} : { full_name: fullName })
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      
      window.location.reload(); // Refresh to update user context
    } catch {
      setError("Authorization Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. Backdrop (The dark blurry part behind) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* 2. The Modal Card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[400px] w-[90%] bg-[#f5f5f5] border-[3px] border-[#6b6b6b] z-[10000] shadow-[12px_12px_0_#000]">        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 hover:rotate-90 transition-transform text-[#7a7a7a] hover:text-black"
        >
          <X size={20} strokeWidth={3} />
        </button>


        <form className="p-6 flex flex-col gap-4" onSubmit={handleAuth}>
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="section-header-tag text-[9px]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} />
                <input
                  type="text"
                  placeholder="NAME"
                  required
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border-2 border-[#6b6b6b] p-2 pl-10 font-bold text-sm focus:shadow-[4px_4px_0_rgba(107,107,107,0.2)] outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="section-header-tag text-[9px]">Operator ID</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} />
              <input
                type="email"
                placeholder="EMAIL@NU.KZ"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-[#6b6b6b] p-2 pl-10 font-bold text-sm focus:shadow-[4px_4px_0_rgba(107,107,107,0.2)] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="section-header-tag text-[9px]">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} />
              <input
                type="password"
                placeholder="••••"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-[#6b6b6b] p-2 pl-10 font-bold text-sm focus:shadow-[4px_4px_0_rgba(107,107,107,0.2)] outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="order-btn flex items-center justify-center gap-2 py-3 mt-2 active:translate-y-1 active:shadow-none"
          >
            {loading ? "VERIFYING..." : isLogin ? "AUTHORIZE" : "ENROLL UNIT"}
            <ArrowRight size={20} strokeWidth={3} />
          </button>

          <div 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black text-[#7a7a7a] text-center cursor-pointer hover:text-black uppercase mt-2"
          >
            {isLogin ? "Need access? Request Credentials" : "Back to Login"}
          </div>
        </form>
      </div>
    </div>
  );
}
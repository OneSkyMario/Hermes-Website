"use client";

import React, { useState, useEffect } from "react";
import { Coffee, ArrowRight, Shield, X, User as UserIcon, Lock, Mail } from "lucide-react";
import { useAuth } from '@/app/context/AuthContext';

// Use the environment variable for Registration (Login is handled by useAuth)
const API_URL = process.env.NEXT_PUBLIC_NOT_OUR_VULNERABLE_API_URL || 'http://127.0.0.1:8000';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLogin?: boolean;
}

export default function AuthModal({ isOpen, onClose, initialLogin = true }: AuthModalProps) {
  const { login } = useAuth(); // Use the login function from our Context
  
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(initialLogin);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState(""); // Only for registration if needed

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
    setError("");
  }, [initialLogin, isOpen]);

  if (!mounted || !isOpen) return null;
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError('Please fill in required fields');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        // Uses the centralized login function from AuthContext
        const success = await login(email, password);
        if (success) {
          onClose(); // Close modal on success
        } else {
          setError("Invalid credentials.");
        }
      } else {
        // --- REGISTRATION FLOW ---
        // Registration is usually a one-off, so we can fetch directly here using the ENV variable
        const res = await fetch(`${API_URL}/api/auth/registration/`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true" 
          },
          body: JSON.stringify({
            username: username || email.split('@')[0], // Fallback if empty
            email: email,
            password: password,
            full_name: fullName
          }),
        });

        if (!res.ok) {
           const errData = await res.json();
           // Try to show a specific error from Django
           throw new Error(Object.values(errData).flat().join(' ') || "Registration failed");
        }

        // Auto-login after registration
        await login(email, password);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[1rem] font-mono">
      {/* 1. Backdrop */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* 2. Background Decorative Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[-1]">
        {/* Only visible if z-index allows, currently hidden by backdrop logic but kept for structure */}
      </div>

      {/* 3. The Modal Card */}
      <div className="relative w-full max-w-[26rem] bg-[#f5f5f5] border-[0.2rem] border-[#4a4a4a] shadow-[0.6rem_0.6rem_0_#222] flex flex-col">
        
        {/* Header/Close */}
        <div className="flex justify-between items-center p-[1rem] border-b-[0.2rem] border-[#4a4a4a] bg-white">
          <div className="flex items-center gap-2">
            {isLogin ? <Lock size={16} /> : <UserIcon size={16} />}
            <span className="text-[0.8rem] font-black uppercase tracking-widest">
              {isLogin ? "System.Access()" : "Unit.Registration()"}
            </span>
          </div>
          <button onClick={onClose} className="hover:bg-red-500 hover:text-white transition-colors p-1 border-[2px] border-transparent hover:border-black">
            <X size="1.2rem" strokeWidth={3} />
          </button>
        </div>

        <form className="p-[1.5rem] flex flex-col gap-[1rem]" onSubmit={handleAuth}>
          
          {/* Registration Fields */}
          {!isLogin && (
            <>
              <div className="flex flex-col gap-[0.25rem]">
                <label className="text-[0.65rem] font-black uppercase text-[#666]">Identity Name</label>
                <input
                  type="text"
                  placeholder="FULL NAME"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.6rem] font-bold text-[0.9rem] focus:border-black outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-[0.25rem]">
                <label className="text-[0.65rem] font-black uppercase text-[#666]">Username</label>
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

          {/* Common Fields */}
          <div className="flex flex-col gap-[0.25rem]">
            <label className="text-[0.65rem] font-black uppercase text-[#666]">Operator Email</label>
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
            <label className="text-[0.65rem] font-black uppercase text-[#666]">Access Key</label>
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

          <div className="h-[1rem]">
            {error && <span className="text-[0.7rem] font-black text-red-600 bg-red-50 px-2 py-1 border border-red-200 block text-center">{error}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`group flex items-center justify-center gap-[0.75rem] bg-black text-white py-[1rem] mt-[0.5rem] font-black text-[0.9rem] uppercase tracking-wider hover:bg-[#333] active:translate-y-[0.1rem] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "PROCESSING..." : (isLogin ? "Initiate Link" : "Enroll Unit")}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <div 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-[0.7rem] font-bold text-[#6b6b6b] text-center cursor-pointer hover:text-black hover:underline uppercase mt-[0.25rem]"
          >
            {isLogin ? ">> Request New Credentials" : ">> Back to Login"}
          </div>
        </form>
        
        {/* Decorative Footer */}
        <div className="flex border-t-[0.2rem] border-[#4a4a4a]">
            {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1 h-[0.5rem] border-r-[0.15rem] border-[#4a4a4a] last:border-r-0 odd:bg-white" />)}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { Coffee, ArrowRight, Shield, X } from "lucide-react";
import { AuthProvider } from '@/app/context/AuthContext';
import { set } from "animejs";
import type { User } from "@/app/context/AuthContext";

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
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
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
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }


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

      }
      catch {
      setError("Authorization Failed");
    } finally {
      setLoading(false);
    }

    
    
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[1rem] font-mono">
      {/* 1. Backdrop */}
      <div className="absolute inset-0 bg-stone-300/80 backdrop-blur-sm" onClick={onClose} />

      {/* 2. Background Decorative Icons (Hidden on small mobile for clarity) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 select-none">
        <Coffee className="absolute -top-[5rem] -left-[5rem]" size="40rem" strokeWidth={0.5} />
        <Shield className="absolute -bottom-[5rem] -right-[5rem]" size="30rem" strokeWidth={0.5} />
      </div>

      {/* 3. The Modal Card */}
      <div className="relative w-full max-w-[28rem] bg-[#f5f5f5] border-[0.2rem] border-[#6b6b6b] shadow-[0.75rem_0.75rem_0_#000] flex flex-col">
        
        {/* Header/Close */}
        <div className="flex justify-between items-center p-[1rem] border-b-[0.2rem] border-[#6b6b6b] bg-white">
          <span className="text-[0.75rem] font-black uppercase tracking-widest">
            {isLogin ? "System.Access()" : "Unit.Registration()"}
          </span>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size="1.5rem" strokeWidth={3} />
          </button>
        </div>

        <form className="p-[1.5rem] flex flex-col gap-[1rem]" onSubmit={handleAuth}>
          {!isLogin && (
            <div className="flex flex-col gap-[0.25rem]">
              <label className="text-[0.65rem] font-black uppercase">Identity Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="FULL NAME"
                  className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.75rem] pl-[2.5rem] font-bold text-[0.9rem] focus:bg-stone-50 outline-none"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-[0.25rem]">
            <label className="text-[0.65rem] font-black uppercase">Username</label>
            <div className="relative">
              <input
                type="username"
                placeholder="ad23"
                className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.75rem] pl-[2.5rem] font-bold text-[0.9rem] outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[0.25rem]">
            <label className="text-[0.65rem] font-black uppercase">Operator ID</label>
            <div className="relative">
              <input
                type="email"
                placeholder="USER@DOMAIN.COM"
                className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.75rem] pl-[2.5rem] font-bold text-[0.9rem] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          

          <div className="flex flex-col gap-[0.25rem]">
            <label className="text-[0.65rem] font-black uppercase">Access Key</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-[0.15rem] border-[#6b6b6b] p-[0.75rem] pl-[2.5rem] font-bold text-[0.9rem] outline-none"
              />
            </div>
          </div>
          <div className="h-[1rem]">
            {error && <span className="text-[0.75rem] font-black text-red-600">{error}</span>}
          </div>
          <button
            type="submit"
            className="group flex items-center justify-center gap-[0.75rem] bg-black text-white py-[1rem] mt-[0.5rem] font-black text-[1rem] hover:bg-[#6b6b6b] active:translate-y-[0.2rem] active:shadow-none transition-all"
          >
            {isLogin ? "AUTHORIZE" : "ENROLL UNIT"}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[0.7rem] font-black text-[#7a7a7a] text-center cursor-pointer hover:text-black uppercase mt-[0.5rem]"
          >
            {isLogin ? ">> Request New Credentials" : ">> Back to Uplink"}
          </div>
        </form>
        
        {/* Decorative Footer */}
        <div className="flex border-t-[0.2rem] border-[#6b6b6b]">
            {[1,2,3,4].map(i => <div key={i} className="flex-1 h-[0.5rem] border-r-[0.15rem] border-[#6b6b6b] last:border-r-0 odd:bg-stone-300" />)}
        </div>
      </div>
    </div>
  );
}
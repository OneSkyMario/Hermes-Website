"use client";

import React, { useState } from 'react';
import { Coffee, ArrowRight, Lock, Mail, User, ShieldCheck, Github, ChevronLeft } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="page-wrapper min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Halftone Background Overlay */}
      <div className="halftone-overlay" />

      <div className="container max-w-[480px] w-full bg-[#f5f5f5] border-[3px] border-[#6b6b6b] relative z-10 shadow-[8px_8px_0_rgba(107,107,107,0.5)] transition-all duration-300">
        
        {/* Header Section */}
        <div className="header border-b-[3px] border-[#6b6b6b] p-6 text-center bg-[#f5f5f5] relative">
            {!isLogin && (
                <button 
                    onClick={() => setIsLogin(true)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border-2 border-[#6b6b6b] flex items-center justify-center hover:bg-[#6b6b6b] hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
            )}
          <div className="logo flex justify-center items-center gap-2 text-2xl font-black uppercase tracking-[4px] text-[#4a4a4a]">
            <Coffee size={32} strokeWidth={3} />
            <span>OTTO</span>
          </div>
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#7a7a7a] mt-2">
            {isLogin ? "Terminal Access Protocol" : "New Unit Enrollment"}
          </p>
        </div>

        {/* Dynamic Form Content */}
        <div className="p-8">
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="section-header-tag">Operator Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={18} />
                  <input 
                    type="text" 
                    placeholder="J. DOE"
                    className="w-full bg-white border-2 border-[#6b6b6b] p-3 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0_#4a4a4a] transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="section-header-tag">Operator ID (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={18} />
                <input 
                  type="email" 
                  placeholder="name@brewos.com"
                  className="w-full bg-white border-2 border-[#6b6b6b] p-3 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0_#4a4a4a] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="section-header-tag">Access Key</label>
                {isLogin && <a href="#" className="text-[9px] font-black uppercase text-[#7a7a7a] hover:text-[#4a4a4a] mb-1">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-[#6b6b6b] p-3 pl-12 font-bold focus:outline-none focus:shadow-[4px_4px_0_#4a4a4a] transition-all"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center gap-3 mt-2 p-3 bg-white border-2 border-dashed border-[#6b6b6b]">
                <input type="checkbox" className="w-4 h-4 accent-[#6b6b6b]" id="terms" />
                <label htmlFor="terms" className="text-[10px] font-bold text-[#7a7a7a] uppercase leading-tight">
                  I accept all <span className="text-[#4a4a4a] underline cursor-pointer">Security Protocols</span> and system mandates.
                </label>
              </div>
            )}

            <button className="launch-btn group mt-4">
              {isLogin ? "Log In" : "Deploy Operator Unit"}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} strokeWidth={3} />
            </button>

            {/* Social Auth (Compact) */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button className="ingredient-card flex justify-center items-center gap-2 py-2">
                <Github size={16} />
                <span className="text-[9px] font-black uppercase">GitHub</span>
              </button>
              <button className="ingredient-card flex justify-center items-center gap-2 py-2">
                <ShieldCheck size={16} />
                <span className="text-[9px] font-black uppercase">SAML SSO</span>
              </button>
            </div>
          </form>
        </div>

        {/* Navigation Footer */}
        <div className="bg-[#e5e5e5] p-5 border-t-2 border-[#6b6b6b] text-center">
          {isLogin ? (
            <p className="text-[11px] font-bold text-[#7a7a7a] uppercase tracking-tight">
              No credentials? <span onClick={() => setIsLogin(false)} className="text-[#4a4a4a] cursor-pointer hover:underline decoration-2 underline-offset-4">Sign Up</span>
            </p>
          ) : (
            <p className="text-[11px] font-bold text-[#7a7a7a] uppercase tracking-tight">
              Already Enrolled? <span onClick={() => setIsLogin(true)} className="text-[#4a4a4a] cursor-pointer hover:underline decoration-2 underline-offset-4">Return to Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
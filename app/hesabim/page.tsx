"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";

export default function GirisPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#050814] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">

      {/* 🌌 ZARİF ARKAPLAN IŞIKLARI (Sadece merkezde yumuşak bir parlama) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3b82f6] blur-[200px] opacity-15 pointer-events-none rounded-[100%]"></div>

      <div className="w-full max-w-[420px] relative z-10">

        {/* GERİ DÖN (Daha minimal) */}
        <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#3b82f6] transition-colors mb-6 ml-2">
          <ArrowLeft className="w-4 h-4" /> Mağazaya Dön
        </Link>

        {/* 💎 MERKEZİ ZARİF KART (Cam efekti) */}
        <div className="bg-[#09090b]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

          {/* BAŞLIK & LOGO (Telefona tam uyumlu, orantılı) */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
              BİLGİN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#00d2ff]">PC</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              {isLogin ? "VİP Garaja Hoş Geldin. Lütfen giriş yap." : "Premium dünyaya katılmak için hesap oluştur."}
            </p>
          </div>

          {/* KİBAR SEKME DEĞİŞTİRİCİ (Hap şeklinde zarif tasarım) */}
          <div className="flex bg-[#121215] p-1 rounded-2xl mb-8 border border-white/5 shadow-inner">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${isLogin ? 'bg-[#25252a] text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${!isLogin ? 'bg-[#25252a] text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* GOOGLE İLE ZARİF GİRİŞ BUTONU */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/hesabim' })}
            className="w-full flex items-center justify-center gap-3 bg-[#121215] border border-white/10 hover:border-white/20 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 mb-6 text-xs sm:text-sm tracking-wide shadow-sm"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Devam Et
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">veya E-Posta</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          {/* DİNAMİK FORM ALANI */}
          {isLogin ? (
            <form className="space-y-4 animate-in fade-in zoom-in-95 duration-300" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors" />
                <input type="email" placeholder="E-Posta Adresiniz" className="w-full bg-[#121215]/50 border border-white/5 focus:border-[#3b82f6]/50 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600" required />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors" />
                <input type="password" placeholder="Şifreniz" className="w-full bg-[#121215]/50 border border-white/5 focus:border-[#3b82f6]/50 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600" required />
              </div>

              <div className="flex justify-between items-center px-1 pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-[#121215] checked:bg-[#3b82f6] transition-colors" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300">Beni Hatırla</span>
                </label>
                <a href="#" className="text-xs text-slate-400 hover:text-[#3b82f6] transition-colors">Şifremi Unuttum</a>
              </div>

              <button type="submit" className="w-full bg-white text-black font-black py-3.5 rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
                Giriş Yap
              </button>
            </form>
          ) : (
            <form className="space-y-4 animate-in fade-in zoom-in-95 duration-300" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00d2ff] transition-colors" />
                <input type="text" placeholder="Adınız Soyadınız" className="w-full bg-[#121215]/50 border border-white/5 focus:border-[#00d2ff]/50 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600" required />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00d2ff] transition-colors" />
                <input type="email" placeholder="E-Posta Adresiniz" className="w-full bg-[#121215]/50 border border-white/5 focus:border-[#00d2ff]/50 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600" required />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00d2ff] transition-colors" />
                <input type="password" placeholder="Şifre Belirleyin" className="w-full bg-[#121215]/50 border border-white/5 focus:border-[#00d2ff]/50 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600" required />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-[#00d2ff] to-blue-500 text-black font-black py-3.5 mt-2 rounded-2xl uppercase tracking-widest text-xs hover:opacity-90 shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all duration-300">
                Hesap Oluştur
              </button>
            </form>
          )}
        </div>

        {/* ALT BİLGİ */}
        <p className="text-center text-[10px] text-slate-600 mt-6 px-4">
          Devam ederek <a href="#" className="underline hover:text-slate-400">Hizmet Şartları</a>'nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
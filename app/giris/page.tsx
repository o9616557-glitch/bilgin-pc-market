"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, UserCircle2, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Şefim, API bağlantısı yapıldığında bu buton NextAuth ile veritabanına gidecek.");
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>

      <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.05)] p-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00e5ff] transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={16} /> Mağazaya Dön
        </Link>

        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
          GİRİŞ YAP
        </h1>
        {/* ŞEFİM: METİN KURUMSALLAŞTIRILDI */}
        <p className="text-slate-400 text-sm mb-8 font-medium">Güvenli alışveriş ve sipariş takibi için hesabınıza giriş yapın.</p>

        <div className="flex gap-3 mb-6">
          <button 
            type="button" 
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex-1 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span className="text-sm font-bold text-white">Google</span>
          </button>

          <button 
            type="button" 
            onClick={() => signIn('facebook', { callbackUrl: '/' })} 
            className="flex-1 hover:bg-white/10 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all group text-[#1877F2]"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span className="text-sm font-bold text-white">Facebook</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Veya E-Posta İle</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Posta Adresiniz"
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz"
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#00e5ff] text-black rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] mt-2">
            GİRİŞ YAP
          </button>
        </form>

        <div className="text-center mb-6">
          <p className="text-slate-400 text-sm">
            Hesabınız yok mu? <Link href="/kayit" className="text-[#00e5ff] font-bold hover:underline">Yeni Kayıt Oluştur</Link>
          </p>
        </div>

        <div className="pt-6 border-t border-white/10">
         <Link href="/" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 flex items-center justify-center gap-2 text-slate-300 hover:text-white hover:bg-white/10 transition-all font-bold text-sm uppercase group">
            Üye Olmadan Devam Et <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
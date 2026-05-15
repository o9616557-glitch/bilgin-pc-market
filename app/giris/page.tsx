"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Şefim buraya ileride gerçek giriş API'sini bağlayacağız.
    // Şimdilik butona basıldığında 1.5 saniye dönme efekti yapıyor.
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden bg-[#050810]">
      
      {/* ARKAPLAN EFEKTLERİ (Gamer Tarzı Neon Işıklar) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* GİRİŞ KUTUSU */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Başlık Alanı */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-black italic tracking-tighter mb-4">
            BİLGİN<span className="text-blue-500 not-italic uppercase">PC</span>
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Hoş Geldiniz</h1>
          <p className="text-slate-400 text-sm font-medium">Hesabınıza giriş yaparak alışverişe devam edin.</p>
        </div>

        {/* Form Alanı */}
        <div className="bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* E-Posta */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">E-Posta Adresi</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ornek@mail.com" 
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Şifre</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Hatırla ve Şifremi Unuttum */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-5 h-5 border border-slate-600 rounded flex items-center justify-center group-hover:border-blue-500 transition-colors">
                  <input type="checkbox" className="opacity-0 absolute w-0 h-0 peer" />
                  <svg className="w-3 h-3 text-transparent peer-checked:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">Beni Hatırla</span>
              </label>
              
              <Link href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Şifremi Unuttum</Link>
            </div>

            {/* Giriş Butonu */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>

          {/* Kayıt Ol Yönlendirmesi */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-medium text-slate-400">
              Hesabınız yok mu? <Link href="#" className="text-white font-bold hover:text-blue-500 transition-colors uppercase tracking-wide ml-1">Kayıt Ol</Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Şefim buraya ileride gerçek giriş API'sini bağlayacağız.
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
            
            {/* E-Posta veya Kullanıcı Adı (Türü "text" yapıldı ki ikisini de kabul etsin) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">E-Posta veya Kullanıcı Adı</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="E-posta veya kullanıcı adınız..." 
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

          {/* VEYA ÇİZGİSİ */}
          <div className="relative flex items-center py-6 mt-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">Hızlı Giriş</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* GOOGLE VE FACEBOOK BUTONLARI */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 py-3.5 rounded-xl transition-all group">
               <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
               </svg>
               <span className="text-xs font-bold text-slate-300 group-hover:text-white tracking-widest uppercase">Google</span>
            </button>
            
            <button type="button" className="flex items-center justify-center space-x-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 py-3.5 rounded-xl transition-all group">
               <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
               </svg>
               <span className="text-xs font-bold text-[#1877F2] tracking-widest uppercase">Facebook</span>
            </button>
          </div>

          {/* Kayıt Ol Yönlendirmesi */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm font-medium text-slate-400">
              Hesabınız yok mu? <Link href="#" className="text-white font-bold hover:text-blue-500 transition-colors uppercase tracking-wide ml-1">Kayıt Ol</Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
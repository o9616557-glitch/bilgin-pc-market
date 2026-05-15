"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚀 GERÇEK GİRİŞ FONKSİYONU
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("https://bilginpcmarket.com/wp-json/jwt-auth/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: identifier,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Başarılı: Token'ı yerel hafızaya at ve ana sayfaya uçur
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_display_name", data.user_display_name);
        router.push("/");
      } else {
        setError("Giriş bilgileri hatalı. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen internetinizi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden font-sans">
      
      {/* ARKA PLAN GAMER IŞIKLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* LOGO BÖLÜMÜ */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-4xl font-black italic tracking-tighter text-white uppercase group transition-transform hover:scale-105">
            BİLGİN<span className="text-blue-500 not-italic">PC</span>
          </Link>
          <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
        </div>

        <div className="bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          
          {/* GİRİŞ YAPILIYOR PERDESİ */}
          {isLoading && (
            <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-md z-50 rounded-3xl flex flex-col items-center justify-center space-y-4">
               <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Sistem Bağlanıyor...</span>
            </div>
          )}

          <h1 className="text-xl font-black text-white uppercase tracking-widest text-center mb-8">Giriş Paneli</h1>

          {/* HATA MESAJI */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-wider animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* KULLANICI ADI GİRDİSİ */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Kullanıcı Adı veya Mail</label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="bilgin_gamer" 
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
              />
            </div>

            {/* ŞİFRE GİRDİSİ */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Şifre</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-[9px] font-black uppercase tracking-tighter">
                  {showPassword ? "GİZLE" : "GÖSTER"}
                </button>
              </div>
              
              {/* ŞİFREMİ UNUTTUM (TAM ŞİFRENİN ALTINDA) */}
              <div className="flex justify-end pt-1">
                <Link href="/sifre-sifirla" className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-all uppercase tracking-widest">
                  Şifremi Unuttum?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Giriş Yap
            </button>
          </form>

          {/* AYIRICI ÇİZGİ */}
          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink-0 mx-4 text-slate-700 text-[10px] font-black uppercase tracking-widest">Hızlı Erişim</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <button type="button" className="bg-white/5 border border-white/5 py-3.5 rounded-xl text-[10px] font-black text-slate-300 uppercase hover:bg-white/10 transition-all">Google</button>
                <button type="button" className="bg-blue-600/5 border border-blue-600/20 py-3.5 rounded-xl text-[10px] font-black text-blue-500 uppercase hover:bg-blue-600/10 transition-all">Facebook</button>
            </div>

            <button 
                onClick={() => router.push("/")}
                className="w-full py-4 bg-white/5 border border-white/5 hover:border-green-500/20 text-slate-500 hover:text-green-500 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.2em]"
            >
                Üye Olmadan Devam Et
            </button>
          </div>

          {/* KAYIT OL BÖLÜMÜ (EN ALTTA) */}
          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
              Hesabınız yok mu? 
              <Link href="/kayit" className="text-white font-black hover:text-blue-500 ml-2 transition-colors uppercase">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
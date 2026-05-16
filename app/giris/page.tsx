"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚀 TELEFONDA GERİ TUŞUNA BASINCA YÜKLENİYOR EKRANINI KAPATAN SENSÖR
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsLoading(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("https://bilginpcmarket.com/wp-json/jwt-auth/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password: password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_display_name", data.user_display_name);
        router.push("/");
      } else {
        setError("Kullanıcı adı veya şifre hatalı. Lütfen kontrol edin.");
      }
    } catch (err) {
      setError("Dükkan sunucusuna bağlanılamadı. İnternetinizi kontrol edin.");
    } {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    setIsLoading(true);
    window.location.href = `https://bilginpcmarket.com/wp-login.php?loginSocial=${platform.toLowerCase()}`;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10 bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        
        {isLoading && (
          <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
               <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Sistem Bağlanıyor...</span>
          </div>
        )}

        {/* UNIFIED LOGO VE BAŞLIK ALANI */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-4xl font-black italic tracking-tighter text-white uppercase">
            BİLGİN<span className="text-blue-500 not-italic">PC</span>
          </Link>
          <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest mt-6">Giriş Yap</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Kullanıcı Adı veya Mail</label>
            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required placeholder="Kullanıcı adınız..." className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Şifre</label>
              <Link href="/sifre-sifirla" className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">Şifremi Unuttum?</Link>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-[10px] font-black uppercase">
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            Giriş Yap
          </button>
        </form>

        <div className="relative flex items-center py-8">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink-0 mx-4 text-slate-700 text-[10px] font-black uppercase tracking-widest">Hızlı Erişim</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => handleSocialLogin('Google')} className="bg-white/5 border border-white/5 py-3.5 rounded-xl text-[10px] font-black text-slate-300 uppercase hover:bg-white/10 transition-all">Google</button>
              <button type="button" onClick={() => handleSocialLogin('Facebook')} className="bg-blue-600/5 border border-blue-600/20 py-3.5 rounded-xl text-[10px] font-black text-blue-500 uppercase hover:bg-blue-600/10 transition-all">Facebook</button>
          </div>
          <button onClick={() => router.push("/")} className="w-full py-4 bg-white/5 border border-white/5 hover:border-green-500/20 text-slate-500 hover:text-green-500 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.2em]">
              Üye Olmadan Devam Et
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            Hesabınız yok mu? <Link href="/kayit" className="text-white font-black hover:text-blue-500 ml-2 uppercase">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚀 HEM GOOGLE HEM FACEBOOK İÇİN VAZGEÇİNCE EKRANI AÇAN ÇİFT SENSÖR
  useEffect(() => {
    const resetLoading = () => setIsLoading(false);
    window.addEventListener("pageshow", resetLoading);
    window.addEventListener("focus", resetLoading); // Ekran tekrar öne gelince yüklemeyi bitirir
    return () => {
      window.removeEventListener("pageshow", resetLoading);
      window.removeEventListener("focus", resetLoading);
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/giris?success=true");
      } else {
        setError(data.error ? data.error.replace(/<[^>]*>?/gm, '') : "Kayıt yapılamadı.");
      }
    } catch (err) {
      setError("Bağlantı hatası! Lütfen tekrar deneyin.");
    } finally {
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

        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-4xl font-black italic tracking-tighter text-white uppercase">
            BİLGİN<span className="text-blue-500 not-italic">PC</span>
          </Link>
          <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest mt-6">Kayıt Merkezi</h1>
        </div>

        {/* 🛠️ YENİ RENK: AMBER/TURUNCU VE KÜÇÜK HARF UYUMLU UYARI KUTUSU */}
        {error && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-semibold text-center normal-case">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Kullanıcı Adı</label>
            <input type="text" required onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" placeholder="Kullanıcı adınız..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">E-Posta Adresi</label>
            <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" placeholder="posta@adres.com" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Şifre</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-[10px] font-black uppercase">
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            Kayıt Ol
          </button>
        </form>

        <div className="relative flex items-center py-8">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink-0 mx-4 text-slate-700 text-[10px] font-black uppercase tracking-widest">Veya</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => handleSocialLogin('Google')} className="bg-white/5 border border-white/5 py-3.5 rounded-xl text-[10px] font-black text-slate-300 uppercase hover:bg-white/10 transition-all">Google</button>
              <button type="button" onClick={() => handleSocialLogin('Facebook')} className="bg-blue-600/5 border border-blue-600/20 py-3.5 rounded-xl text-[10px] font-black text-blue-500 uppercase hover:bg-blue-600/10 transition-all">Facebook</button>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            Zaten üye misin? <Link href="/giris" className="text-white font-black hover:text-blue-500 ml-2 uppercase">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
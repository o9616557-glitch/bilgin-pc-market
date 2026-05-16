"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const key = searchParams.get("key") || "";
  const login = searchParams.get("login") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const resetLoading = () => setIsLoading(false);
    window.addEventListener("pageshow", resetLoading);
    return () => window.removeEventListener("pageshow", resetLoading);
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor şefim.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 🚀 ŞEFİM: Az önce oluşturduğumuz o güvenli ve özel API kapısına şutluyoruz
      const res = await fetch("https://bilginpcmarket.com/wp-json/bilginpc/v1/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: key,
          login: login,
          password: password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/giris");
        }, 3000);
      } else {
        // WordPress'ten gelen gerçek hata mesajını (Örn: Linkin süresi dolmuş) ekrana basar
        setError(data.message || "Şifre güncellenemedi, link geçersiz olabilir.");
      }

    } catch (err) {
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Şifre Güncelleniyor...</span>
        </div>
      )}

      <div className="text-center mb-8">
        <Link href="/" className="inline-block text-4xl font-black italic tracking-tighter text-white uppercase">
          BİLGİN<span className="text-blue-500 not-italic">PC</span>
        </Link>
        <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
        <h1 className="text-xl font-black text-white uppercase tracking-widest mt-6">Yeni Şifre</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-semibold text-center normal-case">
          {error}
        </div>
      )}

      {!isSuccess ? (
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Yeni Şifre</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-[10px] font-black uppercase">
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Yeni Şifre (Tekrar)</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" 
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            Şifreyi Güncelle
          </button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            ✓
          </div>
          <p className="text-slate-300 text-sm font-medium px-2 leading-relaxed">
            Şifreniz başarıyla güncellendi şefim! Giriş sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <Suspense fallback={<div className="text-white text-xs font-black uppercase tracking-widest">Yükleniyor...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
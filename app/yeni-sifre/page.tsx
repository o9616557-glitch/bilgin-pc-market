"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 1. ADIM: İŞLEM MOTORUNU AYRI BİR İSKELETE ALIYORUZ (Vercel'in çökmemesi için)
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
      const res = await fetch("https://bilginpcmarket.com/wp-json/bilgin/v1/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: key,
          login: login,
          password: password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/giris");
        }, 3000);
      } else {
        setError(data.message || "Şifre sıfırlanırken bir hata oluştu.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050814] text-white">
      <div className="w-full max-w-md bg-[#0b1329] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl">
        <h1 className="text-xl sm:text-2xl font-black mb-6 text-center text-blue-400 uppercase tracking-wider">Yeni Şifre Belirle</h1>
        
        {isSuccess ? (
          <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center font-bold text-sm">
            ✅ Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
            {error && <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs font-bold text-center">{error}</div>}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Yeni Şifre</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full bg-[#050814]/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-slate-200"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Şifre Tekrar</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full bg-[#050814]/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-slate-200"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer w-max group">
              <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="w-4 h-4 rounded border-white/10 bg-[#050814] text-blue-600 focus:ring-0 cursor-pointer" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-slate-300 transition-colors">Şifreyi Göster</span>
            </label>

            <button type="submit" disabled={isLoading} className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-lg text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// 2. ADIM: SAYFAYI SUSPENSE (KALKAN) İÇİNDE DIŞARI AKTARIYORUZ
export default function YeniSifrePage() {
  return (
    // Bu Suspense kalkanı sayesinde Vercel derlerken "searchParams okunamıyor" diye çökmez!
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-400 font-black text-sm uppercase tracking-widest bg-[#050814]">Yükleniyor...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
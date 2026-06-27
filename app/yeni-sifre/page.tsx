"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

function YeniSifreIcerik() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // 🚀 Maildeki gizli bileti linkten çekiyoruz

  // Eğer linkte token yoksa kullanıcıyı çakallık yapmasın diye girişe geri şutluyoruz
  useEffect(() => {
    if (!token) {
      toast.error("Geçersiz veya eksik şifre sıfırlama bağlantısı.");
      router.push("/giris");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Şifrelerin uyuşma kontrolü
    if (newPassword !== confirmPassword) {
      toast.error("Şifreler birbiriyle uyuşmuyor!");
      return;
    }

    // 2. Şifre uzunluğu kontrolü
    if (newPassword.length < 6) {
      toast.error("Yeni şifreniz en az 6 karakter olmalıdır!");
      return;
    }

    setIsLoading(false);
    const loadingToast = toast.loading("Yeni şifreniz kaydediliyor...");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Harika! Şifreniz başarıyla güncellendi.");
        router.push("/giris"); // Başarılıysa giriş sayfasına şutla
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanırken bir hata oluştu.");
    }
  };

  return (
    <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.05)] p-8 relative z-10">
      
      <Link href="/giris" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#3b82f6] transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
        <ArrowLeft size={16} /> Giriş Yap'a Dön
      </Link>

      <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
        YENİ ŞİFRE BELİRLE
      </h1>
      <p className="text-slate-400 text-sm mb-8 font-medium">
        Hesabınız için yeni ve güçlü bir şifre belirleyin.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Yeni Şifre Kutusu */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type={showPassword ? "text" : "password"} 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Yeni Şifreniz (En az 6 hane)" 
            className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
            required 
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Şifre Tekrar Kutusu */}
        <div className="relative mb-2">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type={showPassword ? "text" : "password"} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni Şifre Tekrar" 
            className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#3b82f6] text-black rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50"
        >
          {isLoading ? "GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
        </button>
      </form>

    </div>
  );
}

// 🚀 VERCEL'İ ÇÖKMEKTEN KURTARAN ANA KALKAN (SUSPENSE)
export default function YeniSifrePage() {
  return (
    <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arka Plan Efekti */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
      <Suspense fallback={<div className="text-[#3b82f6] font-black uppercase tracking-widest text-sm animate-pulse relative z-10">Sayfa Hazırlanıyor...</div>}>
        <YeniSifreIcerik />
      </Suspense>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function SifreSifirlaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading("Şifre sıfırlama bağlantısı gönderiliyor...");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Harika! Şifre sıfırlama linki e-postanıza gönderildi.");
        setEmail(""); // Kutuyu temizle
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arka Plan Efekti */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
      <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.05)] p-8 relative z-10">
        
        {/* Geri Dön Linki */}
        <Link href="/giris" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#3b82f6] transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={16} /> Giriş Yap'a Dön
        </Link>

        {/* Başlık ve Açıklama */}
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
          ŞİFREMİ UNUTTUM
        </h1>
        <p className="text-slate-400 text-sm mb-8 font-medium">
          Kayıtlı e-posta adresinizi girin. Size yeni bir şifre belirlemeniz için güvenli bir bağlantı göndereceğiz.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative mb-2">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Posta Adresiniz" 
              className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
              required 
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#3b82f6] text-black rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "GÖNDERİLİYOR..." : "SIFIRLAMA LİNKİ GÖNDER"}
          </button>
        </form>

      </div>
    </div>
  );
}
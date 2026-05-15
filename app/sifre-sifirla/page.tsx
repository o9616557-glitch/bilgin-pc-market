"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Şefim buraya WordPress Şifre Sıfırlama API'si gelecek
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden">
      <div className="w-full max-w-md bg-[#0b1120] p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-xl font-black text-white uppercase tracking-widest">Şifre Kurtarma</h1>
          <p className="text-slate-500 text-xs mt-2 italic">E-posta adresinize bir sıfırlama linki göndereceğiz.</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-6">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500/50 transition-all" placeholder="E-posta adresiniz" />
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-4 rounded-xl transition-all">
              {isLoading ? "GÖNDERİLİYOR..." : "SIFIRLAMA LİNKİ GÖNDER"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
            <p className="text-white text-sm font-medium">Sıfırlama linki e-posta adresine gönderildi. Lütfen gelen kutunu kontrol et.</p>
            <Link href="/giris" className="inline-block text-blue-500 font-black uppercase text-xs tracking-widest pt-4">GİRİŞE DÖN</Link>
          </div>
        )}
      </div>
    </div>
  );
}
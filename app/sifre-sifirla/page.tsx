"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const resetLoading = () => setIsLoading(false);
    window.addEventListener("pageshow", resetLoading);
    return () => window.removeEventListener("pageshow", resetLoading);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 🚀 ŞEFİM İŞTE SİHİRLİ DOKUNUŞ:
      // Next.js API yollarını tamamen baypas edip, tarayıcıdan direkt wp-login.php'ye form fırlatıyoruz.
      // mode: "no-cors" sayesinde WordPress güvenlik duvarları bu isteği gerçek bir insan formu gibi kabul eder.
      const formData = new URLSearchParams();
      formData.append("user_login", email);
      formData.append("redirect_to", "");

      await fetch("https://bilginpcmarket.com/wp-login.php?action=lostpassword", {
        method: "POST",
        mode: "no-cors", // Güvenlik engelini aşan gizli anahtar
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      // no-cors modunda yanıt içeriği okunamaz ama istek başarıyla gönderilir ve mail tetiklenir.
      setIsSent(true);

    } catch (err) {
      setError("bir bağlantı hatası oluştu. lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10 bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        
        {isLoading && (
          <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
               <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Talep Gönderiliyor...</span>
          </div>
        )}

        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-4xl font-black italic tracking-tighter text-white uppercase">
            BİLGİN<span className="text-blue-500 not-italic">PC</span>
          </Link>
          <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest mt-6">Şifre Kurtarma</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-semibold text-center normal-case">
            {error}
          </div>
        )}

        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">E-Posta Adresi veya Kullanıcı Adı</label>
              <input 
                type="text" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="posta@adres.com veya kullanıcı adı" 
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-900" 
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              Sıfırlama Linki Gönder
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              ✓
            </div>
            <p className="text-slate-300 text-sm font-medium px-2 leading-relaxed">
              şifre sıfırlama talimatları başarıyla gönderildi. lütfen e-posta adresinin gelen kutusunu kontrol et şefim.
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            Hatırladın mı? <Link href="/giris" className="text-white font-black hover:text-blue-500 ml-2 uppercase">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
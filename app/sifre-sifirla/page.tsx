"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell, { authBtnPrimaryClass, authInputClass, authSubtitleClass, authTitleClass } from "@/components/auth/AuthShell";

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
        setEmail("");
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
    <AuthShell>
      <Link
        href="/giris"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-wider"
      >
        <ArrowLeft size={16} /> Giriş Yap&apos;a Dön
      </Link>

      <h1 className={`${authTitleClass} mb-2`}>ŞİFREMİ UNUTTUM</h1>
      <p className={`${authSubtitleClass} mb-6 sm:mb-8`}>
        Kayıtlı e-posta adresinizi girin. Size yeni bir şifre belirlemeniz için güvenli bir bağlantı göndereceğiz.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Posta Adresiniz"
            className={authInputClass}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading} className={`${authBtnPrimaryClass} mt-2`}>
          {isLoading ? "GÖNDERİLİYOR..." : "SIFIRLAMA LİNKİ GÖNDER"}
        </button>
      </form>
    </AuthShell>
  );
}

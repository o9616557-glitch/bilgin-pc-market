"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell, { authBtnPrimaryClass, authFormGapClass, authInputClass, authSubtitleClass, authTitleClass } from "@/components/auth/AuthShell";

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
      <div className="max-lg:flex max-lg:flex-col max-lg:h-full max-lg:min-h-0 max-lg:justify-between lg:block">
        <div className="max-lg:shrink-0">
          <Link
            href="/giris"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2 lg:mb-6 text-xs lg:text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Giriş Yap&apos;a Dön
          </Link>

          <h1 className={`${authTitleClass} mb-2`}>ŞİFREMİ UNUTTUM</h1>
          <p className={`${authSubtitleClass} mb-2 lg:mb-8`}>
            <span className="lg:hidden">E-postanıza sıfırlama linki gönderilir.</span>
            <span className="hidden lg:inline">
              Kayıtlı e-posta adresinizi girin. Size yeni bir şifre belirlemeniz için güvenli bir bağlantı göndereceğiz.
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`${authFormGapClass} max-lg:flex-1 max-lg:flex max-lg:flex-col max-lg:justify-center lg:block`}>
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

          <button type="submit" disabled={isLoading} className={`${authBtnPrimaryClass} mt-1 lg:mt-2`}>
            {isLoading ? "GÖNDERİLİYOR..." : "SIFIRLAMA LİNKİ GÖNDER"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}

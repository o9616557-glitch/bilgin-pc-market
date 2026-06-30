"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell, { authBtnPrimaryClass, authInputClass, authSubtitleClass, authTitleClass } from "@/components/auth/AuthShell";

function YeniSifreIcerik() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Geçersiz veya eksik şifre sıfırlama bağlantısı.");
      router.push("/giris");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Şifreler birbiriyle uyuşmuyor!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Yeni şifreniz en az 6 karakter olmalıdır!");
      return;
    }

    setIsLoading(true);
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
        router.push("/giris");
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

      <h1 className={`${authTitleClass} mb-2`}>YENİ ŞİFRE BELİRLE</h1>
      <p className={`${authSubtitleClass} mb-6 sm:mb-8`}>
        Hesabınız için yeni ve güçlü bir şifre belirleyin.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Yeni Şifreniz (En az 6 hane)"
            className={`${authInputClass} pr-12`}
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

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni Şifre Tekrar"
            className={`${authInputClass} pr-12`}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className={`${authBtnPrimaryClass} mt-2`}>
          {isLoading ? "GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function YeniSifrePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white/60 font-black uppercase tracking-widest text-sm animate-pulse">
          Sayfa Hazırlanıyor...
        </div>
      }
    >
      <YeniSifreIcerik />
    </Suspense>
  );
}

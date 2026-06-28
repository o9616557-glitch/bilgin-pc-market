"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function OnayIcerik() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Hesabınız doğrulanıyor, lütfen bekleyin...");

  // 🚀 BİNGO: HAYALET TIKLAMAYI ENGELLEYEN KİLİT
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Geçersiz veya eksik onay bağlantısı.");
      return;
    }

    // Eğer kod saniyenin binde biri hızında ikinci kez çalışmaya kalkarsa, buradan geri dön!
    if (hasFetched.current) return;
    hasFetched.current = true; // Kapıyı kilitledik

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/user/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Harika! E-posta adresiniz başarıyla doğrulandı. Artık giriş yapabilirsiniz.");
          toast.success("Hesabınız onaylandı!");
        } else {
          setStatus("error");
          setMessage(data.message || "Bir hata oluştu.");
          toast.error(data.message || "Onay başarısız.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Sunucuya bağlanırken bir hata oluştu.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.05)] p-8 relative z-10 text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-[#3b82f6] animate-spin" />
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">HESAP ONAYLANIYOR</h1>
          <p className="text-slate-400 text-sm font-medium">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">TEBRİKLER!</h1>
          <p className="text-slate-400 text-sm font-medium mb-4">{message}</p>
          <Link href="/giris" className="w-full bg-[#3b82f6] text-black rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            GİRİŞ YAPMAYA GİT
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <XCircle className="w-16 h-16 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]" />
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">ONAY BAŞARISIZ</h1>
          <p className="text-slate-400 text-sm font-medium mb-4">{message}</p>
          <Link href="/kayit" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            YENİDEN KAYIT OL
          </Link>
        </div>
      )}
    </div>
  );
}

export default function EpostaOnaylaPage() {
  return (
    <div className="min-h-screen bg-[#050814] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      <Suspense fallback={
        <div className="text-white flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      }>
        <OnayIcerik />
      </Suspense>
    </div>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, CreditCard, Package, LogOut } from "lucide-react";

export default function HesabimPage() {
  const { data: session } = useSession();

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    await signOut({ callbackUrl: "/" });
  };

  const userName = session?.user?.name || "Özkan";
  const userEmail = session?.user?.email || "";
  const basHarf = userName ? userName.charAt(0).toUpperCase() : "Ö";

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-8 relative overflow-hidden">
      {/* 🌌 ARKA PLAN UZAY IŞIKLARI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10">

        {/* ⬅️ SOL MENÜ (SİDEBAR) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <nav className="flex flex-col gap-1">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white font-medium shadow-inner transition-all">
                <User className="w-5 h-5 text-slate-400" /> Profil
              </Link>
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-5 h-5" /> Güvenlik
              </Link>
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-5 h-5" /> Ödeme Yöntemleri
              </Link>
              <Link href="/siparislerim" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <Package className="w-5 h-5" /> Siparişlerim
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ TARAF (ANA KUMANDA MERKEZİ) */}
        <div className="flex-1 flex flex-col min-w-0 gap-6">

          {/* 🏆 1. ADIM: NEON PROFİL KARTI (Görselin Birebir Aynısı!) */}
          <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10 shadow-[0_0_50px_rgba(0,210,255,0.15)] group">
            {/* Dış Parlama Efekti */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem] transition-opacity duration-500"></div>

            <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border border-cyan-500/20 overflow-hidden z-10">

              {/* Sol Arka Plan Işığı */}
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>

              {/* ⚡ CYBERPUNK AVATAR (Metalik Halkalar ve Neon Parlamalar) */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                {/* Dış Metalik Kasa */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.5)]"></div>
                
                {/* İç Neon Halka (Dönen Işık Efekti) */}
                <div className="absolute inset-2.5 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,255,0.4),inset_0_0_20px_rgba(34,211,255,0.2)] border-t-cyan-300 animate-[spin_8s_linear_infinite]"></div>
                
                {/* En İç Karanlık Göbek */}
                <div className="absolute inset-4 bg-[#020617] rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] border border-cyan-900/50">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,255,0.8)]">
                    {basHarf}
                  </span>
                </div>
              </div>

              {/* 👤 İSİM VE E-POSTA */}
              <div className="flex-1 text-center sm:text-left z-10">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1 sm:mb-2 drop-shadow-md">
                  {userName}
                </h1>
                <p className="text-slate-400 text-sm sm:text-base font-medium tracking-wide">
                  {userEmail}
                </p>
              </div>

              {/* 🚪 ÇIKIŞ BUTONU */}
              <button onClick={handleCikisYap} className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 hover:text-red-300 hover:border-red-500/50 transition-all font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                <LogOut className="w-4 h-4" /> Çıkış
              </button>

            </div>
          </div>

          {/* ALT KISIM BAŞLIĞI */}
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4 ml-2">
            HESAP YÖNETİMİ
          </h2>

          {/* 🧩 2. ADIM İÇİN YER TUTUCU İSKELETLER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1 bg-[#0f172a] border border-slate-800/50 rounded-2xl p-6 min-h-[300px] flex items-center justify-center border-dashed">
              <span className="text-slate-600 text-sm font-medium">Son İşlemler Tablosu Gelecek</span>
            </div>

            <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">
              <div className="flex-1 bg-[#0f172a] border border-slate-800/50 rounded-2xl p-6 flex items-center justify-center border-dashed">
                 <span className="text-slate-600 text-sm font-medium">Grafikler ve Harcama Dağılımı Gelecek</span>
              </div>
            </div>

            <div className="lg:col-span-3 xl:col-span-1 bg-[#0f172a] border border-slate-800/50 rounded-2xl p-6 min-h-[300px] flex items-center justify-center border-dashed">
               <span className="text-slate-600 text-sm font-medium">Sistemlerim Kutuları Gelecek</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
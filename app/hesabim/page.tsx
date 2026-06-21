"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Heart, Server, MapPin, ShieldAlert, LogOut, ChevronRight, User, Mail, Truck } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function HesabimPage() {
  const { data: session } = useSession();

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    await signOut({ callbackUrl: "/" }); 
  };

  const garajlar = [
    { 
      id: "siparisler", 
      isim: "Siparişlerim", 
      aciklama: "Kargodaki ve geçmiş siparişlerin", 
      ikon: Package, 
      link: "/siparislerim", 
      renk: "text-[#3b82f6]", 
      bg: "bg-[#3b82f6]/10",
      border: "group-hover:border-[#3b82f6]/30" 
    },
    { 
      id: "siparis-takip", 
      isim: "Sipariş Takip", 
      aciklama: "Kargonun anlık durumunu izle", 
      ikon: Truck, 
      link: "/siparis-takip", 
      renk: "text-purple-400", 
      bg: "bg-purple-500/10",
      border: "group-hover:border-purple-500/30" 
    },
    { 
      id: "sistemlerim", 
      isim: "Sistemlerim", 
      aciklama: "Topladığın özel PC canavarları", 
      ikon: Server, 
      link: "/sistemlerim", 
      renk: "text-[#00d2ff]", 
      bg: "bg-[#00d2ff]/10",
      border: "group-hover:border-[#00d2ff]/30" 
    },
    { 
      id: "favoriler", 
      isim: "Favorilerim", 
      aciklama: "Gözüne kestirdiğin donanımlar", 
      ikon: Heart, 
      link: "/favorilerim", 
      renk: "text-rose-400", 
      bg: "bg-rose-500/10",
      border: "group-hover:border-rose-500/30" 
    },
    { 
      id: "adresler", 
      isim: "Adreslerim", 
      aciklama: "Teslimat ve fatura bilgilerin", 
      ikon: MapPin, 
      link: "/adreslerim", 
      renk: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      border: "group-hover:border-emerald-500/30" 
    },
    { 
      id: "yonetim", 
      isim: "Yönetim Paneli", 
      aciklama: "Dükkanın ana kumanda merkezi", 
      ikon: ShieldAlert, 
      link: "/admin", 
      renk: "text-amber-400", 
      bg: "bg-amber-500/10",
      border: "group-hover:border-amber-500/30" 
    },
  ];

  const userName = session?.user?.name || "Değerli Müşterimiz";
  const userEmail = session?.user?.email || "";
  const basHarf = userName !== "Değerli Müşterimiz" ? userName.charAt(0).toUpperCase() : "V";
  const isAdmin = userEmail.toLowerCase() === "o9616557@gmail.com";

  return (
    <div className="min-h-screen bg-[#050814] text-white pt-8 sm:pt-12 pb-24 px-4 relative font-sans">
      
      {/* ZARİF ARKA PLAN PARLAMASI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00d2ff] blur-[150px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* 🏆 ÜST GİRİŞ LOBİSİ (Cam Etkili, Minimal ve Yeşil Rozetli) */}
        <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          
          {/* Arka plan süsü */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#3b82f6]/5 to-transparent pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 relative z-10">
            
            {/* AVATAR (Kusursuz Yuvarlak, Kibar) */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#00d2ff] p-[2px] shrink-0 shadow-[0_0_20px_rgba(0,210,255,0.15)]">
              <div className="w-full h-full bg-[#050814] rounded-full flex items-center justify-center">
                 <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#00d2ff]">
                   {basHarf}
                 </span>
              </div>
            </div>
            
            {/* KULLANICI BİLGİLERİ VE YEŞİL ROZET */}
            <div className="text-center sm:text-left flex-1 flex flex-col justify-center h-full mt-2 sm:mt-0">
              
              {/* YEŞİL VIP ROZETİ */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-3.5 mx-auto sm:mx-0 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> VIP MÜŞTERİ
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight break-words leading-none">
                {userName}
              </h1>
              {userEmail && <p className="text-slate-400 text-xs sm:text-sm mt-2 font-medium">{userEmail}</p>}
            </div>

            {/* ÇIKIŞ BUTONU */}
            <button 
              onClick={handleCikisYap} 
              className="mt-4 sm:mt-0 sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] sm:text-xs shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" /> Çıkış
            </button>
          </div>
        </div>

        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Hesap Kumanda Merkezi</h2>

        {/* 🚀 KİBAR & ZARİF MENÜ LİSTESİ (Kaba Kutular Gitti!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {garajlar.map((garaj) => {
            const Icon = garaj.ikon;
            if (garaj.id === "yonetim" && !isAdmin) return null;

            return (
              <Link 
                href={garaj.link} 
                prefetch={true} 
                key={garaj.id}
                className={`group flex items-center p-4 sm:p-5 rounded-2xl bg-[#09090b] border border-white/5 hover:bg-white/[0.02] transition-all duration-300 ${garaj.border}`}
              >
                {/* İKON ALANI (Kompakt ve Zarif) */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border border-white/5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${garaj.bg}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${garaj.renk}`} />
                </div>

              {/* YAZI ALANI */}
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors truncate">
                    {garaj.isim}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1 truncate">
                    {garaj.aciklama}
                  </p>
                </div>

                {/* OK İŞARETİ */}
                <div className="w-8 h-8 rounded-full bg-[#121215] flex items-center justify-center border border-white/5 group-hover:border-white/10 group-hover:bg-white/5 transition-all ml-2 shrink-0">
                   <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
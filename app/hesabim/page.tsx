"use client";

import React from "react";
import Link from "next/link";
import { Package, Heart, Server, MapPin, ShieldAlert, LogOut, ChevronRight, Truck } from "lucide-react";
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
      aciklama: "Kargodaki ve geçmiş siparişleriniz", 
      ikon: Package, 
      link: session ? "/siparislerim" : "/giris", 
      renk: "text-[#3b82f6]", 
      bg: "bg-[#3b82f6]/10",
      border: "group-hover:border-[#3b82f6]/30" 
    },
    { 
      id: "siparis-takip", 
      isim: "Sipariş Takip", 
      aciklama: "Kargonuzun anlık durumunu izleyin", 
      ikon: Truck, 
      link: "/siparis-takip", 
      renk: "text-orange-400", 
      bg: "bg-orange-500/10",
      border: "group-hover:border-orange-500/30" 
    },
    { 
      id: "sistemlerim", 
      isim: "Sistemlerim", 
      aciklama: "Topladığınız özel bilgisayarlar", 
      ikon: Server, 
      link: session ? "/sistemlerim" : "/giris", 
      renk: "text-[#00d2ff]", 
      bg: "bg-[#00d2ff]/10",
      border: "group-hover:border-[#00d2ff]/30" 
    },
    { 
      id: "favoriler", 
      isim: "Favorilerim", 
      aciklama: "İlginizi çeken donanımlar", 
      ikon: Heart, 
      link: session ? "/favorilerim" : "/giris", 
      renk: "text-rose-400", 
      bg: "bg-rose-500/10",
      border: "group-hover:border-rose-500/30" 
    },
    { 
      id: "adresler", 
      isim: "Adreslerim", 
      aciklama: "Teslimat ve fatura bilgileriniz", 
      ikon: MapPin, 
      link: session ? "/adreslerim" : "/giris", 
      renk: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      border: "group-hover:border-emerald-500/30" 
    },
    { 
      id: "yonetim", 
      isim: "Yönetim Paneli", 
      aciklama: "Mağaza yönetim ekranı", 
      ikon: ShieldAlert, 
      link: session ? "/admin" : "/giris", 
      renk: "text-amber-400", 
      bg: "bg-amber-500/10",
      border: "group-hover:border-amber-500/30" 
    },
  ];

  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";
  const basHarf = userName ? userName.charAt(0).toUpperCase() : "";
  const isAdmin = userEmail.toLowerCase() === "o9616557@gmail.com";

  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 sm:pt-16 pb-32 px-4 sm:px-6 relative font-sans">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* 🏆 ÜST LOBİ EKRANI */}
        {session ? (
          /* GİRİŞ YAPAN MÜŞTERİ KARTI */
          <div className="bg-[#09090b] border border-white/5 rounded-3xl p-6 py-8 sm:p-10 mb-12 shadow-xl">
            <div className="flex flex-row items-center gap-5 sm:gap-8">
              
              {/* AVATAR */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#121215] border border-[#3b82f6]/30 flex items-center justify-center shrink-0">
                 <span className="text-3xl sm:text-5xl font-black text-[#3b82f6]">
                   {basHarf}
                 </span>
              </div>
              
              {/* KULLANICI BİLGİLERİ */}
              <div className="text-left flex-1 flex flex-col justify-center min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-2 sm:mb-4 w-fit">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#3b82f6]"></span> BİLGİN PC ÜYESİ
                </div>
                <h1 className="text-xl sm:text-4xl font-black text-white tracking-tight truncate leading-tight">
                  {userName}
                </h1>
                {userEmail && <p className="text-slate-400 text-xs sm:text-base mt-1.5 sm:mt-3 font-medium truncate">{userEmail}</p>}
              </div>
              
              {/* ÇIKIŞ BUTONU */}
              <button 
                onClick={handleCikisYap} 
                className="flex items-center justify-center gap-2 p-3.5 sm:px-6 sm:py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest shrink-0"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:block text-xs">Çıkış</span>
              </button>
            </div>
          </div>
        ) : (
          /* GİRİŞ YAPMAMIŞ (ZİYARETÇİ) KARTI */
          <div className="bg-[#09090b] border border-white/10 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10">
              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 mx-auto md:mx-0 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span> HOŞ GELDİNİZ
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4 uppercase">
                  BİLGİN PC <span className="text-[#3b82f6]">HESABIM</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                  Siparişlerinizi güvenle takip etmek, hayalinizdeki sistemi toplamak ve size özel fırsatlardan yararlanmak için hemen giriş yapın veya kayıt olun.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                <Link href="/giris" className="flex items-center justify-center px-10 py-4 rounded-xl bg-[#3b82f6] text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  Giriş Yap
                </Link>
                <Link href="https://www.bilginpcmarket.com/kayit" className="flex items-center justify-center px-10 py-4 rounded-xl bg-[#121215] border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 hover:border-white/20 transition-all">
                  Yeni Kayıt
                </Link>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 ml-2">
          {session ? "Hesap Yönetimi" : "Hesap Yönetimi (Önizleme)"}
        </h2>

        {/* 🚀 LİSTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {garajlar.map((garaj) => {
            const Icon = garaj.ikon;
            if (garaj.id === "yonetim" && !isAdmin) return null;

            return (
              <Link 
                href={garaj.link} 
                prefetch={true} 
                key={garaj.id}
                className={`group flex items-center p-5 sm:p-6 rounded-3xl bg-[#09090b] border border-white/5 hover:bg-white/[0.02] transition-all duration-300 ${garaj.border}`}
              >
                {/* İKON ALANI */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border border-white/5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${garaj.bg}`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${garaj.renk}`} />
                </div>

                {/* YAZI ALANI */}
                <div className="ml-5 flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-white transition-colors truncate">
                    {garaj.isim}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5 truncate">
                    {garaj.aciklama}
                  </p>
                </div>

                {/* OK İŞARETİ */}
                <div className="w-10 h-10 rounded-full bg-[#121215] flex items-center justify-center border border-white/5 group-hover:border-white/10 group-hover:bg-white/5 transition-all ml-3 shrink-0">
                   <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
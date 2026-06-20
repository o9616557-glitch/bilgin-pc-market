"use client";

import React from "react";
import Link from "next/link";
import { Package, Heart, Server, MapPin, ShieldAlert, LogOut, ArrowRight, Truck } from "lucide-react";
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
      renk: "text-blue-400", 
      bgAura: "bg-blue-500/5", 
      borderHover: "hover:border-blue-500/40" 
    },
    { 
      id: "siparis-takip", 
      isim: "Sipariş Takip", 
      aciklama: "Kargonun anlık durumunu ve konumunu izle", 
      ikon: Truck, 
      link: "/siparis-takip", 
      renk: "text-purple-400", 
      bgAura: "bg-purple-500/5", 
      borderHover: "hover:border-purple-500/40" 
    },
    { 
      id: "sistemlerim", 
      isim: "Sistemlerim", 
      aciklama: "Topladığın özel PC canavarları", 
      ikon: Server, 
      link: "/sistemlerim", 
      renk: "text-[#00d2ff]", 
      bgAura: "bg-[#00d2ff]/5", 
      borderHover: "hover:border-[#00d2ff]/40" 
    },
    { 
      id: "favoriler", 
      isim: "Favorilerim", 
      aciklama: "Gözüne kestirdiğin parçalar", 
      ikon: Heart, 
      link: "/favorilerim", 
      renk: "text-rose-400", 
      bgAura: "bg-rose-500/5", 
      borderHover: "hover:border-rose-500/40" 
    },
    { 
      id: "adresler", 
      isim: "Adreslerim", 
      aciklama: "Teslimat ve fatura bilgilerin", 
      ikon: MapPin, 
      link: "/adreslerim", 
      renk: "text-emerald-400", 
      bgAura: "bg-emerald-500/5", 
      borderHover: "hover:border-emerald-500/40" 
    },
    { 
      id: "yonetim", 
      isim: "Yönetim Paneli", 
      aciklama: "Dükkanın ana kumanda merkezi", 
      ikon: ShieldAlert, 
      link: "/admin", 
      renk: "text-amber-400", 
      bgAura: "bg-amber-500/5", 
      borderHover: "hover:border-amber-500/40" 
    },
  ];

  const basHarf = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "V";

  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00d2ff] blur-[150px] opacity-[0.03] pointer-events-none rounded-full"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 border-b border-white/10 pb-10 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border border-white/10 bg-[#121215] flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.1)]">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-blue-500">
                {basHarf}
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-black tracking-widest uppercase mb-1">VIP ÜYE • Hoş Geldin</div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-white">
                {session?.user?.name ? (
                  <>
                    {session.user.name.split(" ")[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-blue-500">{session.user.name.split(" ").slice(1).join(" ")}</span>
                  </>
                ) : (
                  "Değerli Müşterimiz"
                )}
              </h1>
            </div>
          </div>

          <button 
            onClick={handleCikisYap} 
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs shadow-lg"
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {garajlar.map((garaj) => {
            const Icon = garaj.ikon;
            if (garaj.id === "yonetim" && session?.user?.email?.toLowerCase() !== "o9616557@gmail.com") return null;

            return (
              <Link 
                href={garaj.link} 
                prefetch={true} // 🚀 İŞTE POPUP'TAKİ O FİŞEK MOTORU BURAYA TAKILDI!
                key={garaj.id}
                className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-[#09090b] p-8 transition-all duration-300 hover:-translate-y-1 ${garaj.borderHover} ${garaj.bgAura}`}
              >
                <div className="absolute top-6 right-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <ArrowRight className={`w-5 h-5 ${garaj.renk}`} />
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-black border border-white/5 shadow-xl transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${garaj.renk}`} />
                </div>

                <h2 className="text-xl font-black uppercase tracking-wide text-white mb-2">{garaj.isim}</h2>
                <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[200px]">{garaj.aciklama}</p>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 transition-all duration-500 group-hover:w-full" style={{ color: "inherit" }}></div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
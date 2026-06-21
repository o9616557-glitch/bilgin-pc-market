"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, CreditCard, Package, LogOut, Server, Truck, Star } from "lucide-react";

export default function HesabimPage() {
  const { data: session } = useSession();

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    await signOut({ callbackUrl: "/" });
  };

  const userName = session?.user?.name || "Özkan";
  const userEmail = session?.user?.email || "";
  const basHarf = userName ? userName.charAt(0).toUpperCase() : "Ö";
  const isAdmin = userEmail.toLowerCase() === "o9616557@gmail.com";

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-8 relative overflow-hidden">
      {/* 🌌 ARKA PLAN UZAY IŞIKLARI (Görseldeki parlayan arka plan) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10">

        {/* ⬅️ SOL MENÜ (SİDEBAR - Görseldeki Sol Panel) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <nav className="flex flex-col gap-1">
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white font-medium shadow-inner transition-all">
                <User className="w-5 h-5 text-slate-400" /> Profil
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-5 h-5" /> Güvenlik
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-5 h-5" /> Ödeme Yöntemleri
              </Link>
              <Link href="/siparislerim" prefetch={true} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <Package className="w-5 h-5" /> Siparişlerim
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ TARAF (ANA KUMANDA MERKEZİ) */}
        <div className="flex-1 flex flex-col min-w-0 gap-6">

          {/* 🏆 NEON PROFİL KARTI (Görseldeki Üst Panel) */}
          <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10 shadow-[0_0_50px_rgba(0,210,255,0.15)] group">
            {/* Dış Parlama Efekti */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem] transition-opacity duration-500"></div>

            <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border border-cyan-500/20 overflow-hidden z-10">

              {/* Sol Arka Plan Işığı */}
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>

              {/* ⚡ CYBERPUNK AVATAR */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute inset-2.5 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,255,0.4),inset_0_0_20px_rgba(34,211,255,0.2)] border-t-cyan-300 animate-[spin_8s_linear_infinite]"></div>
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

          {/* 🧩 DASHBOARD BİLEŞENLERİ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* ⬅️ SOL SÜTUN */}
            <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
              
              {/* Son İşlemler Tablosu */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                <h3 className="text-white font-bold text-lg mb-6 relative z-10">Son İşlemler</h3>
                <div className="space-y-4 relative z-10">
                  {/* Örnek veri */}
                  {[
                    { date: "20.11.2024", system: "Custom Rig", price: "595,00", status: "Active" },
                    { date: "20.11.2024", system: "Custom Rig", price: "995,00", status: "Active" },
                    { date: "02.11.2024", system: "Custom Rig", price: "1130,00", status: "Pending" },
                    { date: "09.03.2024", system: "Custom Rig", price: "935,00", status: "Active" },
                    { date: "29.11.2024", system: "Custom Rig", price: "959,00", status: "Pending" },
                    { date: "02.01.2024", system: "Custom Rig", price: "253,00", status: "Active" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{item.system}</p>
                        <p className="text-slate-500 text-xs">{item.date}</p>
                      </div>
                      <p className="text-white font-bold text-sm text-right shrink-0">{item.price} ₺</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${item.status === 'Active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ➡️ ORTA SÜTUN */}
            <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">

              {/* Grafikler */}
              <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                   <h3 className="text-white font-bold text-lg">Sipariş Geçmişi</h3>
                   <div className="h-40 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center">
                     {/* Tailwind ile grafik simülasyonu */}
                     <div className="flex items-end gap-1.5 h-32 px-4 w-full">
                       {[60, 40, 80, 50, 70, 90, 40, 60, 30, 70, 50, 80].map((h, i) => (
                         <div key={i} className="flex-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-sm" style={{ height: `${h}%` }}></div>
                       ))}
                     </div>
                   </div>
                   <div className="flex justify-center pt-2">
                      <span className="text-[10px] text-slate-500 font-medium">Last 12 Months</span>
                   </div>
                </div>
                <div className="w-full md:w-[280px] space-y-3">
                   <h3 className="text-white font-bold text-lg">Harcama Dağılımı</h3>
                   <div className="h-40 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center">
                     {/* Tailwind ile pasta grafik simülasyonu */}
                     <div className="w-32 h-32 rounded-full border-[15px] border-cyan-500 relative flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,255,0.3)]">
                        <span className="text-lg font-black text-white">45%</span>
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full border-[15px] border-rose-500" style={{ transform: 'rotate(60deg) translate(-5px, -5px)' }}></div>
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-[15px] border-purple-500" style={{ transform: 'rotate(150deg) translate(-5px, 5px)' }}></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full border-[15px] border-emerald-500" style={{ transform: 'rotate(240deg) translate(5px, 5px)' }}></div>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500"></span><span className="text-xs text-slate-400">PC Components</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-xs text-slate-400">Laptops</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-xs text-slate-400">Software</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-xs text-slate-400">Accessories</span></div>
                   </div>
                </div>
              </div>

            </div>

            {/* ➡️ SAĞ SÜTUN */}
            <div className="lg:col-span-3 xl:col-span-1 flex flex-col gap-6">

              {/* Metric Kartları */}
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2">
                   <Server className="w-8 h-8 text-cyan-400" />
                   <p className="text-3xl font-black text-white">3</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kayıtlı Sistemler</p>
                 </div>
                 <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2">
                   <Truck className="w-8 h-8 text-rose-400" />
                   <p className="text-3xl font-black text-white">1</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Açık Siparişler</p>
                 </div>
                 <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2">
                   <Star className="w-8 h-8 text-purple-400" />
                   <p className="text-3xl font-black text-white">12</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Favoriler</p>
                 </div>
              </div>

              {/* Sistem Listesi Kartı */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl">
                 <h3 className="text-white font-bold text-lg mb-6">Sistem Listesi</h3>
                 <div className="space-y-4">
                   {/* Örnek veri */}
                   {[
                     { isim: "Custom Rig", resim: "/placeholder-rig.png", status: "Active" },
                     { isim: "Laptop", resim: "/placeholder-laptop.png", status: "Pending" },
                     { isim: "Laptop", resim: "/placeholder-laptop.png", status: "Favorite" },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2">
                       <div className="w-12 h-12 bg-black/50 rounded-xl p-2 flex items-center justify-center shrink-0">
                          <img src={item.resim} alt={item.isim} className="max-w-full max-h-full object-contain" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-white font-semibold text-sm truncate">{item.isim}</p>
                         <p className="text-slate-500 text-xs">Custom</p>
                       </div>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${item.status === 'Active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : item.status === 'Pending' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                        {item.status}
                      </span>
                     </div>
                   ))}
                 </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
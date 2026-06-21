"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, CreditCard, Package, LogOut, Server, Truck, Star, MapPin, Loader2 } from "lucide-react";

export default function HesabimPage() {
  const { data: session } = useSession();
  
  // 🧠 CANLI VERİ MOTORLARI
  const [siparisler, setSiparisler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    await signOut({ callbackUrl: "/" });
  };

  // 🚀 SİPARİŞ ÇEKME MOTORU
  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const siparisleriGetir = async () => {
      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
        });
        
        const data = await res.json();
        
        if (res.ok && data.orders) {
          const benimSiparislerim = data.orders.filter((siparis: any) => {
            const siparisMaili = siparis.userEmail || siparis.email || siparis.musteri?.eposta || siparis.musteri?.email || "";
            const musteriMaili = session?.user?.email || ""; 
            return siparisMaili.toLowerCase() === musteriMaili.toLowerCase();
          });

          const siraliSiparisler = benimSiparislerim.sort((a: any, b: any) => 
            new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime()
          );

          setSiparisler(siraliSiparisler.slice(0, 6));
        }
      } catch (error) {
        console.error("Siparişler çekilirken bağlantı koptu:", error);
      } finally {
        setLoading(false);
      }
    };

    siparisleriGetir();
  }, [session]);

  const userName = session?.user?.name || "Özkan";
  const userEmail = session?.user?.email || "";
  const basHarf = userName ? userName.charAt(0).toUpperCase() : "Ö";

  return (
    // 🔥 max-w sınırlarını kaldırdık, tam ekran (w-full) yaptık!
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* 🌌 ARKA PLAN UZAY IŞIKLARI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1500px] h-[600px] bg-[#00d2ff] blur-[300px] opacity-[0.05] pointer-events-none rounded-full"></div>

      {/* 🔥 w-full ile ekranı sonuna kadar kullanıyoruz */}
      <div className="w-full mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-10">

        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-xl">
            <nav className="flex flex-col gap-2">
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-4 px-5 py-4 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner transition-all">
                <User className="w-5 h-5 text-cyan-400" /> Profil
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-5 h-5" /> Ödeme Yöntemleri
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-5 h-5" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ TARAF (ANA KUMANDA MERKEZİ) */}
        <div className="flex-1 flex flex-col min-w-0 gap-8">

          {/* 🏆 NEON PROFİL KARTI */}
          <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10 shadow-[0_0_50px_rgba(0,210,255,0.15)] group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem] transition-opacity duration-500"></div>

            <div className="relative bg-[#0b1121] rounded-[2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 border border-cyan-500/20 overflow-hidden z-10">
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>

              {/* ⚡ CYBERPUNK AVATAR */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute inset-2.5 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,255,0.4),inset_0_0_20px_rgba(34,211,255,0.2)] border-t-cyan-300 animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute inset-4 bg-[#020617] rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] border border-cyan-900/50">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,255,0.8)]">
                    {basHarf}
                  </span>
                </div>
              </div>

              {/* 👤 İSİM VE E-POSTA */}
              <div className="flex-1 text-center sm:text-left z-10">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                  {userName}
                </h1>
                <p className="text-slate-400 text-base sm:text-lg font-medium tracking-wide">
                  {userEmail}
                </p>
              </div>

              {/* 🚪 ÇIKIŞ BUTONU */}
              <button onClick={handleCikisYap} className="relative z-10 flex items-center gap-3 px-8 py-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 hover:text-red-300 hover:border-red-500/50 transition-all font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                <LogOut className="w-5 h-5" /> Çıkış
              </button>
            </div>
          </div>

          <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mt-2 ml-2">
            HESAP YÖNETİMİ
          </h2>

          {/* 🧩 DASHBOARD BİLEŞENLERİ - EKSTRA GENİŞLETİLDİ */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

            {/* 🔥 SON İŞLEMLER / SİPARİŞLERİM */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full min-h-[450px]">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
                  <h3 className="text-white font-bold text-xl">Son İşlemler</h3>
                  <Link href="/siparislerim" prefetch={true} className="text-sm font-bold text-cyan-400 hover:underline">
                    Tümünü Gör
                  </Link>
                </div>

                {/* 🔥 BİNGO: Kaydırma çubuğu gizlendi (scrollbar-width: none ve webkit-scrollbar: hidden) */}
                <div className="space-y-3 relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {loading ? (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                      <span className="text-sm text-slate-500 font-medium">Siparişler çekiliyor...</span>
                    </div>
                  ) : siparisler.length > 0 ? (
                    siparisler.map((item: any, idx: number) => {
                      const tarih = item.createdAt ? new Date(item.createdAt).toLocaleDateString("tr-TR") : item.tarih ? new Date(item.tarih).toLocaleDateString("tr-TR") : "";
                      const urunAdi = item.items?.[0]?.isim || item.items?.[0]?.name || item.sepet?.[0]?.isim || item.siparisKodu || "Sipariş";
                      const toplamFiyat = item.totalPrice || item.toplamTutar || "0";
                      const durum = item.status || item.durum || "Hazırlanıyor";

                      return (
                        // 🔥 BİNGO: Yazılar çarpışmasın diye düzen değiştirildi (Fiyat ve Rozet alt alta eklendi)
                        <div key={item._id || idx} className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors rounded-xl px-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate mb-1" title={urunAdi}>{urunAdi}</p>
                            <p className="text-slate-500 text-xs">{tarih}</p>
                          </div>
                          
                          <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-2 shrink-0">
                            <p className="text-white font-black text-sm">
                              {Number(toplamFiyat).toLocaleString("tr-TR")} ₺
                            </p>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shrink-0 ${
                              durum.toLowerCase().includes('aktif') || durum.toLowerCase().includes('teslim') || durum.toLowerCase().includes('tamam')
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : durum.toLowerCase().includes('iptal')
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            }`}>
                              {durum}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center opacity-40">
                      <Package className="w-12 h-12 text-slate-500 mb-3" />
                      <span className="text-sm text-slate-400 font-medium">Henüz bir siparişiniz bulunmuyor.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GRAFİKLER */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                   <h3 className="text-white font-bold text-xl">Sipariş Geçmişi</h3>
                   <div className="h-48 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center pt-4">
                     <div className="flex items-end gap-2 h-36 px-6 w-full">
                       {[60, 40, 80, 50, 70, 90, 40, 60, 30, 70, 50, 80].map((h, i) => (
                         <div key={i} className="flex-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-sm hover:from-cyan-300 hover:to-cyan-500 transition-colors" style={{ height: `${h}%` }}></div>
                       ))}
                     </div>
                   </div>
                   <div className="flex justify-center pt-2">
                      <span className="text-xs text-slate-500 font-medium tracking-wide">Son 12 Ay (Örnek Grafik)</span>
                   </div>
                </div>

                {/* SVG DONUT GRAFİK */}
                <div className="w-full md:w-[320px] space-y-4">
                   <h3 className="text-white font-bold text-xl">Harcama Dağılımı</h3>
                   <div className="h-48 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center relative">
                     <svg className="w-36 h-36 transform -rotate-90 drop-shadow-xl" viewBox="0 0 42 42">
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="5"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="5" strokeDasharray="45 55" strokeDashoffset="0"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fb7185" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="-45"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c084fc" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-70"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-85"></circle>
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                       <span className="text-2xl font-black text-white tracking-tight">45%</span>
                       <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">PC Donanım</span>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3">
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span><span className="text-sm text-slate-400 font-medium">Bileşenler</span></div>
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#fb7185]"></span><span className="text-sm text-slate-400 font-medium">Laptoplar</span></div>
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#c084fc]"></span><span className="text-sm text-slate-400 font-medium">Yazılım</span></div>
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#34d399]"></span><span className="text-sm text-slate-400 font-medium">Aksesuar</span></div>
                   </div>
                </div>
              </div>
            </div>

            {/* METRİKLER VE SİSTEM LİSTESİ */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                 <Link href="/adreslerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/20 rounded-2xl p-5 shadow-xl flex flex-col items-center gap-2 transition-colors">
                   <MapPin className="w-8 h-8 text-cyan-400" />
                   <p className="text-3xl font-black text-white">2</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Adresler</p>
                 </Link>
                 <Link href="/siparis-takip" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-rose-500/20 rounded-2xl p-5 shadow-xl flex flex-col items-center gap-2 transition-colors">
                   <Truck className="w-8 h-8 text-rose-400" />
                   <p className="text-3xl font-black text-white">{siparisler.filter(s => s.status?.toLowerCase().includes("kargo") || s.durum?.toLowerCase().includes("kargo")).length}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Kargolar</p>
                 </Link>
                 <Link href="https://www.bilginpcmarket.com/favorilerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-purple-500/20 rounded-2xl p-5 shadow-xl flex flex-col items-center gap-2 transition-colors">
                   <Star className="w-8 h-8 text-purple-400" />
                   <p className="text-3xl font-black text-white">12</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Favoriler</p>
                 </Link>
              </div>

              {/* Sistem Listesi Kartı */}
              <Link href="/sistemlerim" prefetch={true} className="block bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl hover:border-cyan-500/30 transition-all duration-300 group">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-white font-bold text-xl">Sistem Listesi</h3>
                   <span className="text-sm font-bold text-cyan-400 group-hover:underline">Yönet</span>
                 </div>
                 <div className="space-y-4">
                   {[
                     { isim: "Custom Rig V1", resim: "/placeholder-rig.png", status: "Active" },
                     { isim: "Oyun Laptopu", resim: "/placeholder-laptop.png", status: "Pending" },
                     { isim: "Yayıncı Sistemi", resim: "/placeholder-laptop.png", status: "Favorite" },
                   ].map((item, idx) => (
                     <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors rounded-xl px-3">
                       <div className="w-14 h-14 bg-black/50 rounded-xl p-2 flex items-center justify-center shrink-0">
                          <img src={item.resim} alt={item.isim} className="max-w-full max-h-full object-contain" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-white font-bold text-sm truncate mb-1">{item.isim}</p>
                         <p className="text-slate-500 text-xs">Kayıtlı Sistem</p>
                       </div>
                       <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shrink-0 w-fit ${item.status === 'Active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : item.status === 'Pending' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                        {item.status}
                      </span>
                     </div>
                   ))}
                 </div>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
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

  // 🚀 TÜM FORMATLARI COZEN VE GİZLİ ANAHTARLA GİREN ÇIRAK MOTORU
  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const siparisleriGetir = async () => {
      try {
        // 🚀 ŞEFİN GİZLİ ANAHTARI CEBİMİZDE KAPIYI ÇALIYORUZ
        const res = await fetch("/api/siparislerim", {
          method: "GET",
          headers: {
            "x-patron-anahtar": "Bilgin123", // İŞTE KAPININ ŞİFRESİ BURADA!
            "Content-Type": "application/json"
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          
          if (Array.isArray(data)) {
            setSiparisler(data);
          } else if (data.orders && Array.isArray(data.orders)) {
            setSiparisler(data.orders);
          } else if (data.siparisler && Array.isArray(data.siparisler)) {
            // Senin API "siparisler" dizisi dönüyor, burası tam senin dükkana göre!
            setSiparisler(data.siparisler);
          } else if (data.data && Array.isArray(data.data)) {
            setSiparisler(data.data);
          }
        } else {
          console.log("Şefim API kapıdan kovdu, parola yanlış olabilir! Durum:", res.status);
        }
      } catch (error) {
        console.error("Sipariş motoru kaza yaptı şefim:", error);
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
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-8 relative overflow-hidden">
      {/* 🌌 ARKA PLAN UZAY IŞIKLARI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10">

        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <nav className="flex flex-col gap-1">
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white font-medium shadow-inner transition-all">
                <User className="w-5 h-5 text-slate-400" /> Profil
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-5 h-5" /> Ödeme Yöntemleri
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-5 h-5" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ TARAF (ANA KUMANDA MERKEZİ) */}
        <div className="flex-1 flex flex-col min-w-0 gap-6">

          {/* 🏆 NEON PROFİL KARTI */}
          <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10 shadow-[0_0_50px_rgba(0,210,255,0.15)] group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem] transition-opacity duration-500"></div>

            <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border border-cyan-500/20 overflow-hidden z-10">
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

          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4 ml-2">
            HESAP YÖNETİMİ
          </h2>

          {/* 🧩 DASHBOARD BİLEŞENLERİ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* SON İŞLEMLER / SİPARİŞLERİM */}
            <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full min-h-[420px]">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
                  <h3 className="text-white font-bold text-lg">Son İşlemler</h3>
                  <Link href="/siparislerim" prefetch={true} className="text-xs font-bold text-cyan-400 hover:underline">
                    Tümünü Gör
                  </Link>
                </div>

                <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {loading ? (
                    <div className="h-full min-h-[250px] flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                      <span className="text-xs text-slate-500 font-medium">Siparişler çekiliyor...</span>
                    </div>
                  ) : siparisler.length > 0 ? (
                    siparisler.map((item: any, idx: number) => {
                      const tarih = item.createdAt ? new Date(item.createdAt).toLocaleDateString("tr-TR") : item.date || "";
                      const urunAdi = item.urunler?.[0]?.isim || item.system || "Sipariş";
                      const toplamFiyat = item.toplamFiyat || item.price || "0";
                      const durum = item.durum || item.status || "Hazırlanıyor";

                      return (
                        <div key={item._id || idx} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{urunAdi}</p>
                            <p className="text-slate-500 text-xs">{tarih}</p>
                          </div>
                          <p className="text-white font-bold text-sm text-right shrink-0">
                            {Number(toplamFiyat).toLocaleString("tr-TR")} ₺
                          </p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${
                            durum.toLowerCase() === 'aktif' || durum.toLowerCase() === 'active' || durum.toLowerCase() === 'tamamlandı' || durum.toLowerCase() === 'teslim edildi'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {durum}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center opacity-40">
                      <Package className="w-10 h-10 text-slate-500 mb-2" />
                      <span className="text-xs text-slate-400 font-medium">Henüz bir siparişiniz bulunmuyor.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GRAFİKLER */}
            <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">
              <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                   <h3 className="text-white font-bold text-lg">Sipariş Geçmişi</h3>
                   <div className="h-40 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center">
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

                {/* SVG DONUT GRAFİK */}
                <div className="w-full md:w-[280px] space-y-3">
                   <h3 className="text-white font-bold text-lg">Harcama Dağılımı</h3>
                   <div className="h-40 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center relative">
                     <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 42 42">
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4.5"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="45 55" strokeDashoffset="0"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fb7185" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-45"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c084fc" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-70"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-85"></circle>
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-xl font-black text-white tracking-tight">45%</span>
                       <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">PC Donanım</span>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span><span className="text-xs text-slate-400 font-medium">PC Components</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#fb7185]"></span><span className="text-xs text-slate-400 font-medium">Laptops</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#c084fc]"></span><span className="text-xs text-slate-400 font-medium">Software</span></div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]"></span><span className="text-xs text-slate-400 font-medium">Accessories</span></div>
                   </div>
                </div>
              </div>
            </div>

            {/* METRİKLER VE SİSTEM LİSTESİ */}
            <div className="lg:col-span-3 xl:col-span-1 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                 <Link href="/adreslerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/20 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2 transition-colors">
                   <MapPin className="w-8 h-8 text-cyan-400" />
                   <p className="text-3xl font-black text-white">2</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Adreslerim</p>
                 </Link>
                 <Link href="/siparis-takip" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-rose-500/20 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2 transition-colors">
                   <Truck className="w-8 h-8 text-rose-400" />
                   <p className="text-3xl font-black text-white">1</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Kargolar</p>
                 </Link>
                 <Link href="https://www.bilginpcmarket.com/favorilerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-purple-500/20 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2 transition-colors">
                   <Star className="w-8 h-8 text-purple-400" />
                   <p className="text-3xl font-black text-white">12</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Favoriler</p>
                 </Link>
              </div>

              {/* Sistem Listesi Kartı */}
              <Link href="/sistemlerim" prefetch={true} className="block bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300 group">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-white font-bold text-lg">Sistem Listesi</h3>
                   <span className="text-xs font-bold text-cyan-400 group-hover:underline">Yönet</span>
                 </div>
                 <div className="space-y-4">
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
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
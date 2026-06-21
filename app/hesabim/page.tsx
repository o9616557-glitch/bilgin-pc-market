"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, CreditCard, Package, LogOut, Server, Truck, Star, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function HesabimPage() {
  const { data: session } = useSession();
  
  // 🧠 CANLI VERİ VE GRAFİK MOTORLARI
  const [hamSiparisler, setHamSiparisler] = useState<any[]>([]);
  const [sonSiparislerListesi, setSonSiparislerListesi] = useState<any[]>([]);
  const [grafikVerisi, setGrafikVerisi] = useState<any[]>([]);
  
  // 📅 YIL VE AY KONTROLLERİ
  const suAnkiTarih = new Date();
  const [seciliYil, setSeciliYil] = useState<number>(suAnkiTarih.getFullYear());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    sessionStorage.removeItem("bilgin_hesabim_data");
    await signOut({ callbackUrl: "/" });
  };

  // 🚀 1. AŞAMA: VERİTABANINDAN TÜM SİPARİŞLERİ ÇEK
  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const verileriGetir = async () => {
      try {
        const hafiza = sessionStorage.getItem("bilgin_hesabim_data");
        if (hafiza) {
          const parsed = JSON.parse(hafiza);
          setHamSiparisler(parsed.tumSiparisler || []);
          setLoading(false);
        }

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

          setHamSiparisler(benimSiparislerim);
          sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({ tumSiparisler: benimSiparislerim }));
        }
      } catch (error) {
        console.error("Çırak verilere ulaşamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    verileriGetir();
  }, [session]);

  // 🚀 2. AŞAMA: SEÇİLİ YILA GÖRE GRAFİĞİ VE LİSTEYİ HESAPLA
  useEffect(() => {
    if (!hamSiparisler || hamSiparisler.length === 0) return;

    // --- LİSTE İÇİN EN YENİ 6 SİPARİŞ ---
    const sirali = [...hamSiparisler].sort((a: any, b: any) => 
      new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime()
    );
    setSonSiparislerListesi(sirali.slice(0, 6));

    // --- GRAFİK İÇİN SABİT 12 AY MATEMATİĞİ ---
    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const aylikToplamlar = new Array(12).fill(0);

    hamSiparisler.forEach((siparis: any) => {
      const d = new Date(siparis.createdAt || siparis.tarih);
      if (isNaN(d.getTime())) return;

      if (d.getFullYear() === seciliYil) {
        aylikToplamlar[d.getMonth()] += Number(siparis.totalPrice || siparis.toplamTutar) || 0;
      }
    });

    const maxTutar = Math.max(...aylikToplamlar);
    
    const dinamikGrafik = aylikToplamlar.map((tutar, index) => {
      const yuzde = maxTutar > 0 && tutar > 0 ? Math.max((tutar / maxTutar) * 100, 5) : 2;
      return {
        etiket: aylar[index],
        yuzde: yuzde,
        tutar: tutar
      };
    });

    setGrafikVerisi(dinamikGrafik);

  }, [hamSiparisler, seciliYil]);


  const userName = session?.user?.name || "Özkan";
  const userEmail = session?.user?.email || "";
  const basHarf = userName ? userName.charAt(0).toUpperCase() : "Ö";

  const isCurrentYear = suAnkiTarih.getFullYear() === seciliYil;
  const currentMonthIndex = suAnkiTarih.getMonth(); 

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* 🌌 ARKA PLAN UZAY IŞIKLARI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10">

        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner transition-all">
                <User className="w-5 h-5 text-cyan-400" /> Profil
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-5 h-5" /> Ödeme Yöntemleri
              </Link>
              <Link href="/hesabim" prefetch={true} className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-5 h-5" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ TARAF */}
        <div className="flex-1 flex flex-col min-w-0 gap-6">

          {/* 🏆 NEON PROFİL KARTI */}
          <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10 shadow-[0_0_50px_rgba(0,210,255,0.15)] group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem] transition-opacity duration-500"></div>
            <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border border-cyan-500/20 overflow-hidden z-10">
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>

              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute inset-2.5 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,255,0.4),inset_0_0_20px_rgba(34,211,255,0.2)] border-t-cyan-300 animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute inset-4 bg-[#020617] rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] border border-cyan-900/50">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,255,0.8)]">
                    {basHarf}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left z-10">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                  {userName}
                </h1>
                <p className="text-slate-400 text-sm sm:text-base font-medium tracking-wide">
                  {userEmail}
                </p>
              </div>

              <button onClick={handleCikisYap} className="relative z-10 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 hover:text-red-300 hover:border-red-500/50 transition-all font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                <LogOut className="w-4 h-4" /> Çıkış
              </button>
            </div>
          </div>

          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2 ml-2">
            HESAP YÖNETİMİ
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

            {/* 🔥 SOL SÜTUN: SON İŞLEMLER */}
            <div className="xl:col-span-1 flex flex-col h-full">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col min-h-[450px] xl:h-[750px]">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
                  <h3 className="text-white font-bold text-lg">Son İşlemler</h3>
                  <Link href="/siparislerim" prefetch={true} className="text-xs font-bold text-cyan-400 hover:underline">
                    Tümünü Gör
                  </Link>
                </div>

                <div className="space-y-3 relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 opacity-80">
                      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                      <span className="text-xs text-slate-500 font-medium">Siparişler çekiliyor...</span>
                    </div>
                  ) : sonSiparislerListesi.length > 0 ? (
                    sonSiparislerListesi.map((item: any, idx: number) => {
                      const tarih = item.createdAt ? new Date(item.createdAt).toLocaleDateString("tr-TR") : item.tarih ? new Date(item.tarih).toLocaleDateString("tr-TR") : "";
                      const urunAdi = item.items?.[0]?.isim || item.items?.[0]?.name || item.sepet?.[0]?.isim || item.siparisKodu || "Sipariş";
                      const toplamFiyat = item.totalPrice || item.toplamTutar || "0";
                      const durum = item.status || item.durum || "Hazırlanıyor";

                      return (
                        <div key={item._id || idx} className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row sm:items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors rounded-xl px-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate mb-1" title={urunAdi}>{urunAdi}</p>
                            <p className="text-slate-500 text-[11px]">{tarih}</p>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col xl:flex-row 2xl:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                            <p className="text-white font-black text-sm">
                              {Number(toplamFiyat).toLocaleString("tr-TR")} ₺
                            </p>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shrink-0 w-fit ${
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
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <Package className="w-10 h-10 text-slate-500 mb-2" />
                      <span className="text-xs text-slate-400 font-medium">Henüz siparişiniz yok.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 📊 ORTA SÜTUN: GRAFİKLER VE SİSTEMLER */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              {/* 1. SİPARİŞ GEÇMİŞİ GRAFİĞİ */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
                {/* 🔥 MOBİLDE ÇARPIŞMAYI ÖNLEYEN BAŞLIK YAPISI */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                   <h3 className="text-white font-bold text-lg">Aylık Harcama Grafiği</h3>
                   
                   <div className="flex items-center self-start sm:self-auto gap-3 bg-[#121215] border border-slate-700/50 rounded-lg px-2 py-1 w-fit">
                     <button onClick={() => setSeciliYil(y => y - 1)} className="p-1 text-slate-400 hover:text-cyan-400 transition-colors">
                       <ChevronLeft className="w-4 h-4" />
                     </button>
                     <span className="text-sm font-black text-white w-10 text-center">{seciliYil}</span>
                     <button onClick={() => setSeciliYil(y => y + 1)} className="p-1 text-slate-400 hover:text-cyan-400 transition-colors" disabled={seciliYil >= suAnkiTarih.getFullYear()}>
                       <ChevronRight className="w-4 h-4" />
                     </button>
                   </div>
                </div>
                
                {/* 🔥 AYLARIN TAŞMASINI ENGELLEYEN YENİ GRAFİK ALANI */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl flex items-end justify-between pt-10 pb-4 px-1 sm:px-4 h-[260px] relative mt-2">
                  
                  {grafikVerisi.length > 0 ? grafikVerisi.map((item, i) => {
                    const isVarsayilanAcik = hoveredIndex === null && isCurrentYear && currentMonthIndex === i;
                    const isTooltipGozukecek = (hoveredIndex === i || isVarsayilanAcik) && item.tutar > 0;

                    return (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center justify-end h-full relative group px-0.5 sm:px-2"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {isTooltipGozukecek && (
                          <div className={`absolute bottom-[105%] bg-[#090f1e] border border-cyan-500 text-cyan-400 font-black text-[10px] sm:text-xs px-2.5 py-1.5 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.4)] whitespace-nowrap z-50 ${isVarsayilanAcik ? '' : 'animate-in fade-in zoom-in-95 duration-150'}`}>
                            {item.tutar.toLocaleString("tr-TR")} ₺
                          </div>
                        )}

                        {/* ÇUBUK İÇİN SABİT YÜKSEKLİK ALANI (TAŞMAYI ÖNLER) */}
                        <div className="w-full flex items-end justify-center h-[160px]">
                          <div 
                            className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ease-out cursor-pointer ${isVarsayilanAcik ? 'bg-gradient-to-b from-cyan-300 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-gradient-to-b from-slate-600 to-slate-800 hover:from-cyan-400 hover:to-cyan-600 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`} 
                            style={{ height: `${item.yuzde}%` }}
                          ></div>
                        </div>

                        <span className={`text-[10px] sm:text-xs font-black mt-3 shrink-0 transition-colors uppercase tracking-wider ${isVarsayilanAcik ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                          {item.etiket}
                        </span>
                      </div>
                    )
                  }) : null}

                </div>
              </div>

              {/* 2. HARCAMA DAĞILIMI */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-8">
                 <div className="shrink-0 space-y-2 text-center sm:text-left">
                   <h3 className="text-white font-bold text-lg">Harcama Dağılımı</h3>
                   <p className="text-[11px] text-slate-500 font-medium">Satın alınan ürün kategorileri</p>
                 </div>

                 <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-8 w-full">
                   <div className="relative w-32 h-32 shrink-0">
                     <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 42 42">
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4.5"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="45 55" strokeDashoffset="0"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fb7185" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-45"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c084fc" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-70"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-85"></circle>
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                       <span className="text-xl font-black text-white tracking-tight">45%</span>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-3 shrink-0">
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span><span className="text-sm text-slate-300 font-medium">Bileşenler</span></div>
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#fb7185]"></span><span className="text-sm text-slate-300 font-medium">Laptoplar</span></div>
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#c084fc]"></span><span className="text-sm text-slate-300 font-medium">Yazılım</span></div>
                      <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]"></span><span className="text-sm text-slate-300 font-medium">Aksesuar</span></div>
                   </div>
                 </div>
              </div>

              {/* 3. METRİKLER VE KAYITLI SİSTEMLER */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 
                 {/* METRİKLER (Üst 3'lü Kutu) */}
                 <div className="sm:col-span-3 grid grid-cols-3 gap-4">
                   <Link href="/adreslerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/20 rounded-2xl p-5 shadow-xl flex flex-col items-center gap-2 transition-colors">
                     <MapPin className="w-7 h-7 text-cyan-400" />
                     <p className="text-2xl font-black text-white">2</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Adresler</p>
                   </Link>
                   <Link href="/siparis-takip" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-rose-500/20 rounded-2xl p-5 shadow-xl flex flex-col items-center gap-2 transition-colors">
                     <Truck className="w-7 h-7 text-rose-400" />
                     <p className="text-2xl font-black text-white">{hamSiparisler.filter(s => s.status?.toLowerCase().includes("kargo") || s.durum?.toLowerCase().includes("kargo")).length}</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Kargolar</p>
                   </Link>
                   <Link href="https://www.bilginpcmarket.com/favorilerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-purple-500/20 rounded-2xl p-5 shadow-xl flex flex-col items-center gap-2 transition-colors">
                     <Star className="w-7 h-7 text-purple-400" />
                     <p className="text-2xl font-black text-white">12</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Favoriler</p>
                   </Link>
                 </div>

                 {/* 🔥 YENİ KAYITLI SİSTEMLER KARTI (Altına Boylu Boyunca Uzanır) */}
                 <div className="sm:col-span-3 mt-2">
                   <Link href="/sistemlerim" prefetch={true} className="block bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300 group">
                     <div className="flex items-center justify-between mb-5">
                       <div className="flex items-center gap-3">
                         <Server className="w-6 h-6 text-cyan-400" />
                         <h3 className="text-white font-bold text-lg">Kayıtlı Sistemlerim</h3>
                       </div>
                       <span className="text-xs font-bold text-cyan-400 group-hover:underline">Tümünü Yönet</span>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {/* Örnek 2 Sistem (Fazla yer kaplamasın diye yan yana 2 tane dizildi) */}
                       {[
                         { isim: "Custom Rig V1 - Toplama PC", resim: "/placeholder-rig.png", parcaSayisi: "7 Parça" },
                         { isim: "Yayıncı Sistemi", resim: "/placeholder-laptop.png", parcaSayisi: "5 Parça" },
                       ].map((item, idx) => (
                         <div key={idx} className="flex items-center gap-4 py-3 bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-colors rounded-xl px-4">
                           <div className="w-12 h-12 bg-black/50 rounded-xl p-2 flex items-center justify-center shrink-0 border border-slate-800">
                              <img src={item.resim} alt={item.isim} className="max-w-full max-h-full object-contain" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-white font-bold text-sm truncate mb-0.5">{item.isim}</p>
                             <p className="text-cyan-400 text-[11px] font-medium">{item.parcaSayisi}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </Link>
                 </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
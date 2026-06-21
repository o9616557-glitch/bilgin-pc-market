"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, CreditCard, Package, LogOut, Server, Truck, Star, MapPin, Loader2, ChevronLeft, ChevronRight, X, Copy, CheckCircle2 } from "lucide-react";

export default function HesabimPage() {
  const { data: session } = useSession();
  
  const [hamSiparisler, setHamSiparisler] = useState<any[]>([]);
  const [sonSiparislerListesi, setSonSiparislerListesi] = useState<any[]>([]);
  const [grafikVerisi, setGrafikVerisi] = useState<any[]>([]);
  const [adresSayisi, setAdresSayisi] = useState<number>(0);
  const [favoriSayisi, setFavoriSayisi] = useState<number>(0);
  const [sistemSayisi, setSistemSayisi] = useState<number>(0);

  const [isKargoModalOpen, setIsKargoModalOpen] = useState(false);
  const [kopyalananKod, setKopyalananKargo] = useState<string | null>(null);

  const [pastaVerisi, setPastaVerisi] = useState({
    kendinTopla: { yuzde: 35, tutar: 0, offset: 0 },
    bilesen: { yuzde: 25, tutar: 0, offset: 35 },
    cevre: { yuzde: 20, tutar: 0, offset: 60 },
    sistem: { yuzde: 12, tutar: 0, offset: 80 },
    aksesuar: { yuzde: 8, tutar: 0, offset: 92 },
    maxYuzde: 35
  });
  
  const suAnkiTarih = new Date();
  const [seciliYil, setSeciliYil] = useState<number>(suAnkiTarih.getFullYear());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiklananAy, setTiklananAy] = useState<number | null>(suAnkiTarih.getMonth());
  const [loading, setLoading] = useState(true);

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    sessionStorage.removeItem("bilgin_hesabim_data");
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    try {
      const hafiza = sessionStorage.getItem("bilgin_hesabim_data");
      if (hafiza) {
        const parsed = JSON.parse(hafiza);
        if (parsed.tumSiparisler && parsed.tumSiparisler.length > 0) {
          setHamSiparisler(parsed.tumSiparisler);
          setLoading(false); 
        }
      }

      const kayitliSistemler = localStorage.getItem("bilgin_kayitli_sistemler");
      if (kayitliSistemler) {
        const parsedSistemler = JSON.parse(kayitliSistemler);
        if (Array.isArray(parsedSistemler)) {
          setSistemSayisi(parsedSistemler.length);
        }
      }
    } catch (error) {
      console.error("Hafıza okuma hatası:", error);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.email) return;

    const gercegiKontrolEt = async () => {
      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
        });
        
        const data = await res.json();
        
        if (res.ok && data.orders) {
          const benimSiparislerim = data.orders.filter((o: any) => {
            const mail = o.userEmail || o.email || o.musteri?.eposta || o.musteri?.email || "";
            return mail.toLowerCase() === (session?.user?.email || "").toLowerCase() && o.gizlendi !== true;
          });

          setHamSiparisler(benimSiparislerim);
          sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({ tumSiparisler: benimSiparislerim }));
          setLoading(false);
        }

        const adresRes = await fetch("/api/addresses?t=" + new Date().getTime(), {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
        });

        if (adresRes.ok) {
          const adresData = await adresRes.json();
          if (adresData.addresses) {
            setAdresSayisi(adresData.addresses.length);
          }
        }

      } catch (error) {
        console.error("Radar bağlantı hatası:", error);
      }
    };

    gercegiKontrolEt();
    const radar = setInterval(gercegiKontrolEt, 10000); 

    return () => clearInterval(radar); 
  }, [session]);

  useEffect(() => {
    if (!hamSiparisler || hamSiparisler.length === 0) return;

    const sirali = [...hamSiparisler].sort((a: any, b: any) => 
      new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime()
    );
    setSonSiparislerListesi(sirali.slice(0, 6));

    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const aylikToplamlar = new Array(12).fill(0);

    let cK_toplam = 0, cB_toplam = 0, cC_toplam = 0, cS_toplam = 0, cA_toplam = 0;

    hamSiparisler.forEach((siparis: any) => {
      const d = new Date(siparis.createdAt || siparis.tarih);
      if (isNaN(d.getTime())) return;

      const siparisTutar = Number(siparis.totalPrice || siparis.toplamTutar) || 0;

      if (d.getFullYear() === seciliYil) {
        aylikToplamlar[d.getMonth()] += siparisTutar;
      }

      const urunler = siparis.items || siparis.sepet || [];
      urunler.forEach((item: any) => {
        const ad = (item.isim || item.title || "").toLowerCase();
        const cat = (item.kategori || "").toLowerCase();
        const urunTutar = (Number(item.fiyat || item.price) * (item.adet || item.quantity)) || 0;

        if (ad.includes("topla") || ad.includes("sihirbaz") || cat.includes("kendin")) {
          cK_toplam += urunTutar;
        } else if (cat.includes("bileşen") || ad.includes("ekran") || ad.includes("işlemci") || ad.includes("anakart") || ad.includes("ram")) {
          cB_toplam += urunTutar;
        } else if (cat.includes("çevre") || cat.includes("oyuncu") || ad.includes("mouse") || ad.includes("klavye")) {
          cC_toplam += urunTutar;
        } else if (cat.includes("sistem") || cat.includes("laptop") || cat.includes("yazılım")) {
          cS_toplam += urunTutar;
        } else {
          cA_toplam += urunTutar;
        }
      });
    });

    const maxTutar = Math.max(...aylikToplamlar);
    
    const dinamikGrafik = aylikToplamlar.map((tutar, index) => {
      const yuzde = maxTutar > 0 && tutar > 0 ? Math.max((tutar / maxTutar) * 100, 5) : 2;
      return { etiket: aylar[index], yuzde: yuzde, tutar: tutar };
    });

    setGrafikVerisi(dinamikGrafik);
    
    const genelToplam = cK_toplam + cB_toplam + cC_toplam + cS_toplam + cA_toplam;
    if (genelToplam > 0) {
      const p1 = (cK_toplam / genelToplam) * 100;
      const p2 = (cB_toplam / genelToplam) * 100;
      const p3 = (cC_toplam / genelToplam) * 100;
      const p4 = (cS_toplam / genelToplam) * 100;
      const p5 = (cA_toplam / genelToplam) * 100;

      setPastaVerisi({
        kendinTopla: { yuzde: Math.round(p1), tutar: cK_toplam, offset: 0 },
        bilesen: { yuzde: Math.round(p2), tutar: cB_toplam, offset: p1 },
        cevre: { yuzde: Math.round(p3), tutar: cC_toplam, offset: p1 + p2 },
        sistem: { yuzde: Math.round(p4), tutar: cS_toplam, offset: p1 + p2 + p3 },
        aksesuar: { yuzde: Math.round(p5), tutar: cA_toplam, offset: p1 + p2 + p3 + p4 },
        maxYuzde: Math.round(Math.max(p1, p2, p3, p4, p5))
      });
    }

    if (seciliYil === suAnkiTarih.getFullYear()) {
      setTiklananAy(suAnkiTarih.getMonth());
    } else {
      setTiklananAy(null);
    }

  }, [hamSiparisler, seciliYil]);

  const kargoSiparisleri = hamSiparisler.filter(s => {
    const d = (s.status || s.durum || "").toLowerCase();
    return d.includes("kargo") && !d.includes("teslim") && !d.includes("iptal");
  });

  // 🔥 SADECE KOPYALAMA YAPAN BUTON (Müşteriyi dükkanda tutar)
  const handleTakipEt = (takipNumarasi: string) => {
    navigator.clipboard.writeText(takipNumarasi);
    setKopyalananKargo(takipNumarasi);
    setTimeout(() => {
      setKopyalananKargo(null);
    }, 2000);
  };
// 🔥 ARKA PLANI KİLİTLEYEN MOTOR (Pencere açıkken arkası oynamaz)
  useEffect(() => {
    if (isKargoModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isKargoModalOpen]);
  const userName = session?.user?.name || "Özkan";
  const userEmail = session?.user?.email || "";
  const basHarf = userName ? userName.charAt(0).toUpperCase() : "Ö";

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
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
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col min-h-[450px] xl:h-[550px]">
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
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col">
                <div className="flex flex-row items-center justify-between gap-2 mb-2">
                   <h3 className="text-white font-bold text-base sm:text-lg">Aylık Harcama Grafiği</h3>
                   
                   <div className="flex items-center gap-1.5 bg-slate-800/30 border border-slate-700/50 rounded-lg px-1.5 py-1">
                     <button onClick={() => setSeciliYil(y => y - 1)} className="p-1 text-slate-400 hover:text-cyan-400 transition-colors">
                       <ChevronLeft className="w-3.5 h-3.5" />
                     </button>
                     <span className="text-[11px] sm:text-xs font-black text-slate-200 w-8 text-center">{seciliYil}</span>
                     <button onClick={() => setSeciliYil(y => y + 1)} className="p-1 text-slate-400 hover:text-cyan-400 transition-colors" disabled={seciliYil >= suAnkiTarih.getFullYear()}>
                       <ChevronRight className="w-3.5 h-3.5" />
                     </button>
                   </div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-xl flex items-end justify-between pt-10 pb-4 px-1 sm:px-4 h-[220px] relative mt-2">
                  
                  {grafikVerisi.length > 0 ? grafikVerisi.map((item, i) => {
                    const isSecili = tiklananAy === i;
                    const isHovered = hoveredIndex === i;
                    const isTooltipGozukecek = (isHovered || isSecili) && item.tutar > 0;

                    return (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center justify-end h-full relative group px-0.5 sm:px-2 outline-none select-none [-webkit-tap-highlight-color:transparent]"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => setTiklananAy(i)} 
                      >
                        {isTooltipGozukecek && (
                          <div className={`absolute bottom-[105%] bg-[#090f1e] border border-cyan-500 text-cyan-400 font-black text-[10px] sm:text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.4)] whitespace-nowrap z-50 ${isSecili ? '' : 'animate-in fade-in zoom-in-95 duration-150'}`}>
                            {item.tutar.toLocaleString("tr-TR")} ₺
                          </div>
                        )}

                        <div className="w-full flex items-end justify-center h-[140px]">
                          <div 
                            className={`w-full max-w-[36px] rounded-t-sm transition-all duration-500 ease-out cursor-pointer ${isSecili ? 'bg-gradient-to-b from-cyan-300 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-[1.05]' : 'bg-gradient-to-b from-slate-600 to-slate-800 hover:from-cyan-400 hover:to-cyan-600 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`} 
                            style={{ height: `${item.yuzde}%` }}
                          ></div>
                        </div>

                        <span className={`text-[9px] sm:text-[10px] font-black mt-2 shrink-0 transition-colors uppercase tracking-wider ${isSecili ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                          {item.etiket}
                        </span>
                      </div>
                    )
                  }) : null}

                </div>
              </div>

              {/* 2. HARCAMA DAĞILIMI */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-8">
                 <div className="shrink-0 space-y-1.5 text-center sm:text-left">
                   <h3 className="text-white font-bold text-base sm:text-lg">Harcama Dağılımı</h3>
                   <p className="text-[10px] text-slate-500 font-medium">Satın alınan ürün kategorileri</p>
                 </div>

                 <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-6 w-full">
                   <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
                     <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 42 42">
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4.5"></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.kendinTopla.yuzde} ${100 - pastaVerisi.kendinTopla.yuzde}`} strokeDashoffset={-pastaVerisi.kendinTopla.offset}></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.bilesen.yuzde} ${100 - pastaVerisi.bilesen.yuzde}`} strokeDashoffset={-pastaVerisi.bilesen.offset}></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fb7185" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.cevre.yuzde} ${100 - pastaVerisi.cevre.yuzde}`} strokeDashoffset={-pastaVerisi.cevre.offset}></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c084fc" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.sistem.yuzde} ${100 - pastaVerisi.sistem.yuzde}`} strokeDashoffset={-pastaVerisi.sistem.offset}></circle>
                       <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.aksesuar.yuzde} ${100 - pastaVerisi.aksesuar.yuzde}`} strokeDashoffset={-pastaVerisi.aksesuar.offset}></circle>
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                       <span className="text-xl font-black text-white tracking-tight">{pastaVerisi.maxYuzde}%</span>
                     </div>
                   </div>

                   <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-[220px]">
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-2 min-w-0">
                         <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] shrink-0"></span>
                         <span className="text-[11px] sm:text-xs text-slate-300 font-bold truncate">Kendin Topla</span>
                       </div>
                       <span className="text-[10px] sm:text-[11px] font-black text-amber-400 shrink-0">{pastaVerisi.kendinTopla.yuzde}%</span>
                     </div>
                     
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-2 min-w-0">
                         <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] shrink-0"></span>
                         <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">Bilgisayar Bileşenleri</span>
                       </div>
                       <span className="text-[10px] sm:text-[11px] font-black text-cyan-400 shrink-0">{pastaVerisi.bilesen.yuzde}%</span>
                     </div>
                     
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-2 min-w-0">
                         <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#fb7185] shrink-0"></span>
                         <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">Çevre Bir. & Oyuncu</span>
                       </div>
                       <span className="text-[10px] sm:text-[11px] font-black text-rose-400 shrink-0">{pastaVerisi.cevre.yuzde}%</span>
                     </div>
                     
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-2 min-w-0">
                         <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#c084fc] shrink-0"></span>
                         <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">Sistem, Laptop & Yazılım</span>
                       </div>
                       <span className="text-[10px] sm:text-[11px] font-black text-purple-400 shrink-0">{pastaVerisi.sistem.yuzde}%</span>
                     </div>
                     
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-2 min-w-0">
                         <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399] shrink-0"></span>
                         <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">Ağ, Aksesuar & Kablo</span>
                       </div>
                       <span className="text-[10px] sm:text-[11px] font-black text-emerald-400 shrink-0">{pastaVerisi.aksesuar.yuzde}%</span>
                     </div>
                  </div>
                 </div>
              </div>

              {/* 3. METRİKLER */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                 
                 <Link href="/adreslerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/20 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors">
                   <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
                   <p className="text-xl sm:text-2xl font-black text-white">{adresSayisi}</p>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Adresler</p>
                 </Link>
                 
                 {/* 🔥 MODAL TETİKLEYİCİ PREMIUM KUTU */}
                 <div 
                   onClick={() => setIsKargoModalOpen(true)} 
                   className="bg-[#0f172a] border border-slate-800 hover:border-rose-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer select-none"
                 >
                   <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
                   <p className="text-xl sm:text-2xl font-black text-white">{kargoSiparisleri.length}</p>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Kargolar</p>
                 </div>
                 
                 <Link href="https://www.bilginpcmarket.com/favorilerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-purple-500/20 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors">
                   <Star className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                   <p className="text-xl sm:text-2xl font-black text-white">{favoriSayisi}</p>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Favoriler</p>
                 </Link>

                 <Link href="/sistemlerim" prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-emerald-500/20 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors">
                   <Server className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                   <p className="text-xl sm:text-2xl font-black text-white">{sistemSayisi}</p>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Sistemler</p>
                 </Link>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 🚀 PREMIUM AKTİF KARGOLAR PENCERESİ (MODAL) */}
      {isKargoModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#09090b] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-400" /> AKTİF KARGOLARINIZ
              </h3>
              <button 
                onClick={() => setIsKargoModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white bg-[#121215] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {kargoSiparisleri.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-medium text-sm">
                  Şu an yolda olan aktif kargonuz bulunmuyor.
                </div>
              ) : (
                kargoSiparisleri.map((siparis: any, idx: number) => {
                  const siparisKodu = siparis.siparisKodu || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
                  const tarih = siparis.createdAt ? new Date(siparis.createdAt).toLocaleDateString("tr-TR") : siparis.tarih ? new Date(siparis.tarih).toLocaleDateString("tr-TR") : "";
                  
                  const firma = siparis.kargoFirmasi || "Belirtilmemiş";
                  const takipNo = siparis.takipNo || "Takip No Girilmemiş";

                  return (
                    <div key={siparis._id || idx} className="bg-[#121215] border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-4 group/item hover:border-slate-700 transition-colors">
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-sm tracking-wide">{siparisKodu}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black uppercase tracking-widest">YOLDA</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{tarih}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Firma</p>
                           <p className="text-xs font-bold text-white mt-0.5 truncate" title={firma}>{firma}</p>
                        </div>
                        <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Takip No</p>
                           <p className="text-xs font-bold text-cyan-400 mt-0.5 truncate" title={takipNo}>{takipNo}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleTakipEt(takipNo)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-black px-4 py-3 rounded-xl transition-all text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.2)] w-full"
                      >
                        {kopyalananKod === takipNo ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> KOPYALANDI!</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> {takipNo} KOPYALA</>
                        )}
                      </button>

                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 text-center">
              <p className="text-[11px] text-slate-500 font-medium">
                Siparişiniz teslim edildiğinde bu listeden otomatik olarak kaldırılır.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
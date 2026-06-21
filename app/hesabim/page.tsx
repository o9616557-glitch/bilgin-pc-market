"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, CreditCard, Package, LogOut, Server, Truck, Star, MapPin, Loader2, ChevronLeft, ChevronRight, X, Copy, CheckCircle2, Search, LogIn, UserPlus } from "lucide-react";

export default function HesabimPage() {
  const { data: session, status } = useSession();
  
  const suAnkiTarih = new Date();
  const yil = suAnkiTarih.getFullYear();

  const vitrinSiparisleri = [
    { _id: "SP-101", tarih: new Date(yil, 0, 15).toISOString(), status: "Teslim Edildi", totalPrice: 45000, items: [{ isim: "ASUS ROG Strix G16 Laptop", kategoriSlug: "laptop", fiyat: 45000, adet: 1 }] },
    { _id: "SP-102", tarih: new Date(yil, 1, 10).toISOString(), status: "Tamamlandı", totalPrice: 18500, items: [{ isim: "MSI 27' Oyuncu Monitörü", kategoriSlug: "monitor", fiyat: 18500, adet: 1 }] },
    { _id: "SP-103", tarih: new Date(yil, 2, 5).toISOString(), status: "Tamamlandı", totalPrice: 8500, items: [{ isim: "Intel Core i5 14400F İşlemci", kategoriSlug: "islemci", fiyat: 8500, adet: 1 }] },
    { _id: "SP-104", tarih: new Date(yil, 3, 20).toISOString(), status: "Tamamlandı", totalPrice: 64000, items: [{ isim: "PC Toplama Sihirbazı", kategoriSlug: "kendin", fiyat: 64000, adet: 1 }] },
    { _id: "SP-105", tarih: new Date(yil, 4, 12).toISOString(), status: "Teslim Edildi", totalPrice: 32000, items: [{ isim: "ASUS TUF RTX 4070 Ti", kategoriSlug: "ekran-kart", fiyat: 32000, adet: 1 }] },
    { _id: "SP-106", tarih: new Date(yil, 5, 2).toISOString(), status: "Kargoya Verildi", kargoFirmasi: "Yurtiçi Kargo", takipNo: "YRTC-84759201", totalPrice: 110000, items: [{ isim: "Premium Özel Sistem", kategoriSlug: "topla", fiyat: 110000, adet: 1 }] },
    { _id: "SP-107", tarih: new Date(yil, 6, 18).toISOString(), status: "Kargoya Verildi", kargoFirmasi: "Aras Kargo", takipNo: "ARAS-10293847", totalPrice: 85000, items: [{ isim: "Masaüstü Oyun Bilgisayarı", kategoriSlug: "masaustu", fiyat: 85000, adet: 1 }] },
    { _id: "SP-108", tarih: new Date(yil, 7, 22).toISOString(), status: "Tamamlandı", totalPrice: 35000, items: [{ isim: "AMD Ryzen 9 İşlemci", kategoriSlug: "islemci", fiyat: 35000, adet: 1 }] },
    { _id: "SP-109", tarih: new Date(yil, 8, 5).toISOString(), status: "Tamamlandı", totalPrice: 5000, items: [{ isim: "Premium Örgü Kablo & Priz Seti", kategoriSlug: "kablo", fiyat: 5000, adet: 1 }] },
    { _id: "SP-110", tarih: new Date(yil, 9, 14).toISOString(), status: "Kargoya Verildi", kargoFirmasi: "MNG Kargo", takipNo: "MNG-55443322", totalPrice: 125000, items: [{ isim: "ASUS ROG Oyun Bilgisayarı", kategoriSlug: "oyun-bilgisayari", fiyat: 125000, adet: 1 }] },
    { _id: "SP-111", tarih: new Date(yil, 10, 27).toISOString(), status: "Tamamlandı", totalPrice: 95000, items: [{ isim: "Kendin Topla PC", kategoriSlug: "sihirbaz", fiyat: 95000, adet: 1 }] },
    { _id: "SP-112", tarih: new Date(yil, 11, 8).toISOString(), status: "Tamamlandı", totalPrice: 42000, items: [{ isim: "Razer Klavye & Mouse Seti", kategoriSlug: "mouse", fiyat: 42000, adet: 1 }] },
  ];

  const [hamSiparisler, setHamSiparisler] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}").tumSiparisler || []; } catch { return []; }
    } return [];
  });
  
  const [adresSayisi, setAdresSayisi] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}").adresSayisi || 0; } catch { return 0; }
    } return 0;
  });

  const [favoriSayisi, setFavoriSayisi] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}").favoriSayisi || 0; } catch { return 0; }
    } return 0;
  });

  const [sistemSayisi, setSistemSayisi] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try { 
        const sys = JSON.parse(localStorage.getItem("bilgin_kayitli_sistemler") || "[]");
        return Array.isArray(sys) ? sys.length : 0;
      } catch { return 0; }
    } return 0;
  });

  const [sonSiparislerListesi, setSonSiparislerListesi] = useState<any[]>([]);
  const [grafikVerisi, setGrafikVerisi] = useState<any[]>([]);

  const [isKargoModalOpen, setIsKargoModalOpen] = useState(false);
  const [kopyalananKod, setKopyalananKargo] = useState<string | null>(null);
  const [girisSartModal, setGirisSartModal] = useState(false);

  const [pastaVerisi, setPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, tutar: 0, offset: 0 },
    bilesen: { yuzde: 0, tutar: 0, offset: 0 },
    cevre: { yuzde: 0, tutar: 0, offset: 0 },
    sistem: { yuzde: 0, tutar: 0, offset: 0 },
    aksesuar: { yuzde: 0, tutar: 0, offset: 0 },
    maxYuzde: 0
  });

  const [aylikPastaVerisi, setAylikPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, offset: 0 },
    bilesen: { yuzde: 0, offset: 0 },
    cevre: { yuzde: 0, offset: 0 },
    sistem: { yuzde: 0, offset: 0 },
    aksesuar: { yuzde: 0, offset: 0 },
    maxYuzde: 0,
    ayAdi: ""
  });
  
  const [seciliYil, setSeciliYil] = useState<number>(yil);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiklananAy, setTiklananAy] = useState<number | null>(suAnkiTarih.getMonth());
  const [loading, setLoading] = useState(hamSiparisler.length === 0);

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    sessionStorage.removeItem("bilgin_hesabim_data");
    await signOut({ callbackUrl: "/" });
  };

  const kilitliIslem = (e: React.MouseEvent) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      setGirisSartModal(true);
    }
  };

  const handleKargoClick = (e: React.MouseEvent) => {
    if (status === "unauthenticated") {
      kilitliIslem(e);
    } else {
      setIsKargoModalOpen(true);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setHamSiparisler(vitrinSiparisleri);
      setAdresSayisi(2);
      setFavoriSayisi(4);
      setSistemSayisi(5);
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

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
          
          const eskiHafiza = JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}");
          sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({ ...eskiHafiza, tumSiparisler: benimSiparislerim }));
          setLoading(false);
        } else {
          setLoading(false);
        }

        const adresRes = await fetch("/api/addresses?t=" + new Date().getTime(), { cache: "no-store" });
        if (adresRes.ok) {
          const adresData = await adresRes.json();
          const sayi = adresData.addresses?.length || 0;
          setAdresSayisi(sayi);
          const eskiHafiza = JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}");
          sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({ ...eskiHafiza, adresSayisi: sayi }));
        }

        const favoriRes = await fetch("/api/favorites?t=" + new Date().getTime(), { cache: "no-store" });
        if (favoriRes.ok) {
          const favoriData = await favoriRes.json();
          const sayi = favoriData.favorites?.length || 0;
          setFavoriSayisi(sayi);
          const eskiHafiza = JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}");
          sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({ ...eskiHafiza, favoriSayisi: sayi }));
        }

      } catch (error) {
        console.error("Radar bağlantı hatası:", error);
        setLoading(false);
      }
    };

    gercegiKontrolEt();
    const radar = setInterval(gercegiKontrolEt, 5000); 

    return () => clearInterval(radar); 
  }, [session, status]);

  useEffect(() => {
    if (!hamSiparisler || hamSiparisler.length === 0) return;

    const sirali = [...hamSiparisler].sort((a: any, b: any) => 
      new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime()
    );
    setSonSiparislerListesi(sirali.slice(0, 7)); 

    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const aylarUzun = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const aylikToplamlar = new Array(12).fill(0);

    let cK_toplam = 0, cB_toplam = 0, cC_toplam = 0, cS_toplam = 0, cA_toplam = 0;
    let m_cK = 0, m_cB = 0, m_cC = 0, m_cS = 0, m_cA = 0;
    const aktifAy = tiklananAy !== null ? tiklananAy : suAnkiTarih.getMonth();

    hamSiparisler.forEach((siparis: any) => {
      const durum = (siparis.status || siparis.durum || "").toLowerCase();
      const iptalMi = durum.includes("iptal") || durum.includes("iade") || durum.includes("red");
      const tamamlandiMi = durum.includes("tamam") || durum.includes("teslim") || durum.includes("kargo") || durum.includes("aktif");
      
      if (iptalMi || !tamamlandiMi) return; 

      const d = new Date(siparis.createdAt || siparis.tarih);
      if (isNaN(d.getTime())) return;

      const siparisTutar = Number(siparis.totalPrice || siparis.toplamTutar) || 0;
      const siparisAyi = d.getMonth();
      const siparisYili = d.getFullYear();

      if (siparisYili === seciliYil) {
        aylikToplamlar[siparisAyi] += siparisTutar;
      }

      const urunler = siparis.items || siparis.sepet || [];
      urunler.forEach((item: any) => {
        const kimlik = `${item.kategoriSlug || ''} ${item.kategori || ''} ${item.slug || ''} ${item.isim || ''} ${item.title || ''}`.toLocaleLowerCase('tr-TR');
        const urunTutar = (Number(item.fiyat || item.price) * (item.adet || item.quantity)) || 0;

        let kategoriTipi = "aksesuar";
        if (kimlik.includes("kendin") || kimlik.includes("topla") || kimlik.includes("sihirbaz")) kategoriTipi = "kendin";
        else if (["oyun-bilgisayari", "laptop", "notebook", "masaüstü", "masaustu", "oem-paket", "isletim", "yazılım", "yazilim"].some(k => kimlik.includes(k))) kategoriTipi = "sistem";
        else if (["anakart", "ekran-kart", "ekran kart", "islemci", "işlemci", "ram", "ssd", "hdd", "kasa", "psu", "sogutma", "soğutma"].some(k => kimlik.includes(k))) kategoriTipi = "bilesen";
        else if (["monitör", "monitor", "klavye", "mouse", "kulaklık", "kulaklik", "mikrofon", "oyun-kolu", "direksiyon", "hoparlör", "hoparlor"].some(k => kimlik.includes(k))) kategoriTipi = "cevre";

        if (kategoriTipi === "kendin") cK_toplam += urunTutar;
        else if (kategoriTipi === "sistem") cS_toplam += urunTutar;
        else if (kategoriTipi === "bilesen") cB_toplam += urunTutar;
        else if (kategoriTipi === "cevre") cC_toplam += urunTutar;
        else cA_toplam += urunTutar;

        if (siparisYili === seciliYil && siparisAyi === aktifAy) {
          if (kategoriTipi === "kendin") m_cK += urunTutar;
          else if (kategoriTipi === "sistem") m_cS += urunTutar;
          else if (kategoriTipi === "bilesen") m_cB += urunTutar;
          else if (kategoriTipi === "cevre") m_cC += urunTutar;
          else m_cA += urunTutar;
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

    const aylikNetToplam = m_cK + m_cB + m_cC + m_cS + m_cA;
    if (aylikNetToplam > 0) {
      const ap1 = (m_cK / aylikNetToplam) * 100;
      const ap2 = (m_cB / aylikNetToplam) * 100;
      const ap3 = (m_cC / aylikNetToplam) * 100;
      const ap4 = (m_cS / aylikNetToplam) * 100;
      const ap5 = (m_cA / aylikNetToplam) * 100;

      setAylikPastaVerisi({
        kendinTopla: { yuzde: Math.round(ap1), offset: 0 },
        bilesen: { yuzde: Math.round(ap2), offset: ap1 },
        cevre: { yuzde: Math.round(ap3), offset: ap1 + ap2 },
        sistem: { yuzde: Math.round(ap4), offset: ap1 + ap2 + ap3 },
        aksesuar: { yuzde: Math.round(ap5), offset: ap1 + ap2 + ap3 + ap4 },
        maxYuzde: Math.round(Math.max(ap1, ap2, ap3, ap4, ap5)),
        ayAdi: aylarUzun[aktifAy]
      });
    } else {
      setAylikPastaVerisi({
        kendinTopla: { yuzde: 0, offset: 0 }, bilesen: { yuzde: 0, offset: 0 },
        cevre: { yuzde: 0, offset: 0 }, sistem: { yuzde: 0, offset: 0 },
        aksesuar: { yuzde: 0, offset: 0 }, maxYuzde: 0, ayAdi: aylarUzun[aktifAy]
      });
    }

  }, [hamSiparisler, seciliYil, tiklananAy]);

  const kargoSiparisleri = hamSiparisler.filter(s => {
    const d = (s.status || s.durum || "").toLowerCase();
    return d.includes("kargo") && !d.includes("teslim") && !d.includes("iptal");
  });

  const handleTakipEt = (takipNumarasi: string) => {
    navigator.clipboard.writeText(takipNumarasi);
    setKopyalananKargo(takipNumarasi);
    setTimeout(() => setKopyalananKargo(null), 2000);
  };

  const userName = status === "unauthenticated" ? "Misafir" : (session?.user?.name || "Özkan");
  const userEmail = status === "unauthenticated" ? "Lütfen giriş yapın" : (session?.user?.email || "");
  const basHarf = userName.charAt(0).toUpperCase();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.5)]"></div>
        <p className="mt-6 text-cyan-400 font-bold uppercase tracking-widest text-sm animate-pulse">Sistem Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10">

        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" onClick={kilitliIslem} className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner transition-all">
                <User className="w-5 h-5 text-cyan-400" /> Profil
              </Link>
              <Link href="/hesabim" onClick={kilitliIslem} className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-5 h-5" /> Ödeme Yöntemleri
              </Link>
              <Link href="/hesabim" onClick={kilitliIslem} className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-5 h-5" /> Güvenlik
              </Link>
            </nav>

            {status === "unauthenticated" && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
                <Link href="/giris" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <LogIn className="w-4 h-4" /> Giriş Yap
                </Link>
                <Link href="/kayit" className="w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" /> Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ➡️ SAĞ TARAF */}
        <div className="flex-1 flex flex-col min-w-0 gap-6">

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
              
              {status === "authenticated" && (
                <button onClick={handleCikisYap} className="relative z-10 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 hover:text-red-300 hover:border-red-500/50 transition-all font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                  <LogOut className="w-4 h-4" /> Çıkış
                </button>
              )}
            </div>
          </div>

          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2 ml-2">
            HESAP YÖNETİMİ
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
             <Link href="/adreslerim" onClick={kilitliIslem} prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/20 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors">
               <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
               <p className="text-xl sm:text-2xl font-black text-white">{adresSayisi}</p>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Adresler</p>
             </Link>
             
             <div 
               onClick={handleKargoClick} 
               className="bg-[#0f172a] border border-slate-800 hover:border-rose-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer select-none"
             >
               <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
               <p className="text-xl sm:text-2xl font-black text-white">{kargoSiparisleri.length}</p>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Kargolar</p>
             </div>

             <Link href="/siparis-takip" onClick={kilitliIslem} prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors">
               <Search className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
               <p className="text-sm sm:text-base font-black text-slate-400 mt-1">Sorgula</p>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Sipariş Takip</p>
             </Link>
             
             <Link href="https://www.bilginpcmarket.com/favorilerim" onClick={kilitliIslem} prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-purple-500/20 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors">
               <Star className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
               <p className="text-xl sm:text-2xl font-black text-white">{favoriSayisi}</p>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Favoriler</p>
             </Link>

             <Link href="/sistemlerim" onClick={kilitliIslem} prefetch={true} className="bg-[#0f172a] border border-slate-800 hover:border-emerald-500/20 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center gap-1.5 transition-colors">
               <Server className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
               <p className="text-xl sm:text-2xl font-black text-white">{sistemSayisi}</p>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Sistemler</p>
             </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-1 flex flex-col h-full">
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-[350px] sm:h-[450px] xl:h-[550px]">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
                  <h3 className="text-white font-bold text-lg">Son İşlemler</h3>
                  <Link href="/siparislerim" onClick={kilitliIslem} prefetch={true} className="text-xs font-bold text-cyan-400 hover:underline">
                    Tümünü Gör
                  </Link>
                </div>

                <div className="space-y-3 relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {sonSiparislerListesi.length > 0 ? (
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
                              durum.toLowerCase().includes('kargo')
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : durum.toLowerCase().includes('teslim') || durum.toLowerCase().includes('tamam')
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
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

            <div className="xl:col-span-2 flex flex-col gap-6">

              {/* 🚀 MOBİLDE YAN YANA İKİYE BÖLÜNMÜŞ ÇİFT MOTORLU HARCAMA DAĞILIMI */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col xl:flex-row items-center gap-6 overflow-hidden">
                 
                 <div className="shrink-0 space-y-1.5 text-center xl:text-left xl:w-[140px] w-full">
                   <h3 className="text-white font-bold text-base sm:text-lg leading-tight">Harcama Dağılımı</h3>
                   <p className="text-[10px] text-slate-500 font-medium">Satın alınan kategoriler</p>
                 </div>

                 <div className="flex-1 grid grid-cols-2 sm:flex sm:flex-row items-start justify-center xl:justify-end gap-2 sm:gap-6 w-full border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-6 sm:pt-0 sm:pl-6">
                   
                   {/* 1. MİNİ PASTA (AYLIK) */}
                   <div className="flex flex-col items-center gap-2 sm:gap-3 relative px-1">
                     <span className="absolute -top-4 sm:-top-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.4)] whitespace-nowrap">
                       {aylikPastaVerisi.ayAdi} AYI
                     </span>
                     <div className="relative w-16 h-16 sm:w-24 sm:h-24 shrink-0 mt-2 sm:mt-3">
                       <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 42 42">
                         <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="4.5"></circle>
                         {aylikPastaVerisi.maxYuzde === 0 ? (
                           <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#334155" strokeWidth="4.5" strokeDasharray="100 0"></circle>
                         ) : (
                           <>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray={`${aylikPastaVerisi.kendinTopla.yuzde} ${100 - aylikPastaVerisi.kendinTopla.yuzde}`} strokeDashoffset={-aylikPastaVerisi.kendinTopla.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray={`${aylikPastaVerisi.bilesen.yuzde} ${100 - aylikPastaVerisi.bilesen.yuzde}`} strokeDashoffset={-aylikPastaVerisi.bilesen.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fb7185" strokeWidth="4.5" strokeDasharray={`${aylikPastaVerisi.cevre.yuzde} ${100 - aylikPastaVerisi.cevre.yuzde}`} strokeDashoffset={-aylikPastaVerisi.cevre.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c084fc" strokeWidth="4.5" strokeDasharray={`${aylikPastaVerisi.sistem.yuzde} ${100 - aylikPastaVerisi.sistem.yuzde}`} strokeDashoffset={-aylikPastaVerisi.sistem.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="4.5" strokeDasharray={`${aylikPastaVerisi.aksesuar.yuzde} ${100 - aylikPastaVerisi.aksesuar.yuzde}`} strokeDashoffset={-aylikPastaVerisi.aksesuar.offset}></circle>
                           </>
                         )}
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center mt-0.5 sm:mt-1">
                         <span className="text-xs sm:text-sm font-black text-white">{aylikPastaVerisi.maxYuzde}%</span>
                       </div>
                     </div>
                   <div className="flex flex-col gap-1 mt-1 w-full pl-2 sm:pl-4">
  {aylikPastaVerisi.kendinTopla.yuzde > 0 && <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span><span className="text-slate-300 font-normal">Topla:</span> {aylikPastaVerisi.kendinTopla.yuzde}%</span>}
  {aylikPastaVerisi.bilesen.yuzde > 0 && <span className="text-[9px] sm:text-[10px] text-cyan-400 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0"></span><span className="text-slate-300 font-normal">Bileşen:</span> {aylikPastaVerisi.bilesen.yuzde}%</span>}
  {aylikPastaVerisi.cevre.yuzde > 0 && <span className="text-[9px] sm:text-[10px] text-rose-400 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span><span className="text-slate-300 font-normal">Çevre:</span> {aylikPastaVerisi.cevre.yuzde}%</span>}
  {aylikPastaVerisi.sistem.yuzde > 0 && <span className="text-[9px] sm:text-[10px] text-purple-400 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0"></span><span className="text-slate-300 font-normal">Sistem:</span> {aylikPastaVerisi.sistem.yuzde}%</span>}
  {aylikPastaVerisi.aksesuar.yuzde > 0 && <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span><span className="text-slate-300 font-normal">Aksesuar:</span> {aylikPastaVerisi.aksesuar.yuzde}%</span>}
  {aylikPastaVerisi.maxYuzde === 0 && <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium text-center">Harcama Yok</span>}
</div>
                   </div>

                   <div className="hidden sm:block w-[1px] h-24 bg-slate-800/80 mx-2"></div>

                   {/* 2. BÜYÜK PASTA (GENEL TOPLAM) */}
                   <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-6 relative border-l border-slate-800/50 sm:border-0 pl-3 sm:pl-0">
                     <span className="absolute -top-4 sm:-top-4 left-1/2 sm:left-auto sm:right-4 -translate-x-1/2 sm:translate-x-0 bg-slate-800 text-slate-400 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest whitespace-nowrap">
                       TÜM ZAMANLAR
                     </span>
                     <div className="relative w-16 h-16 sm:w-32 sm:h-32 shrink-0 mt-2 sm:mt-0">
                       <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 42 42">
                         <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4.5"></circle>
                         {pastaVerisi.maxYuzde === 0 ? (
                           <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#334155" strokeWidth="4.5" strokeDasharray="100 0"></circle>
                         ) : (
                           <>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.kendinTopla.yuzde} ${100 - pastaVerisi.kendinTopla.yuzde}`} strokeDashoffset={-pastaVerisi.kendinTopla.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.bilesen.yuzde} ${100 - pastaVerisi.bilesen.yuzde}`} strokeDashoffset={-pastaVerisi.bilesen.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fb7185" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.cevre.yuzde} ${100 - pastaVerisi.cevre.yuzde}`} strokeDashoffset={-pastaVerisi.cevre.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c084fc" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.sistem.yuzde} ${100 - pastaVerisi.sistem.yuzde}`} strokeDashoffset={-pastaVerisi.sistem.offset}></circle>
                             <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="4.5" strokeDasharray={`${pastaVerisi.aksesuar.yuzde} ${100 - pastaVerisi.aksesuar.yuzde}`} strokeDashoffset={-pastaVerisi.aksesuar.offset}></circle>
                           </>
                         )}
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center mt-0.5 sm:mt-1">
                         <span className="text-xs sm:text-xl font-black text-white tracking-tight">{pastaVerisi.maxYuzde}%</span>
                       </div>
                     </div>

                     <div className="flex flex-col gap-1.5 sm:gap-2 shrink-0 w-full sm:w-[180px]">
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] shrink-0"></span>
                           <span className="text-[9px] sm:text-[11px] text-slate-300 font-bold truncate">Kendin Topla</span>
                         </div>
                         <span className="text-[9px] sm:text-[11px] font-black text-amber-400 shrink-0 pl-1">{pastaVerisi.kendinTopla.yuzde}%</span>
                       </div>
                       
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] shrink-0"></span>
                           <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Bileşenler</span>
                         </div>
                         <span className="text-[9px] sm:text-[11px] font-black text-cyan-400 shrink-0 pl-1">{pastaVerisi.bilesen.yuzde}%</span>
                       </div>
                       
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#fb7185] shrink-0"></span>
                           <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Çevre & Oyuncu</span>
                         </div>
                         <span className="text-[9px] sm:text-[11px] font-black text-rose-400 shrink-0 pl-1">{pastaVerisi.cevre.yuzde}%</span>
                       </div>
                       
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#c084fc] shrink-0"></span>
                           <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Sistem & Laptop</span>
                         </div>
                         <span className="text-[9px] sm:text-[11px] font-black text-purple-400 shrink-0 pl-1">{pastaVerisi.sistem.yuzde}%</span>
                       </div>
                       
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                           <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399] shrink-0"></span>
                           <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Ağ & Aksesuar</span>
                         </div>
                         <span className="text-[9px] sm:text-[11px] font-black text-emerald-400 shrink-0 pl-1">{pastaVerisi.aksesuar.yuzde}%</span>
                       </div>
                    </div>
                   </div>

                 </div>
              </div>
              
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

            </div>

          </div>

        </div>
      </div>

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

      {girisSartModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#020617] rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Erişim Kısıtlı</h3>
            <p className="text-slate-400 text-sm mb-6">
              Lütfen işlem yapabilmek ve hesap detaylarınızı görüntüleyebilmek için giriş yapınız.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/giris" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> Giriş Yap
              </Link>
              <button onClick={() => setGirisSartModal(false)} className="w-full py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest transition-all">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
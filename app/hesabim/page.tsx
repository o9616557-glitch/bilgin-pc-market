"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  User, ShieldCheck, CreditCard, Package, LogOut, Server, Truck, Star, 
  MapPin, Loader2, ChevronLeft, ChevronRight, X, Copy, CheckCircle2, 
  Search, LogIn, UserPlus, Headset, Crown, Palette 
} from "lucide-react";

// Canlı Lucide ikonlarını isimlerine göre eşleştiren akıllı motor
const ikonEslestir = (liste: any[]) => {
  return liste.map((item: any) => {
    let ikonBileseni = Star;
    if (item.id === "profil") ikonBileseni = User;
    if (item.id === "cuzdan") ikonBileseni = CreditCard;
    if (item.id === "guvenlik") ikonBileseni = ShieldCheck;
    if (item.id === "adresler") ikonBileseni = MapPin;
    if (item.id === "sistemler") ikonBileseni = Server;
    if (item.id === "kargolar") ikonBileseni = Truck;
    if (item.id === "destek") ikonBileseni = Headset;
    if (item.id === "sorgula") ikonBileseni = Search;
    return { ...item, ikon: ikonBileseni };
  });
};

export default function HesabimPage() {
  const { data: session, status } = useSession();
  const suAnkiTarih = new Date();
  const yil = suAnkiTarih.getFullYear();

  // =========================================================================
  // 1. ÖN BELLEK (LOCAL STORAGE) VE SÜRÜKLE-BIRAK MOTORU
  // =========================================================================
  const renkSecenekleri = [
    { text: "text-white", bg: "bg-white border-slate-300" }, 
    { text: "text-slate-500", bg: "bg-slate-700 border-slate-500" }, 
    { text: "text-slate-400", bg: "bg-slate-400 border-slate-300" }, 
    { text: "text-red-500", bg: "bg-red-500 border-red-400" }, 
    { text: "text-rose-500", bg: "bg-rose-500 border-rose-400" }, 
    { text: "text-orange-500", bg: "bg-orange-500 border-orange-400" }, 
    { text: "text-amber-500", bg: "bg-amber-500 border-amber-400" }, 
    { text: "text-yellow-400", bg: "bg-yellow-400 border-yellow-300" }, 
    { text: "text-lime-400", bg: "bg-lime-400 border-lime-300" }, 
    { text: "text-green-500", bg: "bg-green-500 border-green-400" }, 
    { text: "text-emerald-400", bg: "bg-emerald-400 border-emerald-300" }, 
    { text: "text-teal-400", bg: "bg-teal-400 border-teal-300" }, 
    { text: "text-cyan-400", bg: "bg-cyan-400 border-cyan-300" }, 
    { text: "text-sky-400", bg: "bg-sky-400 border-sky-300" }, 
    { text: "text-blue-500", bg: "bg-blue-500 border-blue-400" }, 
    { text: "text-indigo-400", bg: "bg-indigo-400 border-indigo-300" }, 
    { text: "text-violet-500", bg: "bg-violet-500 border-violet-400" }, 
    { text: "text-purple-500", bg: "bg-purple-500 border-purple-400" }, 
    { text: "text-fuchsia-400", bg: "bg-fuchsia-400 border-fuchsia-300" }, 
    { text: "text-pink-500", bg: "bg-pink-500 border-pink-400" }, 
    { text: "text-stone-400", bg: "bg-stone-400 border-stone-300" }, 
  ];

  const varsayilanUstMenu = [
    { id: "profil", isim: "Profil", ikon: User, renk: "text-cyan-400", isLink: true, href: "/hesabim" },
    { id: "cuzdan", isim: "Cüzdan", ikon: CreditCard, renk: "text-amber-400", isLink: true, href: "/cuzdan" },
    { id: "guvenlik", isim: "Güvenlik", ikon: ShieldCheck, renk: "text-emerald-400", isLink: true, href: "/guvenlik" },
    { id: "adresler", isim: "Adresler", ikon: MapPin, renk: "text-cyan-400", isLink: true, href: "/adreslerim" }
  ];

  const varsayilanAltMenu = [
    { id: "favoriler", isim: "Favoriler", ikon: Star, renk: "text-purple-400", isLink: true, href: "https://www.bilginpcmarket.com/favorilerim" },
    { id: "sistemler", isim: "Sistemler", ikon: Server, renk: "text-emerald-400", isLink: true, href: "/sistemlerim" },
    { id: "kargolar", isim: "Kargolar", ikon: Truck, renk: "text-rose-400", isKargo: true },
    { id: "destek", isim: "Destek", ikon: Headset, renk: "text-orange-400", isLink: true, href: "/destek-taleplerim" },
    { id: "sorgula", isim: "Sorgula", ikon: Search, renk: "text-blue-400", isLink: true, href: "/siparis-takip" }
  ];

  // Sıfır Gecikme: Sayfa açılır açılmaz ön bellekten (Local Storage) menüyü çeker
  const [ustMenuListesi, setUstMenuListesi] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("bilgin_ust_menu_v2");
        if (cached) return ikonEslestir(JSON.parse(cached));
      } catch (e) {}
    }
    return varsayilanUstMenu;
  });

  const [altMenuListesi, setAltMenuListesi] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("bilgin_alt_menu_v2");
        if (cached) return ikonEslestir(JSON.parse(cached));
      } catch (e) {}
    }
    return varsayilanAltMenu;
  });
  
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [seciliKutuId, setSeciliKutuId] = useState<string | null>(null);
  
  const suruklenenUstRef = useRef<number | null>(null);
  const suruklenenAltRef = useRef<number | null>(null);

  // =========================================================================
  // 2. SİSTEM DURUMLARI (Siparişler, Adresler, Grafikler vb.)
  // =========================================================================
  const [hamSiparisler, setHamSiparisler] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}").tumSiparisler || []; } catch { return []; }
    } return [];
  });
  
  const [adresSayisi, setAdresSayisi] = useState<number>(0);
  const [favoriSayisi, setFavoriSayisi] = useState<number>(0);
  const [sistemSayisi, setSistemSayisi] = useState<number>(0);
  const [acikTalepSayisi, setAcikTalepSayisi] = useState<number>(0);
  const [yeniMesajVar, setYeniMesajVar] = useState<boolean>(false);

  const [sonSiparislerListesi, setSonSiparislerListesi] = useState<any[]>([]);
  const [grafikVerisi, setGrafikVerisi] = useState<any[]>([]);
  const [isKargoModalOpen, setIsKargoModalOpen] = useState(false);
  const [kopyalananKod, setKopyalananKargo] = useState<string | null>(null);
  const [girisSartModal, setGirisSartModal] = useState(false);

  const [pastaVerisi, setPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, tutar: 0, offset: 0 }, bilesen: { yuzde: 0, tutar: 0, offset: 0 },
    cevre: { yuzde: 0, tutar: 0, offset: 0 }, sistem: { yuzde: 0, tutar: 0, offset: 0 },
    aksesuar: { yuzde: 0, tutar: 0, offset: 0 }, maxYuzde: 0
  });

  const [aylikPastaVerisi, setAylikPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, offset: 0 }, bilesen: { yuzde: 0, offset: 0 },
    cevre: { yuzde: 0, offset: 0 }, sistem: { yuzde: 0, offset: 0 },
    aksesuar: { yuzde: 0, offset: 0 }, maxYuzde: 0, ayAdi: ""
  });
  
  const [seciliYil, setSeciliYil] = useState<number>(yil);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiklananAy, setTiklananAy] = useState<number | null>(suAnkiTarih.getMonth());

  // =========================================================================
  // 3. ÇEKİRDEK FONKSİYONLAR (Menü Senkronizasyonu, Kayıt vb.)
  // =========================================================================
  
  // SESSİZ ARKA PLAN GÜNCELLEMESİ (Source of Truth)
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/menu-ayarlari?email=${session.user.email}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data?.menuListesi?.length > 0) {
            const mapliListe = ikonEslestir(resData.data.menuListesi);

            const ustIds = ["profil", "cuzdan", "guvenlik", "adresler"];
            const yuklenenUst = mapliListe.filter((i: any) => ustIds.includes(i.id));
            const yuklenenAlt = mapliListe.filter((i: any) => !ustIds.includes(i.id));

            // MongoDB'den gelen güncel (ve eksikleri kapatılmış) listeyi ön yüze uygula
            setUstMenuListesi(yuklenenUst);
            setAltMenuListesi(yuklenenAlt);

            // Yerel hafızayı da anında güncelle
            localStorage.setItem("bilgin_ust_menu_v2", JSON.stringify(yuklenenUst.map(({ikon, ...k})=>k)));
            localStorage.setItem("bilgin_alt_menu_v2", JSON.stringify(yuklenenAlt.map(({ikon, ...k})=>k)));
          }
        }).catch(err => console.error("Menü yükleme hatası:", err));
    }
  }, [session, status]);

  // KALICI KAYDETME MOTORU
  const veritabaninaKaydet = async (guncelUst: any[], guncelAlt: any[]) => {
    if (!session?.user?.email) return;
    
    const temizUst = guncelUst.map(({ ikon, ...kalanlar }) => kalanlar);
    const temizAlt = guncelAlt.map(({ ikon, ...kalanlar }) => kalanlar);

    // Ön belleğe anında yaz (0ms açılış için)
    localStorage.setItem("bilgin_ust_menu_v2", JSON.stringify(temizUst));
    localStorage.setItem("bilgin_alt_menu_v2", JSON.stringify(temizAlt));

    try {
      // Arka planda sessizce MongoDB'yi (Tek Doğru Kaynak) güncelle
      const birlestirilmisListe = [...temizUst, ...temizAlt];
      await fetch('/api/menu-ayarlari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kullaniciEmail: session.user.email, menuListesi: birlestirilmisListe })
      });
    } catch (error) { console.error("Veritabanına kaydetme hatası:", error); }
  };

  const handleDuzenlemeModuGecis = async () => {
    if (status === "unauthenticated") return; 
    if (duzenlemeModu) {
      await veritabaninaKaydet(ustMenuListesi, altMenuListesi); 
      setDuzenlemeModu(false);
      setSeciliKutuId(null);
    } else {
      setDuzenlemeModu(true); 
    }
  };

  const handleDragEnterUst = (hedefIndex: number) => {
    const suruklenenIndex = suruklenenUstRef.current;
    if (suruklenenIndex === null || suruklenenIndex === hedefIndex) return;
    setUstMenuListesi((eskiListe) => {
      const yeniListe = [...eskiListe];
      const suruklenenOge = yeniListe.splice(suruklenenIndex, 1)[0];
      yeniListe.splice(hedefIndex, 0, suruklenenOge);
      return yeniListe;
    });
    suruklenenUstRef.current = hedefIndex;
  };

  const handleDragEnterAlt = (hedefIndex: number) => {
    const suruklenenIndex = suruklenenAltRef.current;
    if (suruklenenIndex === null || suruklenenIndex === hedefIndex) return;
    setAltMenuListesi((eskiListe) => {
      const yeniListe = [...eskiListe];
      const suruklenenOge = yeniListe.splice(suruklenenIndex, 1)[0];
      yeniListe.splice(hedefIndex, 0, suruklenenOge);
      return yeniListe;
    });
    suruklenenAltRef.current = hedefIndex;
  };

  const renkUygula = (yeniRenk: string) => {
    if (!seciliKutuId) return;
    setUstMenuListesi(eski => eski.map(kutu => kutu.id === seciliKutuId ? { ...kutu, renk: yeniRenk } : kutu));
    setAltMenuListesi(eski => eski.map(kutu => kutu.id === seciliKutuId ? { ...kutu, renk: yeniRenk } : kutu));
  };

  const handleCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    localStorage.removeItem("bilgin_ust_menu_v2");
    localStorage.removeItem("bilgin_alt_menu_v2");
    sessionStorage.removeItem("bilgin_hesabim_data");
    const cihazId = (session?.user as any)?.deviceId;
    if (cihazId) {
      try { await fetch("/api/user/logout-device", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deviceId: cihazId }) }); } catch (e) {}
    }
    await signOut({ callbackUrl: "/" });
  };

  const kilitliIslem = (e: React.MouseEvent) => {
    if (status === "unauthenticated") { e.preventDefault(); setGirisSartModal(true); }
    else if (duzenlemeModu) { e.preventDefault(); } 
  };

  const handleKargoClick = (e?: React.MouseEvent) => {
    if (status === "unauthenticated") { if(e) kilitliIslem(e); } 
    else if (!duzenlemeModu) { setIsKargoModalOpen(true); }
  };

  const handleTakipEt = (takipNumarasi: string) => {
    navigator.clipboard.writeText(takipNumarasi);
    setKopyalananKargo(takipNumarasi);
    setTimeout(() => setKopyalananKargo(null), 2000);
  };

  // =========================================================================
  // 4. VERİ ÇEKME VE GRAFİK HESAPLAMA MOTORLARI
  // =========================================================================
  useEffect(() => {
    if (status === "unauthenticated") {
      setHamSiparisler([]); setAdresSayisi(0); setFavoriSayisi(0); setSistemSayisi(0);
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    try {
      const hafiza = sessionStorage.getItem("bilgin_hesabim_data");
      if (hafiza) {
        const parsed = JSON.parse(hafiza);
        if (parsed.tumSiparisler && parsed.tumSiparisler.length > 0) setHamSiparisler(parsed.tumSiparisler);
        if (parsed.favoriSayisi !== undefined) setFavoriSayisi(parsed.favoriSayisi);
        if (parsed.adresSayisi !== undefined) setAdresSayisi(parsed.adresSayisi);
      }
      const kayitliSistemler = localStorage.getItem("bilgin_kayitli_sistemler");
      if (kayitliSistemler) {
        const parsedSistemler = JSON.parse(kayitliSistemler);
        if (Array.isArray(parsedSistemler)) setSistemSayisi(parsedSistemler.length);
      }
    } catch (error) { console.error("Hafıza okuma hatası:", error); }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;
    const gercegiKontrolEt = async () => {
      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { cache: "no-store", headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" } });
        const data = await res.json();
        if (res.ok && data.orders) {
          const benimSiparislerim = data.orders.filter((o: any) => {
            const mail = o.userEmail || o.email || o.musteri?.eposta || o.musteri?.email || "";
            return mail.toLowerCase() === (session?.user?.email || "").toLowerCase() && o.gizlendi !== true;
          });
          setHamSiparisler(benimSiparislerim);
          const eskiHafiza = JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}");
          sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({ ...eskiHafiza, tumSiparisler: benimSiparislerim }));
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

        const destekRes = await fetch("/api/destek?t=" + new Date().getTime(), { cache: "no-store" });
        if (destekRes.ok) {
          const destekData = await destekRes.json();
          if (destekData.talepler) {
            const aciklar = destekData.talepler.filter((t: any) => t.durum !== "Çözüldü");
            const acilMesaj = aciklar.some((t: any) => t.durum === "Yanıt Bekleniyor");
            setAcikTalepSayisi(aciklar.length); setYeniMesajVar(acilMesaj);
            sessionStorage.setItem("bilgin_destek_ozet", JSON.stringify({ sayi: aciklar.length, acil: acilMesaj }));
          }
        }
      } catch (error) { console.error("Radar bağlantı hatası:", error); }
    };
    gercegiKontrolEt();
    const radar = setInterval(gercegiKontrolEt, 5000); 
    return () => clearInterval(radar); 
  }, [session, status]);

  useEffect(() => {
    if (!hamSiparisler) return;
    const sirali = [...hamSiparisler].sort((a: any, b: any) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime());
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

      if (siparisYili === seciliYil) { aylikToplamlar[siparisAyi] += siparisTutar; }

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
      const p1 = (cK_toplam / genelToplam) * 100; const p2 = (cB_toplam / genelToplam) * 100;
      const p3 = (cC_toplam / genelToplam) * 100; const p4 = (cS_toplam / genelToplam) * 100;
      const p5 = (cA_toplam / genelToplam) * 100;

      setPastaVerisi({
        kendinTopla: { yuzde: Math.round(p1), tutar: cK_toplam, offset: 0 },
        bilesen: { yuzde: Math.round(p2), tutar: cB_toplam, offset: p1 },
        cevre: { yuzde: Math.round(p3), tutar: cC_toplam, offset: p1 + p2 },
        sistem: { yuzde: Math.round(p4), tutar: cS_toplam, offset: p1 + p2 + p3 },
        aksesuar: { yuzde: Math.round(p5), tutar: cA_toplam, offset: p1 + p2 + p3 + p4 },
        maxYuzde: Math.round(Math.max(p1, p2, p3, p4, p5))
      });
    } else {
      setPastaVerisi({ kendinTopla: { yuzde: 0, tutar: 0, offset: 0 }, bilesen: { yuzde: 0, tutar: 0, offset: 0 }, cevre: { yuzde: 0, tutar: 0, offset: 0 }, sistem: { yuzde: 0, tutar: 0, offset: 0 }, aksesuar: { yuzde: 0, tutar: 0, offset: 0 }, maxYuzde: 0 });
    }

    const aylikNetToplam = m_cK + m_cB + m_cC + m_cS + m_cA;
    if (aylikNetToplam > 0) {
      const ap1 = (m_cK / aylikNetToplam) * 100; const ap2 = (m_cB / aylikNetToplam) * 100;
      const ap3 = (m_cC / aylikNetToplam) * 100; const ap4 = (m_cS / aylikNetToplam) * 100;
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
      setAylikPastaVerisi({ kendinTopla: { yuzde: 0, offset: 0 }, bilesen: { yuzde: 0, offset: 0 }, cevre: { yuzde: 0, offset: 0 }, sistem: { yuzde: 0, offset: 0 }, aksesuar: { yuzde: 0, offset: 0 }, maxYuzde: 0, ayAdi: aylarUzun[aktifAy] });
    }
  }, [hamSiparisler, seciliYil, tiklananAy]);

  const kargoSiparisleri = hamSiparisler.filter(s => {
    const d = (s.status || s.durum || "").toLowerCase();
    return d.includes("kargo") && !d.includes("teslim") && !d.includes("iptal");
  });

  const userName = status === "unauthenticated" ? "Misafir" : (session?.user?.name || "Özkan");
  const userEmail = status === "unauthenticated" ? "Lütfen giriş yapın" : (session?.user?.email || "");
  const basHarf = userName.charAt(0).toUpperCase();

  // Tam ekran ana yükleme
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.5)]"></div>
        <p className="mt-6 text-cyan-400 font-bold uppercase tracking-widest text-sm animate-pulse">Sistem Yükleniyor...</p>
      </div>
    );
  }

  return (
    // suppressHydrationWarning: Tarayıcı ve Sunucu senkronizasyonunda "titremeyi" önler
    <div suppressHydrationWarning={true} className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip z-[999]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#00d2ff] blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1000px] mx-auto flex flex-col gap-6 relative z-10 items-center">

       {/* ==================================================================== */}
        {/* 1️⃣ ÜST 4'LÜ MENÜ KUTULARI                                              */}
        {/* ==================================================================== */}
        <div className="w-full block">
          <div className={`grid grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4 w-full transition-all duration-300 ${duzenlemeModu ? 'bg-[#0f172a]/50 p-2 sm:p-4 rounded-3xl border-2 border-dashed border-emerald-500/50' : ''}`}>
            
            {ustMenuListesi.map((item, index) => {
              const IkonBileseni = item.ikon;
              const isSecili = seciliKutuId === item.id;
              
              const KutuIcerigi = (
                <div
                  draggable={duzenlemeModu}
                  onDragStart={() => (suruklenenUstRef.current = index)}
                  onDragEnter={() => handleDragEnterUst(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={() => (suruklenenUstRef.current = null)}
                  onClick={() => { if (duzenlemeModu) setSeciliKutuId(isSecili ? null : item.id); }}
                  className={`flex flex-col items-center gap-1.5 lg:gap-2.5 group w-full select-none ${isSecili ? "relative z-[9999]" : "relative z-10"}`}
                >
                  <div className={`relative w-full aspect-square max-w-[64px] lg:max-w-none lg:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      duzenlemeModu && isSecili
                      ? "bg-slate-800 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110 z-20"
                      : duzenlemeModu && !isSecili
                      ? "bg-[#0f172a]/60 border-2 border-dashed border-slate-700 opacity-50 hover:opacity-100 cursor-pointer"
                      : "bg-[#0f172a] border border-slate-800 shadow-lg group-hover:bg-white/[0.05] group-hover:border-cyan-500/30 cursor-pointer"
                  }`}>
                    <IkonBileseni className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-all duration-300 ${item.renk} ${!duzenlemeModu ? 'group-hover:scale-110' : ''}`} />
                    
                    {duzenlemeModu && isSecili && (
                      <div className="absolute -top-1.5 -right-1.5 bg-[#020617] rounded-full shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-wide text-center truncate w-full px-0.5 transition-colors ${duzenlemeModu && isSecili ? "text-emerald-400" : "text-slate-300 group-hover:text-cyan-400"}`}>
                    {item.isim}
                  </span>
                </div>
              );

              if (item.isLink && !duzenlemeModu) {
                return <Link key={item.id} href={item.href || "#"} onClick={kilitliIslem} prefetch={true} className="w-full">{KutuIcerigi}</Link>;
              }
              return <div key={item.id} className="w-full">{KutuIcerigi}</div>;
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 2️⃣ KULLANICI KARTI VE MERKEZİ RENK CEKMECESİ                           */}
        {/* ==================================================================== */}
        <div className={`w-full relative rounded-[2rem] p-[2px] transition-all duration-300 shadow-[0_0_50px_rgba(0,210,255,0.15)] group ${duzenlemeModu ? 'bg-gradient-to-r from-emerald-500/50 via-emerald-900 to-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10'}`}>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem] transition-opacity duration-500"></div>
          <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col border border-cyan-500/20 overflow-hidden z-10">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10">
              {/* 🐍 Orijinal Işıklı Yılan Dönüşlü Profil Yuvarlağı */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.5)]"></div>
                <div className={`absolute inset-2.5 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,255,0.4),inset_0_0_20px_rgba(34,211,255,0.2)] border-t-cyan-300 animate-[spin_8s_linear_infinite] ${duzenlemeModu ? 'border-t-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}`}></div>
                
                {/* Tıklanabilir İç Alan */}
                <div 
                  onClick={handleDuzenlemeModuGecis}
                  title={duzenlemeModu ? "Düzenlemeyi Kaydet ve Kapat" : "Menüyü Düzenle"}
                  className={`absolute inset-4 rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] cursor-pointer transition-all duration-300 hover:scale-105 z-20 ${duzenlemeModu ? 'bg-emerald-950 border-2 border-emerald-500' : 'bg-[#020617] border border-cyan-900/50'}`}
                >
                  <span className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b drop-shadow-[0_0_15px_rgba(34,211,255,0.8)] ${duzenlemeModu ? 'from-emerald-100 to-emerald-500' : 'from-cyan-100 to-cyan-500'}`}>
                    {duzenlemeModu ? <Palette className="w-10 h-10 text-emerald-400" /> : basHarf}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left z-10 flex flex-col justify-center">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-0.5 sm:mb-2 drop-shadow-md">
                  {duzenlemeModu ? "Düzenleme Modu Açık" : userName}
                </h1>
                <p className={`text-xs sm:text-sm font-medium tracking-wide mb-4 ${duzenlemeModu ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {duzenlemeModu ? "Bir kutuya tıklayın, ardından buradaki paletten rengini belirleyin." : userEmail}
                </p>
                
                {/* 🛡️ ADMIN İÇİN GÜVENLİ ÇIKIŞ YAP BUTONU */}
                {status === "authenticated" && !duzenlemeModu && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <button onClick={handleCikisYap} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-all font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-md">
                      <LogOut className="w-4 h-4" /> Güvenli Çıkış
                    </button>
                  </div>
                )}

                {status === "unauthenticated" && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Link href="/giris" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-lg transition-all">
                      <LogIn className="w-4 h-4" /> Giriş
                    </Link>
                    <Link href="/kayit" className="bg-[#0f172a] border border-slate-700 hover:border-slate-500 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all">
                      <UserPlus className="w-4 h-4" /> Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* 🎨 MERKEZİ RENK PALETİ */}
            {duzenlemeModu && (
              <div className="w-full mt-6 pt-6 border-t border-cyan-500/20 animate-in fade-in slide-in-from-top-4 z-20">
                <div className="text-center mb-4">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                    🎨 Önce yukarıdan veya aşağıdan bir kutu seçin, sonra renk verin
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 max-h-[160px] overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {renkSecenekleri.map((renkObj, i) => (
                    <button 
                      key={i} 
                      onClick={() => renkUygula(renkObj.text)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center shadow-lg border-2 ${renkObj.bg} ${!seciliKutuId ? "opacity-20 grayscale cursor-not-allowed" : "opacity-100"}`}
                      disabled={!seciliKutuId}
                    ></button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3️⃣ ALT 5'Lİ MENÜ KUTULARI                                              */}
        {/* ==================================================================== */}
        <div className="w-full block">
          <div className={`grid grid-cols-5 gap-1.5 sm:gap-3 lg:gap-4 w-full transition-all duration-300 ${duzenlemeModu ? 'bg-[#0f172a]/50 p-2 sm:p-4 rounded-3xl border-2 border-dashed border-emerald-500/50' : ''}`}>
            {altMenuListesi.map((item, index) => {
              const IkonBileseni = item.ikon;
              const isSecili = seciliKutuId === item.id;
              
              const kargoVarmi = item.id === "kargolar" && kargoSiparisleri.length > 0;
              const mesajVarmi = item.id === "destek" && yeniMesajVar;

              const KutuIcerigi = (
                <div
                  draggable={duzenlemeModu}
                  onDragStart={() => (suruklenenAltRef.current = index)}
                  onDragEnter={() => handleDragEnterAlt(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={() => (suruklenenAltRef.current = null)}
                  onClick={() => {
                    if (duzenlemeModu) {
                      setSeciliKutuId(isSecili ? null : item.id);
                    } else if (item.isKargo) {
                      handleKargoClick();
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 lg:gap-2.5 group w-full select-none ${isSecili ? "relative z-[9999]" : "relative z-10"}`}
                >
                  <div className={`relative w-full aspect-square max-w-[64px] lg:max-w-none lg:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      duzenlemeModu && isSecili
                      ? "bg-slate-800 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110 z-20"
                      : duzenlemeModu && !isSecili
                      ? "bg-[#0f172a]/60 border-2 border-dashed border-slate-700 opacity-50 hover:opacity-100 cursor-pointer"
                      : "bg-[#0f172a] border border-slate-800 shadow-lg group-hover:bg-white/[0.05] group-hover:border-cyan-500/30 cursor-pointer"
                  }`}>
                    
                    <IkonBileseni className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-all duration-300 ${item.renk} ${!duzenlemeModu ? 'group-hover:scale-110' : ''}`} />
                    
                 {(kargoVarmi || mesajVarmi) && !duzenlemeModu && (
  <span className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 z-10">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${kargoVarmi ? 'bg-cyan-400' : 'bg-emerald-400'}`}></span>
    <span className={`relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 border-2 border-[#0f172a] ${kargoVarmi ? 'bg-cyan-500' : 'bg-emerald-500'}`}></span>
  </span>
)}

                    {duzenlemeModu && isSecili && (
                      <div className="absolute -top-1.5 -right-1.5 bg-[#020617] rounded-full shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  
                  <span className={`text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-wide text-center truncate w-full px-0.5 transition-colors ${duzenlemeModu && isSecili ? "text-emerald-400" : "text-slate-300 group-hover:text-cyan-400"}`}>
                    {item.isim}
                  </span>
                </div>
              );

              if (item.isLink && !duzenlemeModu) {
                return <Link key={item.id} href={item.href || "#"} onClick={kilitliIslem} prefetch={true} className="w-full">{KutuIcerigi}</Link>;
              }
              return <div key={item.id} className="w-full">{KutuIcerigi}</div>;
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 📊 SİPARİŞLER VE GRAFİKLER BÖLÜMÜ (TÜM GRAFİKLER KORUNDU)            */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start w-full">
          <div className="xl:col-span-1 flex flex-col h-full">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-[350px] sm:h-[450px] xl:h-[550px]">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80 relative z-10 shrink-0">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Siparişler</h3>
                <Link href="/siparislerim" onClick={kilitliIslem} prefetch={true} className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:underline tracking-widest uppercase">
                  TÜMÜNÜ GÖR
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
                          <p className="text-white font-bold text-xs sm:text-sm truncate mb-0.5 sm:mb-1" title={urunAdi}>{urunAdi}</p>
                          <p className="text-slate-500 text-[9px] sm:text-[10px] font-medium">{tarih}</p>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col xl:flex-row 2xl:flex-col items-center sm:items-end justify-between gap-1 sm:gap-2 shrink-0">
                          <p className="text-white font-black text-xs sm:text-sm">
                            {Number(toplamFiyat).toLocaleString("tr-TR")} ₺
                          </p>
                          <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-widest shrink-0 w-fit ${
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

          <div className="xl:col-span-2 flex flex-col gap-6 w-full">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col xl:flex-row items-center gap-6 overflow-hidden">
               <div className="shrink-0 space-y-1.5 text-center xl:text-left xl:w-[140px] w-full">
               <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider leading-tight">Harcama Dağılımı</h3>
                 <p className="text-[10px] text-slate-500 font-medium">Satın alınan kategoriler</p>
               </div>

               <div className="flex-1 grid grid-cols-2 w-full border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-6 sm:pt-0 sm:pl-6">
                 
                 <div className="flex flex-col items-center gap-4 w-full pr-2 sm:pr-6 border-r border-slate-800/80">
                   <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.4)] whitespace-nowrap text-center">
                     {aylikPastaVerisi.ayAdi ? `${aylikPastaVerisi.ayAdi} ÖZETİ` : "AYLIK ÖZET"}
                   </span>
                   
                   <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
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
                       <span className="text-sm sm:text-xl font-black text-white">{aylikPastaVerisi.maxYuzde}%</span>
                     </div>
                   </div>
                   
                   <div className="flex flex-col gap-2 shrink-0 w-full sm:w-[180px]">
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                         <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] shrink-0"></span>
                         <span className="text-[9px] sm:text-[11px] text-slate-300 font-bold truncate">Kendin Topla</span>
                       </div>
                       <span className="text-[9px] sm:text-[11px] font-black text-amber-400 shrink-0 pl-1">{aylikPastaVerisi.kendinTopla.yuzde}%</span>
                     </div>
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                         <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] shrink-0"></span>
                         <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Bileşenler</span>
                       </div>
                       <span className="text-[9px] sm:text-[11px] font-black text-cyan-400 shrink-0 pl-1">{aylikPastaVerisi.bilesen.yuzde}%</span>
                     </div>
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                         <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#fb7185] shrink-0"></span>
                         <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Çevre & Oyuncu</span>
                       </div>
                       <span className="text-[9px] sm:text-[11px] font-black text-rose-400 shrink-0 pl-1">{aylikPastaVerisi.cevre.yuzde}%</span>
                     </div>
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                         <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#c084fc] shrink-0"></span>
                         <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Sistem & Laptop</span>
                       </div>
                       <span className="text-[9px] sm:text-[11px] font-black text-purple-400 shrink-0 pl-1">{aylikPastaVerisi.sistem.yuzde}%</span>
                     </div>
                     <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                         <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399] shrink-0"></span>
                         <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium truncate">Ağ & Aksesuar</span>
                       </div>
                       <span className="text-[9px] sm:text-[11px] font-black text-emerald-400 shrink-0 pl-1">{aylikPastaVerisi.aksesuar.yuzde}%</span>
                     </div>
                   </div>
                 </div>

                 <div className="flex flex-col items-center gap-4 w-full pl-2 sm:pl-6">
                   <span className="bg-slate-800 text-slate-400 text-[9px] sm:text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest whitespace-nowrap text-center">
                     TÜM ZAMANLAR
                   </span>
                   
                   <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
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
                       <span className="text-sm sm:text-xl font-black text-white tracking-tight">{pastaVerisi.maxYuzde}%</span>
                     </div>
                   </div>

                   <div className="flex flex-col gap-2 shrink-0 w-full sm:w-[180px]">
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
            
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col w-full">
              <div className="flex flex-row items-center justify-between gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Aylık Harcama Grafiği</h3>
                 
                 <div className="flex items-center gap-1.5 bg-slate-800/30 border border-slate-700/50 rounded-lg px-1.5 py-1">
                   <button onClick={() => setSeciliYil((y: number) => y - 1)} className="p-1 text-slate-400 hover:text-cyan-400 transition-colors">
                     <ChevronLeft className="w-3.5 h-3.5" />
                   </button>
                   <span className="text-[11px] sm:text-xs font-black text-slate-200 w-8 text-center">{seciliYil}</span>
                   <button onClick={() => setSeciliYil((y: number) => y + 1)} className="p-1 text-slate-400 hover:text-cyan-400 transition-colors" disabled={seciliYil >= suAnkiTarih.getFullYear()}>
                     <ChevronRight className="w-3.5 h-3.5" />
                   </button>
                 </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/5 rounded-xl flex items-end justify-between pt-10 pb-4 px-1 sm:px-4 h-[220px] relative mt-2">
                {grafikVerisi.length > 0 ? grafikVerisi.map((item, i) => {
                  const isSecili = tiklananAy === i;
                  const isHovered = hoveredIndex === i;
                  const isTooltipGozukecek = (isHovered || isSecili);

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

      {/* ======================================================== */}
      {/* 🟢 MODALLAR (Kargo ve Giriş Şartı)                       */}
      {/* ======================================================== */}
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
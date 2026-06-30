"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { oturumHafizasiniTemizle } from "@/lib/oturum-hafiza";
import { useOrders } from "@/app/OrderContext";
import AccountShell from "@/components/layout/AccountShell";
import Image from "next/image";
import RenkPaleti from "@/components/hesabim/RenkPaleti";
import {
  VARSAYILAN_UST_MENU,
  VARSAYILAN_ALT_MENU,
  ikonEslestir,
} from "@/lib/hesabim/constants";
import {
  User,
  ShieldCheck,
  Palette,
  Camera,
  Loader2,
  ImagePlus,
} from "lucide-react";

const HesabimAnalytics = dynamic(() => import("@/components/hesabim/HesabimAnalytics"), {
  ssr: false,
  loading: () => null,
});

const HesabimModals = dynamic(() => import("@/components/hesabim/HesabimModals"), {
  ssr: false,
  loading: () => null,
});

export default function HesabimPage() {
  const { data: session, status, update: updateSession } = useSession();
  const { orders: siparisler } = useOrders();
  const suAnkiTarih = new Date();
  const yil = suAnkiTarih.getFullYear();

  // ── Avatar yükleme
  const dosyaInputRef = useRef<HTMLInputElement>(null);
  const [avatarOnizleme, setAvatarOnizleme] = useState<string | null>(null);
  const [avatarYukleniyor, setAvatarYukleniyor] = useState(false);

  // ── Banner (profil kartı geniş alan)
  const BANNER_KEY = "bilgin_profil_banner_v1";
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(BANNER_KEY) || null;
  });
  const [bannerYukleniyor, setBannerYukleniyor] = useState(false);

  // ── Kutu resimleri (5 adet navigasyon kutusu)
  const KUTU_RESIM_KEY = "bilgin_kutu_resimleri_v1";
  const kutuInputRef = useRef<HTMLInputElement>(null);
  const [kutuResimleri, setKutuResimleri] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem(KUTU_RESIM_KEY) || "{}"); } catch { return {}; }
  });
  const [resimYuklenecekKutu, setResimYuklenecekKutu] = useState<string | null>(null);

  // ── DB'den profil varlıklarını yükle (giriş yapınca bir kez)
  const profilVarlikYuklendi = useRef(false);
  useEffect(() => {
    if (status !== "authenticated" || profilVarlikYuklendi.current) return;
    profilVarlikYuklendi.current = true;
    fetch("/api/user/profile-assets")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        if (data.profileBanner) {
          setBannerUrl(data.profileBanner);
          localStorage.setItem(BANNER_KEY, data.profileBanner);
        }
        if (data.tileImages && Object.keys(data.tileImages).length > 0) {
          setKutuResimleri(data.tileImages);
          localStorage.setItem(KUTU_RESIM_KEY, JSON.stringify(data.tileImages));
        }
        if (data.pingRenk) {
          setPingRenk(data.pingRenk);
          localStorage.setItem("bilgin_ping_renk", data.pingRenk);
        }
      })
      .catch(() => {});
  }, [status]);

  const handleKutuResimSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya || !resimYuklenecekKutu) return;
    const imgEl = document.createElement("img");
    const blobUrl = URL.createObjectURL(dosya);
    imgEl.onload = () => {
      const S = 200;
      const canvas = document.createElement("canvas");
      canvas.width = S; canvas.height = S;
      const ctx = canvas.getContext("2d")!;
      const ratio = Math.max(S / imgEl.width, S / imgEl.height);
      const w = imgEl.width * ratio, h = imgEl.height * ratio;
      ctx.drawImage(imgEl, (S - w) / 2, (S - h) / 2, w, h);
      const b64 = canvas.toDataURL("image/jpeg", 0.80);
      const guncel = { ...kutuResimleri, [resimYuklenecekKutu]: b64 };
      setKutuResimleri(guncel);
      localStorage.setItem(KUTU_RESIM_KEY, JSON.stringify(guncel));
      URL.revokeObjectURL(blobUrl);
      // DB'ye kaydet
      fetch("/api/user/profile-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tileImages: guncel }),
      }).catch(() => {});
    };
    imgEl.src = blobUrl;
    setResimYuklenecekKutu(null);
    e.target.value = "";
  };

  const handleBannerSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    setBannerYukleniyor(true);
    const imgEl = document.createElement("img");
    const blobUrl = URL.createObjectURL(dosya);
    imgEl.onload = () => {
      const W = 800, H = 240;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      const ratio = Math.max(W / imgEl.width, H / imgEl.height);
      const w = imgEl.width * ratio, h = imgEl.height * ratio;
      ctx.drawImage(imgEl, (W - w) / 2, (H - h) / 2, w, h);
      const b64 = canvas.toDataURL("image/jpeg", 0.80);
      localStorage.setItem(BANNER_KEY, b64);
      setBannerUrl(b64);
      URL.revokeObjectURL(blobUrl);
      setBannerYukleniyor(false);
      // DB'ye kaydet
      fetch("/api/user/profile-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileBanner: b64 }),
      }).catch(() => {});
    };
    imgEl.src = blobUrl;
    e.target.value = "";
  };

  const handleAvatarSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const okur = new FileReader();
    okur.onload = async (ev) => {
      const ham = ev.target?.result as string;
      // Canvas ile 256x256'ya sıkıştır
      const img = document.createElement("img");
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext("2d")!;
        const oran = Math.max(256 / img.width, 256 / img.height);
        const w = img.width * oran; const h = img.height * oran;
        ctx.drawImage(img, (256 - w) / 2, (256 - h) / 2, w, h);
        const base64 = canvas.toDataURL("image/jpeg", 0.75);
        setAvatarOnizleme(base64);
        setAvatarYukleniyor(true);
        try {
          const res = await fetch("/api/user/update-avatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          });
          if (res.ok) await updateSession();
        } catch {}
        setAvatarYukleniyor(false);
      };
      img.src = ham;
    };
    okur.readAsDataURL(dosya);
    e.target.value = "";
  };

  const aktifAvatar = avatarOnizleme || session?.user?.image;

  // =========================================================================
  // 🚀 REHBER (ONBOARDING) SİSTEMİ HAFIZASI
  // =========================================================================
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [portalHazir, setPortalHazir] = useState(false);

  useEffect(() => {
    setPortalHazir(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isRead = localStorage.getItem('bilgin_rehber_okundu');
      if (!isRead) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const closeOnboarding = () => {
    if (dontShowAgain) {
      localStorage.setItem('bilgin_rehber_okundu', 'true');
    }
    setShowOnboarding(false);
  };
// Arkadaki sayfanın kaymasını (scroll) engelleme motoru
  useEffect(() => {
    if (showOnboarding) {
      // Pop-up açıksa gövdeyi kilitle
      document.body.style.overflow = 'hidden';
    } else {
      // Pop-up kapalıysa kilidi aç
      document.body.style.overflow = 'unset';
    }
    // Sayfadan çıkıldığında temizlik yap
    return () => { document.body.style.overflow = 'unset'; };
  }, [showOnboarding]);
  const [ustMenuListesi, setUstMenuListesi] = useState(() => {
    if (typeof window !== "undefined") {
      try { const cached = localStorage.getItem("bilgin_ust_menu_v4"); if (cached) return ikonEslestir(JSON.parse(cached)); } catch (e) {}
    }
    return VARSAYILAN_UST_MENU;
  });

  const [altMenuListesi, setAltMenuListesi] = useState(() => {
    if (typeof window !== "undefined") {
      try { const cached = localStorage.getItem("bilgin_alt_menu_v4"); if (cached) return ikonEslestir(JSON.parse(cached)); } catch (e) {}
    }
    return VARSAYILAN_ALT_MENU;
  });

  const [siparisRenkleri, setSiparisRenkleri] = useState<Record<string, any>>(() => {
    if(typeof window !== 'undefined') {
        const cached = localStorage.getItem('bilgin_siparis_renkleri');
        if(cached) return JSON.parse(cached);
    }
    return {};
  });

  const [pastaRenkleri, setPastaRenkleri] = useState<Record<string, any>>(() => {
    if(typeof window !== 'undefined') {
        const cached = localStorage.getItem('bilgin_pasta_renkleri');
        if(cached) return JSON.parse(cached);
    }
    return {
        kendinTopla: { hex: "#f59e0b", text: "text-amber-400" },
        bilesen: { hex: "#06b6d4", text: "text-cyan-400" },
        cevre: { hex: "#fb7185", text: "text-rose-400" },
        sistem: { hex: "#c084fc", text: "text-purple-400" },
        aksesuar: { hex: "#34d399", text: "text-emerald-400" }
    };
  });

  const [cubukRenk, setCubukRenk] = useState<any>(() => {
    if(typeof window !== 'undefined') {
        const cached = localStorage.getItem('bilgin_cubuk_renk');
        if(cached) return JSON.parse(cached);
    }
    return { hex: "#06b6d4", text: "text-cyan-400" };
  });

  // ── Ping noktası rengi (Destek + Kargo bildirim noktaları)
  const [pingRenk, setPingRenk] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('bilgin_ping_renk') || '#fb7185';
    return '#fb7185';
  });

  const [aktifPalet, setAktifPalet] = useState<'menu'|'siparis'|'pasta'|'cubuk'|null>(null);
  const [seciliKutuId, setSeciliKutuId] = useState<string | null>(null);
  const [seciliSiparisDurumu, setSeciliSiparisDurumu] = useState<string | null>(null);
  const [seciliPastaDilimi, setSeciliPastaDilimi] = useState<string | null>(null);
  
  const suruklenenUstRef = useRef<number | null>(null);
  const suruklenenAltRef = useRef<number | null>(null);

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
  const [guvenlikOzeti, setGuvenlikOzeti] = useState<{ ikiAdim: boolean; cihazSayisi: number } | null>(() => {
    if (typeof window === "undefined") return null;
    try { const c = sessionStorage.getItem("bilgin_guvenlik_ozet"); return c ? JSON.parse(c) : null; } catch { return null; }
  });
  const guvenlikYuklendi = useRef(false);

  const [pastaVerisi, setPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, offset: 0 }, bilesen: { yuzde: 0, offset: 0 },
    cevre: { yuzde: 0, offset: 0 }, sistem: { yuzde: 0, offset: 0 },
    aksesuar: { yuzde: 0, offset: 0 }, maxYuzde: 0
  });

  const [aylikPastaVerisi, setAylikPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, offset: 0 }, bilesen: { yuzde: 0, offset: 0 },
    cevre: { yuzde: 0, offset: 0 }, sistem: { yuzde: 0, offset: 0 },
    aksesuar: { yuzde: 0, offset: 0 }, maxYuzde: 0, ayAdi: ""
  });
  
  const [seciliYil, setSeciliYil] = useState<number>(yil);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiklananAy, setTiklananAy] = useState<number | null>(suAnkiTarih.getMonth());

  const togglePalet = (hedef: 'menu'|'siparis'|'pasta'|'cubuk') => {
    if(aktifPalet === hedef) {
        veritabaninaKaydet(ustMenuListesi, altMenuListesi, siparisRenkleri, pastaRenkleri, cubukRenk);
        setAktifPalet(null);
        setSeciliKutuId(null);
        setSeciliSiparisDurumu(null);
        setSeciliPastaDilimi(null);
    } else {
        setAktifPalet(hedef);
    }
  };

  const renkUygula = (renkObj: any) => {
    if (aktifPalet === 'menu') {
        setPingRenk(renkObj.hex);
        localStorage.setItem('bilgin_ping_renk', renkObj.hex);
        fetch("/api/user/profile-assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pingRenk: renkObj.hex }),
        }).catch(() => {});
    } else if (aktifPalet === 'siparis' && seciliSiparisDurumu) {
        const yeni = { ...siparisRenkleri, [seciliSiparisDurumu]: renkObj };
        setSiparisRenkleri(yeni);
        localStorage.setItem('bilgin_siparis_renkleri', JSON.stringify(yeni));
    } else if (aktifPalet === 'pasta' && seciliPastaDilimi) {
        const yeni = { ...pastaRenkleri, [seciliPastaDilimi]: { hex: renkObj.hex, text: renkObj.text } };
        setPastaRenkleri(yeni);
        localStorage.setItem('bilgin_pasta_renkleri', JSON.stringify(yeni));
    } else if (aktifPalet === 'cubuk') {
        const yeni = { hex: renkObj.hex, text: renkObj.text };
        setCubukRenk(yeni);
        localStorage.setItem('bilgin_cubuk_renk', JSON.stringify(yeni));
    }
  };

  const getSiparisRenk = (durum: string) => {
    if(siparisRenkleri[durum]) return siparisRenkleri[durum];
    const d = durum.toLowerCase();
    if(d.includes('kargo')) return { badge: "bg-rose-500/10 text-rose-500 border-rose-500/20" };
    if(d.includes('teslim') || d.includes('tamam') || d.includes('öden')) return { badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
    return { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/menu-ayarlari?email=${session.user.email}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data) {
            /* Menu listesi artık DB'den yüklenmez — 5 sabit kutu her zaman geçerli */

            if (resData.data.siparisRenkleri && Object.keys(resData.data.siparisRenkleri).length > 0) {
                setSiparisRenkleri(resData.data.siparisRenkleri);
                localStorage.setItem('bilgin_siparis_renkleri', JSON.stringify(resData.data.siparisRenkleri));
            }
            if (resData.data.pastaRenkleri && Object.keys(resData.data.pastaRenkleri).length > 0) {
                setPastaRenkleri(resData.data.pastaRenkleri);
                localStorage.setItem('bilgin_pasta_renkleri', JSON.stringify(resData.data.pastaRenkleri));
            }
            if (resData.data.cubukRenk && Object.keys(resData.data.cubukRenk).length > 0) {
                setCubukRenk(resData.data.cubukRenk);
                localStorage.setItem('bilgin_cubuk_renk', JSON.stringify(resData.data.cubukRenk));
            }
          }
        }).catch(err => console.error("Sessiz güncelleme hatası:", err));
    }
  }, [session, status]);

  const veritabaninaKaydet = async (guncelUst: any[], guncelAlt: any[], gSiparis: any, gPasta: any, gCubuk: any) => {
    if (!session?.user?.email) return;
    const temizUst = guncelUst.map(({ ikon, ...kalanlar }) => kalanlar);
    const temizAlt = guncelAlt.map(({ ikon, ...kalanlar }) => kalanlar);
    
    localStorage.setItem("bilgin_ust_menu_v4", JSON.stringify(temizUst));
    localStorage.setItem("bilgin_alt_menu_v4", JSON.stringify(temizAlt));
    
    try {
      const birlestirilmisListe = [...temizUst, ...temizAlt];
      await fetch('/api/menu-ayarlari', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
              kullaniciEmail: session.user.email, 
              menuListesi: birlestirilmisListe,
              siparisRenkleri: gSiparis,
              pastaRenkleri: gPasta,
              cubukRenk: gCubuk
          }) 
      });
    } catch (error) { console.error("Veritabanına kaydetme hatası:", error); }
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

  const handleCikisYap = async () => {
    oturumHafizasiniTemizle();
    localStorage.removeItem("bilgin_ust_menu_v4");
    localStorage.removeItem("bilgin_alt_menu_v4");
    const cihazId = (session?.user as any)?.deviceId;
    if (cihazId) {
      try { await fetch("/api/user/logout-device", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deviceId: cihazId }) }); } catch (e) {}
    }
    await signOut({ callbackUrl: "/" });
  };

  const kilitliIslem = (e: React.MouseEvent) => {
    if (status === "unauthenticated") { e.preventDefault(); setGirisSartModal(true); }
    else if (aktifPalet === 'menu') { e.preventDefault(); } 
  };

  const handleKargoClick = (e?: React.MouseEvent) => {
    if (status === "unauthenticated") { if(e) kilitliIslem(e); } 
    else if (aktifPalet !== 'menu') { setIsKargoModalOpen(true); }
  };

  const handleTakipEt = (takipNumarasi: string) => {
    navigator.clipboard.writeText(takipNumarasi);
    setKopyalananKargo(takipNumarasi);
    setTimeout(() => setKopyalananKargo(null), 2000);
  };

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const hafizadanOku = () => {
      try {
        const hafiza = sessionStorage.getItem("bilgin_hesabim_data");
        if (hafiza) {
          const parsed = JSON.parse(hafiza);
          if (parsed.tumSiparisler?.length) setHamSiparisler(parsed.tumSiparisler);
          if (parsed.favoriSayisi !== undefined) setFavoriSayisi(parsed.favoriSayisi);
          if (parsed.adresSayisi !== undefined) setAdresSayisi(parsed.adresSayisi);
        }
        const destekOzet = sessionStorage.getItem("bilgin_destek_ozet");
        if (destekOzet) {
          const parsed = JSON.parse(destekOzet);
          setAcikTalepSayisi(parsed.sayi || 0);
          setYeniMesajVar(!!parsed.acil);
        }
        const kayitliSistemler = localStorage.getItem("bilgin_kayitli_sistemler");
        if (kayitliSistemler) {
          const parsedSistemler = JSON.parse(kayitliSistemler);
          if (Array.isArray(parsedSistemler)) setSistemSayisi(parsedSistemler.length);
        }
      } catch (error) {
        console.error("Hafıza okuma hatası:", error);
      }
    };

    hafizadanOku();
    window.addEventListener("bilgin-hesap-guncellendi", hafizadanOku);

    // Yalnızca bir kez fetch yap (sessionStorage cache'i yoksa)
    if (!guvenlikYuklendi.current) {
      guvenlikYuklendi.current = true;
      fetch("/api/user/get-2fa", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return;
          const aktifCihazlar = (data.activeDevices || []).filter((c: any) => c.isActive === true);
          const ozet = { ikiAdim: !!data.twoFactorEmail, cihazSayisi: aktifCihazlar.length };
          setGuvenlikOzeti(ozet);
          try { sessionStorage.setItem("bilgin_guvenlik_ozet", JSON.stringify(ozet)); } catch {}
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("bilgin-hesap-guncellendi", hafizadanOku);
  }, [status, session?.user?.email]);

  useEffect(() => {
    if (status !== "authenticated" || siparisler.length === 0) return;
    setHamSiparisler(siparisler);
    try {
      const eskiHafiza = JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}");
      sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({ ...eskiHafiza, tumSiparisler: siparisler }));
    } catch {}
  }, [siparisler, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setHamSiparisler([]);
    }
  }, [status]);

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
        kendinTopla: { yuzde: Math.round(p1), offset: 0 },
        bilesen: { yuzde: Math.round(p2), offset: p1 },
        cevre: { yuzde: Math.round(p3), offset: p1 + p2 },
        sistem: { yuzde: Math.round(p4), offset: p1 + p2 + p3 },
        aksesuar: { yuzde: Math.round(p5), offset: p1 + p2 + p3 + p4 },
        maxYuzde: Math.round(Math.max(p1, p2, p3, p4, p5))
      });
    } else {
      setPastaVerisi({ kendinTopla: { yuzde: 0, offset: 0 }, bilesen: { yuzde: 0, offset: 0 }, cevre: { yuzde: 0, offset: 0 }, sistem: { yuzde: 0, offset: 0 }, aksesuar: { yuzde: 0, offset: 0 }, maxYuzde: 0 });
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

  const kargoSiparisleri = hamSiparisler.filter(s => (s.status || s.durum || "").toLowerCase().includes("kargo"));
  const userName = status === "unauthenticated" ? "Misafir" : (session?.user?.name || "Özkan");
  const userEmail = status === "unauthenticated" ? "Lütfen giriş yapın" : (session?.user?.email || "");
  const basHarf = userName.charAt(0).toUpperCase();

  return (
  <>
  <AccountShell active="hesabim">
    <div suppressHydrationWarning={true} className="flex flex-col gap-6 w-full">

        <div className={`w-full relative rounded-[2rem] p-[2px] transition-all duration-300 shadow-[0_0_50px_rgba(0,210,255,0.15)] group ${aktifPalet === 'menu' ? 'bg-gradient-to-r from-emerald-500/50 via-emerald-900 to-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10'}`}>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-20 blur-xl rounded-[2rem] transition-opacity duration-500"></div>
          <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col border border-cyan-500/20 overflow-hidden z-10">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.5)]"></div>
                <div className={`absolute inset-2.5 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,255,0.4),inset_0_0_20px_rgba(34,211,255,0.2)] border-t-cyan-300 animate-[spin_8s_linear_infinite] ${aktifPalet === 'menu' ? 'border-t-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}`}></div>

                {/* Avatar içi — fotoğraf veya harf, tıklama = palette */}
                <div
                  onClick={() => togglePalet('menu')}
                  title={aktifPalet === 'menu' ? "Düzenlemeyi Kapat" : "Menüyü Düzenle"}
                  className={`absolute inset-4 rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 z-20 ${aktifPalet === 'menu' ? 'ring-2 ring-emerald-500' : ''}`}
                >
                  {aktifPalet === 'menu' ? (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-950 rounded-full">
                      <Palette className="w-10 h-10 text-emerald-400" />
                    </div>
                  ) : aktifAvatar ? (
                    <Image src={aktifAvatar} alt="Profil" fill className="object-cover rounded-full" />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,255,0.8)]">
                      {basHarf}
                    </span>
                  )}
                </div>

                {/* Kamera butonu — sağ alt köşe, ayrı */}
                {aktifPalet !== 'menu' && (
                  <button
                    type="button"
                    onClick={() => dosyaInputRef.current?.click()}
                    title="Profil fotoğrafı değiştir"
                    className="absolute bottom-0 right-0 z-30 w-8 h-8 rounded-full bg-[#0b1121] border-2 border-cyan-500/50 flex items-center justify-center hover:bg-cyan-950 hover:border-cyan-400 transition-all shadow-lg"
                  >
                    {avatarYukleniyor
                      ? <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      : <Camera className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                )}

                {/* Gizli dosya input */}
                <input
                  ref={dosyaInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSec}
                />
              </div>
              
              {/* İsim / email — sabit küçük alan (1/3 oranında) */}
              <div className="text-center sm:text-left z-10 flex flex-col justify-center sm:w-[180px] lg:w-[220px] shrink-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1 drop-shadow-md truncate">
                  {aktifPalet === 'menu' ? "Menü Düzenleme" : (userName || "Hoş geldiniz")}
                </h1>
                <p className={`text-xs sm:text-sm font-medium tracking-wide truncate ${aktifPalet === 'menu' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {aktifPalet === 'menu' ? "Bir menü kutusuna tıklayın ve rengini belirleyin." : userEmail}
                </p>
              </div>

              {/* Banner alanı — 2/3 genişlik, flex-1 */}
              {aktifPalet !== 'menu' && (
                <div
                  className="hidden sm:block relative flex-1 rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ height: "110px" }}
                  onClick={() => bannerInputRef.current?.click()}
                  title="Banner resmi ekle veya değiştir"
                >
                  {bannerUrl ? (
                    <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full relative bg-gradient-to-br from-[#0b1535] via-[#0d1b4a] to-[#06091c]">
                      <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.35) 0%, transparent 60%)"
                      }} />
                      <div className="absolute inset-0 opacity-[0.05]" style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                        backgroundSize: "24px 24px"
                      }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/25">
                        <ImagePlus className="w-6 h-6" />
                        <span className="text-[10px] font-medium tracking-wide">Resim ekle</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                    {bannerYukleniyor
                      ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                      : <><Camera className="w-5 h-5 text-white" /><span className="text-white text-[11px] font-medium">Değiştir</span></>
                    }
                  </div>
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerSec} />
                </div>
              )}
            </div>

            {aktifPalet === 'menu' && (
              <RenkPaleti disabledCondition={false} text="🎨 Bildirim noktalarının rengini seçin" onSelect={renkUygula} />
            )}
          </div>
        </div>

        {status !== "unauthenticated" && aktifPalet !== "menu" && (
          <Link
            href="/guvenlik"
            className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 shadow-xl transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">Güvenlik Merkezi</p>
                <p className="text-xs text-slate-500 truncate">
                  {guvenlikOzeti
                    ? `${guvenlikOzeti.ikiAdim ? "2FA aktif" : "2FA kapalı"} • ${guvenlikOzeti.cihazSayisi} aktif cihaz`
                    : "Yükleniyor..."}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest shrink-0 group-hover:text-cyan-300">
              Yönet →
            </span>
          </Link>
        )}

        <div className="w-full block">
          <div className={`grid grid-cols-5 gap-1.5 sm:gap-3 lg:gap-4 w-full transition-all duration-300 ${aktifPalet === 'menu' ? 'bg-[#0f172a]/50 p-2 sm:p-4 rounded-3xl border-2 border-dashed border-emerald-500/50' : ''}`}>
            {altMenuListesi.map((item: any, index: number) => {
              const IkonBileseni = item.ikon;
              const isSecili = seciliKutuId === item.id;
              
              const kargoVarmi = item.id === "kargolar" && kargoSiparisleri.length > 0;
              const mesajVarmi = item.id === "destek" && yeniMesajVar;

              const KutuIcerigi = (
                <div
                  draggable={aktifPalet === 'menu'}
                  onDragStart={() => (suruklenenAltRef.current = index)}
                  onDragEnter={() => handleDragEnterAlt(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={() => {
                     suruklenenAltRef.current = null;
                     if(aktifPalet === 'menu') veritabaninaKaydet(ustMenuListesi, altMenuListesi, siparisRenkleri, pastaRenkleri, cubukRenk);
                  }}
                  onClick={() => {
                    if (aktifPalet === 'menu') {
                      setResimYuklenecekKutu(item.id);
                      kutuInputRef.current?.click();
                    } else if (item.isKargo) {
                      handleKargoClick();
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 lg:gap-2.5 group w-full select-none ${isSecili ? "relative z-[9999]" : "relative z-10"}`}
                >
                  {/* Resim alanı */}
                  <div className={`relative w-full aspect-square max-w-[64px] lg:max-w-none lg:h-24 rounded-2xl overflow-hidden transition-all duration-300 ${
                      aktifPalet === 'menu'
                      ? "ring-2 ring-dashed ring-emerald-500/60 cursor-pointer hover:ring-emerald-400"
                      : "cursor-pointer group-hover:scale-[1.04]"
                  }`}>
                    {kutuResimleri[item.id] ? (
                      <Image src={kutuResimleri[item.id]} alt={item.isim} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f172a] border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                        <IkonBileseni className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${item.renk} opacity-60`} />
                        {aktifPalet === 'menu' && (
                          <Camera className="w-3 h-3 text-emerald-400 mt-1 opacity-80" />
                        )}
                      </div>
                    )}

                    {/* Düzenleme modunda: resim seç overlay */}
                    {aktifPalet === 'menu' && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4 text-white" />
                        <span className="text-[8px] text-white font-medium">Resim Ekle</span>
                      </div>
                    )}

                    {/* Bildirim noktası */}
                    {(kargoVarmi || mesajVarmi) && aktifPalet !== 'menu' && (
                      <span className="absolute top-1 right-1 flex h-2.5 w-2.5 z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: pingRenk }}></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 border border-[#0f172a]" style={{ backgroundColor: pingRenk }}></span>
                      </span>
                    )}
                  </div>
                  
                  <span className={`text-[9px] sm:text-[10px] lg:text-xs font-bold tracking-wide text-center truncate w-full px-0.5 transition-colors ${aktifPalet === 'menu' ? "text-emerald-400" : "text-slate-300 group-hover:text-cyan-400"}`}>
                    {item.isim}
                  </span>
                </div>
              );

              if (item.isLink && aktifPalet !== 'menu') {
                return <Link key={item.id} href={item.href || "#"} onClick={kilitliIslem} prefetch={true} className="w-full">{KutuIcerigi}</Link>;
              }
              return <React.Fragment key={item.id}>{KutuIcerigi}</React.Fragment>;
            })}
          </div>
          {/* Gizli kutu resim input */}
          <input ref={kutuInputRef} type="file" accept="image/*" className="hidden" onChange={handleKutuResimSec} />
        </div>


        <HesabimAnalytics
          aktifPalet={aktifPalet}
          togglePalet={togglePalet}
          sonSiparislerListesi={sonSiparislerListesi}
          seciliSiparisDurumu={seciliSiparisDurumu}
          setSeciliSiparisDurumu={setSeciliSiparisDurumu}
          getSiparisRenk={getSiparisRenk}
          kilitliIslem={kilitliIslem}
          pastaVerisi={pastaVerisi}
          pastaRenkleri={pastaRenkleri}
          seciliPastaDilimi={seciliPastaDilimi}
          setSeciliPastaDilimi={setSeciliPastaDilimi}
          aylikPastaVerisi={aylikPastaVerisi}
          seciliYil={seciliYil}
          setSeciliYil={setSeciliYil}
          suAnkiTarih={suAnkiTarih}
          grafikVerisi={grafikVerisi}
          tiklananAy={tiklananAy}
          setTiklananAy={setTiklananAy}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          cubukRenk={cubukRenk}
          renkUygula={renkUygula}
        />

    </div>
  </AccountShell>

      <HesabimModals
        showOnboarding={showOnboarding}
        portalHazir={portalHazir}
        closeOnboarding={closeOnboarding}
        dontShowAgain={dontShowAgain}
        setDontShowAgain={setDontShowAgain}
        isKargoModalOpen={isKargoModalOpen}
        setIsKargoModalOpen={setIsKargoModalOpen}
        kargoSiparisleri={kargoSiparisleri}
        kopyalananKod={kopyalananKod}
        handleTakipEt={handleTakipEt}
        girisSartModal={girisSartModal}
        setGirisSartModal={setGirisSartModal}
      />
  </>
  );
}
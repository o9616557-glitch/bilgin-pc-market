"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useOrders } from "@/app/OrderContext";
import Image from "next/image";
import { Camera, Loader2, ImagePlus } from "lucide-react";

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

  const dosyaInputRef = useRef<HTMLInputElement>(null);
  const [avatarOnizleme, setAvatarOnizleme] = useState<string | null>(null);
  const [avatarYukleniyor, setAvatarYukleniyor] = useState(false);

  const BANNER_KEY = "bilgin_profil_banner_v1";
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(BANNER_KEY) || null;
  });
  const [bannerYukleniyor, setBannerYukleniyor] = useState(false);

  const profilVarlikYuklendi = useRef(false);
  useEffect(() => {
    if (status !== "authenticated" || profilVarlikYuklendi.current) return;
    profilVarlikYuklendi.current = true;
    fetch("/api/user/profile-assets")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.profileBanner) return;
        setBannerUrl(data.profileBanner);
        localStorage.setItem(BANNER_KEY, data.profileBanner);
      })
      .catch(() => {});
  }, [status]);

  const handleBannerSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    setBannerYukleniyor(true);
    const imgEl = document.createElement("img");
    const blobUrl = URL.createObjectURL(dosya);
    imgEl.onload = () => {
      const W = 800;
      const H = 240;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      const ratio = Math.max(W / imgEl.width, H / imgEl.height);
      const w = imgEl.width * ratio;
      const h = imgEl.height * ratio;
      ctx.drawImage(imgEl, (W - w) / 2, (H - h) / 2, w, h);
      const b64 = canvas.toDataURL("image/jpeg", 0.8);
      localStorage.setItem(BANNER_KEY, b64);
      setBannerUrl(b64);
      URL.revokeObjectURL(blobUrl);
      setBannerYukleniyor(false);
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
      const img = document.createElement("img");
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d")!;
        const oran = Math.max(256 / img.width, 256 / img.height);
        const w = img.width * oran;
        const h = img.height * oran;
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

  const [hamSiparisler, setHamSiparisler] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}").tumSiparisler || [];
    } catch {
      return [];
    }
  });

  const [sonSiparislerListesi, setSonSiparislerListesi] = useState<any[]>([]);
  const [grafikVerisi, setGrafikVerisi] = useState<any[]>([]);
  const [girisSartModal, setGirisSartModal] = useState(false);

  const [pastaVerisi, setPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, offset: 0 },
    bilesen: { yuzde: 0, offset: 0 },
    cevre: { yuzde: 0, offset: 0 },
    sistem: { yuzde: 0, offset: 0 },
    aksesuar: { yuzde: 0, offset: 0 },
    maxYuzde: 0,
  });

  const [aylikPastaVerisi, setAylikPastaVerisi] = useState({
    kendinTopla: { yuzde: 0, offset: 0 },
    bilesen: { yuzde: 0, offset: 0 },
    cevre: { yuzde: 0, offset: 0 },
    sistem: { yuzde: 0, offset: 0 },
    aksesuar: { yuzde: 0, offset: 0 },
    maxYuzde: 0,
    ayAdi: "",
  });

  const [seciliYil, setSeciliYil] = useState<number>(yil);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tiklananAy, setTiklananAy] = useState<number | null>(suAnkiTarih.getMonth());

  const getSiparisRenk = (durum: string) => {
    const d = durum.toLowerCase();
    if (d.includes("kargo")) return { badge: "bg-rose-500/10 text-rose-500 border-rose-500/20" };
    if (d.includes("teslim") || d.includes("tamam") || d.includes("öden"))
      return { badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
    return { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
  };

  const kilitliIslem = (e: React.MouseEvent) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      setGirisSartModal(true);
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const hafizadanOku = () => {
      try {
        const hafiza = sessionStorage.getItem("bilgin_hesabim_data");
        if (hafiza) {
          const parsed = JSON.parse(hafiza);
          if (parsed.tumSiparisler?.length) setHamSiparisler(parsed.tumSiparisler);
        }
      } catch {}
    };

    hafizadanOku();
    window.addEventListener("bilgin-hesap-guncellendi", hafizadanOku);
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
    if (status === "unauthenticated") setHamSiparisler([]);
  }, [status]);

  useEffect(() => {
    if (!hamSiparisler) return;
    const sirali = [...hamSiparisler].sort(
      (a: any, b: any) => new Date(b.createdAt || b.tarih).getTime() - new Date(a.createdAt || a.tarih).getTime()
    );
    setSonSiparislerListesi(sirali.slice(0, 7));

    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const aylarUzun = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const aylikToplamlar = new Array(12).fill(0);

    let cK_toplam = 0;
    let cB_toplam = 0;
    let cC_toplam = 0;
    let cS_toplam = 0;
    let cA_toplam = 0;
    let m_cK = 0;
    let m_cB = 0;
    let m_cC = 0;
    let m_cS = 0;
    let m_cA = 0;
    const aktifAy = tiklananAy !== null ? tiklananAy : suAnkiTarih.getMonth();

    hamSiparisler.forEach((siparis: any) => {
      const durum = (siparis.status || siparis.durum || "").toLowerCase();
      const iptalMi = durum.includes("iptal") || durum.includes("iade") || durum.includes("red");
      const tamamlandiMi =
        durum.includes("tamam") || durum.includes("teslim") || durum.includes("kargo") || durum.includes("aktif");
      if (iptalMi || !tamamlandiMi) return;

      const d = new Date(siparis.createdAt || siparis.tarih);
      if (isNaN(d.getTime())) return;

      const siparisTutar = Number(siparis.totalPrice || siparis.toplamTutar) || 0;
      const siparisAyi = d.getMonth();
      const siparisYili = d.getFullYear();
      if (siparisYili === seciliYil) aylikToplamlar[siparisAyi] += siparisTutar;

      const urunler = siparis.items || siparis.sepet || [];
      urunler.forEach((item: any) => {
        const kimlik = `${item.kategoriSlug || ""} ${item.kategori || ""} ${item.slug || ""} ${item.isim || ""} ${item.title || ""}`.toLocaleLowerCase("tr-TR");
        const urunTutar = (Number(item.fiyat || item.price) * (item.adet || item.quantity)) || 0;

        let kategoriTipi = "aksesuar";
        if (kimlik.includes("kendin") || kimlik.includes("topla") || kimlik.includes("sihirbaz")) kategoriTipi = "kendin";
        else if (["oyun-bilgisayari", "laptop", "notebook", "masaüstü", "masaustu", "oem-paket", "isletim", "yazılım", "yazilim"].some((k) => kimlik.includes(k)))
          kategoriTipi = "sistem";
        else if (["anakart", "ekran-kart", "ekran kart", "islemci", "işlemci", "ram", "ssd", "hdd", "kasa", "psu", "sogutma", "soğutma"].some((k) => kimlik.includes(k)))
          kategoriTipi = "bilesen";
        else if (["monitör", "monitor", "klavye", "mouse", "kulaklık", "kulaklik", "mikrofon", "oyun-kolu", "direksiyon", "hoparlör", "hoparlor"].some((k) => kimlik.includes(k)))
          kategoriTipi = "cevre";

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
    setGrafikVerisi(
      aylikToplamlar.map((tutar, index) => ({
        etiket: aylar[index],
        yuzde: maxTutar > 0 && tutar > 0 ? Math.max((tutar / maxTutar) * 100, 5) : 2,
        tutar,
      }))
    );

    const genelToplam = cK_toplam + cB_toplam + cC_toplam + cS_toplam + cA_toplam;
    if (genelToplam > 0) {
      const p1 = (cK_toplam / genelToplam) * 100;
      const p2 = (cB_toplam / genelToplam) * 100;
      const p3 = (cC_toplam / genelToplam) * 100;
      const p4 = (cS_toplam / genelToplam) * 100;
      const p5 = (cA_toplam / genelToplam) * 100;
      setPastaVerisi({
        kendinTopla: { yuzde: Math.round(p1), offset: 0 },
        bilesen: { yuzde: Math.round(p2), offset: p1 },
        cevre: { yuzde: Math.round(p3), offset: p1 + p2 },
        sistem: { yuzde: Math.round(p4), offset: p1 + p2 + p3 },
        aksesuar: { yuzde: Math.round(p5), offset: p1 + p2 + p3 + p4 },
        maxYuzde: Math.round(Math.max(p1, p2, p3, p4, p5)),
      });
    } else {
      setPastaVerisi({
        kendinTopla: { yuzde: 0, offset: 0 },
        bilesen: { yuzde: 0, offset: 0 },
        cevre: { yuzde: 0, offset: 0 },
        sistem: { yuzde: 0, offset: 0 },
        aksesuar: { yuzde: 0, offset: 0 },
        maxYuzde: 0,
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
        ayAdi: aylarUzun[aktifAy],
      });
    } else {
      setAylikPastaVerisi({
        kendinTopla: { yuzde: 0, offset: 0 },
        bilesen: { yuzde: 0, offset: 0 },
        cevre: { yuzde: 0, offset: 0 },
        sistem: { yuzde: 0, offset: 0 },
        aksesuar: { yuzde: 0, offset: 0 },
        maxYuzde: 0,
        ayAdi: aylarUzun[aktifAy],
      });
    }
  }, [hamSiparisler, seciliYil, tiklananAy, suAnkiTarih]);

  const userName = status === "unauthenticated" ? "Misafir" : session?.user?.name || "Kullanıcı";
  const userEmail = status === "unauthenticated" ? "" : session?.user?.email || "";
  const basHarf = userName.charAt(0).toUpperCase();

  return (
    <>
      <div suppressHydrationWarning className="flex flex-col gap-6 w-full">
        <div className="w-full relative rounded-[2rem] p-[2px] bg-gradient-to-r from-cyan-500/30 via-[#0f172a] to-cyan-500/10 shadow-[0_0_50px_rgba(0,210,255,0.15)]">
          <div className="relative bg-[#0b1121] rounded-[2rem] p-6 sm:p-8 flex flex-col border border-cyan-500/20 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border-[3px] border-slate-700" />
                <div className="absolute inset-2.5 rounded-full border border-cyan-400/30 border-t-cyan-300 animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
                  {aktifAvatar ? (
                    <img src={aktifAvatar} alt="Profil" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-500">
                      {basHarf}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dosyaInputRef.current?.click()}
                  title="Profil fotoğrafı değiştir"
                  className="absolute bottom-0 right-0 z-30 w-8 h-8 rounded-full bg-[#0b1121] border-2 border-cyan-500/50 flex items-center justify-center hover:bg-cyan-950 hover:border-cyan-400 transition-all shadow-lg"
                >
                  {avatarYukleniyor ? (
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </button>
                <input ref={dosyaInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSec} />
              </div>

              <div className="text-center sm:text-left z-10 flex flex-col justify-center sm:w-[180px] lg:w-[220px] shrink-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
                  {userName}
                </h1>
                {userEmail && <p className="text-xs sm:text-sm text-slate-400 truncate mt-1">{userEmail}</p>}
              </div>

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
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/25">
                      <ImagePlus className="w-6 h-6" />
                      <span className="text-[10px] font-medium">Resim ekle</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                  {bannerYukleniyor ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-5 h-5 text-white" />
                      <span className="text-white text-[11px] font-medium">Değiştir</span>
                    </>
                  )}
                </div>
                <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerSec} />
              </div>
            </div>
          </div>
        </div>

        <HesabimAnalytics
          sonSiparislerListesi={sonSiparislerListesi}
          getSiparisRenk={getSiparisRenk}
          kilitliIslem={kilitliIslem}
          pastaVerisi={pastaVerisi}
          aylikPastaVerisi={aylikPastaVerisi}
          seciliYil={seciliYil}
          setSeciliYil={setSeciliYil}
          suAnkiTarih={suAnkiTarih}
          grafikVerisi={grafikVerisi}
          tiklananAy={tiklananAy}
          setTiklananAy={setTiklananAy}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      </div>

      <HesabimModals girisSartModal={girisSartModal} setGirisSartModal={setGirisSartModal} />
    </>
  );
}

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Package, ShoppingCart, LogOut, Trash2, 
  CheckCircle2, XCircle, MessageSquare, Save, Crown, 
  Star, HelpCircle, ShieldAlert, Clock, User, Headset, Send,
  LayoutDashboard, Megaphone, Bell, AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import { adminMi } from "@/lib/admin";
import { ORDER_STATUS_OPTIONS } from "@/lib/order-utils";
import type { OrderItemLike, OrderLike } from "@/lib/order-types";
import type { RefundItemLike, ReviewLike, SupportMessageLike, SupportRequestLike } from "@/lib/admin-types";

export default function AdminPaneli() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (!session || !(adminMi(session?.user?.email) || (session.user as { isAdmin?: boolean }).isAdmin)) {
        router.push("/"); 
      }
    }
  }, [session, status, router]);

  const [sifre, setSifre] = useState("");
  // 🚀 Şifre ekranı atlandı
  const [girisYapildi, setGirisYapildi] = useState(true);
  const [aktifSekme, setAktifSekme] = useState<"ozet" | "siparisler" | "yorumlar" | "talepler">("ozet");
  const [yukleniyor, setYukleniyor] = useState(true);

  // SİPARİŞ & GÜNCELLEME STATE'LERİ
  const [siparisler, setSiparisler] = useState<OrderLike[]>([]);
  const [silinecekSiparisID, setSilinecekSiparisID] = useState<string | null>(null);
  const [guncellenenID, setGuncellenenID] = useState<string | null>(null); 
  const [siparisOdemeFiltresi, setSiparisOdemeFiltresi] = useState<
    "tumu" | "odeme_bekliyor" | "havale_bekliyor" | "odendi" | "onaylandi" | "zaman_asimi" | "iptal"
  >("tumu");

  // DESTEK TALEPLERİ STATE'LERİ 🚀
  const [talepler, setTalepler] = useState<SupportRequestLike[]>([]);
  const [talepCevaplari, setTalepCevaplari] = useState<{ [key: string]: string }>({});
  const [iadeTutarlari, setIadeTutarlari] = useState<{ [key: string]: string }>({});
  const [iadeKalemSecimleri, setIadeKalemSecimleri] = useState<Record<string, Record<string, number>>>({});
  const [silinecekTalepID, setSilinecekTalepID] = useState<string | null>(null);

  // DUYURU STATE
  const [duyuruMetin, setDuyuruMetin] = useState("");
  const [duyuruAktif, setDuyuruAktif] = useState(false);
  const [duyuruTip, setDuyuruTip] = useState<"bilgi" | "uyari" | "kampanya">("bilgi");
  const [duyuruKaydediliyor, setDuyuruKaydediliyor] = useState(false);

  const [yorumlar, setYorumlar] = useState<ReviewLike[]>([]);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [silinecekYorumID, setSilinecekYorumID] = useState<string | null>(null);

  const PATRON_SIFRESI = "Bilgin123";

  const odemeDurumuRozeti = (odemeDurumu?: string) => {
    switch (odemeDurumu) {
      case "odeme_bekliyor":
        return "bg-amber-950/40 text-amber-300 border border-amber-800/50";
      case "havale_bekliyor":
        return "bg-blue-950/40 text-blue-300 border border-blue-800/50";
      case "odendi":
        return "bg-emerald-950/40 text-emerald-300 border border-emerald-800/50";
      case "onaylandi":
        return "bg-cyan-950/40 text-cyan-300 border border-cyan-800/50";
      case "zaman_asimi":
        return "bg-orange-950/40 text-orange-300 border border-orange-800/50";
      case "iptal":
        return "bg-rose-950/40 text-rose-300 border border-rose-800/50";
      default:
        return "bg-slate-800 text-slate-300 border border-slate-700";
    }
  };

  const odemeDurumuEtiketi = (odemeDurumu?: string) => {
    switch (odemeDurumu) {
      case "odeme_bekliyor":
        return "Kart Bekleniyor";
      case "havale_bekliyor":
        return "Havale Bekleniyor";
      case "odendi":
        return "Ödendi";
      case "onaylandi":
        return "Onaylandı";
      case "zaman_asimi":
        return "Zaman Aşımı";
      case "iptal":
        return "İptal";
      default:
        return "Durum Yok";
    }
  };
// 🚀 BİNGO: GECİKMELİ KESİN KAYDIRMA MOTORU (ADMİN İÇİN)
  useEffect(() => {
    // Sekme değiştiğinde veya yeni mesaj geldiğinde çalışır
    setTimeout(() => {
      // Hem admin-sohbet-kutusu hem de kaydırma çubuğu olan tüm kutuları zorla dibe iter
    // Sadece mesaj geçmişinin olduğu özel kutuyu hedefler, tüm sayfayı bozmaz
const kutular = document.querySelectorAll('.mesaj-gecmisi-kutusu');
      kutular.forEach((kutu) => {
        kutu.scrollTop = kutu.scrollHeight;
      });
    }, 250); // UI'ın (arayüzün) tam açılmasını bekler
  }, [talepler, aktifSekme]);
  // 🚀 YENİ ANA MOTOR: Sayfa açıldığı an sorgusuz sualsiz tüm verileri çeker
  useEffect(() => {
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    setYukleniyor(true);
    // Varsa fonksiyonları çalıştır (hata vermemesi için typeof ile kontrol edildi)
    if (typeof siparisleriGetir === "function") await siparisleriGetir();
    if (typeof yorumlariGetir === "function") await yorumlariGetir();
    if (typeof talepleriGetir === "function") await talepleriGetir();
    if (typeof duyuruGetir === "function") await duyuruGetir();
    setYukleniyor(false);
  };

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault();
    if (sifre === PATRON_SIFRESI) {
      sessionStorage.setItem("patronGiris", "basarili"); 
      setGirisYapildi(true);
      verileriYukle();
      toast.success("Yönetim Katına Giriş Yapıldı.");
    } else {
      toast.error("Hatalı Şifre!");
    }
  };

  const cikisYap = () => { sessionStorage.removeItem("patronGiris"); setGirisYapildi(false); };
  // --- SİPARİŞ İŞLEMLERİ ---
  const siparisGuncelle = async (siparisId: string) => {
    try {
      const durum = (document.getElementById(`durum-${siparisId}`) as HTMLSelectElement).value;
      const mesaj = (document.getElementById(`mesaj-${siparisId}`) as HTMLInputElement).value;
      const firma = (document.getElementById(`firma-${siparisId}`) as HTMLInputElement)?.value || "";
      const takip = (document.getElementById(`takip-${siparisId}`) as HTMLInputElement)?.value || "";

      const payload = { id: siparisId, yeniDurum: durum, musteriMesaji: mesaj, kargoFirmasi: firma, takipNo: takip };
      const res = await fetch("/api/admin/siparisler", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify(payload) });

      if ((await res.json()).success) {
        setSiparisler(siparisler.map(s => s._id === siparisId ? { ...s, durum, musteriMesaji: mesaj, kargoFirmasi: firma, takipNo: takip } : s));
        setGuncellenenID(siparisId);
        setTimeout(() => setGuncellenenID(null), 2000); 
      } else { toast.error("Güncelleme başarısız!"); }
    } catch (e) { toast.error("Sistem hatası!"); }
  };
  const siparisleriGetir = async () => { try { const res = await fetch(`/api/admin/siparisler?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }}); const data = await res.json(); if (data.success) setSiparisler(data.siparisler); } catch (e) {} };
  const siparisSilmeIslemi = async () => { if (!silinecekSiparisID) return; try { const res = await fetch(`/api/admin/siparisler?id=${silinecekSiparisID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }}); if ((await res.json()).success) { setSiparisler(siparisler.filter(s => s._id !== silinecekSiparisID)); setSilinecekSiparisID(null); toast.success("Sipariş silindi."); } } catch (e) { toast.error("Silinemedi."); } };

// 🚀 --- DESTEK TALEPLERİ İŞLEMLERİ (YENİ EKLENDİ) --- 🚀
  const talepleriGetir = async () => {
    try {
      const res = await fetch(`/api/admin/destek?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      const data = await res.json();
      if (data.success) {
        setTalepler(data.talepler);
        setIadeTutarlari((prev) => {
          const merged = { ...prev };
          for (const t of data.talepler || []) {
            if (
              (t.konu === "iade" || t.konu === "iptal") &&
              !t.iadeOdendi &&
              (t.onerilenIadeTutar > 0 || t.kalanIadeEdilebilir > 0 || t.siparisTutari > 0) &&
              (!merged[t._id] || merged[t._id] === "")
            ) {
              const tutar = t.onerilenIadeTutar || t.kalanIadeEdilebilir || t.siparisTutari;
              merged[t._id] = String(tutar);
            }
          }
          return merged;
        });
        setIadeKalemSecimleri((prev) => {
          const merged = { ...prev };
          for (const t of data.talepler || []) {
            if ((t.konu === "iade" || t.konu === "iptal") && t.iadeKalemleri?.length && !merged[t._id]) {
              const secim: Record<string, number> = {};
              for (const k of t.iadeKalemleri) secim[k.urunId] = k.adet;
              merged[t._id] = secim;
            }
          }
          return merged;
        });
      }
    } catch (e) {}
  };

  // 🚀 BİNGO: ADMİN RADARI (Sayfayı yenilemeden 5 saniyede bir yeni mesajları çeker)
  useEffect(() => {
    talepleriGetir(); // Sayfa ilk açıldığında 1 kere hemen çeker
    
    // 5000 milisaniye (5 saniye) aralıklarla arkadan sessizce günceller
    const radar = setInterval(() => {
      talepleriGetir();
    }, 5000); 

    // Sen başka sayfaya geçersen motoru durdurur (sistemi yormaz)
    return () => clearInterval(radar); 
  }, []); // <-- Buradaki boş köşeli parantez çok önemli, sadece sayfa açılınca motoru 1 kez kurar.

  const talepCevapGonder = async (id: string) => {
    const metin = talepCevaplari[id];
    if (!metin?.trim()) return toast.error("Cevap boş olamaz şefim!");
    
    const toastId = toast.loading("Cevap iletiliyor...");
    try {
      const res = await fetch("/api/admin/destek", { 
        method: "PUT", 
        headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, 
        body: JSON.stringify({ id, action: "reply", mesaj: metin }) 
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Cevap müşteriye iletildi! 🚀", { id: toastId });
        setTalepCevaplari(prev => ({...prev, [id]: ""}));
        talepleriGetir();
      } else { 
        // Eğer veritabanı reddederse tam olarak neden reddettiğini kırmızı ekranda yazacak!
        toast.error("Hata: " + (data.message || "Bilinmeyen bir sorun oluştu."), { id: toastId }); 
      }
    } catch (e: unknown) { 
      const mesaj = e instanceof Error ? e.message : "Bilinmeyen bağlantı hatası";
      toast.error("Bağlantı Hatası: " + mesaj, { id: toastId }); 
    }
  };

  const talepDurumGuncelle = async (id: string, yeniDurum: string) => {
    try {
      const res = await fetch("/api/admin/destek", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, action: "status", durum: yeniDurum }) });
      if ((await res.json()).success) {
        toast.success("Talep durumu güncellendi.");
        talepleriGetir(); // Durum değişince ekranı hemen yeniler
      }
    } catch (e) { toast.error("Güncellenemedi."); }
  };

  const kalanTumunuAl = (talep: SupportRequestLike) => {
    const kalan = talep.kalanIadeEdilebilir ?? talep.siparisTutari ?? 0;
    setIadeTutarlari((prev) => ({ ...prev, [talep._id]: String(kalan) }));
    if (talep.siparisKalemleri?.length) {
      const secim: Record<string, number> = {};
      for (const k of talep.siparisKalemleri) {
        if (k.iadeEdilebilirAdet > 0) secim[k.urunId] = k.iadeEdilebilirAdet;
      }
      setIadeKalemSecimleri((prev) => ({ ...prev, [talep._id]: secim }));
    }
  };

  const iadeKalemAdetGuncelle = (talepId: string, urunId: string, adet: number, max: number, kalemler: RefundItemLike[]) => {
    const yeni = Math.max(0, Math.min(max, adet));
    setIadeKalemSecimleri((prev) => {
      const talepSecim = { ...(prev[talepId] || {}) };
      if (yeni <= 0) delete talepSecim[urunId];
      else talepSecim[urunId] = yeni;
      return { ...prev, [talepId]: talepSecim };
    });
    const secim = { ...(iadeKalemSecimleri[talepId] || {}) };
    if (yeni <= 0) delete secim[urunId];
    else secim[urunId] = yeni;
    const tutar = kalemler.reduce((s, k) => s + k.birimFiyat * (secim[k.urunId] || 0), 0);
    if (tutar > 0) {
      setIadeTutarlari((prev) => ({ ...prev, [talepId]: String(Math.round(tutar * 100) / 100) }));
    }
  };

  const iadeTamamla = async (id: string, yontem: "kart" | "magaza_kredisi") => {
    const tutar = iadeTutarlari[id];
    if (!tutar || Number(tutar) <= 0) return toast.error("İade tutarını girin şefim!");
    const talep = talepler.find((t) => t._id === id);
    const secim = iadeKalemSecimleri[id] || {};
    const kalemlerKaynak = talep?.siparisKalemleri || [];
    const iadeKalemleri = Object.entries(secim)
      .filter(([, adet]) => adet > 0)
      .map(([urunId, adet]) => {
        const k = kalemlerKaynak.find((x: RefundItemLike) => x.urunId === urunId) || talep?.iadeKalemleri?.find((x: RefundItemLike) => x.urunId === urunId);
        return { urunId, adet, isim: k?.isim, birimFiyat: k?.birimFiyat };
      });
    const toastId = toast.loading(yontem === "magaza_kredisi" ? "Mağaza kredisi yükleniyor..." : "Kart iadesi işleniyor...");
    try {
      const res = await fetch("/api/admin/destek", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI },
        body: JSON.stringify({
          id,
          action: "iade_tamamla",
          tutar: Number(tutar),
          yontem,
          ...(iadeKalemleri.length ? { iadeKalemleri } : {}),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(yontem === "magaza_kredisi" ? "Kredi cüzdana yüklendi!" : "Kart iadesi müşteriye bildirildi.", { id: toastId });
        setIadeTutarlari((prev) => ({ ...prev, [id]: "" }));
        talepleriGetir();
      } else {
        toast.error(data.message || "İşlem başarısız.", { id: toastId });
      }
    } catch {
      toast.error("Bağlantı hatası.", { id: toastId });
    }
  };

  const talepSilmeIslemi = async () => {
    if (!silinecekTalepID) return;
    try {
      const res = await fetch(`/api/admin/destek?id=${silinecekTalepID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }});
      if ((await res.json()).success) {
        setTalepler(talepler.filter(t => t._id !== silinecekTalepID));
        setSilinecekTalepID(null);
        talepleriGetir(); // 🚀 BİNGO: Silme işleminden sonra veritabanını anında sorgular, radarı beklemez!
        toast.success("Talep silindi.");
      }
    } catch (e) { toast.error("Silinemedi."); }
  };
  // Ürün ve Yorum Fonksiyonları
  const duyuruGetir = async () => {
    try {
      const res = await fetch(`/api/admin/duyuru?v=${Date.now()}`, { headers: { "x-patron-anahtar": PATRON_SIFRESI } });
      const data = await res.json();
      if (data.success) {
        setDuyuruMetin(data.duyuru?.metin || "");
        setDuyuruAktif(Boolean(data.duyuru?.aktif));
        setDuyuruTip(data.duyuru?.tip || "bilgi");
      }
    } catch {}
  };

  const duyuruKaydet = async () => {
    setDuyuruKaydediliyor(true);
    try {
      const res = await fetch("/api/admin/duyuru", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI },
        body: JSON.stringify({ metin: duyuruMetin, aktif: duyuruAktif, tip: duyuruTip }),
      });
      if ((await res.json()).success) {
        toast.success(duyuruAktif && duyuruMetin.trim() ? "Duyuru yayında!" : "Duyuru kaydedildi.");
      } else {
        toast.error("Kaydedilemedi.");
      }
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setDuyuruKaydediliyor(false);
    }
  };

  const yorumlariGetir = async () => { try { const res = await fetch("/api/reviews", { headers: { "x-patron-anahtar": PATRON_SIFRESI } }); const result = await res.json(); if (result.success) setYorumlar(result.data); } catch (error) {} };
  const yorumDurumGuncelle = async (id: string, currentStatus: boolean) => { try { const res = await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, onaylandi: !currentStatus }) }); if (res.ok) { toast.success(currentStatus ? "Yorum gizlendi." : "Yorum yayında."); yorumlariGetir(); } } catch (error) { toast.error("Güncellenemedi."); } };
  const yorumCevapGonder = async (id: string) => { if (!replyText.trim()) return toast.error("Cevap boş olamaz!"); try { const res = await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json", "x-patron-anahtar": PATRON_SIFRESI }, body: JSON.stringify({ id, answer: replyText, onaylandi: true }) }); if (res.ok) { setReplyId(null); setReplyText(""); toast.success("Cevap yayınlandı."); yorumlariGetir(); } } catch (error) { toast.error("Gönderilemedi."); } };
  const yorumSilmeIslemi = async () => { if (!silinecekYorumID) return; try { const res = await fetch(`/api/reviews?id=${silinecekYorumID}`, { method: "DELETE", headers: { "x-patron-anahtar": PATRON_SIFRESI }}); if (res.ok) { setSilinecekYorumID(null); toast.success("Yorum silindi."); yorumlariGetir(); } } catch (error) { toast.error("Silinemedi."); } };

  const bekleyenHavale = siparisler.filter((s) => (s.durum || "").includes("Havale")).length;
  const hazirlaniyor = siparisler.filter((s) => (s.durum || "").includes("Hazırlanıyor")).length;
  const acikTalepler = talepler.filter((t) => t.durum !== "Çözüldü").length;
  const bekleyenYorumlar = yorumlar.filter((y) => !y.onaylandi).length;
  const bekleyenIade = talepler.filter((t) => (t.konu === "iade" || t.konu === "iptal") && !t.iadeOdendi).length;
  const hizliSiparisSayaclari = useMemo(() => {
    const odemeDurumSayilari = siparisler.reduce<Record<string, number>>((acc, siparis) => {
      const key = siparis.odemeDurumu || "tumu";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return [
      {
        value: "tumu" as const,
        label: "Tüm Siparişler",
        count: siparisler.length,
        activeClassName: "border-slate-500 bg-slate-800/80 text-slate-100",
        idleClassName: "border-slate-800 bg-[#111827] text-slate-300 hover:border-slate-700",
      },
      {
        value: "odeme_bekliyor" as const,
        label: "Kart Bekleyen",
        count: odemeDurumSayilari.odeme_bekliyor || 0,
        activeClassName: "border-amber-500/50 bg-amber-950/40 text-amber-100",
        idleClassName: "border-slate-800 bg-[#111827] text-slate-300 hover:border-amber-800/50",
      },
      {
        value: "havale_bekliyor" as const,
        label: "Havale Bekleyen",
        count: odemeDurumSayilari.havale_bekliyor || 0,
        activeClassName: "border-blue-500/50 bg-blue-950/40 text-blue-100",
        idleClassName: "border-slate-800 bg-[#111827] text-slate-300 hover:border-blue-800/50",
      },
      {
        value: "zaman_asimi" as const,
        label: "Zaman Aşımı",
        count: odemeDurumSayilari.zaman_asimi || 0,
        activeClassName: "border-orange-500/50 bg-orange-950/40 text-orange-100",
        idleClassName: "border-slate-800 bg-[#111827] text-slate-300 hover:border-orange-800/50",
      },
      {
        value: "odendi" as const,
        label: "Ödendi",
        count: odemeDurumSayilari.odendi || 0,
        activeClassName: "border-emerald-500/50 bg-emerald-950/40 text-emerald-100",
        idleClassName: "border-slate-800 bg-[#111827] text-slate-300 hover:border-emerald-800/50",
      },
      {
        value: "onaylandi" as const,
        label: "Onaylandı",
        count: odemeDurumSayilari.onaylandi || 0,
        activeClassName: "border-cyan-500/50 bg-cyan-950/40 text-cyan-100",
        idleClassName: "border-slate-800 bg-[#111827] text-slate-300 hover:border-cyan-800/50",
      },
      {
        value: "iptal" as const,
        label: "İptal",
        count: odemeDurumSayilari.iptal || 0,
        activeClassName: "border-rose-500/50 bg-rose-950/40 text-rose-100",
        idleClassName: "border-slate-800 bg-[#111827] text-slate-300 hover:border-rose-800/50",
      },
    ];
  }, [siparisler]);
  const filtrelenmisSiparisler = siparisOdemeFiltresi === "tumu"
    ? siparisler
    : siparisler.filter((siparis) => siparis.odemeDurumu === siparisOdemeFiltresi);
// 🚀 ŞİFRESİZ GİRİŞ İÇİN BÜTÜN VERİLERİ OTOMATİK ÇEKEN MOTOR
  useEffect(() => {
    if (typeof siparisleriGetir === "function") siparisleriGetir();
    if (typeof yorumlariGetir === "function") yorumlariGetir();
    if (typeof duyuruGetir === "function") duyuruGetir();
  }, []);
  if (status === "loading" || (yukleniyor && !girisYapildi)) {
    return <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-slate-500 text-sm font-bold tracking-widest uppercase">Sistem Başlatılıyor...</div>;
  }

  if (!girisYapildi) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
        <form onSubmit={girisYap} className="bg-[#111827] border border-slate-800 rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
          <Crown className="w-8 h-8 text-slate-400 mb-4" />
          <h2 className="text-lg font-bold text-slate-200 uppercase tracking-widest mb-6">Yönetim Girişi</h2>
          <input type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder="Şifre" className="w-full bg-[#0b1120] border border-slate-700 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-300 text-center tracking-widest focus:outline-none transition-colors mb-4" required />
          <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold tracking-widest text-sm py-3 rounded-lg transition-colors">GİRİŞ YAP</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* ⬅️ SOL MENÜ */}
      <div className="w-full md:w-64 bg-[#111827] border-r border-slate-800 flex flex-col shrink-0 h-auto md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">
            <Crown className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="font-bold text-slate-200 tracking-widest text-base uppercase">Bilgin PC</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider">Operasyon Paneli</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => setAktifSekme("ozet")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "ozet" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <LayoutDashboard className="w-5 h-5" /> Özet & Duyuru
          </button>

          <button onClick={() => setAktifSekme("siparisler")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "siparisler" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <ShoppingCart className="w-5 h-5" /> Siparişler <span className="ml-auto bg-[#0b1120] px-2.5 py-1 rounded text-[10px] border border-slate-700/50"><span className="text-slate-500 mr-1">Görünür</span>{siparisler.length}</span>
          </button>
          
          <button onClick={() => setAktifSekme("talepler")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "talepler" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <Headset className="w-5 h-5" /> Destek & İade <span className="ml-auto bg-[#0b1120] px-2.5 py-1 rounded text-xs border border-slate-700/50">{acikTalepler > 0 ? <span className="text-indigo-400">{acikTalepler} Açık</span> : talepler.length}</span>
          </button>

          <button onClick={() => setAktifSekme("yorumlar")} className={`flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${aktifSekme === "yorumlar" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}>
            <MessageSquare className="w-5 h-5" /> Yorumlar <span className="ml-auto bg-[#0b1120] px-2.5 py-1 rounded text-xs border border-slate-700/50">{bekleyenYorumlar > 0 ? <span className="text-amber-500">{bekleyenYorumlar} Yeni</span> : yorumlar.length}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={cikisYap} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider text-xs transition-colors border border-slate-700/50">
            <LogOut className="w-4 h-4" /> Güvenli Çıkış
          </button>
        </div>
      </div>

      {/* ➡️ SAĞ İÇERİK ALANI */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0b1120]">
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-black text-slate-200 uppercase tracking-widest">
              {aktifSekme === "ozet" ? "Operasyon Özeti & Bilgilendirme" :
               aktifSekme === "siparisler" ? "Operasyon ve Sipariş Yönetimi" : 
               aktifSekme === "talepler" ? "Destek ve İade Yönetimi" : "Soru ve Yorumlar"}
            </h2>
          </div>

          {yukleniyor ? (
            <div className="text-center py-20 text-slate-500 text-base font-bold tracking-widest uppercase">Veriler Yükleniyor...</div>
          ) : aktifSekme === "ozet" ? (

            /* 📊 ÖZET & BİLGİLENDİRME */
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button onClick={() => setAktifSekme("siparisler")} className="bg-[#111827] border border-slate-800 rounded-xl p-5 text-left hover:border-slate-600 transition-colors">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Havale Bekleyen</div>
                  <div className={`text-3xl font-black ${bekleyenHavale > 0 ? "text-amber-400" : "text-slate-400"}`}>{bekleyenHavale}</div>
                </button>
                <button onClick={() => setAktifSekme("siparisler")} className="bg-[#111827] border border-slate-800 rounded-xl p-5 text-left hover:border-slate-600 transition-colors">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hazırlanıyor</div>
                  <div className={`text-3xl font-black ${hazirlaniyor > 0 ? "text-emerald-400" : "text-slate-400"}`}>{hazirlaniyor}</div>
                </button>
                <button onClick={() => setAktifSekme("talepler")} className="bg-[#111827] border border-slate-800 rounded-xl p-5 text-left hover:border-slate-600 transition-colors">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Açık Destek</div>
                  <div className={`text-3xl font-black ${acikTalepler > 0 ? "text-indigo-400" : "text-slate-400"}`}>{acikTalepler}</div>
                </button>
                <button onClick={() => setAktifSekme("yorumlar")} className="bg-[#111827] border border-slate-800 rounded-xl p-5 text-left hover:border-slate-600 transition-colors">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Onay Bekleyen</div>
                  <div className={`text-3xl font-black ${bekleyenYorumlar > 0 ? "text-amber-400" : "text-slate-400"}`}>{bekleyenYorumlar}</div>
                </button>
              </div>

              {(bekleyenHavale > 0 || bekleyenIade > 0 || bekleyenYorumlar > 0) && (
                <div className="bg-[#111827] border border-slate-700 rounded-xl p-6">
                  <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" /> Şimdi Bakılacaklar
                  </h3>
                  <ul className="flex flex-col gap-2 text-sm text-slate-400">
                    {bekleyenHavale > 0 && (
                      <li>
                        <button onClick={() => setAktifSekme("siparisler")} className="hover:text-amber-300 transition-colors">
                          • {bekleyenHavale} sipariş havale onayı bekliyor
                        </button>
                      </li>
                    )}
                    {bekleyenIade > 0 && (
                      <li>
                        <button onClick={() => setAktifSekme("talepler")} className="hover:text-cyan-300 transition-colors">
                          • {bekleyenIade} iade/iptal talebi işlem bekliyor
                        </button>
                      </li>
                    )}
                    {bekleyenYorumlar > 0 && (
                      <li>
                        <button onClick={() => setAktifSekme("yorumlar")} className="hover:text-amber-300 transition-colors">
                          • {bekleyenYorumlar} yorum onay bekliyor
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="bg-[#111827] border border-slate-700 rounded-xl p-6">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-400" /> Site Duyurusu (Müşteri Bilgilendirme)
                </h3>
                <p className="text-xs text-slate-500 mb-5">Aktif duyuru tüm sitede header altında banner olarak görünür.</p>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Duyuru Metni</label>
                    <textarea
                      value={duyuruMetin}
                      onChange={(e) => setDuyuruMetin(e.target.value)}
                      placeholder="Örn: Kargo yoğunluğu nedeniyle teslimatlar 1-2 gün gecikebilir."
                      className="w-full bg-[#0b1120] border border-slate-700 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-slate-500 min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Duyuru Tipi</label>
                      <select
                        value={duyuruTip}
                        onChange={(e) => setDuyuruTip(e.target.value as "bilgi" | "uyari" | "kampanya")}
                        className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none"
                      >
                        <option value="bilgi">Bilgi (mavi)</option>
                        <option value="uyari">Uyarı (sarı)</option>
                        <option value="kampanya">Kampanya (yeşil)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-3 cursor-pointer bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 w-full">
                        <input
                          type="checkbox"
                          checked={duyuruAktif}
                          onChange={(e) => setDuyuruAktif(e.target.checked)}
                          className="w-4 h-4 rounded accent-emerald-500"
                        />
                        <span className="text-sm font-bold text-slate-300">Sitede yayınla</span>
                      </label>
                    </div>
                  </div>

                  {duyuruAktif && duyuruMetin.trim() && (
                    <div className={`rounded-lg border p-3 text-sm flex items-start gap-2 ${
                      duyuruTip === "uyari" ? "bg-amber-950/30 border-amber-900/50 text-amber-200" :
                      duyuruTip === "kampanya" ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-200" :
                      "bg-blue-950/30 border-blue-900/50 text-blue-200"
                    }`}>
                      {duyuruTip === "uyari" ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <Megaphone className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span>{duyuruMetin}</span>
                    </div>
                  )}

                  <button
                    onClick={duyuruKaydet}
                    disabled={duyuruKaydediliyor}
                    className="self-start flex items-center gap-2 bg-slate-200 hover:bg-white disabled:opacity-50 text-slate-900 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors"
                  >
                    <Save className="w-4 h-4" /> {duyuruKaydediliyor ? "Kaydediliyor..." : "Duyuruyu Kaydet"}
                  </button>
                </div>
              </div>
            </div>

          ) : aktifSekme === "siparisler" ? (
            
            /* 📦 SİPARİŞLER BANT SİSTEMİ */
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {hizliSiparisSayaclari.map((sayac) => {
                  const aktif = siparisOdemeFiltresi === sayac.value;
                  return (
                    <button
                      key={sayac.value}
                      type="button"
                      onClick={() => setSiparisOdemeFiltresi(sayac.value)}
                      className={`rounded-xl border p-4 text-left transition-colors ${aktif ? sayac.activeClassName : sayac.idleClassName}`}
                    >
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        {sayac.label}
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <span className="text-3xl font-black">{sayac.count}</span>
                        {aktif && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                            Aktif
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ödeme Durumu Filtresi</div>
                  <div className="text-sm text-slate-400">
                    {siparisOdemeFiltresi === "tumu" ? (
                      <>Görünür toplam: <span className="text-slate-200 font-bold">{filtrelenmisSiparisler.length}</span> sipariş</>
                    ) : (
                      <>Filtre sonucu: <span className="text-slate-200 font-bold">{filtrelenmisSiparisler.length}</span> sipariş</>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Kullanıcı tarafından gizlenen siparişler bu sayıya dahil değildir.
                  </div>
                </div>
                <select
                  value={siparisOdemeFiltresi}
                  onChange={(e) => setSiparisOdemeFiltresi(e.target.value as typeof siparisOdemeFiltresi)}
                  className="bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-200 focus:outline-none focus:border-slate-500"
                >
                  <option value="tumu">Tüm Siparişler</option>
                  <option value="odeme_bekliyor">Kart Bekleniyor</option>
                  <option value="havale_bekliyor">Havale Bekleniyor</option>
                  <option value="odendi">Ödendi</option>
                  <option value="onaylandi">Onaylandı</option>
                  <option value="zaman_asimi">Zaman Aşımı</option>
                  <option value="iptal">İptal</option>
                </select>
              </div>

              {filtrelenmisSiparisler.length === 0 ? (
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-10 text-center text-slate-500 font-bold uppercase tracking-widest">
                  Seçili ödeme durumunda sipariş bulunmuyor.
                </div>
              ) : filtrelenmisSiparisler.map((siparis) => {
                const siparisId = String(siparis._id || "");
                const seciliDurum =
                  siparis.durum === "Ödeme Bekliyor" &&
                  (siparis.odemeDurumu === "havale_bekliyor" || siparis.odemeYontemi === "havale")
                    ? "Ödeme Bekliyor (Havale)"
                    : siparis.durum;
                return (
                <div key={siparisId || siparis.siparisKodu} className="bg-[#111827] border border-slate-700 rounded-xl flex flex-col xl:flex-row overflow-hidden shadow-lg">
                  {/* SOL TARAF: BİLGİLER */}
                  <div className="flex-[3] p-6 flex flex-col gap-6 border-b xl:border-b-0 xl:border-r border-slate-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="text-xl font-black text-slate-200 tracking-wider mb-1">{siparis.siparisKodu}</div>
                        <div className="text-sm text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(siparis.tarih || siparis.createdAt || Date.now()).toLocaleString("tr-TR")}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-500">{Number((siparis.toplamTutar) || (siparis.Tutar) || 0).toLocaleString("tr-TR")} <span className="text-sm text-emerald-600">TL</span></div>
                        <div className="flex flex-wrap justify-end gap-2 mt-1">
                          <div className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded inline-block uppercase tracking-wider">
                            {siparis.odemeYontemi === "kart" ? "Kredi Kartı" : siparis.odemeYontemi === "bkm" ? "BKM" : "Havale / EFT"}
                          </div>
                          <div className={`text-xs font-bold px-2 py-1 rounded inline-block uppercase tracking-wider ${odemeDurumuRozeti(siparis.odemeDurumu)}`}>
                            {odemeDurumuEtiketi(siparis.odemeDurumu)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-[#0b1120] p-5 rounded-lg border border-slate-800">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Müşteri Bilgileri</div>
                        <div className="text-base font-bold text-slate-300 mb-2">{siparis.musteri?.ad} {siparis.musteri?.soyad}</div>
                        <div className="text-sm text-slate-400 mb-2">{siparis.musteri?.telefon} <span className="mx-2">•</span> {siparis.musteri?.eposta}</div>
                        <div className="text-sm text-slate-400 leading-relaxed">{siparis.musteri?.adres ? `${siparis.musteri.adres}, ` : ""}{siparis.musteri?.ilce} / {siparis.musteri?.sehir}</div>
                        {siparis.siparisNotu && siparis.siparisNotu !== "Not eklenmemiş" && (
                          <div className="mt-3 p-3 bg-amber-900/20 border border-amber-900/30 rounded text-sm text-amber-200/80 italic">
                            <span className="font-bold uppercase text-[10px] block not-italic mb-1 text-amber-500/70">Müşteri Notu:</span>
                            "{siparis.siparisNotu}"
                          </div>
                        )}
                      </div>
                      <div className="bg-[#0b1120] p-5 rounded-lg border border-slate-800 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 sticky top-0 bg-[#0b1120] pb-2 flex items-center gap-2"><Package className="w-4 h-4" /> Sipariş İçeriği ({siparis.sepet?.length || 0} Parça)</div>
                        <div className="flex flex-col gap-3">
                          {siparis.sepet?.map((urun: OrderItemLike, i: number) => (
                            <div key={i} className="flex flex-col border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-300 leading-snug">
                                <span><span className="font-black text-slate-500 mr-2 text-base">{urun.adet}x</span>{urun.isim || urun.name}</span>
                                {Number(urun.iadeEdilenAdet || 0) > 0 && (
                                  <span className="px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest">
                                    Kısmi İade
                                  </span>
                                )}
                              </div>
                              {Number(urun.iadeEdilenAdet || 0) > 0 && (
                                <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-rose-400">
                                  İade Edilen: {Number(urun.iadeEdilenAdet || 0)} Adet
                                </div>
                              )}
                              <div className="text-[11px] text-slate-600 font-mono mt-1">ID: {urun.id || urun._id}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {Number(siparis.toplamIadeEdilenTutar || 0) > 0 && (
                      <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2">
                          İade Özeti
                        </div>
                        <div className="text-sm text-slate-300">
                          Bu siparişte toplam <span className="font-black text-rose-400">{Number(siparis.toplamIadeEdilenTutar || 0).toLocaleString("tr-TR")} TL</span> iade işlendi.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SAĞ TARAF: KONTROL PANELİ */}
                  <div className="flex-[2] bg-[#1a2333] p-6 flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sipariş Durumu</label>
                        <select id={`durum-${siparisId}`} defaultValue={seciliDurum} className="w-full bg-[#0b1120] border border-slate-600 rounded-lg px-4 py-3 text-sm font-bold text-slate-200 focus:outline-none focus:border-slate-400 appearance-none">
                          {ORDER_STATUS_OPTIONS.map((durum) => (
                            <option key={durum} value={durum}>{durum}</option>
                          ))}
                        </select>
                      </div>
                      <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-lg">
                        <label className="block text-xs font-bold text-indigo-400/80 uppercase tracking-wider mb-2">Müşteriye Takip Mesajı Bırak</label>
                        <input type="text" id={`mesaj-${siparisId}`} defaultValue={siparis.musteriMesaji || ""} placeholder="Örn: Kargonuz özenle paketlendi..." className="w-full bg-[#0b1120] border border-indigo-900/50 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors" />
                      </div>
                      <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
                        <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-wider mb-2">Kargo Bilgilerini İşle</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input type="text" id={`firma-${siparisId}`} defaultValue={siparis.kargoFirmasi || ""} placeholder="Firma Adı" className="flex-1 bg-[#0b1120] border border-emerald-900/50 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-600/50" />
                          <input type="text" id={`takip-${siparisId}`} defaultValue={siparis.takipNo || ""} placeholder="Takip No" className="flex-[2] bg-[#0b1120] border border-emerald-900/50 rounded-lg px-4 py-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-emerald-600/50 tracking-widest" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-700/50 mt-2">
                      <button onClick={() => setSilinecekSiparisID(siparisId)} className="w-14 flex items-center justify-center bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-500/30 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                      <button onClick={() => siparisGuncelle(siparisId)} className={`flex-1 font-black uppercase tracking-widest text-sm py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${guncellenenID === siparisId ? 'bg-emerald-600 text-white' : 'bg-slate-200 hover:bg-white text-slate-900'}`}>{guncellenenID === siparisId ? <><CheckCircle2 className="w-5 h-5" /> GÜNCELLENDİ</> : <><Save className="w-5 h-5" /> KAYDET VE GÜNCELLE</>}</button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

          ) : aktifSekme === "talepler" ? (
            
            /* 🚀 DESTEK VE İADE TALEPLERİ EKRANI */
            <div className="flex flex-col gap-6">
              {talepler.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-base font-bold tracking-widest uppercase">Hiç Destek Talebi Yok.</div>
              ) : talepler.map((talep) => (
                <div key={talep._id} className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col lg:flex-row">
                  
                  {/* Sol: Talep Bilgileri ve Mesaj Geçmişi */}
                  <div className="flex-[3] p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${talep.konu === 'iade' ? 'bg-rose-950/30 text-rose-400 border border-rose-900/50' : talep.konu === 'teknik' ? 'bg-blue-950/30 text-blue-400 border border-blue-900/50' : 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/50'}`}>
                            {talep.konu === 'iade' ? 'İade İşlemi' : talep.konu === 'teknik' ? 'Teknik Destek' : 'Kargo / Diğer'}
                          </span>
                          <span className="text-xs text-slate-500 font-bold bg-[#0b1120] px-2 py-1 rounded border border-slate-800">#{talep.talepNo}</span>
                        </div>
                        <div className="text-slate-400 text-sm font-medium"><span className="text-slate-300 font-bold">{talep.kullaniciEmail}</span> tarafından açıldı</div>
                        {(talep.konu === "iade" || talep.konu === "iptal") && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {talep.siparisNo && (
                              <span className="text-[10px] font-bold text-slate-400 bg-[#0b1120] px-2 py-1 rounded border border-slate-800">Sipariş: {talep.siparisNo}</span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${talep.iadeYontemi === "magaza_kredisi" ? "bg-cyan-950/30 text-cyan-400 border-cyan-900/50" : "bg-slate-800 text-slate-300 border-slate-700"}`}>
                              Tercih: {talep.iadeYontemi === "magaza_kredisi" ? "Mağaza kredisi" : talep.iadeYontemi === "kart" ? "Kart iadesi" : "Belirtilmedi"}
                            </span>
                            {talep.iadeOdendi && (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">
                                İade tamamlandı{talep.iadeTutari ? ` — ${Number(talep.iadeTutari).toLocaleString("tr-TR")} TL` : ""}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${talep.durum === 'Çözüldü' ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50' : talep.durum === 'Yanıt Bekleniyor' ? 'bg-amber-950/30 text-amber-500 border-amber-900/50' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                          {talep.durum}
                        </span>
                        <div className="text-xs text-slate-500 mt-2 font-medium">{new Date(talep.createdAt).toLocaleString("tr-TR")}</div>
                      </div>
                    </div>

                    {/* Mesaj Akışı */}
             {/* Mesaj Akışı */}
<div className="flex-1 bg-[#0b1120] border border-slate-800 rounded-lg p-5 flex flex-col gap-4 overflow-y-auto max-h-[400px] custom-scrollbar mesaj-gecmisi-kutusu">
                      {talep.mesajlar?.map((msg: SupportMessageLike, index: number) => (
                        <div key={index} className={`flex flex-col max-w-[80%] ${msg.gonderen === 'admin' ? 'self-end items-end' : 'self-start items-start'}`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${msg.gonderen === 'admin' ? 'text-indigo-400' : 'text-slate-400'}`}>
                            {msg.gonderen === 'admin' ? 'Müşteri Hizmetleri' : 'Müşteri'}
                          </div>
                          <div className={`p-4 rounded-xl text-sm leading-relaxed ${msg.gonderen === 'admin' ? 'bg-indigo-900/20 border border-indigo-900/40 text-indigo-100 rounded-tr-sm' : 'bg-slate-800/50 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
                            {msg.metin.split('\n').map((satir: string, i: number) => <span key={i}>{satir}<br/></span>)}
                          </div>
                          <div className="text-[9px] text-slate-600 mt-1 font-medium">{new Date(msg.tarih).toLocaleString("tr-TR")}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sağ: Operatör Yanıt Paneli */}
                  <div className="flex-[2] bg-[#1a2333] p-6 flex flex-col justify-between gap-6">
             <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] p-4 admin-sohbet-kutusu">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Talebi Yanıtla</label>
                        <textarea 
                          value={talepCevaplari[talep._id] || ""} 
                          onChange={(e) => setTalepCevaplari(prev => ({...prev, [talep._id]: e.target.value}))}
                          placeholder="Müşteriye cevabınızı yazın... (Örn: İade kodunuz: 12345)" 
                          className="w-full bg-[#0b1120] border border-slate-600 rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 min-h-[150px] resize-none"
                        />
                      </div>
                      <button 
                        onClick={() => talepCevapGonder(talep._id)} 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> CEVAP GÖNDER
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-700/50 mt-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hızlı İşlemler</label>
                      {(talep.konu === "iade" || talep.konu === "iptal") && !talep.iadeOdendi && (
                        <div className="p-3 bg-[#0b1120] border border-slate-700 rounded-lg space-y-2">
                          {talep.siparisBulundu && talep.siparisTutari > 0 ? (
                            <div className="text-[10px] leading-relaxed space-y-1">
                              <p className="text-cyan-400">
                                Sipariş{talep.siparisKoduBulunan ? ` ${talep.siparisKoduBulunan}` : ""} — toplam{" "}
                                <strong>{Number(talep.siparisTutari).toLocaleString("tr-TR")} TL</strong>
                              </p>
                              <p className="text-slate-400">
                                Sipariş kalanı: <strong className="text-white">{Number(talep.kalanIadeEdilebilir ?? talep.siparisTutari).toLocaleString("tr-TR")} TL</strong>
                                {(talep.kullanilanKredi > 0 || talep.kullanilanPuan > 0) && (
                                  <> · kredi {Number(talep.kullanilanKredi || 0).toLocaleString("tr-TR")} TL · puan {Number(talep.kullanilanPuan || 0)}</>
                                )}
                              </p>
                              {talep.nakitOdemeTutari != null && (
                                <p className="text-emerald-400/90">
                                  Nakit ödeme (kart/havale): <strong>{Number(talep.nakitOdemeTutari).toLocaleString("tr-TR")} TL</strong>
                                  {talep.kalanNakitIade != null && talep.kalanNakitIade < talep.nakitOdemeTutari && (
                                    <> · kalan nakit iadesi <strong>{Number(talep.kalanNakitIade).toLocaleString("tr-TR")} TL</strong></>
                                  )}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] text-amber-400/90 leading-relaxed">
                              Sipariş kaydı bulunamadı. Tutarı elle girin veya sipariş numarasını kontrol edin (ör. BPC-123456).
                            </p>
                          )}
                          {talep.iadeKalemleri?.length > 0 && (
                            <p className="text-[10px] text-amber-400/90">
                              Müşteri kısmi iade talep etti: {talep.iadeKalemleri.map((k: RefundItemLike) => `${k.isim || "Ürün"} ×${k.adet}`).join(", ")}
                            </p>
                          )}
                          {talep.siparisKalemleri?.length > 0 && (
                            <div className="space-y-1.5 max-h-36 overflow-y-auto admin-sohbet-kutusu">
                              <p className="text-[10px] font-bold text-slate-500 uppercase">İade kalemleri seç</p>
                              {talep.siparisKalemleri.map((k: RefundItemLike) => {
                                const secili = iadeKalemSecimleri[talep._id]?.[k.urunId] || 0;
                                const devreDisi = k.iadeEdilebilirAdet <= 0;
                                return (
                                  <div key={k.urunId} className={`flex items-center gap-2 text-[10px] p-2 rounded border ${devreDisi ? "border-slate-800 opacity-50" : "border-slate-700"}`}>
                                    <input
                                      type="checkbox"
                                      checked={secili > 0}
                                      disabled={devreDisi}
                                      onChange={(e) => iadeKalemAdetGuncelle(talep._id, k.urunId, e.target.checked ? 1 : 0, k.iadeEdilebilirAdet, talep.siparisKalemleri)}
                                    />
                                    <span className="flex-1 text-slate-300 truncate">{k.isim}</span>
                                    <span className="text-slate-500 shrink-0">{k.birimFiyat?.toLocaleString("tr-TR")} TL</span>
                                    {secili > 0 && (
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button type="button" onClick={() => iadeKalemAdetGuncelle(talep._id, k.urunId, secili - 1, k.iadeEdilebilirAdet, talep.siparisKalemleri)} className="w-5 h-5 rounded bg-slate-800 text-slate-400">−</button>
                                        <span className="w-4 text-center text-white">{secili}</span>
                                        <button type="button" onClick={() => iadeKalemAdetGuncelle(talep._id, k.urunId, secili + 1, k.iadeEdilebilirAdet, talep.siparisKalemleri)} className="w-5 h-5 rounded bg-slate-800 text-slate-400">+</button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Sipariş iade tutarı (TL)</label>
                          <p className="text-[9px] text-slate-500 leading-relaxed">
                            Ürün/kalem bazlı iade tutarı. Kart veya mağaza kredisine yüklenen nakit kısım ayrıca hesaplanır.
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={iadeTutarlari[talep._id] || ""}
                              onChange={(e) => setIadeTutarlari((prev) => ({ ...prev, [talep._id]: e.target.value }))}
                              placeholder="Örn. 1250"
                              className="flex-1 bg-[#111827] border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                            />
                            {(talep.kalanIadeEdilebilir > 0 || talep.siparisTutari > 0) && (
                              <button
                                type="button"
                                onClick={() => kalanTumunuAl(talep)}
                                className="shrink-0 px-3 py-2 rounded-lg bg-cyan-950/50 border border-cyan-800/50 text-[10px] font-bold text-cyan-300 uppercase hover:bg-cyan-900/40 transition-colors"
                                title="Kalan tüm ürünleri seç ve sipariş kalan tutarını doldur"
                              >
                                Hepsini iade et
                              </button>
                            )}
                          </div>
                          {talep.kalanNakitIade != null && Number(iadeTutarlari[talep._id]) > 0 && (
                            <p className="text-[10px] text-emerald-400/90">
                              Bu iade için tahmini nakit (kart/kredi):{" "}
                              <strong>
                                {(() => {
                                  const girilen = Number(iadeTutarlari[talep._id] || 0);
                                  const kalanSiparis = talep.kalanIadeEdilebilir || talep.siparisTutari || 1;
                                  const oran = Math.min(1, girilen / kalanSiparis);
                                  const nakit = Math.round((talep.kalanNakitIade || 0) * oran * 100) / 100;
                                  return nakit.toLocaleString("tr-TR");
                                })()} TL
                              </strong>
                            </p>
                          )}
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => iadeTamamla(talep._id, "magaza_kredisi")}
                              className="w-full py-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 text-[10px] font-black uppercase tracking-wider hover:bg-cyan-900/30 transition-colors"
                            >
                              Mağaza kredisine yükle
                            </button>
                            <button
                              type="button"
                              onClick={() => iadeTamamla(talep._id, "kart")}
                              className="w-full py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 text-[10px] font-black uppercase tracking-wider hover:bg-slate-700 transition-colors"
                            >
                              Kart iadesi yapıldı (bildir)
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => talepDurumGuncelle(talep._id, talep.durum === 'Çözüldü' ? 'Açık' : 'Çözüldü')} 
                          className={`flex-[3] font-bold uppercase text-[10px] tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${talep.durum === 'Çözüldü' ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900/30'}`}
                        >
                          {talep.durum === 'Çözüldü' ? 'Tekrar Aç' : <><CheckCircle2 className="w-4 h-4" /> Çözüldü Olarak İşaretle</>}
                        </button>
                        <button onClick={() => setSilinecekTalepID(talep._id)} className="flex-1 flex items-center justify-center bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-500/30 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : (

            /* 💬 YORUMLAR (Bant Sistemi) */
            <div className="flex flex-col gap-5">
              {yorumlar.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-base font-bold tracking-widest uppercase">Hiç Yorum Yok.</div>
              ) : yorumlar.map((item) => (
                <div key={item._id} className={`bg-[#111827] border rounded-xl p-6 ${item.onaylandi ? 'border-slate-800' : 'border-amber-900/50 bg-amber-950/10'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        {item.type === "question" ? <span className="bg-blue-950/30 text-blue-400 text-[10px] border border-blue-900/50 font-bold px-2.5 py-1 rounded uppercase flex items-center gap-1.5"><HelpCircle size={12} /> Soru</span> : <span className="bg-purple-950/30 text-purple-400 text-[10px] border border-purple-900/50 font-bold px-2.5 py-1 rounded uppercase flex items-center gap-1.5"><Star size={12} /> Yorum</span>}
                        {!item.onaylandi && <span className="bg-amber-950/30 text-amber-500 border border-amber-900/50 text-[10px] font-bold px-2.5 py-1 rounded uppercase flex items-center gap-1.5"><ShieldAlert size={12} /> Onay Bekliyor</span>}
                      </div>
                      <h3 className="text-slate-200 font-bold text-base mb-2">{item.name}</h3>
                      <p className="text-slate-400 text-sm italic mb-4 leading-relaxed">"{item.text}"</p>
                      {item.answer && <div className="bg-[#0b1120] p-4 rounded-lg border-l-2 border-slate-600 text-sm text-slate-400 mt-auto"><span className="font-bold text-[10px] uppercase tracking-wider block mb-1">Mağaza Cevabı:</span>{item.answer}</div>}
                    </div>
                    <div className="flex md:flex-col gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
                      <button onClick={() => yorumDurumGuncelle(item._id, item.onaylandi)} className={`flex items-center justify-center gap-2 p-3 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-colors ${item.onaylandi ? 'bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-slate-300' : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900/30'}`}>{item.onaylandi ? <XCircle size={16} /> : <CheckCircle2 size={16} />} {item.onaylandi ? "Gizle" : "Onayla"}</button>
                      <button onClick={() => { setReplyId(replyId === item._id ? null : item._id); setReplyText(item.answer || ""); }} className="flex items-center justify-center gap-2 p-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-colors"><MessageSquare size={16} /> Cevapla</button>
                      <button onClick={() => setSilinecekYorumID(item._id)} className="flex items-center justify-center gap-2 p-3 bg-[#0b1120] border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-900/50 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-colors"><Trash2 size={16} /> Sil</button>
                    </div>
                  </div>
                  {replyId === item._id && (
                    <div className="mt-5 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Cevabınızı yazın..." className="flex-1 bg-[#0b1120] border border-slate-700 rounded-lg p-4 text-sm text-slate-300 focus:outline-none min-h-[80px] resize-none" />
                      <div className="flex sm:flex-col gap-2 shrink-0 sm:w-32">
                        <button onClick={() => yorumCevapGonder(item._id)} className="flex-1 bg-slate-700 text-white rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-600 transition-colors">Gönder</button>
                        <button onClick={() => setReplyId(null)} className="flex-1 bg-[#0b1120] border border-slate-700 text-slate-500 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-slate-800 transition-colors">İptal</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ORTAK SİLME ONAY MODALI */}
      {(silinecekSiparisID || silinecekYorumID || silinecekTalepID) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mb-5 bg-red-500/10"><Trash2 className="w-7 h-7 text-red-400" /></div>
            <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider mb-2">Kalıcı Silme İşlemi</h3>
            <p className="text-slate-400 text-sm mb-6">Bu işlemi geri alamazsınız. Onaylıyor musunuz?</p>
            <div className="flex w-full gap-3">
              <button onClick={() => { setSilinecekSiparisID(null); setSilinecekYorumID(null); setSilinecekTalepID(null); }} className="flex-1 bg-[#0b1120] border border-slate-700 hover:bg-slate-800 text-slate-400 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">İptal</button>
              <button onClick={silinecekSiparisID ? siparisSilmeIslemi : silinecekYorumID ? yorumSilmeIslemi : talepSilmeIslemi} className="flex-1 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}
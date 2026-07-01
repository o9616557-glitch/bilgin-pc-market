"use client";
import { ArrowLeft, CreditCard, Banknote, ShieldCheck, MapPin, Edit3, User, Phone, Mail, ChevronRight, ChevronLeft, Package, Copy, Check, Plus } from "lucide-react";
import { useCart } from "../CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { temizleOdemeSayfasiKalintilari } from "@/lib/iyzico-checkout";
import { type KayitliKart } from "@/lib/cuzdan";

const KART_MARKA: Record<string, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  troy: "TROY",
  amex: "AMEX",
  diger: "KART",
};

const ODEME_FORM_CACHE_KEY = "odeme_form_cache";

const labelClass = "text-xs text-slate-400 font-medium block mb-1.5";
const fieldClass =
  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-site-accent/50 focus:bg-white/[0.05] transition-colors";

export default function OdemeSayfasi() {
  const { data: session, status } = useSession();
  const { sepet } = useCart();

  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [ibanKopyalandi, setIbanKopyalandi] = useState(false);
  const [faturaAyni, setFaturaAyni] = useState(true);
  const [acikSozlesme, setAcikSozlesme] = useState<"mesafeli" | "gizlilik" | null>(null);
  const [asama, setAsama] = useState(1);

  const [kayitliKartlar, setKayitliKartlar] = useState<KayitliKart[]>([]);
  const [kayitliKartlarYukleniyor, setKayitliKartlarYukleniyor] = useState(false);
  const [seciliKartId, setSeciliKartId] = useState<string | null>(null);
  const [odemeIptalAcik, setOdemeIptalAcik] = useState(false);

  const [adresAraniyor, setAdresAraniyor] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem("bilgin_hizli_adresler");
  });
  const [adresKilitli, setAdresKilitli] = useState(false);

 const [form, setForm] = useState({ ad: "", soyad: "", telefon: "", eposta: "", adres: "", sehir: "", ilce: "", siparisNotu: "" });
  const [faturaForm, setFaturaForm] = useState({ ad: "", soyad: "", telefon: "", eposta: "", adres: "", sehir: "", ilce: "" });

  useEffect(() => {
    if (status === "loading") return;
    if (session && session.user && session.user.email) {
      const userEmail = session.user.email;
      setForm((prev) => ({ ...prev, eposta: userEmail }));
      setFaturaForm((prev) => ({ ...prev, eposta: userEmail }));
    }
  }, [session, status]);

  useEffect(() => {
    if (status !== "authenticated" || odemeYontemi !== "kart") return;

    const kartlariGetir = async () => {
      setKayitliKartlarYukleniyor(true);
      try {
        const res = await fetch("/api/cuzdan?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const kartlar: KayitliKart[] = (data.savedCards || []).filter((k: KayitliKart) => k.iyzicoHazir);
        setKayitliKartlar(kartlar);
        const varsayilan = kartlar.find((k) => k.isDefault) || kartlar[0];
        setSeciliKartId(varsayilan?._id ?? null);
      } catch {
        setKayitliKartlar([]);
      } finally {
        setKayitliKartlarYukleniyor(false);
      }
    };

    kartlariGetir();
  }, [status, odemeYontemi]);

  useEffect(() => {
    sessionStorage.removeItem("iyzico_temizle");

    try {
      const ham = sessionStorage.getItem(ODEME_FORM_CACHE_KEY);
      if (ham) {
        const c = JSON.parse(ham);
        if (c.form) setForm(c.form);
        if (c.faturaForm) setFaturaForm(c.faturaForm);
        if (typeof c.faturaAyni === "boolean") setFaturaAyni(c.faturaAyni);
        if (c.asama) setAsama(c.asama);
        if (c.odemeYontemi) setOdemeYontemi(c.odemeYontemi);
        if (c.seciliKartId !== undefined) setSeciliKartId(c.seciliKartId);
        setAdresKilitli(true);
        setAdresAraniyor(false);
      }
    } catch {
      /* önbellek bozuksa yoksay */
    }

    setYukleniyor(false);

    const params = new URLSearchParams(window.location.search);
    if (params.get("iptal") === "1") {
      setOdemeIptalAcik(true);
      window.history.replaceState(null, "", "/odeme");
    }

    const sayfaGeri = () => setYukleniyor(false);
    const sekmeGeri = () => {
      if (document.visibilityState === "visible") setYukleniyor(false);
    };
    window.addEventListener("pageshow", sayfaGeri);
    document.addEventListener("visibilitychange", sekmeGeri);

    return () => {
      window.removeEventListener("pageshow", sayfaGeri);
      document.removeEventListener("visibilitychange", sekmeGeri);
      temizleOdemeSayfasiKalintilari();
    };
  }, []);
// 🚀 ERKENCİ ÇIRAK MOTORU V2 (0 MİLİSANİYE - SIFIR GECİKME!)
  useEffect(() => {
    // 🛠️ YARDIMCI MAKİNE: Adresi forma yapıştıran sistem
    const adresleriFormaDoldur = (adresler: any[]) => {
      const varsayilanTeslimat = adresler.find((a: any) => a.isDefaultDelivery);
      if (varsayilanTeslimat) {
        const nameParts = varsayilanTeslimat.fullName.trim().split(" ");
        const soyad = nameParts.length > 1 ? nameParts.pop() : "";
        const ad = nameParts.join(" ");
        const sessionEmail = (session && session.user && session.user.email) ? session.user.email : "";
        const kesinEposta = varsayilanTeslimat.email || varsayilanTeslimat.eposta || sessionEmail;

        setForm(prev => ({ ...prev, ad: ad, soyad: soyad, telefon: varsayilanTeslimat.phone, sehir: varsayilanTeslimat.city, ilce: varsayilanTeslimat.district, adres: varsayilanTeslimat.fullAddress, eposta: kesinEposta, siparisNotu: prev.siparisNotu || "" }));
        setAdresKilitli(true);
        setAdresAraniyor(false); // 🔥 Ekranı anında aç!
      }

      const varsayilanFatura = adresler.find((a: any) => a.isDefaultBilling);
      if (varsayilanFatura) {
        const nameParts = varsayilanFatura.fullName.trim().split(" ");
        const soyad = nameParts.length > 1 ? nameParts.pop() : "";
        const ad = nameParts.join(" ");
        const sessionEmail = (session && session.user && session.user.email) ? session.user.email : "";
        const faturaKesinEposta = varsayilanFatura.email || varsayilanFatura.eposta || sessionEmail;

        setFaturaForm(prev => ({ ...prev, ad: ad, soyad: soyad, telefon: varsayilanFatura.phone, sehir: varsayilanFatura.city, ilce: varsayilanFatura.district, adres: varsayilanFatura.fullAddress, eposta: faturaKesinEposta }));

        if (varsayilanTeslimat && varsayilanFatura._id !== varsayilanTeslimat._id) {
          setFaturaAyni(false);
        }
      }
    };

    // 🚀 AŞAMA 1 (IŞIK HIZI): Oturum kontrolünü falan bekleme, hafızayı saniyesinde bas!
    const hafiza = localStorage.getItem("bilgin_hizli_adresler");
    if (hafiza) {
      try {
        adresleriFormaDoldur(JSON.parse(hafiza));
      } catch(e) {}
    }

    // Eğer oturum hala yükleniyorsa ve hafıza BOMBOŞSA mecburen beklet. 
    // Ama hafızada adres varsa zerre kadar bekleme yapmaz!
    if (status === "loading") {
      if (!hafiza) setAdresAraniyor(true);
      return;
    }

    // 🚀 AŞAMA 2 (SESSİZ GÜNCELLEME): Sayfa açıldıktan sonra arkadan veritabanını kontrol et
    const fetchKayitliAdresler = async () => {
      try {
        const res = await fetch("/api/addresses");
        if (res.ok) {
          const data = await res.json();
          const adresler = data.addresses || [];
          localStorage.setItem("bilgin_hizli_adresler", JSON.stringify(adresler)); 
          adresleriFormaDoldur(adresler); 
        }
      } catch (error) {
      } finally { 
        setAdresAraniyor(false); 
      }
    };

    if (status === "authenticated" && session) {
      fetchKayitliAdresler();
    } else {
      if (!hafiza) setAdresAraniyor(false);
    }
  }, [session, status]);

// 🚀 SÖZLEŞME ZORUNLU OKUMA KİLİDİ VE RADARI
  const [sozlesmeOkundu, setSozlesmeOkundu] = useState(false);

  // Müşteri sözleşmeyi her açtığında kilit tekrar başa sarsın (kapansın)
  useEffect(() => {
    if (acikSozlesme) setSozlesmeOkundu(false);
  }, [acikSozlesme]);

  // 📜 Kaydırma (Scroll) Radarı: En aşağı inildiğini milimi milimine anlar
  const sozlesmeKaydirmaRadari = (e: any) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    // En aşağı inmeye 5 piksel (hata payı) kaldığında kilidi açar
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      setSozlesmeOkundu(true);
    }
  };
  // 🚀 ARKA PLANI TAŞ GİBİ KİLİTLEYEN MOTOR (Kaydırma İptali)
  useEffect(() => {
    if (acikSozlesme) {
      // Sözleşme açıldığında sitenin ana kaydırmasını (scroll) tamamen kilitler
      document.body.style.overflow = "hidden";
    } else {
      // Sözleşme kapandığında kilidi açar, site normale döner
      document.body.style.overflow = "unset";
    }

    // Müşteri sayfadan aniden çıkarsa kilidi garanti olsun diye açıyoruz
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [acikSozlesme]);

  const hesaplaTutar = () => {
    let hesaplananAraToplam = 0;
    sepet.forEach((urun: any) => {
      const indirimOrani = (urun.havaleIndirimi !== undefined && urun.havaleIndirimi !== null) ? Number(urun.havaleIndirimi) : 0;
      let urunFiyati = Number(urun.fiyat);
      if (odemeYontemi === "havale" && indirimOrani > 0) {
        urunFiyati = urunFiyati - (urunFiyati * indirimOrani) / 100;
      }
      hesaplananAraToplam += urunFiyati * urun.adet;
    });
    const hesaplananKargo = (hesaplananAraToplam > 5000 || hesaplananAraToplam === 0) ? 0 : 1;
    return { araToplam: hesaplananAraToplam, kargo: hesaplananKargo, genelToplam: hesaplananAraToplam + hesaplananKargo };
  };

  const { araToplam, kargo, genelToplam } = hesaplaTutar();
  const inputDegis = (e: any) => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const faturaInputDegis = (e: any) => { setFaturaForm({ ...faturaForm, [e.target.name]: e.target.value }); };

  const siparisTamamla = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setOdemeIptalAcik(false);

    const sessionEmail = (session && session.user && session.user.email) ? session.user.email : form.eposta;

   const siparisVerisi = {
      musteri: { ...form, eposta: sessionEmail, faturaBilgileri: faturaAyni ? form : faturaForm },
      sepet: sepet.map((item: any) => {
        const indirimOrani = (item.havaleIndirimi !== undefined && item.havaleIndirimi !== null) ? Number(item.havaleIndirimi) : 0;
        let sonFiyat = Number(item.fiyat);
        if (odemeYontemi === "havale" && indirimOrani > 0) sonFiyat = sonFiyat - (sonFiyat * indirimOrani) / 100;
        const urunResmi = item.resim || item.image || "/placeholder.jpg";
        return { id: item.id, isim: item.isim, title: item.isim, miktar: item.adet, quantity: item.adet, adet: item.adet, fiyat: sonFiyat, price: sonFiyat, varyasyon: item.varyasyon, resim: urunResmi, image: urunResmi };
      }),
      odemeYontemi: odemeYontemi,
      siparisNotu: form.siparisNotu, // <--- İŞTE JİLET GİBİ BURAYA EKLENDİ ŞEFİM
      toplamTutar: genelToplam,
      totalPrice: genelToplam,
      genelToplam: genelToplam
    };
    if (odemeYontemi === "kart" && seciliKartId) {
      (siparisVerisi as any).kayitliKartId = seciliKartId;
    }
    try {
      const response = await fetch("/api/siparis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(siparisVerisi) });
      const data = await response.json();
      
      if (data.success) {
        if (data.odemeYontemi === "havale") {
          sessionStorage.removeItem(ODEME_FORM_CACHE_KEY);
          localStorage.removeItem("bilgin-sepet");
          window.location.href = "/siparis-basarili?kodu=" + data.siparisKodu;
        } else if (data.paymentPageUrl) {
          sessionStorage.setItem(
            ODEME_FORM_CACHE_KEY,
            JSON.stringify({ form, faturaForm, faturaAyni, asama, odemeYontemi, seciliKartId })
          );
          window.location.href = data.paymentPageUrl;
          return;
        } else {
          alert("Ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin.");
        }
      } else {
        alert("Hata Oluştu: " + (data.error || "İşlem reddedildi."));
      }
    } catch (hata) {
      alert("Sunucu ile bağlantı kurulamadı. Lütfen tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  };

  const ibanKopyala = () => {
    navigator.clipboard.writeText("TR14 0006 7010 0000 0043 3005 49");
    setIbanKopyalandi(true);
    setTimeout(() => setIbanKopyalandi(false), 2000);
  };

  const adresTamamMi = () =>
    !!(form.ad?.trim() && form.soyad?.trim() && form.telefon?.trim() && form.eposta?.trim() && form.adres?.trim() && form.sehir?.trim() && form.ilce?.trim()) &&
    (faturaAyni || !!(faturaForm.ad?.trim() && faturaForm.soyad?.trim() && faturaForm.telefon?.trim() && faturaForm.eposta?.trim() && faturaForm.adres?.trim() && faturaForm.sehir?.trim() && faturaForm.ilce?.trim()));

  const asamaIleri = () => {
    if (asama === 1) {
      setAsama(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (asama === 2) {
      if (adresAraniyor) return;
      if (!adresTamamMi()) {
        alert("Lütfen teslimat bilgilerini eksiksiz doldurun.");
        return;
      }
      setAsama(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const asamaGeri = () => {
    setAsama((a) => Math.max(1, a - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const odemeYontemiSec = (yontem: "kart" | "havale") => {
    setOdemeYontemi(yontem);
    if (yontem === "havale") setSeciliKartId(null);
  };

  const KayitliKartSecimi = () => {
    if (status !== "authenticated") {
      return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 mb-5">
          <p className="text-slate-400 text-xs leading-relaxed">
            Kayıtlı kartlarınızı kullanmak için{" "}
            <Link href="/giris?callbackUrl=/odeme" className="text-site-accent hover:underline">giriş yapın</Link>
            {" "}veya ödeme sırasında yeni kart girebilirsiniz.
          </p>
        </div>
      );
    }

    if (kayitliKartlarYukleniyor) {
      return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 mb-5 animate-pulse">
          <div className="h-3 bg-white/10 w-1/3 rounded mb-3" />
          <div className="h-14 bg-white/5 rounded-xl" />
        </div>
      );
    }

    if (kayitliKartlar.length === 0) {
      return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 mb-5">
          <p className="text-slate-400 text-xs leading-relaxed mb-2">
            Henüz hızlı ödeme için kayıtlı kartınız yok. İyzico ekranında yeni kart girebilir veya{" "}
            <Link href="/cuzdan" className="text-site-accent hover:underline">cüzdanınıza kart ekleyebilirsiniz</Link>.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-[#00d2ff]/20 bg-[#00d2ff]/[0.03] p-4 sm:p-5 mb-5">
        <p className="text-white text-sm font-semibold mb-1">Kayıtlı kartınız</p>
        <p className="text-slate-500 text-xs mb-4">Seçtiğiniz kart İyzico güvenli ödeme ekranında hazır gelir.</p>
        <div className="space-y-2">
          {kayitliKartlar.map((kart) => {
            const secili = seciliKartId === kart._id;
            return (
              <button
                key={kart._id}
                type="button"
                onClick={() => setSeciliKartId(kart._id)}
                className={[
                  "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all touch-manipulation",
                  secili
                    ? "border-[#00d2ff]/50 bg-[#00d2ff]/10"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20",
                ].join(" ")}
              >
                <div className={[
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  secili ? "bg-[#00d2ff]/20" : "bg-white/[0.05]",
                ].join(" ")}>
                  <CreditCard className={secili ? "w-5 h-5 text-[#00d2ff]" : "w-5 h-5 text-slate-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium font-mono tracking-wider">•••• {kart.last4}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{KART_MARKA[kart.brand] || "KART"}</span>
                    {kart.isDefault && (
                      <span className="text-[9px] font-bold text-[#00d2ff]/80 bg-[#00d2ff]/10 px-1.5 py-0.5 rounded">Varsayılan</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] truncate mt-0.5">
                    {kart.holderName} · {kart.expiryMonth}/{kart.expiryYear}
                  </p>
                </div>
                <div className={[
                  "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                  secili ? "border-[#00d2ff] bg-[#00d2ff]" : "border-slate-600",
                ].join(" ")}>
                  {secili && <Check className="w-3 h-3 text-black" />}
                </div>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSeciliKartId(null)}
            className={[
              "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all touch-manipulation",
              seciliKartId === null
                ? "border-[#00d2ff]/50 bg-[#00d2ff]/10"
                : "border-white/[0.08] bg-white/[0.02] hover:border-white/20",
            ].join(" ")}
          >
            <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <span className="text-white text-sm font-medium">Farklı kart ile öde</span>
              <p className="text-slate-500 text-[11px] mt-0.5">İyzico ekranında yeni kart bilgisi girin</p>
            </div>
            <div className={[
              "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
              seciliKartId === null ? "border-[#00d2ff] bg-[#00d2ff]" : "border-slate-600",
            ].join(" ")}>
              {seciliKartId === null && <Check className="w-3 h-3 text-black" />}
            </div>
          </button>
        </div>
      </div>
    );
  };

  const OdemeYontemiKartlari = ({ compact = false }: { compact?: boolean }) => (
    <div className={`grid grid-cols-2 gap-3 ${compact ? "mb-4" : "mb-5"}`}>
      <button
        type="button"
        onClick={() => odemeYontemiSec("kart")}
        className={[
          "relative rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 touch-manipulation active:scale-[0.98]",
          compact ? "py-3 px-2 min-h-[64px]" : "py-4 px-3 min-h-[80px]",
          odemeYontemi === "kart"
            ? "bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/50 shadow-[0_0_20px_rgba(0,210,255,0.12)]"
            : "bg-white/[0.03] text-slate-400 border-white/[0.08] hover:border-white/20 hover:text-white",
        ].join(" ")}
      >
        {odemeYontemi === "kart" && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]" />
        )}
        <CreditCard className={compact ? "w-5 h-5" : "w-6 h-6"} />
        <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">Kredi / Banka Kartı</span>
      </button>
      <button
        type="button"
        onClick={() => odemeYontemiSec("havale")}
        className={[
          "relative rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 touch-manipulation active:scale-[0.98]",
          compact ? "py-3 px-2 min-h-[64px]" : "py-4 px-3 min-h-[80px]",
          odemeYontemi === "havale"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
            : "bg-white/[0.03] text-slate-400 border-white/[0.08] hover:border-white/20 hover:text-white",
        ].join(" ")}
      >
        {odemeYontemi === "havale" && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        )}
        <Banknote className={compact ? "w-5 h-5" : "w-6 h-6"} />
        <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">Havale / EFT</span>
      </button>
    </div>
  );

  const SiparisOzetiKutusu = ({ notGoster = false }: { notGoster?: boolean }) => (
    <div className="glass-card p-4 sm:p-5">
      <h2 className="text-sm sm:text-base font-semibold text-white mb-4 pb-3 border-b border-white/[0.06] flex items-center gap-2">
        <Package className="w-4 h-4 text-site-accent" /> Sipariş özeti
      </h2>
      <div className="space-y-3 mb-4 max-h-[280px] sm:max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
        {sepet.map((urun: any) => {
          const indirimOrani = urun.havaleIndirimi !== undefined && urun.havaleIndirimi !== null ? Number(urun.havaleIndirimi) : 0;
          let birimFiyat = Number(urun.fiyat);
          if (odemeYontemi === "havale" && indirimOrani > 0) birimFiyat -= (birimFiyat * indirimOrani) / 100;
          return (
            <div key={urun.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-white/[0.03] rounded-lg border border-white/[0.06] flex items-center justify-center p-1">
                <img src={urun.resim || urun.image || "/placeholder.jpg"} alt={urun.isim} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <span className="text-white text-xs font-medium leading-snug line-clamp-2">{urun.isim}</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 text-[10px]">{urun.adet} adet</span>
                  <span className="text-site-accent font-semibold text-xs tabular-nums">{(birimFiyat * urun.adet).toLocaleString("tr-TR")} TL</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-400"><span>Ara toplam</span><span className="text-white font-medium tabular-nums">{araToplam.toLocaleString("tr-TR")} TL</span></div>
        <div className="flex justify-between text-slate-400">
          <span>Kargo</span>
          <span>{kargo === 0 ? <span className="text-emerald-400 text-xs font-medium">Ücretsiz</span> : <span className="text-white font-medium tabular-nums">{kargo} TL</span>}</span>
        </div>
      </div>
      <div className="flex justify-between items-center border-t border-white/[0.06] pt-3 mt-3">
        <span className="text-sm text-slate-400">Genel toplam</span>
        <span className="text-lg sm:text-xl font-semibold text-site-accent tabular-nums">{genelToplam.toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-medium">TL</span></span>
      </div>
      {notGoster && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <label className={labelClass}>Sipariş notu <span className="text-slate-600">(isteğe bağlı)</span></label>
          <textarea rows={3} name="siparisNotu" value={form.siparisNotu} onChange={inputDegis} placeholder="Kargocuya iletmek istediğiniz not…" className={`${fieldClass} resize-none`} />
        </div>
      )}
    </div>
  );

  const AsamaGostergesi = () => (
    <div className="flex justify-center mb-6 sm:mb-8 px-2">
      <div className="flex items-center w-full max-w-sm sm:max-w-md mx-auto">
        {[
          { n: 1, baslik: "Özet" },
          { n: 2, baslik: "Adres" },
          { n: 3, baslik: "Ödeme" },
        ].map(({ n, baslik }, i) => (
          <div key={n} className="contents">
            <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-[56px] sm:min-w-[64px]">
              <div
                className={[
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  asama >= n ? "bg-site-accent text-black shadow-[0_0_12px_rgba(0,210,255,0.35)]" : "bg-white/10 text-slate-500",
                ].join(" ")}
              >
                {n}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium text-center ${asama >= n ? "text-white" : "text-slate-500"}`}>
                {baslik}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-0.5 mx-1 sm:mx-2 rounded-full mb-5 ${asama > n ? "bg-site-accent" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const HavaleDetayKarti = () => (
    <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-transparent p-4 sm:p-5 mb-5">
      <p className="text-emerald-400 text-sm font-semibold mb-1">Havale / EFT bilgileri</p>
      <p className="text-slate-500 text-xs mb-4">Açıklama alanına <span className="text-slate-300">adınız ve soyadınızı</span> yazmayı unutmayın.</p>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-4 py-2 border-b border-white/[0.06]">
          <span className="text-slate-500 shrink-0">Banka</span>
          <span className="text-white font-medium text-right">Yapı Kredi</span>
        </div>
        <div className="flex justify-between gap-4 py-2 border-b border-white/[0.06]">
          <span className="text-slate-500 shrink-0">Alıcı</span>
          <span className="text-white font-medium text-right">Özkan BİLGİN</span>
        </div>
        <div className="pt-1">
          <span className="text-slate-500 text-xs block mb-2">IBAN</span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-black/30 rounded-xl p-3 border border-white/[0.06]">
            <code className="text-emerald-300 text-xs sm:text-sm font-mono tracking-wide break-all flex-1">TR14 0006 7010 0000 0043 3005 49</code>
            <button
              type="button"
              onClick={ibanKopyala}
              className={[
                "inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all shrink-0",
                ibanKopyalandi ? "bg-emerald-500 text-white" : "bg-site-accent text-white hover:opacity-90",
              ].join(" ")}
            >
              {ibanKopyalandi ? <><Check className="w-3.5 h-3.5" /> Kopyalandı</> : <><Copy className="w-3.5 h-3.5" /> Kopyala</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (sepet.length === 0) {
    return (
      <div className="min-h-[80vh] site-page flex flex-col items-center justify-center px-4">
        <div className="glass-card p-8 sm:p-12 flex flex-col items-center max-w-md w-full text-center">
          <h2 className="site-h2 mb-3">Sepetinizde ürün yok</h2>
          <p className="site-body mb-6">Ödeme için önce sepete ürün eklemeniz gerekir.</p>
          <Link href="/" className="btn-primary">Alışverişe başla</Link>
        </div>
      </div>
    );
  }

  if (odemeIptalAcik) {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6 text-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <p className="text-[88px] sm:text-[120px] font-black leading-none text-slate-200 select-none" aria-hidden>
          :(
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 -mt-6 mb-2">Ödeme iptal edildi</h1>
        <p className="text-slate-500 text-sm max-w-xs mb-8 leading-relaxed">
          İşleminiz tamamlanmadı. Kartınızdan tahsilat yapılmadı.
        </p>
        <button
          type="button"
          onClick={() => setOdemeIptalAcik(false)}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#252540] transition-colors touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" /> Ödemeye dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen site-page pb-12 relative">
      <div className="glass-panel border-b border-white/[0.06] sticky top-0 z-50 mb-6 sm:mb-8 rounded-none">
        <div className="site-container-narrow py-3.5 sm:py-4 flex items-center justify-between">
          <Link href="/sepet" className="flex items-center gap-2 text-sm text-slate-400 hover:text-site-accent transition-colors">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Sepete dön</span>
          </Link>
          <Link href="/" className="font-semibold text-lg sm:text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
            BİLGİN <span className="site-accent-text">PC</span>
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Güvenli ödeme</span>
          </div>
        </div>
      </div>

      <div className="site-container-narrow pb-8">
        <div className="text-center max-w-lg mx-auto mb-2">
          <h1 className="site-h2 mb-2">Güvenli ödeme</h1>
          <p className="text-slate-500 text-sm">3 adımda siparişinizi tamamlayın</p>
        </div>
        <AsamaGostergesi />

        <form onSubmit={(e) => { if (asama !== 3) { e.preventDefault(); return; } void siparisTamamla(e); }}>
          {/* ——— AŞAMA 1: Ürün özeti + not ——— */}
          {asama === 1 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <SiparisOzetiKutusu notGoster />
              <button
                type="button"
                onClick={asamaIleri}
                className="w-full py-3.5 rounded-xl text-sm font-semibold btn-primary flex items-center justify-center gap-2 touch-manipulation"
              >
                Devam et <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ——— AŞAMA 2: Adres + ödeme yöntemi ——— */}
          {asama === 2 && (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-5xl mx-auto">
              <div className="flex-1 min-w-0 glass-card p-4 sm:p-6 lg:p-8">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-site-accent" /> Teslimat bilgileri
                </h3>

                {adresAraniyor ? (
                  <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 animate-pulse mb-6">
                    <div className="h-3 bg-white/10 w-1/3 rounded mb-3" />
                    <div className="h-10 bg-white/5 w-full rounded-xl mb-2" />
                    <div className="h-16 bg-white/5 w-full rounded-xl" />
                  </div>
                ) : adresKilitli ? (
                  <div className="mb-6 bg-white/[0.03] border border-site-accent/20 rounded-xl p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2 text-white font-medium text-sm sm:text-base">
                          <User className="w-4 h-4 text-site-accent shrink-0" /> {form.ad} {form.soyad}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-slate-400 text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {form.telefon}</span>
                          <span className="hidden sm:inline text-slate-600">·</span>
                          <span className="flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> {form.eposta}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-slate-300 text-xs sm:text-sm">
                          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{form.adres}, <span className="text-white font-medium">{form.ilce} / {form.sehir}</span></span>
                        </div>
                      </div>
                      <button type="button" onClick={() => setAdresKilitli(false)} className="shrink-0 flex items-center gap-2 text-site-accent text-xs font-medium px-3 py-2 rounded-lg border border-white/[0.08] hover:border-site-accent/40 hover:bg-site-accent/5 transition-all">
                        <Edit3 className="w-3.5 h-3.5" /> Düzenle
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={labelClass}>Adınız</label><input type="text" name="ad" value={form.ad} onChange={inputDegis} required className={fieldClass} /></div>
                      <div><label className={labelClass}>Soyadınız</label><input type="text" name="soyad" value={form.soyad} onChange={inputDegis} required className={fieldClass} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>Telefon</label><input type="tel" name="telefon" value={form.telefon} onChange={inputDegis} required className={fieldClass} /></div>
                      <div><label className={labelClass}>E-posta</label><input type="email" name="eposta" value={form.eposta} onChange={inputDegis} required className={fieldClass} /></div>
                    </div>
                    <div><label className={labelClass}>Açık adres</label><textarea rows={3} name="adres" value={form.adres} onChange={inputDegis} required className={`${fieldClass} resize-none`} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={labelClass}>Şehir</label><input type="text" name="sehir" value={form.sehir} onChange={inputDegis} required className={fieldClass} /></div>
                      <div><label className={labelClass}>İlçe</label><input type="text" name="ilce" value={form.ilce} onChange={inputDegis} required className={fieldClass} /></div>
                    </div>
                  </div>
                )}

                {!adresKilitli && (
                  <div className="flex items-center gap-2.5 mb-4 py-1">
                    <input type="checkbox" id="faturaAyni" checked={faturaAyni} onChange={(e) => setFaturaAyni(e.target.checked)} className="w-4 h-4 cursor-pointer accent-site-accent rounded" />
                    <label htmlFor="faturaAyni" className="text-slate-300 text-sm cursor-pointer">Fatura adresim teslimat ile aynı</label>
                  </div>
                )}

                {!faturaAyni && !adresKilitli && (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 sm:p-5 mb-5">
                    <h4 className="text-site-accent text-sm font-semibold mb-3">Fatura bilgileri</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><label className={labelClass}>Adınız</label><input type="text" name="ad" value={faturaForm.ad} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                      <div><label className={labelClass}>Soyadınız</label><input type="text" name="soyad" value={faturaForm.soyad} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div><label className={labelClass}>Telefon</label><input type="tel" name="telefon" value={faturaForm.telefon} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                      <div><label className={labelClass}>E-posta</label><input type="email" name="eposta" value={faturaForm.eposta} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                    </div>
                    <div className="mb-3"><label className={labelClass}>Açık adres</label><textarea rows={3} name="adres" value={faturaForm.adres} onChange={faturaInputDegis} required={!faturaAyni} className={`${fieldClass} resize-none`} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={labelClass}>Şehir</label><input type="text" name="sehir" value={faturaForm.sehir} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                      <div><label className={labelClass}>İlçe</label><input type="text" name="ilce" value={faturaForm.ilce} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                    </div>
                  </div>
                )}

                <hr className="border-white/[0.06] mb-5" />
                <h3 className="text-sm font-semibold text-white mb-3">Ödeme yöntemi</h3>
                <OdemeYontemiKartlari />

                <div className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl mb-5 text-center">
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Siparişi onaylayarak{" "}
                    <button type="button" onClick={() => setAcikSozlesme("mesafeli")} className="text-site-accent hover:underline">Mesafeli Satış Sözleşmesi</button>
                    {" "}ve{" "}
                    <button type="button" onClick={() => setAcikSozlesme("gizlilik")} className="text-site-accent hover:underline">Gizlilik Politikası</button>
                    &apos;nı kabul edersiniz.
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button type="button" onClick={asamaGeri} className="flex-1 py-3.5 rounded-xl text-sm font-medium border border-white/10 text-slate-300 hover:bg-white/5 flex items-center justify-center gap-2 touch-manipulation">
                    <ChevronLeft className="w-4 h-4" /> Geri
                  </button>
                  <button type="button" onClick={asamaIleri} disabled={adresAraniyor} className={["flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 touch-manipulation", adresAraniyor ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "btn-primary"].join(" ")}>
                    {adresAraniyor ? "Kontrol ediliyor…" : <>Ödemeye geç <ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>

              <div className="hidden lg:block w-[320px] shrink-0 lg:sticky lg:top-28 h-fit">
                <SiparisOzetiKutusu />
              </div>
            </div>
          )}

          {/* ——— AŞAMA 3: Kart (İyzico) veya Havale ——— */}
          {asama === 3 && (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-5xl mx-auto">
              <div className="flex-1 min-w-0 glass-card p-4 sm:p-6 lg:p-8">
                <h3 className="text-sm font-semibold text-white mb-1">Ödeme</h3>
                <p className="text-slate-500 text-xs mb-4">Yöntemi değiştirebilirsiniz</p>
                <OdemeYontemiKartlari compact />

                {odemeYontemi === "kart" ? (
                  <>
                    <KayitliKartSecimi />
                    <div className="rounded-2xl border border-[#00d2ff]/20 bg-[#00d2ff]/[0.04] p-4 sm:p-5 mb-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/15 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5 text-[#00d2ff]" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold mb-1">Güvenli kart ödemesi</p>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {seciliKartId
                              ? "Kayıtlı kartınız hazır gelir; bankanız onay SMS’i gönderebilir."
                              : "Kart bilgileriniz İyzico güvenli ödeme ekranında alınır."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <HavaleDetayKarti />
                )}

                <div className="lg:hidden mb-5">
                  <SiparisOzetiKutusu />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button type="button" onClick={asamaGeri} className="flex-1 py-3.5 rounded-xl text-sm font-medium border border-white/10 text-slate-300 hover:bg-white/5 flex items-center justify-center gap-2 touch-manipulation">
                    <ChevronLeft className="w-4 h-4" /> Geri
                  </button>
                  <button
                    type="submit"
                    disabled={yukleniyor}
                    className={["flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 touch-manipulation", yukleniyor ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "btn-primary"].join(" ")}
                  >
                    {yukleniyor ? "İşleniyor…" : odemeYontemi === "kart" ? (
                      <><CreditCard className="w-4 h-4" /> {seciliKartId ? "Kayıtlı kart ile öde" : "Kart ile öde"}</>
                    ) : (
                      <><Banknote className="w-4 h-4" /> Havale siparişini onayla</>
                    )}
                  </button>
                </div>
              </div>

              <div className="hidden lg:block w-[320px] shrink-0 lg:sticky lg:top-28 h-fit">
                <SiparisOzetiKutusu />
              </div>
            </div>
          )}
        </form>
      </div>

   {acikSozlesme && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex flex-col bg-white w-full h-[100dvh] max-h-[100dvh]">
            <div className="flex items-center justify-center text-center p-4 sm:p-5 border-b border-gray-200 shrink-0 bg-white pt-[max(1rem,env(safe-area-inset-top))]">
              <h2 className="text-sm sm:text-base font-black text-black tracking-wide uppercase px-4">
                {acikSozlesme === "mesafeli" ? "Mesafeli Satış Sözleşmesi" : "Gizlilik ve KVKK Politikası"}
              </h2>
            </div>

            <div
              onScroll={sozlesmeKaydirmaRadari}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8 text-sm text-gray-700 space-y-6 leading-relaxed bg-zinc-50 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              {acikSozlesme === "mesafeli" ? (
                <>
                  <div>
                    <h3 className="text-black font-bold text-base mb-2">1.1. Satıcı Bilgileri</h3>
                    <p className="text-gray-600"><strong>Ünvanı:</strong> ÖZKAN BİLGİN </p>
                    <p className="text-gray-600"><strong>Merkez:</strong> İstanbul</p>
                    <p className="text-gray-600 text-xs italic mt-2 mb-2">* Bilgin PC Market, tüm Türkiye'ye hizmet veren e-ticaret odaklı bir teknoloji tedarikçisidir. Açık depo ve merkez adresimiz, güvenlik protokolleri gereği yalnızca sipariş sonrası tarafınıza iletilen resmi e-fatura üzerinde yer almaktadır.</p>
                    <p className="text-gray-600"><strong>E-posta:</strong> info@bilginpcmarket.com</p>
                  </div>

                  <div>
                    <h3 className="text-black font-bold text-base mb-2">1.2. Alıcı Bilgileri</h3>
                    <p className="text-gray-600">Siparişi veren, ödeme sayfasında bilgileri yer alan ve platform üzerinden alışveriş yapan tüketiciyi ifade eder.</p>
                  </div>

                  <div>
                    <h3 className="text-black font-bold text-base mb-2">2. Konu</h3>
                    <p className="text-gray-600">İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait Bilgin PC Market internet sitesinden elektronik ortamda siparişini yaptığı, sözleşmede ve ödeme sayfasında nitelikleri ile satış fiyatı belirtilen donanım ve elektronik ürünün/ürünlerin satışı ve teslimi ile ilgili olarak yasal mevzuat hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
                  </div>

                  <div>
                    <h3 className="text-black font-bold text-base mb-2">3. Teslimat Şartları</h3>
                    <p className="text-gray-600 mb-2">Ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler kısmında açıklanan süre zarfında ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.</p>
                    <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 p-3 rounded-xl mt-3">
                      <p className="text-[#3b82f6] text-xs sm:text-sm font-medium"><strong>Önemli Bilgi:</strong> ALICI, kargo paketini teslim alırken hasar kontrolü yapmakla ve koli üzerinde ezilme, yırtılma veya ıslanma gibi olağandışı bir durum tespit etmesi halinde ürünü teslim almayarak kargo yetkilisine tutanak tutturmakla yükümlüdür.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-black font-bold text-base mb-2">4. Cayma Hakkı ve İstisnaları</h3>
                    <p className="text-gray-600 mb-4">ALICI, satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir.</p>
                    
                    <h4 className="text-gray-900 font-bold text-sm mb-2 text-[#3b82f6]">Cayma Hakkının Kullanılamayacağı Durumlar</h4>
                    <p className="text-gray-600 mb-2">Bilgisayar donanımları yüksek hassasiyet içeren elektronik bileşenlerdir. Aşağıdaki durumlarda yasa gereği cayma hakkı kullanılamaz:</p>
                    <ul className="space-y-2 text-gray-600 pl-2">
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span>Ambalajı, güvenlik bandı, mührü, paketi gibi koruyucu unsurları açılmış olan elektronik aletler ve bilgisayar bileşenleri.</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span>İşlemci (CPU) ve Anakart gibi montajı yapıldıktan sonra "ikinci el" statüsüne düşen, statik elektrik riski taşıyan ürünler (Pinlerin montaj izi taşıması durumu).</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span>Termal macunu sürülmüş veya soğutucu montajı yapılmış bileşenler.</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span>Lisans gerektiren yazılımlar ve dijital aktivasyon kodları içeren ürünler.</span></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-black font-bold text-base mb-2">5. Uyuşmazlıkların Çözümü</h3>
                    <p className="text-gray-600">İşbu sözleşmenin uygulanmasında doğabilecek uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600">Bilgin PC Market olarak kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz. Dijital dünyadaki ayak izinizin güvende olması, yüksek performanslı sistemlerimiz kadar hassas olduğumuz bir konudur.</p>

                  <div className="mt-4">
                    <h3 className="text-black font-bold text-base mb-2">1. Veri Sorumlusu Kimliği</h3>
                    <p className="text-gray-600">6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Bilgin PC Market olarak, veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında; hukuka ve dürüstlük kurallarına uygun bir şekilde kaydedecek, saklayacak, güncelleyecek ve mevzuatın izin verdiği durumlarda üçüncü kişilere aktarabileceğiz.</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-black font-bold text-base mb-2">2. İşlenen Kişisel Verileriniz</h3>
                    <p className="text-gray-600 mb-2">Platformumuz üzerinden alışveriş yapmanız veya üye olmanız durumunda aşağıdaki verileriniz işlenmektedir:</p>
                    <ul className="space-y-2 text-gray-600 pl-2">
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span><strong>Kimlik ve İletişim Verileri:</strong> Ad, soyad, T.C. kimlik numarası (fatura kesimi için yasal zorunluluk), e-posta adresi, telefon numarası, fatura ve teslimat adresi.</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span><strong>İşlem Güvenliği Verileri:</strong> IP adresi bilgileri, site içi gezinme bilgileri, şifre ve parola bilgileri.</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span><strong>Finansal Veriler:</strong> Ödeme yöntemine ilişkin bilgiler (Kredi kartı bilgileriniz sistemlerimizde tutulmaz, doğrudan lisanslı ödeme kuruluşlarına 256-bit SSL ile şifrelenerek iletilir).</span></li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-black font-bold text-base mb-2">3. Verilerinizin İşlenme Amacı</h3>
                    <p className="text-gray-600">Toplanan kişisel verileriniz; sipariş süreçlerinin yürütülmesi, faturalandırma işlemlerinin yasal mevzuata uygun yapılması, kargo teslimatlarının gerçekleştirilmesi, satış sonrası teknik destek hizmetlerinin sağlanması, distribütör garanti süreçlerinin takibi ve yetkili kamu kurumlarına yasal bilgi verilmesi amaçlarıyla işlenmektedir.</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-black font-bold text-base mb-2">4. Verilerin Aktarımı (Kime ve Neden?)</h3>
                    <p className="text-gray-600 mb-2">Kişisel verileriniz, gizlilik sözleşmeleri ile güvence altına alınmış olmak şartıyla yalnızca işin gerektirdiği kurumlarla paylaşılır:</p>
                    <ul className="space-y-2 text-gray-600 pl-2 mb-4">
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span>Ürün teslimatı için sözleşmeli kargo firmalarıyla.</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span>Ödeme tahsilatı için BDDK lisanslı güvenli ödeme altyapısı sağlayıcılarıyla.</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#3b82f6] mt-0.5">▹</span> <span>Garanti süreçlerinin işletilebilmesi için resmi distribütörler ve yetkili teknik servislerle.</span></li>
                    </ul>
                    <p className="text-gray-600"><strong>Veri Güvenliği Taahhüdümüz:</strong> Bilgin PC Market altyapısı, uluslararası güvenlik standartlarına uygun olarak tasarlanmıştır. Sitemizde gerçekleşen tüm veri alışverişleri 256-bit şifreleme algoritmaları ve SSL sertifikaları ile korunmaktadır. Sunucularımız düzenli siber güvenlik testlerinden geçirilmekte ve yetkisiz erişimlere karşı kapalı tutulmaktadır.</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-black font-bold text-base mb-2">5. KVKK Kapsamındaki Haklarınız</h3>
                    <p className="text-gray-600">KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, verilerin düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Bu taleplerinizi <span className="text-[#3b82f6]">info@bilginpcmarket.com</span> adresi üzerinden bizimle iletişime geçerek iletebilirsiniz. Talepleriniz en geç 30 gün içerisinde ücretsiz olarak sonuçlandırılacaktır.</p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-gray-200 shrink-0 bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setAcikSozlesme(null)}
                disabled={!sozlesmeOkundu}
                className={`w-full max-w-lg mx-auto block py-3.5 text-sm font-bold tracking-wide rounded-xl transition-all duration-300 ${
                  sozlesmeOkundu
                    ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-[0_0_20px_rgba(59,130,246,0.25)] cursor-pointer"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {sozlesmeOkundu ? "Okudum, kapat" : "Onaylamak için metni aşağı kaydırın"}
              </button>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}
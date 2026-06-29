"use client";
import { ArrowLeft, CreditCard, Banknote, ShieldCheck, MapPin, Edit3, User, Phone, Mail, X } from "lucide-react";
import { useCart } from "../CartContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  temizleIyzicoKalintilari,
  temizleOdemeSayfasiKalintilari,
  enjekteIyzicoCheckoutForm,
  iyzicoFormuYuklendiMi,
} from "@/lib/iyzico-checkout";

const labelClass = "text-xs text-slate-400 font-medium block mb-1.5";
const fieldClass =
  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-site-accent/50 focus:bg-white/[0.05] transition-colors";

export default function OdemeSayfasi() {
  const { data: session, status } = useSession();
  const { sepet } = useCart();

  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string>("");
  const [iyzicoHazir, setIyzicoHazir] = useState(false);
  const iyzicoFormRef = useRef<HTMLDivElement>(null);
  const [ibanKopyalandi, setIbanKopyalandi] = useState(false);
  const [faturaAyni, setFaturaAyni] = useState(true);
  const [acikSozlesme, setAcikSozlesme] = useState<"mesafeli" | "gizlilik" | null>(null);

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
    return () => {
      temizleOdemeSayfasiKalintilari();
    };
  }, []);

  const iyzicoKapat = () => {
    temizleIyzicoKalintilari();
    setIyzicoHazir(false);
    setIyzicoFormHtml("");
  };

  useEffect(() => {
    if (iyzicoFormHtml) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [iyzicoFormHtml]);
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

  useEffect(() => {
    if (!iyzicoFormHtml) {
      setIyzicoHazir(false);
      return;
    }

    let observer: MutationObserver | null = null;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const kontrolHazir = () => {
      if (iyzicoFormuYuklendiMi()) setIyzicoHazir(true);
    };

    const baslat = () => {
      const el = iyzicoFormRef.current;
      if (!el) return false;

      setIyzicoHazir(false);
      enjekteIyzicoCheckoutForm(el, iyzicoFormHtml);

      timers = [100, 300, 600, 1200, 2000, 4000].map((ms) => setTimeout(kontrolHazir, ms));
      observer = new MutationObserver(kontrolHazir);
      observer.observe(el, { childList: true, subtree: true });

      return true;
    };

    if (!baslat()) {
      requestAnimationFrame(() => baslat());
    }

    return () => {
      timers.forEach(clearTimeout);
      observer?.disconnect();
      temizleIyzicoKalintilari();
    };
  }, [iyzicoFormHtml]);

  const siparisTamamla = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setIyzicoHazir(false);
    setIyzicoFormHtml("");

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
    try {
      const response = await fetch("/api/siparis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(siparisVerisi) });
      const data = await response.json();
      
      if (data.success) {
        if (data.odemeYontemi === "havale") {
          localStorage.removeItem("bilgin-sepet");
          window.location.href = "/siparis-basarili?kodu=" + data.siparisKodu;
        } else {
          setIyzicoFormHtml(data.checkoutFormContent);
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

  return (
    <div className="min-h-screen site-page pb-12 relative">
      {iyzicoFormHtml && (
        <div
          className="fixed inset-0 z-[150] bg-[#050814]/80 backdrop-blur-md"
          aria-hidden="true"
        />
      )}

      <div
        className={[
          "glass-panel border-b border-white/[0.06] sticky top-0 mb-6 sm:mb-8 rounded-none transition-opacity",
          iyzicoFormHtml ? "z-40 opacity-40 pointer-events-none" : "z-50",
        ].join(" ")}
      >
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

      <div
        className={[
          "site-container-narrow transition-opacity",
          iyzicoFormHtml ? "opacity-40 pointer-events-none" : "",
        ].join(" ")}
      >
        <h1 className="site-h2 mb-6">Güvenli ödeme</h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 min-w-0">
            <form
              onSubmit={siparisTamamla}
              className={["glass-card p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-all duration-300", iyzicoFormHtml ? "hidden" : "block"].join(" ")}
            >
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
                    <button
                      type="button"
                      onClick={() => setAdresKilitli(false)}
                      className="shrink-0 flex items-center gap-2 text-site-accent text-xs font-medium px-3 py-2 rounded-lg border border-white/[0.08] hover:border-site-accent/40 hover:bg-site-accent/5 transition-all"
                    >
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
                  <div>
                    <label className={labelClass}>Açık adres</label>
                    <textarea rows={3} name="adres" value={form.adres} onChange={inputDegis} required className={`${fieldClass} resize-none`} />
                  </div>
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
                  <div className="mb-3">
                    <label className={labelClass}>Açık adres</label>
                    <textarea rows={3} name="adres" value={faturaForm.adres} onChange={faturaInputDegis} required={!faturaAyni} className={`${fieldClass} resize-none`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>Şehir</label><input type="text" name="sehir" value={faturaForm.sehir} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                    <div><label className={labelClass}>İlçe</label><input type="text" name="ilce" value={faturaForm.ilce} onChange={faturaInputDegis} required={!faturaAyni} className={fieldClass} /></div>
                  </div>
                </div>
              )}

              <hr className="border-white/[0.06] mb-5" />

              <h3 className="text-sm font-semibold text-white mb-3">Ödeme yöntemi</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("kart"); }}
                  className={[
                    "py-3 px-2 sm:px-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px]",
                    odemeYontemi === "kart"
                      ? "bg-site-accent/10 text-site-accent border-site-accent/40"
                      : "bg-white/[0.03] text-slate-400 border-white/[0.08] hover:border-white/15",
                  ].join(" ")}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[11px] sm:text-xs font-medium text-center leading-tight">Kredi / Banka Kartı</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("havale"); }}
                  className={[
                    "py-3 px-2 sm:px-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 min-h-[72px]",
                    odemeYontemi === "havale"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                      : "bg-white/[0.03] text-slate-400 border-white/[0.08] hover:border-white/15",
                  ].join(" ")}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-[11px] sm:text-xs font-medium text-center leading-tight">Havale / EFT</span>
                </button>
              </div>

              {odemeYontemi === "havale" && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-sm mb-5 leading-relaxed">
                  <p className="text-emerald-400 font-medium mb-2">Havale talimatı</p>
                  <p className="text-slate-400 text-xs sm:text-sm mb-3">Açıklama alanına <span className="text-white font-medium">adınız ve soyadınızı</span> yazın.</p>
                  <div className="font-mono text-xs sm:text-sm bg-black/30 p-3 rounded-lg border border-white/[0.06] space-y-1.5">
                    <div><span className="text-slate-500">Banka:</span> <span className="text-slate-300">Yapı Kredi</span></div>
                    <div><span className="text-slate-500">Alıcı:</span> <span className="text-slate-300">Özkan BİLGİN</span></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
                      <div className="text-slate-300 break-all text-[11px] sm:text-xs">
                        <span className="text-slate-500">IBAN:</span> TR14 0006 7010 0000 0043 3005 49
                      </div>
                      <button
                        type="button"
                        onClick={ibanKopyala}
                        className={["text-xs font-medium px-3 py-1.5 rounded-lg transition-all shrink-0", ibanKopyalandi ? "bg-emerald-500 text-white" : "bg-site-accent text-white hover:bg-site-accent-hover"].join(" ")}
                      >
                        {ibanKopyalandi ? "Kopyalandı" : "Kopyala"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl mb-5 text-center">
                <p className="text-slate-400 text-xs leading-relaxed">
                  Siparişi onaylayarak{" "}
                  <span onClick={() => setAcikSozlesme("mesafeli")} className="text-site-accent hover:underline cursor-pointer">Mesafeli Satış Sözleşmesi</span>
                  {" "}ve{" "}
                  <span onClick={() => setAcikSozlesme("gizlilik")} className="text-site-accent hover:underline cursor-pointer">Gizlilik Politikası</span>
                  &apos;nı kabul edersiniz.
                </p>
              </div>

              <button
                type="submit"
                disabled={yukleniyor || adresAraniyor}
                className={["w-full py-3.5 rounded-xl text-sm font-medium transition-all", yukleniyor || adresAraniyor ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "btn-primary"].join(" ")}
              >
                {adresAraniyor ? "Bilgiler kontrol ediliyor…" : yukleniyor ? "İşleniyor…" : "Siparişi onayla"}
              </button>
            </form>
          </div>

         <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-28 h-fit space-y-4">
            <div className="glass-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-white mb-4 pb-3 border-b border-white/[0.06]">Sipariş özeti</h2>

                <div className="space-y-3 mb-5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                  {sepet.map((urun: any) => (
                    <div key={urun.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="w-14 h-14 shrink-0 bg-white/[0.03] rounded-lg border border-white/[0.06] flex items-center justify-center p-1">
                        <img
                          src={urun.resim || urun.image || "/placeholder.jpg"}
                          alt={urun.isim}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                        <span className="text-white text-xs font-medium leading-snug line-clamp-2">{urun.isim}</span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 text-[10px]">{urun.adet} adet</span>
                          <span className="text-site-accent font-semibold text-xs tabular-nums">
                            {(urun.fiyat * urun.adet).toLocaleString("tr-TR")} TL
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-400"><span>Ara toplam</span><span className="text-white font-medium tabular-nums">{araToplam.toLocaleString("tr-TR")} TL</span></div>
                  <div className="flex justify-between text-slate-400">
                    <span>Kargo</span>
                    <span>{kargo === 0 ? <span className="text-emerald-400 text-xs font-medium">Ücretsiz</span> : <span className="text-white font-medium tabular-nums">{kargo} TL</span>}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-white/[0.06] pt-4 mt-4">
                  <span className="text-sm text-slate-400">Genel toplam</span>
                  <span className="text-xl font-semibold text-site-accent tabular-nums">{genelToplam.toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-medium">TL</span></span>
                </div>
             </div>

     <div className={["glass-card p-4 sm:p-5 transition-all", iyzicoFormHtml ? "border-rose-500/20 opacity-80" : ""].join(" ")}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Edit3 className={["w-4 h-4", iyzicoFormHtml ? "text-slate-500" : "text-site-accent"].join(" ")} />
              <h3 className="text-sm font-semibold text-white">Sipariş notu</h3>
            </div>
            {iyzicoFormHtml && (
              <span className="text-rose-400 text-[10px] font-medium bg-rose-500/10 px-2 py-0.5 rounded">Kilitli</span>
            )}
          </div>
          <p className="text-slate-400 text-xs mb-3 leading-relaxed">
            {iyzicoFormHtml ? "Ödeme adımında not düzenlenemez." : "Kargocuya iletmek istediğiniz notu yazabilirsiniz (isteğe bağlı)."}
          </p>
          <textarea
            rows={3}
            name="siparisNotu"
            value={form.siparisNotu}
            onChange={inputDegis}
            disabled={iyzicoFormHtml !== ""}
            placeholder="Notunuz…"
            className={[`${fieldClass} resize-none`, iyzicoFormHtml ? "opacity-50 cursor-not-allowed" : ""].join(" ")}
          />
        </div>

          </div>
        </div>
      </div>

      {iyzicoFormHtml && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              iyzicoKapat();
            }}
            className="pointer-events-auto fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-[200] text-white text-sm font-semibold px-5 py-2.5 rounded-xl bg-rose-600 border border-rose-400 shadow-lg shadow-rose-900/40 hover:bg-rose-500 active:scale-95 transition-all"
          >
            Vazgeç
          </button>

          <div
            id="iyzico-panel"
            className="pointer-events-auto w-full max-w-2xl max-h-[min(90vh,820px)] glass-card border-site-accent/40 p-4 sm:p-6 overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,210,255,0.15)] animate-in zoom-in-95 duration-300"
          >
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/[0.06] shrink-0 relative z-[20]">
              <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Güvenli ödeme
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  iyzicoKapat();
                }}
                className="text-white text-xs font-semibold px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-400/40 hover:bg-rose-500/30 transition-colors relative z-[20]"
              >
                Vazgeç
              </button>
            </div>

            <div className="bg-white p-2 sm:p-4 rounded-2xl w-full flex-1 min-h-0 overflow-hidden iyzico-kutu relative z-0">
              {!iyzicoHazir && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 border-4 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin mb-3" />
                  <span className="text-slate-500 font-bold text-sm animate-pulse uppercase tracking-widest">İyzico Yükleniyor...</span>
                </div>
              )}
              <div
                ref={iyzicoFormRef}
                id="iyzipay-checkout-form"
                className="responsive w-full relative z-[1] min-h-[280px] h-full overflow-hidden"
              />
            </div>
          </div>
        </div>
      )}

   {acikSozlesme && (
        // 🚀 İŞTE O EFSANE TAŞ ZEMİN (ARKA PLANI DONDURAN VE BULANIKLAŞTIRAN KISIM)
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#050814]/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          
          {/* 📜 SÖZLEŞME KUTUSUNUN ANA ÇERÇEVESİ */}
          <div className="relative w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
       {/* 🚀 BAŞLIK KISMI (X BUTONU UÇURULDU - KAÇIŞ YOK!) 🚀 */}
            <div className="flex items-center justify-center text-center p-5 sm:p-6 border-b border-gray-100 shrink-0 bg-white rounded-t-2xl">
              <h2 className="text-base sm:text-lg font-black text-black tracking-widest uppercase">
                {acikSozlesme === "mesafeli" ? "Mesafeli Satış Sözleşmesi" : "Gizlilik ve KVKK Politikası"}
              </h2>
            </div>

          {/* 📜 AŞAĞI KAYDIRILABİLİR İÇERİK (LIGHT MODE SCROLL ALANI) 📜 */}
            <div 
              onScroll={sozlesmeKaydirmaRadari} 
              className="p-5 sm:p-6 overflow-y-auto text-sm text-gray-700 space-y-6 leading-relaxed [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full bg-zinc-50"
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

        {/* 🛑 BUTON KISMI (AKILLI KİLİT) 🛑 */}
            <div className="p-4 sm:p-5 border-t border-white/10 shrink-0 bg-[#0a0a0a] rounded-b-2xl">
              <button 
                onClick={() => setAcikSozlesme(null)} 
                disabled={!sozlesmeOkundu}
                className={`w-full py-3.5 text-sm font-black tracking-widest rounded-xl transition-all duration-300 ${
                  sozlesmeOkundu 
                    ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer" 
                    : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                }`}
              >
                {sozlesmeOkundu ? "OKUDUM, KAPAT" : "ONAYLAMAK İÇİN METNİ AŞAĞI KAYDIRIN"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* İŞTE EKSİK OLAN KAPAK BURASI ŞEFİM! */}
      
      </div>

  );
}
"use client";
import { ArrowLeft, CreditCard, Banknote, ShieldCheck, MapPin, Edit3, User, Phone, Mail, X, ShoppingCart } from "lucide-react";
import { useCart } from "../CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function OdemeSayfasi() {
  const { data: session, status } = useSession();
  const { sepet } = useCart();

  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string>("");
  const [ibanKopyalandi, setIbanKopyalandi] = useState(false);
  const [faturaAyni, setFaturaAyni] = useState(true);
  const [acikSozlesme, setAcikSozlesme] = useState<"mesafeli" | "gizlilik" | null>(null);

  const [adresAraniyor, setAdresAraniyor] = useState(true);
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
    if (status === "loading") {
      setAdresAraniyor(true);
      return;
    }

    const fetchKayitliAdresler = async () => {
      try {
        const res = await fetch("/api/addresses");
        if (res.ok) {
          const data = await res.json();
          const adresler = data.addresses || [];

          const varsayilanTeslimat = adresler.find((a: any) => a.isDefaultDelivery);
          if (varsayilanTeslimat) {
            const nameParts = varsayilanTeslimat.fullName.trim().split(" ");
            const soyad = nameParts.length > 1 ? nameParts.pop() : "";
            const ad = nameParts.join(" ");
            const sessionEmail = (session && session.user && session.user.email) ? session.user.email : "";
            const kesinEposta = varsayilanTeslimat.email || varsayilanTeslimat.eposta || sessionEmail;

         setForm({ ad: ad, soyad: soyad, telefon: varsayilanTeslimat.phone, sehir: varsayilanTeslimat.city, ilce: varsayilanTeslimat.district, adres: varsayilanTeslimat.fullAddress, eposta: kesinEposta, siparisNotu: "" });
            setAdresKilitli(true);
          }

          const varsayilanFatura = adresler.find((a: any) => a.isDefaultBilling);
          if (varsayilanFatura) {
            const nameParts = varsayilanFatura.fullName.trim().split(" ");
            const soyad = nameParts.length > 1 ? nameParts.pop() : "";
            const ad = nameParts.join(" ");
            const sessionEmail = (session && session.user && session.user.email) ? session.user.email : "";
            const faturaKesinEposta = varsayilanFatura.email || varsayilanFatura.eposta || sessionEmail;

            setFaturaForm({ ad: ad, soyad: soyad, telefon: varsayilanFatura.phone, sehir: varsayilanFatura.city, ilce: varsayilanFatura.district, adres: varsayilanFatura.fullAddress, eposta: faturaKesinEposta });

            if (varsayilanTeslimat && varsayilanFatura._id !== varsayilanTeslimat._id) {
              setFaturaAyni(false);
            }
          }
        }
      } catch (error) {} finally { setAdresAraniyor(false); }
    };

    if (status === "authenticated" && session) {
      fetchKayitliAdresler();
    } else {
      setAdresAraniyor(false);
    }
  }, [session, status]);

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
    if (iyzicoFormHtml) {
      const gonderilenScript = document.getElementById("iyzico-script");
      if (gonderilenScript) gonderilenScript.remove();

      const formKutusu = document.getElementById("iyzipay-checkout-form");
      if (formKutusu) {
        // 1. YENİ FORM YÜKLENMEDEN ÖNCE ESKİ KALINTILARI TEMİZLE
        formKutusu.innerHTML = ""; 
        const icerik = document.createRange().createContextualFragment(iyzicoFormHtml);
        formKutusu.appendChild(icerik);
      }

      setTimeout(() => {
        const panel = document.getElementById("iyzico-panel");
        if (panel) {
          const y = panel.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300);
    }

    // 2. KULLANICI SEPETE DÖNERSE VEYA ÇIKARSA İYZİCO'YU SIFIRLA (ÇÖZÜM BURADA)
    return () => {
      const formKutusu = document.getElementById("iyzipay-checkout-form");
      if (formKutusu) {
        formKutusu.innerHTML = "";
      }
    };
  }, [iyzicoFormHtml]);

  const siparisTamamla = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
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
      <div className="min-h-[80vh] bg-[#050814] text-white flex flex-col items-center justify-center px-4">
        <div className="bg-[#09090b] border border-white/5 rounded-3xl p-10 md:p-16 flex flex-col items-center max-w-lg w-full text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-wider text-white">Ödeme İçin Sepetinizde <span className="text-[#3b82f6]">Ürün Olmalı</span></h2>
          <Link href="/" className="bg-[#3b82f6] text-white font-black py-4 px-10 rounded-xl hover:bg-[#2563eb] transition-all uppercase tracking-wide mt-4">Alışverişe Başla</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-white pb-12 relative font-sans">
      <div className="border-b border-white/5 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50 shadow-lg mb-8">
   <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
  {/* Link yerine 'a' etiketi kullandık ki sayfa tam yenilensin ve İyzico sıfırlansın */}
  <a href="/sepet" className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-[#3b82f6] transition-colors uppercase tracking-wider"><ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Sepete Dön</span></a>
  <a href="/" className="font-black text-xl sm:text-2xl tracking-tight text-white hover:opacity-80 transition-opacity">BİLGİN <span className="text-[#3b82f6]">PC</span></a>
  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20"><ShieldCheck className="w-4 h-4" /> <span className="hidden sm:inline">Güvenli Ödeme</span></div>
</div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-6 border-l-4 border-[#3b82f6] pl-4">GÜVENLİ <span className="text-[#3b82f6]">ÖDEME</span></h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-2 w-full lg:w-2/3">
            <form onSubmit={siparisTamamla} className={["bg-[#09090b] border border-white/5 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300", iyzicoFormHtml ? "hidden" : "block"].join(" ")}>
              <h3 className="text-base sm:text-lg font-black text-white mb-5 flex items-center gap-2 uppercase tracking-wider"><span className="text-[#3b82f6]">📍</span> Teslimat Bilgileri</h3>

              {adresAraniyor ? (
                <div className="w-full bg-[#121215] border border-white/5 rounded-2xl p-5 animate-pulse mb-6"><div className="h-4 bg-white/10 w-1/3 rounded mb-4"></div><div className="h-10 bg-white/5 w-full rounded-xl mb-3"></div><div className="h-20 bg-white/5 w-full rounded-xl"></div></div>
              ) : adresKilitli ? (
                <div className="mb-6 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/5 to-transparent rounded-2xl border border-[#3b82f6]/30 pointer-events-none"></div>
                  <div className="bg-[#121215] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 shadow-inner">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base uppercase tracking-wider"><User className="w-4 h-4 text-[#3b82f6]" /> {form.ad} {form.soyad}</div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-slate-400 text-xs sm:text-sm"><span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {form.telefon}</span><span className="hidden sm:inline text-slate-600">|</span><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {form.eposta}</span></div>
                      <div className="flex items-start gap-1.5 text-slate-300 text-xs sm:text-sm mt-1.5 font-medium"><MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> <span>{form.adres}, <span className="text-white font-bold">{form.ilce} / {form.sehir}</span></span></div>
                    </div>
                    <button type="button" onClick={() => setAdresKilitli(false)} className="shrink-0 flex items-center gap-2 bg-[#09090b] border border-white/10 hover:border-[#3b82f6]/50 text-[#3b82f6] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"><Edit3 className="w-4 h-4" /> Düzenle</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Adınız *</label><input type="text" name="ad" value={form.ad} onChange={inputDegis} required className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Soyadınız *</label><input type="text" name="soyad" value={form.soyad} onChange={inputDegis} required className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Telefon *</label><input type="tel" name="telefon" value={form.telefon} onChange={inputDegis} required className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">E-Posta Adresi *</label><input type="email" name="eposta" value={form.eposta} onChange={inputDegis} required className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                  </div>
                 <div>
  <label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Açık Adres *</label>
  <textarea 
    rows={3} 
    name="adres" 
    value={form.adres} 
    onChange={inputDegis} 
    required 
    className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6] resize-none"
  ></textarea>
</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Şehir *</label><input type="text" name="sehir" value={form.sehir} onChange={inputDegis} required className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">İlçe *</label><input type="text" name="ilce" value={form.ilce} onChange={inputDegis} required className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                  </div>
                </div>
              )}

              {!adresKilitli && (
                <><hr className="border-white/5 mb-4" /><div className="flex items-center gap-2 mb-4"><input type="checkbox" id="faturaAyni" checked={faturaAyni} onChange={(e) => setFaturaAyni(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#3b82f6]" /><label htmlFor="faturaAyni" className="text-slate-300 text-xs sm:text-sm cursor-pointer font-bold">Fatura/Teslimat adresim aynıdır.</label></div></>
              )}

              {!faturaAyni && !adresKilitli && (
                <div className="bg-[#121215] border border-white/5 rounded-2xl p-4 sm:p-5 mb-5">
                  <h4 className="text-[#3b82f6] text-sm font-black uppercase tracking-wider mb-3">Farklı Fatura Bilgileri</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Adınız *</label><input type="text" name="ad" value={faturaForm.ad} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Soyadınız *</label><input type="text" name="soyad" value={faturaForm.soyad} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Telefon *</label><input type="tel" name="telefon" value={faturaForm.telefon} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">E-Posta *</label><input type="email" name="eposta" value={faturaForm.eposta} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                  </div>
              <div>
  <label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Açık Adres *</label>
  <textarea 
    rows={3} 
    name="adres" 
    value={form.adres} 
    onChange={inputDegis} 
    required 
    className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6] resize-none"
  ></textarea>
</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Şehir *</label><input type="text" name="sehir" value={faturaForm.sehir} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                    <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">İlçe *</label><input type="text" name="ilce" value={faturaForm.ilce} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]" /></div>
                  </div>
                </div>
              )}

              <hr className="border-white/5 mb-5" />

              <h3 className="text-base sm:text-lg font-black text-white mb-4 uppercase tracking-wider">Ödeme Yöntemi</h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
                <button type="button" onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("kart"); }} className={["flex-1 py-3 sm:py-4 rounded-xl font-black uppercase tracking-wider transition-all border flex flex-col items-center justify-center gap-1 sm:gap-1.5", odemeYontemi === "kart" ? "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]" : "bg-[#121215] text-slate-400 border-white/5"].join(" ")}><CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1" /> <span className="text-xs sm:text-sm">Kredi / Banka Kartı</span></button>
                <button type="button" onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("havale"); }} className={["flex-1 py-3 sm:py-4 rounded-xl font-black uppercase tracking-wider transition-all border flex flex-col items-center justify-center gap-1 sm:gap-1.5", odemeYontemi === "havale" ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]" : "bg-[#121215] text-slate-400 border-white/5"].join(" ")}><Banknote className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1" /> <span className="text-xs sm:text-sm">Havale / EFT</span></button>
              </div>

              {odemeYontemi === "havale" && (
                <div className="bg-[#121215] border border-[#10b981]/30 rounded-2xl p-4 sm:p-5 text-slate-400 text-xs sm:text-sm mb-5 leading-relaxed w-full">
                  <p className="text-[#10b981] font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">💡 Havale Ödeme Talimatı:</p>
                  <p className="text-slate-300 mb-2 font-medium">Açıklama alanına sadece <span className="text-[#3b82f6] font-bold underline">adınızı ve soyadınızı</span> yazınız.</p>
                  <div className="mt-3 border-t border-white/10 pt-3 font-mono flex flex-col gap-1.5 bg-black/40 p-3 sm:p-4 rounded-xl">
                    <div><strong>Banka:</strong> Yapı Kredi</div>
                    <div><strong>Alıcı:</strong> Özkan BİLGİN</div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-white/5">
                      <div className="break-all select-all"><strong>IBAN:</strong> <span className="text-white font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 ml-1">TR14 0006 7010 0000 0043 3005 49</span></div>
                      <button type="button" onClick={ibanKopyala} className={["text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0", ibanKopyalandi ? "bg-[#10b981] text-white" : "bg-[#3b82f6] text-white hover:bg-[#2563eb]"].join(" ")}>{ibanKopyalandi ? "✓ Kopyalandı" : "📋 Kopyala"}</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#121215] border border-slate-800 p-3 sm:p-4 rounded-xl mb-5 text-center">
                <p className="text-slate-400 text-[10px] sm:text-xs leading-snug">Siparişi onaylayarak <span onClick={() => setAcikSozlesme("mesafeli")} className="text-[#3b82f6] font-bold hover:underline cursor-pointer">Mesafeli Satış Sözleşmesi</span>'ni ve <span onClick={() => setAcikSozlesme("gizlilik")} className="text-[#3b82f6] font-bold hover:underline cursor-pointer">Gizlilik Politikası</span>'nı okuyup kabul etmiş sayılırsınız.</p>
              </div>

              <button type="submit" disabled={yukleniyor || adresAraniyor} className={["w-full font-black uppercase tracking-widest py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm transition-all", yukleniyor || adresAraniyor ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-[0_0_15px_rgba(59,130,246,0.3)]"].join(" ")}>
                {adresAraniyor ? "BİLGİLER KONTROL EDİLİYOR..." : yukleniyor ? "İŞLENİYOR..." : "SİPARİŞİ ONAYLA VE BİTİR"}
              </button>
            </form>

            {iyzicoFormHtml && (
              <div id="iyzico-panel" className="bg-[#09090b] border border-[#3b82f6]/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                   <h3 className="font-black text-white uppercase tracking-wider text-sm sm:text-base flex items-center gap-2">
                     <ShieldCheck className="w-5 h-5 text-emerald-400" /> Güvenli Ödeme Ekranı
                   </h3>
                   <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 bg-[#121215] rounded-lg border border-white/10 transition-colors">
                     Vazgeç / Kapat
                   </button>
                </div>
                
                <div className="bg-white p-2 sm:p-4 rounded-2xl w-full relative min-h-[350px] flex items-center justify-center">
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0 bg-slate-50 rounded-2xl">
                     <div className="w-10 h-10 border-4 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin mb-3"></div>
                     <span className="text-slate-500 font-bold text-sm animate-pulse uppercase tracking-widest">İyzico Yükleniyor...</span>
                  </div>
                  <div id="iyzipay-checkout-form" className="responsive w-full relative z-10"></div>
                </div>
              </div>
            )}
          </div>

         <div className="w-full lg:w-1/3 sticky top-28 h-fit">
            <div className="bg-[#09090b] border border-white/5 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl">
                <h2 className="font-black text-lg sm:text-xl mb-5 pb-3 border-b border-white/10 text-white uppercase tracking-wider">Sipariş <span className="text-[#3b82f6]">Özeti</span></h2>
                
                {/* 🚀 BİNGO: Liste boşluğu ve yüksekliği ayarlandı */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {sepet.map((urun: any) => (
                    /* 🚀 BİNGO: Kart yapısı dikey (flex-col) yapıldı, padding artırıldı */
                    <div key={urun.id} className="flex flex-col bg-[#121215] p-4 rounded-2xl border border-white/5 gap-3 shadow-sm animate-in fade-in duration-300 hover:border-[#3b82f6]/20 transition-colors">
                      
                      {/* 1. Üst Kısım: Büyük Resim Kutusu - Sepetteki gibi! */}
                      <div className="w-full h-36 sm:h-32 bg-[#09090b] rounded-xl border border-white/10 flex items-center justify-center p-2 shrink-0 shadow-inner">
                        <img
                          src={urun.resim || urun.image || "/placeholder.jpg"}
                          alt={urun.isim}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {/* 2. Orta Kısım: Başlık tam genişlik, yayılıyor */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-white text-[11px] sm:text-xs font-bold leading-snug break-words block w-full" title={urun.isim}>
                          {urun.isim}
                        </span>
                        {/* Opsiyonel: Varyasyon bilgisi varsa buraya eklenebilir */}
                      </div>
                      
                      {/* 3. Alt Kısım: Adet ve Fiyat Satırı */}
                      <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 mt-1">
                        <div className="flex items-center gap-1.5">
                          <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-400 text-xs font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5 tracking-wide">
                            {urun.adet} Adet
                          </span>
                        </div>
                        <div className="text-[#3b82f6] font-black text-xs sm:text-sm shrink-0 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                          {(urun.fiyat * urun.adet).toLocaleString("tr-TR")} TL
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-slate-400 mb-3 sm:mb-4 font-medium text-xs sm:text-sm"><span>Ara Toplam</span><span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span></div>
                <div className="flex justify-between text-slate-400 mb-5 sm:mb-6 font-medium text-xs sm:text-sm"><span>Kargo Ücreti</span><span>{kargo === 0 ? <span className="text-emerald-400 font-black uppercase tracking-wider text-[10px] sm:text-xs bg-emerald-400/10 px-2 py-1 rounded">Ücretsiz</span> : <span className="text-white font-bold">{kargo} TL</span>}</span></div>
                <div className="flex justify-between items-center text-white font-black border-t border-white/10 pt-5 sm:pt-6 mt-3 sm:mt-4"><span className="text-xs sm:text-sm uppercase tracking-wider text-slate-400">Genel Toplam</span><span className="text-xl sm:text-2xl lg:text-3xl text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{genelToplam.toLocaleString("tr-TR")} <span className="text-xs sm:text-sm text-white">TL</span></span></div>
             </div>
    {/* --- MODERN SİPARİŞ NOTU ALANI BAŞLANGIÇ --- */}
        <div className={["mt-6 mb-28 sm:mb-0 bg-[#09090b] border rounded-2xl p-5 shadow-lg transition-all duration-300", iyzicoFormHtml ? "border-[#ef4444]/30 opacity-70" : "border-white/5"].join(" ")}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Edit3 className={["w-4 h-4", iyzicoFormHtml ? "text-slate-500" : "text-[#3b82f6]"].join(" ")} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sipariş Notu</h3>
            </div>
            {iyzicoFormHtml && (
              <span className="text-[#ef4444] text-[10px] font-black uppercase tracking-widest bg-[#ef4444]/10 px-2 py-1 rounded animate-pulse">
                🔒 DÜZENLEMEYE KAPALI
              </span>
            )}
          </div>
          <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">
            {iyzicoFormHtml ? "Güvenli ödeme adımına geçildiği için bilgi girişi kilitlenmiştir." : "Kargocuya veya tarafımıza iletmek istediğiniz özel bir detay varsa buraya ekleyebilirsiniz (İsteğe Bağlı)."}
          </p>
          <textarea 
            rows={3} 
            name="siparisNotu" 
            value={form.siparisNotu} 
            onChange={inputDegis} 
            disabled={iyzicoFormHtml !== ""}
            placeholder={iyzicoFormHtml ? "Ödeme aşamasında form kilitlenir..." : ""}
            className={["w-full rounded-xl p-3 text-sm outline-none resize-none transition-all duration-300", iyzicoFormHtml ? "bg-[#121215]/50 border border-transparent text-slate-500 cursor-not-allowed" : "bg-[#121215] border border-white/10 text-white focus:border-[#3b82f6]"].join(" ")}
          ></textarea>
        </div>
        {/* --- MODERN SİPARİŞ NOTU ALANI BİTİŞ --- */}
          </div>
        </div>
      </div>

     {acikSozlesme && (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-2xl flex flex-col max-h-[85vh] shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
      
      {/* 🚀 BAŞLIK KISMI (LIGHT MODE) 🚀 */}
      <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 shrink-0 bg-white rounded-t-2xl">
        <h2 className="text-base sm:text-lg font-black text-black tracking-widest uppercase">
          {acikSozlesme === "mesafeli" ? "Mesafeli Satış Sözleşmesi" : "Gizlilik ve KVKK Politikası"}
        </h2>
        <button onClick={() => setAcikSozlesme(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* 📜 AŞAĞI KAYDIRILABİLİR İÇERİK (LIGHT MODE SCROLL ALANI) 📜 */}
      <div className="p-5 sm:p-6 overflow-y-auto text-sm text-gray-700 space-y-6 leading-relaxed [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full bg-zinc-50">
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
              <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/10 p-3 rounded-xl mt-3">
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

      {/* BUTON KISMI */}
      <div className="p-4 sm:p-5 border-t border-white/10 shrink-0 bg-[#0a0a0a] rounded-b-2xl">
        <button onClick={() => setAcikSozlesme(null)} className="w-full py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-black tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          OKUDUM, KAPAT
        </button>
      </div>

    </div>
  </div>
)}

  </div>
);
}
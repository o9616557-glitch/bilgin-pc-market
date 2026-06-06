"use client";
import { ArrowLeft, CreditCard, Banknote, ShieldCheck, MapPin, Edit3, User, Phone, Mail, X } from "lucide-react";
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

  const [form, setForm] = useState({ ad: "", soyad: "", telefon: "", eposta: "", adres: "", sehir: "", ilce: "" });
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

            setForm({ ad: ad, soyad: soyad, telefon: varsayilanTeslimat.phone, sehir: varsayilanTeslimat.city, ilce: varsayilanTeslimat.district, adres: varsayilanTeslimat.fullAddress, eposta: kesinEposta });
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

  // Orijinal sağlam İyzico motoru + 🚀 OTOMATİK KAYDIRMA (SCROLL)
  useEffect(() => {
    if (iyzicoFormHtml) {
      const gonderilenScript = document.getElementById("iyzico-script");
      if (gonderilenScript) gonderilenScript.remove();
      const icerik = document.createRange().createContextualFragment(iyzicoFormHtml);
      document.getElementById("iyzipay-checkout-form")?.appendChild(icerik);

      // 🚀 BİNGO: İyzico'yu tam hizasında, bir tık yukarıda durdurur (Üst menüyü ezmez)
      setTimeout(() => {
        const panel = document.getElementById("iyzico-panel");
        if (panel) {
          // -120 rakamı üstten bırakılacak boşluktur. Ekran tam kararında durur.
          const y = panel.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300);
    }
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
          <Link href="/sepet" replace className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-[#3b82f6] transition-colors uppercase tracking-wider"><ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Sepete Dön</span></Link>
          <Link href="/" className="font-black text-xl sm:text-2xl tracking-tight text-white hover:opacity-80 transition-opacity">BİLGİN <span className="text-[#3b82f6]">PC</span></Link>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20"><ShieldCheck className="w-4 h-4" /> <span className="hidden sm:inline">Güvenli Ödeme</span></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-6 border-l-4 border-[#3b82f6] pl-4">GÜVENLİ <span className="text-[#3b82f6]">ÖDEME</span></h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-2 w-full lg:w-2/3">
            
            <form onSubmit={siparisTamamla} className={iyzicoFormHtml ? "hidden" : "bg-[#09090b] border border-white/5 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden block"}>
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
                  <div><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Açık Adres *</label><textarea rows={3} name="adres" value={form.adres} onChange={inputDegis} required className="w-full bg-[#121215] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]"></textarea></div>
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
                  <div className="mb-3 sm:mb-4"><label className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">Açık Adres *</label><textarea rows={2} name="adres" value={faturaForm.adres} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#3b82f6]"></textarea></div>
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

            {/* 🚀 BİNGO: İYZİCO AÇILDIĞINDA EKRANI ORTALAYAN PANEL */}
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

          <div className="w-full lg:w-1/3">
             <div className="bg-[#09090b] border border-white/5 rounded-3xl p-5 sm:p-6 lg:p-8 sticky top-28 shadow-2xl">
                <h2 className="font-black text-lg sm:text-xl mb-5 pb-3 border-b border-white/10 text-white uppercase tracking-wider">Sipariş <span className="text-[#3b82f6]">Özeti</span></h2>
                
                <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                  {sepet.map((urun: any) => (
                    <div key={urun.id} className="flex items-center gap-3 bg-[#121215] p-2 sm:p-3 rounded-xl border border-white/5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#09090b] rounded-lg border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                        <img src={urun.resim || urun.image || "/placeholder.jpg"} alt={urun.isim} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                      <span className="text-white text-[10px] sm:text-xs font-bold leading-snug break-words" title={urun.isim}>{urun.isim}</span>
                        <span className="text-slate-400 text-[9px] sm:text-[10px]">{urun.adet} Adet</span>
                      </div>
                      <div className="text-[#3b82f6] font-black text-xs sm:text-sm shrink-0">
                        {(urun.fiyat * urun.adet).toLocaleString("tr-TR")} TL
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-slate-400 mb-3 sm:mb-4 font-medium text-xs sm:text-sm"><span>Ara Toplam</span><span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span></div>
                <div className="flex justify-between text-slate-400 mb-5 sm:mb-6 font-medium text-xs sm:text-sm"><span>Kargo Ücreti</span><span>{kargo === 0 ? <span className="text-emerald-400 font-black uppercase tracking-wider text-[10px] sm:text-xs bg-emerald-400/10 px-2 py-1 rounded">Ücretsiz</span> : <span className="text-white font-bold">{kargo} TL</span>}</span></div>
                <div className="flex justify-between items-center text-white font-black border-t border-white/10 pt-5 sm:pt-6 mt-3 sm:mt-4"><span className="text-xs sm:text-sm uppercase tracking-wider text-slate-400">Genel Toplam</span><span className="text-xl sm:text-2xl lg:text-3xl text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{genelToplam.toLocaleString("tr-TR")} <span className="text-xs sm:text-sm text-white">TL</span></span></div>
             </div>
          </div>
        </div>
      </div>

      {acikSozlesme && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#09090b] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-800 bg-[#121215]"><h3 className="text-white font-bold uppercase tracking-wider text-sm sm:text-base">{acikSozlesme === "mesafeli" ? "Mesafeli Satış Sözleşmesi" : "Gizlilik Politikası"}</h3><button onClick={() => setAcikSozlesme(null)} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button></div>
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 sm:space-y-4">
              {acikSozlesme === "mesafeli" ? (
                <><p><strong>Madde 1: Taraflar</strong><br/>Bu sözleşme, alıcı ve satıcı (Bilgin PC) arasında dijital ortamda kurulmuştur.</p><p><strong>Madde 2: Sözleşmenin Konusu</strong><br/>Alıcının sipariş ettiği bilgisayar ve donanım ürünlerinin satışı, teslimatı ve garanti şartlarıdır.</p><p><strong>Madde 3: İade ve İptal Şartları</strong><br/>Alıcı, ürün kendisine teslim edildikten sonra 14 gün içinde cayma hakkını kullanabilir (kutu açılmamış ve zarar görmemişse).</p></>
              ) : (
                <><p><strong>Veri Güvenliği:</strong><br/>Bilgin PC, müşteri bilgilerini (adres, e-posta, telefon) yalnızca siparişin teslimatı ve faturalandırma süreçleri için kullanır.</p><p><strong>Üçüncü Şahıslar:</strong><br/>Hiçbir kişisel veri, kargo firmaları haricinde 3. şahıslarla paylaşılmaz veya satılamaz.</p><p><strong>Ödeme Güvenliği:</strong><br/>Kredi kartı bilgileriniz sistemimizde saklanmaz. Ödemeler 256-bit SSL sertifikası ile doğrudan banka altyapısında gerçekleşir.</p></>
              )}
            </div>
            <div className="p-3 sm:p-4 border-t border-slate-800 bg-[#121215] flex justify-end"><button onClick={() => setAcikSozlesme(null)} className="bg-[#3b82f6] text-white font-bold px-5 sm:px-6 py-2 rounded-lg hover:bg-[#2563eb] transition-colors text-[10px] sm:text-xs uppercase tracking-wider">Okudum, Kapat</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
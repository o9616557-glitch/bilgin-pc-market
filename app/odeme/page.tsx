"use client";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
// 🚀 Çarpı (X) ikonunu içeri aldık
import { CreditCard, Banknote, X } from "lucide-react"; 

export default function OdemeSayfasi() {
  const { data: session } = useSession(); 
  const { sepet } = useCart();
  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string>("");
  const [ibanKopyalandi, setIbanKopyalandi] = useState(false); 
  const [faturaAyni, setFaturaAyni] = useState(true);
  
  // 🚀 BİNGO: POPUP (MODAL) MOTORU
  const [acikSozlesme, setAcikSozlesme] = useState<"mesafeli" | "gizlilik" | null>(null);

  const [form, setForm] = useState({
    ad: "", soyad: "", telefon: "", eposta: "", adres: "", sehir: "", ilce: ""
  });

  const [faturaForm, setFaturaForm] = useState({
    ad: "", soyad: "", telefon: "", adres: "", sehir: "", ilce: ""
  });

  useEffect(() => {
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
            setForm((prev: any) => ({
              ...prev, ad: ad, soyad: soyad, telefon: varsayilanTeslimat.phone, sehir: varsayilanTeslimat.city, ilce: varsayilanTeslimat.district, adres: varsayilanTeslimat.fullAddress,
            }));
          }

          const varsayilanFatura = adresler.find((a: any) => a.isDefaultBilling);
          if (varsayilanFatura) {
            const nameParts = varsayilanFatura.fullName.trim().split(" ");
            const soyad = nameParts.length > 1 ? nameParts.pop() : "";
            const ad = nameParts.join(" ");
            setFaturaForm({
              ad: ad, soyad: soyad, telefon: varsayilanFatura.phone, sehir: varsayilanFatura.city, ilce: varsayilanFatura.district, adres: varsayilanFatura.fullAddress,
            });
            setFaturaAyni(false); 
          }
        }
      } catch (error) {}
    };
    fetchKayitliAdresler();
  }, []);

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

    const hesaplananKargo = (hesaplananAraToplam > 5000 || hesaplananAraToplam === 0) ? 0 : 150;
    const hesaplananGenelToplam = hesaplananAraToplam + hesaplananKargo;

    return { araToplam: hesaplananAraToplam, kargo: hesaplananKargo, genelToplam: hesaplananGenelToplam };
  };

  const { araToplam, kargo, genelToplam } = hesaplaTutar();

  const inputDegis = (e: any) => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const faturaInputDegis = (e: any) => { setFaturaForm({ ...faturaForm, [e.target.name]: e.target.value }); };

  useEffect(() => {
    if (iyzicoFormHtml) {
      const gonderilenScript = document.getElementById("iyzico-script");
      if (gonderilenScript) gonderilenScript.remove();
      const icerik = document.createRange().createContextualFragment(iyzicoFormHtml);
      document.getElementById("iyzipay-checkout-form")?.appendChild(icerik);
    }
  }, [iyzicoFormHtml]);

  const siparisTamamla = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setIyzicoFormHtml("");

    const siparisVerisi = {
      musteri: {
        ...form,
        eposta: session?.user?.email || form.eposta,
        faturaBilgileri: faturaAyni ? form : faturaForm
      },
      sepet: sepet.map((item: any) => {
        const indirimOrani = (item.havaleIndirimi !== undefined && item.havaleIndirimi !== null) ? Number(item.havaleIndirimi) : 0;
        let sonFiyat = Number(item.fiyat);
        if (odemeYontemi === "havale" && indirimOrani > 0) {
          sonFiyat = sonFiyat - (sonFiyat * indirimOrani) / 100;
        }
        return { id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: sonFiyat, varyasyon: item.varyasyon };
      }),
      odemeYontemi,
      toplamTutar: genelToplam,
      totalPrice: genelToplam,
      genelToplam: genelToplam
    };

    try {
      const response = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siparisVerisi)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("bilgin-sepet");
        if (data.odemeYontemi === "havale") {
          window.location.href = "/siparis-basarili?kodu=" + data.siparisKodu;
        } else {
          setIyzicoFormHtml(data.checkoutFormContent);
        }
      } else {
        alert("Hata oluştu: " + data.error);
      }
    } catch (hata) {
      alert("Sistemsel bir hata meydana geldi.");
    } finally {
      setYukleniyor(false);
    }
  };

  if (sepet.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#050814] text-white flex flex-col items-center justify-center px-4">
        <div className="bg-[#09090b] border border-slate-800 rounded-3xl p-10 md:p-16 flex flex-col items-center max-w-lg w-full text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-wider text-white">
            Ödeme İçin Sepetinizde <span className="text-[#00e5ff]">Ürün Olmalı</span>
          </h2>
          <Link href="/" className="bg-[#00e5ff] text-black font-black py-4 px-10 rounded-xl hover:bg-[#00c4db] transition-all uppercase tracking-wide mt-4">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  const ibanKopyala = () => {
    navigator.clipboard.writeText("TR99 0001 0002 0003 0004 0005 06"); 
    setIbanKopyalandi(true);
    setTimeout(() => setIbanKopyalandi(false), 2000);
  };

 return (
   <div className="min-h-screen bg-[#050814] text-white pb-12 relative">
      
      {/* 🚀 MİNİMAL GÜVENLİ ÖDEME BARI */}
      {/* 🚀 MİNİMAL GÜVENLİ ÖDEME BARI (Ortalanmış Yeni Versiyon) */}
      <div className="border-b border-slate-800 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50 shadow-lg mb-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Sol: Sepete Dönüş Kapısı */}
          <Link href="/sepet" replace className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-[#00e5ff] transition-colors uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Sepete Dön</span>
          </Link>

          {/* Orta: Tıklanabilir Logo */}
          <Link href="/" className="font-black text-xl sm:text-2xl tracking-tight text-white hover:opacity-80 transition-opacity">
            BİLGİN <span className="text-[#00e5ff]">PC</span>
          </Link>

          {/* Sağ: Güvenlik Rozeti */}
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span>🔒</span> <span className="hidden sm:inline">Güvenli Ödeme</span>
          </div>
        </div>
      </div>

      {/* ANA İÇERİK BAŞLANGICI */}
      <div className="ana-konteynir" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        
       <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white drop-shadow-md mb-8 border-l-4 border-[#00e5ff] pl-4">
  KASA / <span className="text-[#00e5ff] font-black">ÖDEME</span>
</h1>

        <div className="odeme-konteynir" style={{ display: "flex", gap: "30px" }}>
          
          <div style={{ flex: "2", display: "flex", flexDirection: "column", gap: "20px" }}>
            <form onSubmit={siparisTamamla} className="bg-[#09090b] border border-slate-800/50 rounded-3xl p-6 sm:p-8">
              
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <span className="text-[#00e5ff]">📍</span> Teslimat Bilgileri
              </h3>
              <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Adınız *</label>
                  <input type="text" name="ad" value={form.ad} onChange={inputDegis} required className="w-full bg-[#121215] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Soyadınız *</label>
                  <input type="text" name="soyad" value={form.soyad} onChange={inputDegis} required className="w-full bg-[#121215] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                </div>
              </div>
              <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Telefon Numarası *</label>
                  <input type="tel" name="telefon" placeholder="05xx xxx xx xx" value={form.telefon} onChange={inputDegis} required className="w-full bg-[#121215] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">E-Posta Adresi *</label>
                  <input type="email" name="eposta" value={form.eposta} onChange={inputDegis} required className="w-full bg-[#121215] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                </div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label className="text-slate-400 text-sm block mb-1.5">Açık Adres *</label>
                <textarea rows={3} name="adres" value={form.adres} onChange={inputDegis} required placeholder="Mahalle, sokak, kapı numarası..." className="w-full bg-[#121215] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all"></textarea>
              </div>
              <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "25px" }}>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">Şehir *</label>
                  <input type="text" name="sehir" value={form.sehir} onChange={inputDegis} required className="w-full bg-[#121215] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm block mb-1.5">İlçe *</label>
                  <input type="text" name="ilce" value={form.ilce} onChange={inputDegis} required className="w-full bg-[#121215] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                </div>
              </div>

              <hr className="border-slate-800 mb-5" />

              <div className="flex items-center gap-2 mb-5">
                <input type="checkbox" id="faturaAyni" checked={faturaAyni} onChange={(e) => setFaturaAyni(e.target.checked)} className="w-5 h-5 cursor-pointer accent-[#00e5ff]" />
                <label htmlFor="faturaAyni" className="text-slate-400 text-sm cursor-pointer">Fatura/Teslimat adresim aynıdır.</label>
              </div>

              {!faturaAyni && (
                <div className="bg-[#121215] border border-slate-800 rounded-2xl p-5 mb-6">
                  <h4 className="text-[#00e5ff] font-bold mb-4">Farklı Adres Bilgileri</h4>
                  <div className="form-grid-2" style={{ display: "grid", gap: "15px", marginBottom: "15px" }}>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">Adınız *</label>
                      <input type="text" name="ad" value={faturaForm.ad} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">Soyadınız *</label>
                      <input type="text" name="soyad" value={faturaForm.soyad} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                    </div>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label className="text-slate-400 text-sm block mb-1.5">Telefon *</label>
                    <input type="tel" name="telefon" value={faturaForm.telefon} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label className="text-slate-400 text-sm block mb-1.5">Açık Adres *</label>
                    <textarea rows={2} name="adres" value={faturaForm.adres} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all"></textarea>
                  </div>
                  <div className="form-grid-2" style={{ display: "grid", gap: "15px" }}>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">Şehir *</label>
                      <input type="text" name="sehir" value={faturaForm.sehir} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm block mb-1.5">İlçe *</label>
                      <input type="text" name="ilce" value={faturaForm.ilce} onChange={faturaInputDegis} required={!faturaAyni} className="w-full bg-[#09090b] border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-[#00e5ff] transition-all" />
                    </div>
                  </div>
                </div>
              )}

              <hr className="border-slate-800 mb-6" />

              <h3 className="text-lg font-black text-white mb-4">Ödeme Yöntemi</h3>
              <div className="flex gap-4 mb-6">
                <button 
                  type="button" 
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("kart"); }} 
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all border flex flex-col items-center justify-center gap-1 ${odemeYontemi === "kart" ? "bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]" : "bg-[#121215] text-slate-400 border-slate-800 hover:border-slate-600"}`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  Kredi / Banka Kartı
                  <span className={`text-[10px] ${odemeYontemi === "kart" ? "text-white" : "text-slate-500"}`}>Tek Çekim veya Taksit</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("havale"); }} 
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all border flex flex-col items-center justify-center gap-1 ${odemeYontemi === "havale" ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]" : "bg-[#121215] text-slate-400 border-slate-800 hover:border-slate-600"}`}
                >
                  <Banknote className="w-5 h-5 mb-1" />
                  Havale / EFT
                  <span className={`text-[10px] ${odemeYontemi === "havale" ? "text-white" : "text-slate-500"}`}>Özel Nakit İndirimi</span>
                </button>
              </div>

              {odemeYontemi === "havale" && (
                <div className="bg-[#121215] border border-[#10b981]/30 rounded-2xl p-5 text-slate-400 text-sm mb-6 leading-relaxed w-full">
                  <p className="text-[#10b981] font-bold mb-3 flex items-center gap-1.5">💡 Havale / EFT Ödeme Talimatı:</p>
                  <div className="text-slate-300 mb-3 font-medium">
                    Lütfen transferi gerçekleştirirken açıklama alanına sadece <span className="text-[#00e5ff] font-bold underline">adınızı ve soyadınızı</span> yazınız.
                  </div>
                  <div className="mt-4 border-t border-slate-800/80 pt-3 font-mono text-xs sm:text-sm flex flex-col gap-1.5 bg-black/20 p-3 rounded-xl">
                    <div><strong>Banka:</strong> Akıllı Banka (Bilgin PC Özel)</div>
                    <div><strong>Alıcı:</strong> BİLGİN PC MARKET LTD. ŞTİ.</div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1 pt-1 border-t border-slate-800/40">
                      <div className="break-all select-all">
                        <strong>IBAN:</strong> <span className="text-white font-bold bg-slate-900 px-1 py-0.5 rounded border border-slate-800">TR99 0001 0002 0003 0004 0005 06</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={ibanKopyala}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 ${ibanKopyalandi ? "bg-[#10b981] text-white" : "bg-[#00e5ff] text-black hover:bg-[#00c4db]"}`}
                      >
                        {ibanKopyalandi ? "✓ Kopyalandı" : "📋 İBAN Kopyala"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 🚀 BİNGO: ARTIK LİNKLER BAŞKA SAYFAYA GİTMEZ, PENCERE (MODAL) AÇAR! */}
              <div className="bg-[#121215] border border-slate-800 p-4 rounded-xl mb-6 text-center">
                <p className="text-slate-400 text-xs sm:text-sm leading-snug">
                  Siparişi onaylayarak <span onClick={() => setAcikSozlesme("mesafeli")} className="text-[#00e5ff] hover:underline cursor-pointer">Mesafeli Satış Sözleşmesi</span>'ni ve <span onClick={() => setAcikSozlesme("gizlilik")} className="text-[#00e5ff] font-bold hover:underline cursor-pointer">Gizlilik Politikası</span>'nı okuyup kabul etmiş sayılırsınız.
                </p>
              </div>

             {!iyzicoFormHtml && (
  <>
    {/* 🚀 ZARİF TAKSİT BİLGİLENDİRME KUTUSU (SADECE KART SEÇİLİYSE GÖRÜNÜR) */}
    {odemeYontemi === "kart" && (
      <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-[#00e5ff]/5 border border-[#00e5ff]/20">
        <div className="text-[#00e5ff] mt-0.5 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
          <span className="text-white font-bold">9 ve 12 aya varan taksit ayrıcalığı!</span> Bankanıza ve kartınıza özel sunulan tüm taksit seçeneklerini, bir sonraki güvenli ödeme adımında görüntüleyebilir ve size en uygun planı seçebilirsiniz.
        </p>
      </div>
    )}

    {/* 🚀 ÖDEMEYE GEÇİŞ BUTONU (Senin Orijinal Butonun) */}
    <button
      type="submit"
      disabled={yukleniyor}
      className={`w-full font-black uppercase tracking-wider py-4 rounded-xl text-lg transition-all ${odemeYontemi === "havale" ? "bg-[#10b981] text-white hover:bg-[#0ea5e9]" : "bg-[#00e5ff] text-black hover:bg-[#00c4db] shadow-[0_0_15px_rgba(0,229,255,0.2)]"}`}
    >
      {yukleniyor ? "Lütfen Bekleyin..." : (odemeYontemi === "havale" ? "Havale İle Siparişi Onayla" : "Kart ile Ödemeye İlerle")}
    </button>
  </>
)}
            </form>

            <div style={{
              display: (odemeYontemi === "kart" && iyzicoFormHtml) ? "block" : "none",
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#ffffff", zIndex: 999999,
              overflowY: "auto", paddingTop: "50px" 
            }}>
              <button type="button" onClick={() => {
                setIyzicoFormHtml("");
                const kutu = document.getElementById("iyzipay-checkout-form");
                if (kutu) kutu.innerHTML = "";
                if (typeof window !== "undefined") { (window as any).iyziInit = undefined; }
              }} style={{ position: "fixed", top: "10px", right: "10px", background: "#f4f4f5", color: "#000", border: "2px solid #e4e4e7", borderRadius: "50%", width: "36px", height: "36px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2147483647 }}>X</button>
              
              <div id="iyzipay-checkout-form" className="w-full max-w-2xl mx-auto px-2 sm:px-4"></div>
            </div>

          </div>

          <div style={{ flex: "1" }} className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#09090b] border border-slate-800/50 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="font-black text-xl mb-6 pb-4 border-b border-slate-800 text-white uppercase tracking-wide">
                Sipariş <span className="text-[#00e5ff]">Özetiniz</span>
              </h2>

              <div style={{ maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", paddingRight: "5px" }}>
                {sepet.map((urun: any, index: number) => {
                  const indirimOrani = (urun.havaleIndirimi !== undefined && urun.havaleIndirimi !== null) ? Number(urun.havaleIndirimi) : 0;
                  let guncelFiyat = Number(urun.fiyat);
                  if (odemeYontemi === "havale" && indirimOrani > 0) {
                    guncelFiyat = guncelFiyat - (guncelFiyat * indirimOrani) / 100;
                  }

                  return (
                    <div key={index} className="bg-[#121215] border border-slate-800 p-2 rounded-xl flex items-center gap-3">
                      <img src={urun.resim} alt={urun.isim} className="w-12 h-12 object-cover rounded-lg bg-[#09090b]" />
                      <div style={{ flex: "1", minWidth: 0 }}>
                        <h4 className="text-white text-sm font-bold truncate">{urun.isim}</h4>
                        <p className="text-slate-400 text-[10px]">{urun.adet} Adet x {urun.varyasyon || "Standart"}</p>
                      </div>
                      <span className="text-white text-sm font-bold">{(guncelFiyat * urun.adet).toLocaleString()} TL</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-slate-400 mb-3 text-sm border-t border-slate-800 pt-4">
                <span>Ara Toplam</span>
                <span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span>
              </div>

              <div className="flex justify-between text-slate-400 mb-5 text-sm">
                <span>Kargo</span>
                <span>{kargo === 0 ? <span className="text-[#00e5ff] font-bold">BEDAVA</span> : <span className="text-white font-bold">{kargo} TL</span>}</span>
              </div>

              {odemeYontemi === "kart" ? (
                <>
                  <div className="border rounded-2xl p-4 mb-4 transition-all relative bg-[#121215] border-[#00e5ff]/50 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[#00e5ff]">
                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-black text-sm sm:text-base">Kredi Kartı Tek Çekim</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-right text-[#00e5ff]">
                        {genelToplam.toLocaleString("tr-TR")} TL
                      </div>
                    </div>
                  </div>
                
                </>
              ) : (
                <>
                  <div className="border rounded-2xl p-4 mb-4 transition-all relative overflow-hidden bg-[#10b981]/10 border-[#10b981]/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981] blur-[50px] opacity-20 pointer-events-none"></div>
                    <div className="flex flex-col gap-2 relative z-10">
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-black text-sm sm:text-base">Havale / EFT Toplam</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-right text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                        {genelToplam.toLocaleString("tr-TR")} TL
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* 🚀 BİNGO: POPUP PENCERELERİ (Ekranda Kalır, Sayfa Değişmez) */}
      {acikSozlesme && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#09090b] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative">
            
            {/* Üst Başlık ve Kapat Butonu */}
            <div className="flex justify-between items-center p-5 border-b border-slate-800 shrink-0">
              <h2 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                <span className="text-[#00e5ff]">📄</span> 
                {acikSozlesme === "mesafeli" ? "Mesafeli Satış Sözleşmesi" : "Gizlilik Politikası"}
              </h2>
              <button onClick={() => setAcikSozlesme(null)} className="text-slate-400 hover:text-white bg-[#121215] border border-slate-700 hover:bg-slate-800 p-2 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* İçerik Alanı (Kaydırılabilir) */}
            <div className="p-6 overflow-y-auto text-slate-300 text-sm leading-relaxed space-y-4">
              {acikSozlesme === "mesafeli" ? (
                <>
                  <h4 className="text-white font-bold mb-2">MADDE 1 - TARAFLAR</h4>
                  <p><strong>SATICI:</strong> BİLGİN PC MARKET LTD. ŞTİ. <br/><strong>ALICI:</strong> bilginpcmarket.com e-ticaret sitesinden sipariş veren kullanıcıdır.</p>
                  <h4 className="text-white font-bold mt-4 mb-2">MADDE 2 - TESLİMAT ŞARTLARI</h4>
                  <p>Siparişleriniz onaylandıktan sonra yasal 30 günlük süreyi aşmamak kaydıyla, belirttiğiniz teslimat adresine kargo firması aracılığıyla ulaştırılır.</p>
                  <h4 className="text-white font-bold mt-4 mb-2">MADDE 3 - CAYMA HAKKI</h4>
                  <p>Tüketici, ürünü teslim aldığı tarihten itibaren 14 (ondört) gün içinde herhangi bir gerekçe göstermeksizin sözleşmeden cayma hakkına sahiptir. Özel montaj yapılmış ürünlerde cayma hakkı geçersizdir.</p>
                </>
              ) : (
                <>
                  <h4 className="text-white font-bold mb-2">1. Toplanan Veriler</h4>
                  <p>Alışveriş deneyiminizi kusursuz hale getirmek için yalnızca ad, soyad, e-posta, teslimat adresi gibi temel verileri topluyoruz. Gereksiz hiçbir veri sistemlerimizde tutulmaz.</p>
                  <h4 className="text-white font-bold mt-4 mb-2">2. Ödeme Güvenliği</h4>
                  <p>Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz veya kaydedilmez. Tüm ödeme işlemleri İyzico altyapısı üzerinden 256-bit şifreleme ile gerçekleşir.</p>
                  <h4 className="text-white font-bold mt-4 mb-2">3. Üçüncü Kişilerle Paylaşım</h4>
                  <p>Müşteri verileriniz asla satılamaz, kiralanamaz veya ticari amaçla üçüncü şahıslarla paylaşılamaz. (Kargo firmaları gibi zorunlu teslimat ortakları hariçtir).</p>
                </>
              )}
            </div>

            {/* Alt Onay Butonu */}
            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0 bg-[#050814] rounded-b-2xl">
              <button onClick={() => setAcikSozlesme(null)} className="bg-[#00e5ff] text-black font-black px-6 py-2.5 rounded-xl hover:bg-[#00c4db] transition-all text-sm uppercase tracking-wider">
                Okudum, Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 992px) { .odeme-konteynir { flex-direction: column !important; } }
        @media (max-width: 550px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .ana-konteynir { padding: 10px !important; }
        }
      `}} />
    </div>
  );
}
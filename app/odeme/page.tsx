"use client";
import { useCart } from "../CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CreditCard, Banknote } from "lucide-react"; 

export default function OdemeSayfasi() {
  const { data: session } = useSession(); 
  const { sepet } = useCart();
  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string>("");
  const [ibanKopyalandi, setIbanKopyalandi] = useState(false); 
  const [faturaAyni, setFaturaAyni] = useState(true);

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
    <div className="min-h-screen bg-[#050814] text-white pb-12 pt-8 md:pt-12">
      <div className="ana-konteynir" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white drop-shadow-md mb-8 border-l-4 border-[#00e5ff] pl-4">
          KASA / <span className="text-[#00e5ff]">ÖDEME</span>
        </h1>

        <div className="odeme-konteynir" style={{ display: "flex", gap: "30px" }}>
          
          {/* ⬅️ SOL TARAF: FORM KUTUSU */}
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

              {/* --- ÖDEME YÖNTEMİ SEÇİMİ --- */}
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

              <div className="bg-[#121215] border border-slate-800 p-4 rounded-xl mb-6 text-center">
                <p className="text-slate-400 text-xs sm:text-sm leading-snug">
                  Siparişi onaylayarak <span className="text-[#00e5ff] cursor-pointer hover:underline">Ön Bilgilendirme Formu</span>'nu, <span className="text-[#00e5ff] cursor-pointer hover:underline">Mesafeli Satış Sözleşmesi</span>'ni ve <span className="text-[#00e5ff] cursor-pointer hover:underline font-bold">Gizlilik Sözleşmesi</span>'ni okuyup kabul etmiş sayılırsınız.
                </p>
              </div>

              {!iyzicoFormHtml && (
                <button 
                  type="submit" 
                  disabled={yukleniyor} 
                  className={`w-full font-black uppercase tracking-wider py-4 rounded-xl text-lg transition-all ${odemeYontemi === "havale" ? "bg-[#10b981] hover:bg-[#14532d] text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-[#00e5ff] hover:bg-[#00c4db] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]"}`}
                >
                  {yukleniyor ? "Bekleyin..." : (odemeYontemi === "havale" ? "Havale İle Siparişi Onayla" : "Kart İle Ödemeye İlerle")}
                </button>
              )}
            </form>

            {/* 🚀 İYZİCO BEYAZ EKRANI: TAMAMEN ZORLA YUKARI ÇEKİLDİ VE ESNEME KALDIRILDI */}
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
              
              {/* 🚀 İYZİCO FORMUNUN KENDİSİ (BOŞLUKSUZ) */}
              <div id="iyzipay-checkout-form" className="w-full max-w-2xl mx-auto px-2 sm:px-4"></div>
            </div>

          </div>

          {/* ➡️ SAĞ TARAF: SİPARİŞ ÖZETİ */}
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

                  <div className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-xl p-3 flex items-center justify-center gap-2 text-center text-[#00e5ff]">
                    <span className="text-lg">===</span>
                    <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase">3 - 6 - 9 - 12 Taksit Seçenekleri!</span>
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
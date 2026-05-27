"use client";
import { useCart } from "../CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function OdemeSayfasi() {
  const { data: session } = useSession(); // 🚀 ŞEFİN KİMLİĞİ
  const { sepet } = useCart();
  const [odemeYontemi, setOdemeYontemi] = useState("kart");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string>("");

  const [faturaAyni, setFaturaAyni] = useState(true);
  const [sozlesmeKabul, setSozlesmeKabul] = useState(false);

  const [form, setForm] = useState({
    ad: "", soyad: "", telefon: "", eposta: "", adres: "", sehir: "", ilce: ""
  });

  const [faturaForm, setFaturaForm] = useState({
    ad: "", soyad: "", telefon: "", adres: "", sehir: "", ilce: ""
  });
// 🚀 ŞEFİM: KASADA OTOMATİK ADRES DOLDURMA (JET MOTORU)
  useEffect(() => {
    const fetchKayitliAdresler = async () => {
      try {
        const res = await fetch("/api/addresses");
        if (res.ok) {
          const data = await res.json();
          const adresler = data.addresses || [];

          // 1. Varsa "Varsayılan Teslimat" adresini bul ve kutuları doldur!
          const varsayilanTeslimat = adresler.find((a: any) => a.isDefaultDelivery);
          if (varsayilanTeslimat) {
            // İsim ve Soyismi ayırıyoruz (Örn: "Özkan Bilgin" -> ad: "Özkan", soyad: "Bilgin")
            const nameParts = varsayilanTeslimat.fullName.trim().split(" ");
            const soyad = nameParts.length > 1 ? nameParts.pop() : "";
            const ad = nameParts.join(" ");

            setForm((prev: any) => ({
              ...prev,
              ad: ad,
              soyad: soyad,
              telefon: varsayilanTeslimat.phone,
              sehir: varsayilanTeslimat.city,
              ilce: varsayilanTeslimat.district,
              adres: varsayilanTeslimat.fullAddress,
            }));
          }

          // 2. Varsa "Varsayılan Fatura" adresini bul ve fatura kutularını doldur!
          const varsayilanFatura = adresler.find((a: any) => a.isDefaultBilling);
          if (varsayilanFatura) {
            const nameParts = varsayilanFatura.fullName.trim().split(" ");
            const soyad = nameParts.length > 1 ? nameParts.pop() : "";
            const ad = nameParts.join(" ");

            setFaturaForm({
              ad: ad,
              soyad: soyad,
              telefon: varsayilanFatura.phone,
              sehir: varsayilanFatura.city,
              ilce: varsayilanFatura.district,
              adres: varsayilanFatura.fullAddress,
            });
            
            // Fatura adresi farklıysa "Fatura Aynı" tikini otomatik kaldır ki müşteri görsün
            setFaturaAyni(false); 
          }
        }
      } catch (error) {
        console.error("Adresleri çekerken hata oluştu:", error);
      }
    };

    fetchKayitliAdresler();
  }, []);
  const araToplam = sepet.reduce((toplam: number, urun: any) => toplam + (urun.fiyat * urun.adet), 0);
  const kargo = araToplam > 5000 ? 0 : 150;
  const havaleIndirimi = araToplam * 0.05;
  const genelToplam = odemeYontemi === "havale" ? (araToplam - havaleIndirimi + kargo) : (araToplam + kargo);

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
    if (!sozlesmeKabul) {
      alert("Lütfen Mesafeli Satış Sözleşmesi ve KVKK metnini onaylayın.");
      return;
    }
    
    setYukleniyor(true);
    setIyzicoFormHtml("");

   // 🚀 ŞEFİM: APİ REDDETMESİN DİYE HEM ESKİ HEM YENİ TÜM KELİMELERİ BURAYA GÖMÜYORUZ!
    const siparisVerisi = {
      musteri: {
        ...form,
        eposta: session?.user?.email || form.eposta, // Şefin e-posta mührü
        faturaBilgileri: faturaAyni ? form : faturaForm
      },
      // Sepet kelimeleri (Hangisini isterse dükkan onun olsun)
      sepet: sepet.map((item: any) => ({ id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: item.fiyat, varyasyon: item.varyasyon })),
      cartItems: sepet.map((item: any) => ({ id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: item.fiyat, varyasyon: item.varyasyon })),
      items: sepet.map((item: any) => ({ id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: item.fiyat, varyasyon: item.varyasyon })),
      
      odemeYontemi,
      
      // Tutar kelimeleri (API ne ararsa burada bulacak)
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
      console.error(hata);
      alert("Sistemsel bir hata meydana geldi.");
    } finally {
      setYukleniyor(false);
    }
  };

  // ==========================================
  // 🛒 1. BÖLÜM: EĞER SEPET BOŞ İSE (MAT SİYAH)
  // ==========================================
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

 // 🧮 🚀 ŞEFİN DİNAMİK HAVALE HESAPLAMA MOTORU
  const toplamHavaleIndirimi = sepet.reduce((toplam: number, urun: any) => {
    const urunOrani = urun.havaleIndirimOrani !== undefined ? urun.havaleIndirimOrani : 5; // Üründe oran yoksa standart %5 al
    const urunToplamFiyat = urun.fiyat * urun.adet;
    return toplam + (urunToplamFiyat * urunOrani) / 100;
  }, 0);
  // Eğer ödeme yöntemi havale ise genel toplamdan bu dinamik indirimi düşüyoruz
  const odenecekSonTutar = odemeYontemi === "havale" ? (genelToplam - toplamHavaleIndirimi) : genelToplam;


  // ==========================================
  // 💳 2. BÖLÜM: ÖDEME FORMU VE SİPARİŞ ÖZETİ
  // ==========================================
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
                <label htmlFor="faturaAyni" className="text-slate-400 text-sm cursor-pointer">Fatura/Teslimat adresim yukarıdaki ile aynıdır.</label>
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
                    <label className="text-slate-400 text-sm block mb-1.5">Telefon Numarası *</label>
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

              {/* ÖDEME YÖNTEMİ SEÇİMİ */}
              <h3 className="text-lg font-black text-white mb-4">Ödeme Yöntemi</h3>
              <div className="flex gap-4 mb-6">
                <button 
                  type="button" 
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("kart"); }} 
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all border ${odemeYontemi === "kart" ? "bg-[#00e5ff] text-black border-[#00e5ff]" : "bg-[#121215] text-slate-400 border-slate-800 hover:border-slate-600"}`}
                >
                  Kredi / Banka Kartı
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("havale"); }} 
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all border ${odemeYontemi === "havale" ? "bg-[#00e5ff] text-black border-[#00e5ff]" : "bg-[#121215] text-slate-400 border-slate-800 hover:border-slate-600"}`}
                >
                  Havale / EFT
                </button>
              </div>

              {/* 🚀 KESİLEN YAZI DÜZELTİLDİ: HAVALE TALİMATLARI BİLGİ KUTUSU */}
              {odemeYontemi === "havale" && (
                <div className="bg-[#121215] border border-slate-800 rounded-2xl p-5 text-slate-400 text-sm mb-6 leading-relaxed w-full block clear-both overflow-hidden">
                  <p className="text-[#10b981] font-bold mb-3 flex items-center gap-1.5">💡 Havale / EFT Ödeme Talimatı:</p>
                  <div className="text-slate-300 mb-3 font-medium">
                    Lütfen transferi gerçekleştirirken açıklama alanına sadece <span className="text-[#00e5ff] font-bold underline">adınızı ve soyadınızı</span> yazınız. Siparişiniz kontrol edildikten sonra anında onaylanacaktır.
                  </div>
                  <div className="mt-4 border-t border-slate-800/80 pt-3 font-mono text-xs sm:text-sm flex flex-col gap-1.5 bg-black/20 p-3 rounded-xl">
                    <div><strong>Banka:</strong> Akıllı Banka (Bilgin PC Özel)</div>
                    <div><strong>Alıcı:</strong> BİLGİN PC MARKET LTD. ŞTİ.</div>
                    <div className="break-all select-all"><strong>IBAN:</strong> <span className="text-white font-bold bg-slate-900 px-1 py-0.5 rounded border border-slate-800">TR99 0001 0002 0003 0004 0005 06</span></div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 bg-[#121215] border border-slate-800 p-4 rounded-xl mb-6">
                <input type="checkbox" id="sozlesmeKabul" checked={sozlesmeKabul} onChange={(e) => setSozlesmeKabul(e.target.checked)} className="w-5 h-5 mt-0.5 cursor-pointer accent-[#00e5ff]" />
                <label htmlFor="sozlesmeKabul" className="text-slate-400 text-sm cursor-pointer leading-snug">
                  Ön Bilgilendirme Formu'nu, <span className="text-[#00e5ff] underline">Mesafeli Satış Sözleşmesi</span>'ni ve <span className="text-[#00e5ff] underline">KVKK Aydınlatma Metni</span>'ni okudum, onaylıyorum.
                </label>
              </div>

              {!iyzicoFormHtml && (
                <button 
                  type="submit" 
                  disabled={yukleniyor || !sozlesmeKabul} 
                  style={{ opacity: (yukleniyor || !sozlesmeKabul) ? 0.5 : 1 }}
                  className="w-full bg-[#00e5ff] hover:bg-[#00c4db] text-black font-black uppercase tracking-wider py-4 rounded-xl text-lg transition-all"
                >
                  {yukleniyor ? "Lütfen Bekleyin..." : (!sozlesmeKabul ? "Sözleşmeyi Onaylayın" : (odemeYontemi === "havale" ? "Siparişi Onayla" : "Kart Ödemesine İlerle"))}
                </button>
              )}
            </form>

            {/* IYZICO MODAL */}
            <div style={{
              display: (odemeYontemi === "kart" && iyzicoFormHtml) ? "flex" : "none",
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#ffffff", zIndex: 999999,
              flexDirection: "column", alignItems: "center", justifyContent: "flex-start", overflowY: "auto"
            }}>
              <button type="button" onClick={() => {
                setIyzicoFormHtml("");
                const kutu = document.getElementById("iyzipay-checkout-form");
                if (kutu) kutu.innerHTML = "";
                if (typeof window !== "undefined") { (window as any).iyziInit = undefined; }
              }} style={{ position: "fixed", top: "10px", right: "10px", background: "#f4f4f5", color: "#000", border: "2px solid #e4e4e7", borderRadius: "50%", width: "40px", height: "40px", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2147483647 }}>X</button>
              <div id="iyzipay-checkout-form" className="w-full max-w-2xl mt-16 p-4"></div>
            </div>

          </div>

          {/* ➡️ SAĞ TARAF: SİPARİŞ ÖZETI */}
          <div style={{ flex: "1" }} className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#09090b] border border-slate-800/50 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="font-black text-xl mb-6 pb-4 border-b border-slate-800 text-white uppercase tracking-wide">
                Sipariş <span className="text-[#00e5ff]">Özetiniz</span>
              </h2>

              <div style={{ maxHeight: "280px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {sepet.map((urun: any, index: number) => {
                  const indOrani = urun.havaleIndirimOrani !== undefined ? urun.havaleIndirimOrani : 5;
                  return (
                    <div key={index} className="bg-[#121215] border border-slate-800 p-2 rounded-xl flex items-center gap-3">
                      <img src={urun.resim} alt={urun.isim} className="w-11 h-11 object-cover rounded-lg bg-[#09090b]" />
                      <div style={{ flex: "1", minWidth: 0 }}>
                        <h4 className="text-white text-sm font-bold truncate">{urun.isim}</h4>
                        <p className="text-slate-400 text-xs">{urun.adet} Adet x {urun.varyasyon || "Standart"}</p>
                        {/* Havale yöntemi seçildiğinde hangi üründen yüzde kaç indirim düştüğünü ufakça fısıldar */}
                        {odemeYontemi === "havale" && (
                          <span className="text-[#10b981] text-[10px] font-bold bg-[#10b981]/10 px-1.5 py-0.5 rounded border border-[#10b981]/20 mt-0.5 inline-block">%{indOrani} Havale İndirimi</span>
                        )}
                      </div>
                      <span className="text-white text-sm font-bold">{(urun.fiyat * urun.adet).toLocaleString()} TL</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-slate-400 mb-3 text-sm border-t border-slate-800 pt-4">
                <span>Ara Toplam</span>
                <span className="text-white font-bold">{araToplam.toLocaleString("tr-TR")} TL</span>
              </div>

              <div className="flex justify-between text-slate-400 mb-3 text-sm">
                <span>Kargo</span>
                <span>{kargo === 0 ? <span className="text-[#00e5ff] font-bold">BEDAVA</span> : <span className="text-white font-bold">{kargo} TL</span>}</span>
              </div>

              {/* 🚀 DİNAMİK YAZILAN YER: Toplam indirim tutarı artık sabit değil, sepetin içindeki oranların toplamı! */}
              {odemeYontemi === "havale" && (
                <div className="flex justify-between text-[#10b981] mb-3 text-sm font-bold bg-[#10b981]/5 p-2 rounded-lg border border-[#10b981]/10">
                  <span>Havale İndirimi</span>
                  <span>-{toplamHavaleIndirimi.toLocaleString("tr-TR")} TL</span>
                </div>
              )}

              <div className="flex justify-between items-center text-white font-black border-t border-slate-800 pt-5 mt-2">
                <span className="text-lg">ÖDENECEK TUTAR</span>
                <span className="text-2xl text-[#00e5ff]">
                  {odenecekSonTutar.toLocaleString("tr-TR")} <span className="text-sm text-slate-400 font-bold">TL</span>
                </span>
              </div>
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
} // 🚀 İŞTE EKSİK OLAN VE HATAYI ÇÖZECEK ANAHTAR BU!
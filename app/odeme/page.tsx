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

   const siparisVerisi = {
      musteri: {
        ...form,
        eposta: session?.user?.email || form.eposta, // 🚀 İŞTE SİHRİN KOPTUĞU YER! MÜHÜR VURULDU.
        faturaBilgileri: faturaAyni ? form : faturaForm
      }, // 🚀 ŞEFİM İŞTE HAYAT KURTARAN VİRGÜL BURADA!
      sepet: sepet.map((item: any) => ({ id: item.id, isim: item.isim, miktar: item.adet, adet: item.adet, fiyat: item.fiyat, varyasyon: item.varyasyon })),
      odemeYontemi,
      toplamTutar: genelToplam
    };

    try {
      const response = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siparisVerisi)
      });

      const data = await response.json();

      if (data.success) {
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

  if (sepet.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", marginBottom: "20px" }}>Ödeme İçin Sepetinizde Ürün Olmalı</h2>
        <Link href="/" style={{ background: "#00e5ff", color: "#000", padding: "15px 40px", borderRadius: "12px", fontWeight: "900", textDecoration: "none" }}>Alışverişe Başla</Link>
      </div>
    );
  }

  return (
    <div className="ana-konteynir" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", marginBottom: "30px", borderLeft: "6px solid #00e5ff", paddingLeft: "15px", marginTop: "20px" }}>
        KASA / <span style={{ color: "#00e5ff" }}>ÖDEME</span>
      </h1>

      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }} className="odeme-konteynir">
        
        <div style={{ flex: "2", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <form onSubmit={siparisTamamla} className="form-kutu" style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
            
            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>📍</span> Teslimat Bilgileri
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }} className="form-grid-2">
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Adınız *</label>
                <input type="text" name="ad" value={form.ad} onChange={inputDegis} required style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Soyadınız *</label>
                <input type="text" name="soyad" value={form.soyad} onChange={inputDegis} required style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }} className="form-grid-2">
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Telefon Numarası *</label>
                <input type="tel" name="telefon" placeholder="05xx xxx xx xx" value={form.telefon} onChange={inputDegis} required style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>E-Posta Adresi *</label>
                <input type="email" name="eposta" value={form.eposta} onChange={inputDegis} required style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Açık Adres *</label>
              <textarea rows={3} name="adres" value={form.adres} onChange={inputDegis} required placeholder="Mahalle, sokak, kapı numarası, daire..." style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none", resize: "none" }}></textarea>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }} className="form-grid-2">
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Şehir *</label>
                <input type="text" name="sehir" value={form.sehir} onChange={inputDegis} required style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>İlçe *</label>
                <input type="text" name="ilce" value={form.ilce} onChange={inputDegis} required style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
              </div>
            </div>

            <hr style={{ borderColor: "#27272a", marginBottom: "20px" }} />

            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <input 
                type="checkbox" 
                id="faturaAyni" 
                checked={faturaAyni} 
                onChange={(e) => setFaturaAyni(e.target.checked)} 
                style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#00e5ff" }} 
              />
              <label htmlFor="faturaAyni" style={{ color: "#d4d4d8", cursor: "pointer", fontSize: "0.95rem" }}>Fatura/Teslimat adresim yukarıdaki ile aynıdır.</label>
            </div>

            {!faturaAyni && (
              <div className="form-kutu" style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: "12px", padding: "20px", marginBottom: "25px" }}>
                <h4 style={{ color: "#00e5ff", marginBottom: "15px", fontSize: "1rem" }}>Farklı Adres Bilgileri</h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }} className="form-grid-2">
                  <div>
                    <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Adınız *</label>
                    <input type="text" name="ad" value={faturaForm.ad} onChange={faturaInputDegis} required={!faturaAyni} style={{ width: "100%", background: "#121214", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Soyadınız *</label>
                    <input type="text" name="soyad" value={faturaForm.soyad} onChange={faturaInputDegis} required={!faturaAyni} style={{ width: "100%", background: "#121214", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Telefon Numarası *</label>
                  <input type="tel" name="telefon" value={faturaForm.telefon} onChange={faturaInputDegis} required={!faturaAyni} style={{ width: "100%", background: "#121214", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Açık Adres *</label>
                  <textarea rows={2} name="adres" value={faturaForm.adres} onChange={faturaInputDegis} required={!faturaAyni} style={{ width: "100%", background: "#121214", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none", resize: "none" }}></textarea>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }} className="form-grid-2">
                  <div>
                    <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Şehir *</label>
                    <input type="text" name="sehir" value={faturaForm.sehir} onChange={faturaInputDegis} required={!faturaAyni} style={{ width: "100%", background: "#121214", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ color: "#a1a1aa", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>İlçe *</label>
                    <input type="text" name="ilce" value={faturaForm.ilce} onChange={faturaInputDegis} required={!faturaAyni} style={{ width: "100%", background: "#121214", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none" }} />
                  </div>
                </div>
              </div>
            )}

            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>💳</span> Ödeme Yöntemi
            </h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
              <button type="button" onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("kart"); }} style={{ flex: 1, padding: "14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", background: odemeYontemi === "kart" ? "rgba(0, 229, 255, 0.1)" : "#09090b", color: odemeYontemi === "kart" ? "#00e5ff" : "#a1a1aa", border: odemeYontemi === "kart" ? "1px solid #00e5ff" : "1px solid #27272a" }}>Kredi / Banka Kartı</button>
              <button type="button" onClick={() => { setIyzicoFormHtml(""); setOdemeYontemi("havale"); }} style={{ flex: 1, padding: "14px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", background: odemeYontemi === "havale" ? "rgba(16, 185, 129, 0.1)" : "#09090b", color: odemeYontemi === "havale" ? "#10b981" : "#a1a1aa", border: odemeYontemi === "havale" ? "1px solid #10b981" : "1px solid #27272a" }}>Havale / EFT (%5 İndirimli)</button>
            </div>

            {odemeYontemi === "havale" && (
              <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: "12px", padding: "16px", color: "#d4d4d8", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "20px" }}>
                <p style={{ color: "#10b981", fontWeight: "700", marginBottom: "10px" }} >💡 Havale Ödeme Talimatı:</p>
                Açıklama kısmına adınızı yazarak IBAN hesabımıza gönderim yapabilirsiniz:
                <div style={{ marginTop: "15px", borderTop: "1px solid #27272a", paddingTop: "12px", fontFamily: "monospace" }}>
                  <strong>Banka:</strong> Bilgin PC Akıllı Banka<br />
                  <strong>Alıcı:</strong> BİLGİN PC MARKET LTD. ŞTİ.<br />
                  <strong>IBAN:</strong> TR99 0001 0002 0003 0004 0005 06
                </div>
              </div>
            )}

            <div style={{ marginBottom: "25px", display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(0, 229, 255, 0.05)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(0, 229, 255, 0.2)" }}>
              <input 
                type="checkbox" 
                id="sozlesmeKabul" 
                checked={sozlesmeKabul} 
                onChange={(e) => setSozlesmeKabul(e.target.checked)} 
                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#00e5ff", marginTop: "2px" }} 
              />
              <label htmlFor="sozlesmeKabul" style={{ color: "#d4d4d8", cursor: "pointer", fontSize: "0.85rem", lineHeight: "1.5" }}>
                Ön Bilgilendirme Formu'nu, <span style={{ color: "#00e5ff", textDecoration: "underline" }}>Mesafeli Satış Sözleşmesi</span>'ni ve <span style={{ color: "#00e5ff", textDecoration: "underline" }}>KVKK Aydınlatma Metni</span>'ni okudum, anladım ve onaylıyorum.
              </label>
            </div>

            {!iyzicoFormHtml && (
              <button 
                type="submit" 
                disabled={yukleniyor || !sozlesmeKabul} 
                style={{ 
                  width: "100%", padding: "16px", color: "#000", border: "none", borderRadius: "12px", fontWeight: "900", fontSize: "1.05rem", 
                  cursor: (yukleniyor || !sozlesmeKabul) ? "not-allowed" : "pointer", 
                  background: odemeYontemi === "havale" ? "linear-gradient(45deg, #10b981, #059669)" : "linear-gradient(45deg, #00e5ff, #007acc)",
                  opacity: (yukleniyor || !sozlesmeKabul) ? 0.5 : 1
                }}>
                {yukleniyor ? "Lütfen Bekleyin..." : (!sozlesmeKabul ? "Sözleşmeyi Onaylayın" : (odemeYontemi === "havale" ? "Siparişi Onayla" : "Kart Ödemesine İlerle"))}
              </button>
            )}
          </form>

          {/* ŞEFİM: BEYAZ EKRAN ÜST BOŞLUĞU SIFIRLANDI VE X BUTONU İÇERİ/ÜSTE ALINDI */}
          <div style={{ 
            display: (odemeYontemi === "kart" && iyzicoFormHtml) ? "flex" : "none", 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            background: "#ffffff", 
            zIndex: 999999, 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "flex-start", // En tepeden başlatır
            overflowY: "auto"
          }}>
            {/* X Butonu tam sağ üst köşede, formun üzerine denk gelecek şekilde! */}
            <button 
              type="button"
              onClick={() => {
                setIyzicoFormHtml("");
                const kutu = document.getElementById("iyzipay-checkout-form");
                if (kutu) kutu.innerHTML = "";
                if (typeof window !== "undefined") {
                  (window as any).iyziInit = undefined;
                }
              }} 
              style={{ 
                position: "fixed", 
                top: "10px", // Yukarıya sıfırlandı
                right: "10px", // Sağa iyice yanaştı
                background: "#f4f4f5", 
                color: "#000", 
                border: "2px solid #e4e4e7", 
                borderRadius: "50%", 
                width: "40px", 
                height: "40px", 
                fontSize: "1.2rem", 
                cursor: "pointer", 
                fontWeight: "bold", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)", 
                zIndex: 2147483647 // Her şeyin ama her şeyin üzerinde durur
              }}>
              ✕
            </button>
            
            <div style={{ width: "100%", maxWidth: "600px", background: "#ffffff", padding: "0" }}>
              <div id="iyzipay-checkout-form" className="responsive"></div>
            </div>
          </div>

        </div>

        {/* SAĞ PANEL: SİPARİŞ ÖZETİ */}
        <div style={{ flex: "1" }}>
          <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "20px", padding: "24px", position: "sticky", top: "100px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: "800", marginBottom: "20px" }}>Sipariş Özetiniz</h2>
            
            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {sepet.map((urun: any, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <img src={urun.resim} alt={urun.isim} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px" }} />
                  <div style={{ flex: "1", minWidth: 0 }}>
                    <h4 style={{ color: "#fff", fontSize: "0.85rem", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{urun.isim}</h4>
                    <p style={{ color: "#a1a1aa", fontSize: "0.75rem" }}>{urun.adet} Adet x {urun.varyasyon || "Standart"}</p>
                  </div>
                  <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: "700" }}>{(urun.fiyat * urun.adet).toLocaleString()} TL</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #27272a", paddingTop: "15px", display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#a1a1aa", fontSize: "0.9rem" }}>
              <span>Ara Toplam</span> <span style={{ color: "#fff" }}>{araToplam.toLocaleString()} TL</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#a1a1aa", fontSize: "0.9rem" }}>
              <span>Kargo</span> <span style={{ color: kargo === 0 ? "#10b981" : "#fff" }}>{kargo === 0 ? "BEDAVA" : kargo + " TL"}</span>
            </div>
            {odemeYontemi === "havale" && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#10b981", fontSize: "0.9rem", fontWeight: "700" }}>
                <span>%5 Havale İndirimi</span> <span>-{havaleIndirimi.toLocaleString()} TL</span>
              </div>
            )}
            <div style={{ borderTop: "1px solid #27272a", paddingTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ color: "#fff", fontWeight: "600" }}>ÖDENECEK TUTAR</span>
                <span style={{ color: odemeYontemi === "havale" ? "#10b981" : "#00e5ff", fontSize: "1.8rem", fontWeight: "900" }}>{genelToplam.toLocaleString()} TL</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ŞEFİM: MOBİLDE BOŞLUKLARI SİLEN SİHİRLİ KODLAR BURADA EKLENDİ! */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 992px) { .odeme-konteynir { flex-direction: column !important; } }
        @media (max-width: 550px) { 
          .form-grid-2 { grid-template-columns: 1fr !important; } 
          .ana-konteynir { padding: 10px !important; }
          .form-kutu { padding: 15px !important; }
        }
      `}} />
    </div>
  );
}
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TakipIcerik() {
  const searchParams = useSearchParams();
  const defaultKodu = searchParams?.get("kodu") || "";

  const [siparisKodu, setSiparisKodu] = useState(defaultKodu);
  const [sonuc, setSonuc] = useState<any>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  // Müşteri "Siparişimi Takip Et" butonuna basıp geldiyse otomatik aramayı başlatır
  useEffect(() => {
    if (defaultKodu) {
      sorgula(defaultKodu);
    }
  }, [defaultKodu]);

  const sorgula = async (koduToSearch: string) => {
    if (!koduToSearch) return;
    setYukleniyor(true);
    setHata("");
    setSonuc(null);

    try {
      const res = await fetch("/api/siparis-takip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siparisKodu: koduToSearch.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setSonuc(data.siparis);
      } else {
        setHata(data.error);
      }
    } catch (err) {
      setHata("Sistemsel bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  const handleSorgula = (e: React.FormEvent) => {
    e.preventDefault();
    sorgula(siparisKodu);
  };

  // Siparişin durumuna göre renklendirme yapan ufak bir motor
  const durumRengi = (durum: string) => {
    if (durum.includes("Ödendi") || durum.includes("Başarılı")) return "#10b981"; // Yeşil
    if (durum.includes("Bekliyor")) return "#f59e0b"; // Turuncu
    if (durum.includes("Kargo")) return "#00e5ff"; // Mavi (Neon)
    if (durum.includes("İptal")) return "#ef4444"; // Kırmızı
    return "#a1a1aa"; // Gri
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", minHeight: "70vh" }}>
      <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", marginBottom: "30px", borderLeft: "6px solid #00e5ff", paddingLeft: "15px" }}>
        SİPARİŞ <span style={{ color: "#00e5ff" }}>TAKİP</span>
      </h1>

      <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px", marginBottom: "30px" }}>
        <form onSubmit={handleSorgula} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={siparisKodu}
            onChange={(e) => setSiparisKodu(e.target.value)}
            placeholder="Sipariş Kodunuzu Girin (Örn: BPC-123456)"
            required
            style={{ flex: "1", minWidth: "250px", background: "#09090b", border: "1px solid #27272a", borderRadius: "10px", padding: "15px", color: "#fff", outline: "none", fontSize: "1rem", letterSpacing: "1px" }}
          />
          <button
            type="submit"
            disabled={yukleniyor}
            style={{ background: "#00e5ff", color: "#000", border: "none", borderRadius: "10px", padding: "0 30px", fontWeight: "900", cursor: yukleniyor ? "not-allowed" : "pointer", fontSize: "1rem", height: "54px", transition: "all 0.2s" }}
          >
            {yukleniyor ? "Aranıyor..." : "Sorgula"}
          </button>
        </form>
        {hata && <div style={{ color: "#ef4444", marginTop: "15px", fontWeight: "700" }}>❌ {hata}</div>}
      </div>

      {sonuc && (
        <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "24px", animation: "fadeIn 0.5s" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a", paddingBottom: "20px", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800", marginBottom: "5px" }}>{sonuc.siparisKodu}</h2>
              <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>Tarih: {new Date(sonuc.tarih).toLocaleDateString("tr-TR")} - {new Date(sonuc.tarih).toLocaleTimeString("tr-TR")}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px 20px", borderRadius: "10px", border: `1px solid ${durumRengi(sonuc.durum)}` }}>
              <span style={{ color: durumRengi(sonuc.durum), fontWeight: "900", fontSize: "1.1rem" }}>{sonuc.durum}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }} className="form-grid-2">
            <div>
              <h3 style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "10px", textTransform: "uppercase" }}>Alıcı Bilgileri</h3>
              <p style={{ color: "#fff", fontSize: "0.95rem", lineHeight: "1.5" }}>
                {sonuc.musteri.ad} {sonuc.musteri.soyad}<br/>
                {sonuc.musteri.telefon}<br/>
                {sonuc.musteri.adres}<br/>
                {sonuc.musteri.ilce} / {sonuc.musteri.sehir}
              </p>
            </div>
            <div>
              <h3 style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "10px", textTransform: "uppercase" }}>Ödeme Özeti</h3>
              <p style={{ color: "#fff", fontSize: "0.95rem", lineHeight: "1.5" }}>
                <strong>Yöntem:</strong> {sonuc.odemeYontemi === "kart" ? "Kredi / Banka Kartı" : "Havale / EFT"}<br/>
                <strong>Ödenen Tutar:</strong> <span style={{ color: "#00e5ff", fontWeight: "800" }}>{sonuc.toplamTutar.toLocaleString()} TL</span>
              </p>
            </div>
          </div>

          <h3 style={{ color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid #27272a", paddingBottom: "10px", marginBottom: "15px" }}>Sipariş Edilen Ürünler</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {sonuc.sepet.map((urun: any, index: number) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#09090b", padding: "15px", borderRadius: "10px", border: "1px solid #27272a" }}>
                <div>
                  <p style={{ color: "#fff", fontWeight: "700", marginBottom: "5px" }}>{urun.isim}</p>
                  <p style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>{urun.adet} Adet x {urun.varyasyon || "Standart"}</p>
                </div>
                <div style={{ color: "#fff", fontWeight: "900" }}>
                  {(urun.fiyat * urun.adet).toLocaleString()} TL
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 550px) { .form-grid-2 { grid-template-columns: 1fr !important; } }
      `}} />
    </div>
  );
}

export default function SiparisTakipSayfasi() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "100px", color: "#00e5ff", fontWeight: "900" }}>Sayfa Yükleniyor...</div>}>
      <TakipIcerik />
    </Suspense>
  );
}
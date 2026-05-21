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

  const durumRengi = (durum: string) => {
    if (durum.includes("Ödendi") || durum.includes("Başarılı")) return "#10b981";
    if (durum.includes("Bekliyor")) return "#f59e0b";
    if (durum.includes("Kargo")) return "#00e5ff";
    if (durum.includes("İptal")) return "#ef4444";
    return "#a1a1aa";
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px 15px", minHeight: "85vh", position: "relative", zIndex: 10 }}>
      <h1 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "900", marginBottom: "20px", borderLeft: "5px solid #00e5ff", paddingLeft: "12px", marginTop: "10px" }}>
        SİPARİŞ <span style={{ color: "#00e5ff" }}>TAKİP</span>
      </h1>

      <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
        <form onSubmit={handleSorgula} style={{ display: "flex", gap: "10px", flexWrap: "nowrap" }}>
          <input
            type="text"
            value={siparisKodu}
            onChange={(e) => setSiparisKodu(e.target.value)}
            placeholder="Sipariş Kodu (Örn: BPC-12345)"
            required
            style={{ flex: "1", background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#fff", outline: "none", fontSize: "0.95rem" }}
          />
          <button
            type="submit"
            disabled={yukleniyor}
            style={{ background: "#00e5ff", color: "#000", border: "none", borderRadius: "8px", padding: "0 20px", fontWeight: "900", cursor: yukleniyor ? "not-allowed" : "pointer", fontSize: "0.95rem" }}
          >
            {yukleniyor ? "..." : "Sorgula"}
          </button>
        </form>
        {hata && <div style={{ color: "#ef4444", marginTop: "12px", fontWeight: "700", fontSize: "0.9rem" }}>❌ {hata}</div>}
      </div>

      {sonuc && (
        <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "14px", padding: "20px", marginBottom: "40px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a", paddingBottom: "15px", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: "800" }}>{sonuc.siparisKodu}</h2>
              <p style={{ color: "#a1a1aa", fontSize: "0.8rem", marginTop: "3px" }}>{new Date(sonuc.tarih).toLocaleDateString("tr-TR")}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", padding: "6px 14px", borderRadius: "8px", border: `1px solid ${durumRengi(sonuc.durum)}` }}>
              <span style={{ color: durumRengi(sonuc.durum), fontWeight: "900", fontSize: "0.95rem" }}>{sonuc.durum}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
            <div style={{ borderBottom: "1px solid #222", paddingBottom: "10px" }}>
              <h3 style={{ color: "#a1a1aa", fontSize: "0.8rem", marginBottom: "6px", textTransform: "uppercase" }}>Alıcı Bilgileri</h3>
              <p style={{ color: "#fff", fontSize: "0.9rem", lineHeight: "1.4" }}>
                {sonuc.musteri.ad} {sonuc.musteri.soyad} | {sonuc.musteri.telefon}<br/>
                {sonuc.musteri.adres} - {sonuc.musteri.ilce}/{sonuc.musteri.sehir}
              </p>
            </div>
            <div>
              <h3 style={{ color: "#a1a1aa", fontSize: "0.8rem", marginBottom: "6px", textTransform: "uppercase" }}>Ödeme Özeti</h3>
              <p style={{ color: "#fff", fontSize: "0.9rem" }}>
                Yöntem: {sonuc.odemeYontemi === "kart" ? "Kart" : "Havale"} | Tutar: <span style={{ color: "#00e5ff", fontWeight: "800" }}>{sonuc.toplamTutar.toLocaleString()} TL</span>
              </p>
            </div>
          </div>

          <h3 style={{ color: "#fff", fontSize: "1rem", borderBottom: "1px solid #27272a", paddingBottom: "8px", marginBottom: "12px" }}>Ürünler</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sonuc.sepet.map((urun: any, index: number) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#09090b", padding: "12px", borderRadius: "8px", border: "1px solid #27272a" }}>
                <div style={{ minWidth: 0, flex: 1, paddingRight: "10px" }}>
                  <p style={{ color: "#fff", fontWeight: "700", fontSize: "0.85rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{urun.isim}</p>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem", marginTop: "2px" }}>{urun.adet} Adet</p>
                </div>
                <div style={{ color: "#fff", fontWeight: "900", fontSize: "0.85rem" }}>
                  {(urun.fiyat * urun.adet).toLocaleString()} TL
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default function SiparisTakipSayfasi() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "100px", color: "#00e5ff", fontWeight: "900" }}>Yükleniyor...</div>}>
      <TakipIcerik />
    </Suspense>
  );
}
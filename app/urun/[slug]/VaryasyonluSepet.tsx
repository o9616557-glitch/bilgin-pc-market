"use client";
import { useState } from "react";

export default function VaryasyonluSepet({ urun }: { urun: any }) {
  // Eğer veritabanında varyasyon varsa ilkini otomatik seç, yoksa null bırak
  const [seciliVaryasyon, setSeciliVaryasyon] = useState(
    urun.varyasyonlar && urun.varyasyonlar.length > 0 ? urun.varyasyonlar[0] : null
  );

  // Fiyatı belirle: Varyasyon seçiliyse onun fiyatı, yoksa ana ürünün fiyatı
  const anaFiyat = seciliVaryasyon ? Number(seciliVaryasyon.fiyat) : Number(urun.fiyat) || 0;
  const havaleFiyati = (anaFiyat * 0.95).toFixed(0);

  return (
    <>
      {/* VARYASYON BUTONLARI (Sadece veritabanında varyasyon varsa görünür) */}
      {urun.varyasyonlar && urun.varyasyonlar.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "0.9rem", color: "#a1a1aa", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Model Seçimi:</span>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {urun.varyasyonlar.map((varOge: any, index: number) => {
              const seciliMi = seciliVaryasyon?.model_adi === varOge.model_adi;
              return (
                <button
                  key={index}
                  onClick={() => setSeciliVaryasyon(varOge)}
                  style={{
                    padding: "10px 16px",
                    background: seciliMi ? "rgba(0, 229, 255, 0.1)" : "#121214",
                    color: seciliMi ? "#00e5ff" : "#a1a1aa",
                    border: seciliMi ? "1px solid #00e5ff" : "1px solid #27272a",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "800",
                    transition: "all 0.2s ease"
                  }}
                >
                  {varOge.model_adi}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FİYAT VE TAKSİT BİLGİSİ TABLOSU */}
      <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "0.9rem", color: "#a1a1aa", display: "block" }}>
            {seciliVaryasyon ? `${seciliVaryasyon.model_adi} - Kredi Kartı Tek Çekim` : "Kredi Kartı Tek Çekim"}
          </span>
          <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#ffffff", transition: "all 0.3s ease" }}>
            {anaFiyat.toLocaleString()} TL
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid #27272a", paddingTop: "16px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "700", display: "block" }}>%5 Havale İndirimi</span>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#10b981", transition: "all 0.3s ease" }}>
              {Number(havaleFiyati).toLocaleString()} TL
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#a1a1aa", display: "block" }}>9 - 12 Taksit Seçenekleri</span>
            <div style={{ fontSize: "1.0rem", fontWeight: "700", color: "#00e5ff", marginTop: "4px" }}>Esnek Ödeme Fırsatı</div>
            <div style={{ fontSize: "0.75rem", color: "#71717a", marginTop: "4px", lineHeight: "1.4" }}>Uygun vade oranlarıyla.</div>
          </div>
        </div>
      </div>

      {/* SEPETE EKLE BUTONLARI */}
      <button className="masaustu-sepet" style={{ width: "100%", padding: "18px", fontSize: "1.2rem", fontWeight: "900", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "12px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
        Sepete Ekle
      </button>

      {/* MOBİL ALT BAR (Sadece mobilde görünür) */}
      <div className="mobil-alt-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(18, 18, 20, 0.98)", borderTop: "1px solid #27272a", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 9999
      }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "#a1a1aa", display: "block" }}>Toplam Tutar</span>
          <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#00e5ff" }}>{anaFiyat.toLocaleString()} TL</span>
        </div>
        <button style={{ padding: "12px 24px", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>
          Sepete Ekle
        </button>
      </div>
    </>
  );
}
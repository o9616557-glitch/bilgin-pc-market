"use client";
import { useState } from "react";
import { useCart } from "../../CartContext"; 

export default function VaryasyonluSepet({ urun }: { urun: any }) {
  console.log("🕵️‍♂️ VERİTABANINDAN GELEN HAM ÜRÜN:", urun);
  const [seciliVaryasyon, setSeciliVaryasyon] = useState(
    urun.varyasyonlar && urun.varyasyonlar.length > 0 ? urun.varyasyonlar[0] : null
  );

  const { sepeteEkle } = useCart(); 

  const anaFiyat = seciliVaryasyon ? Number(seciliVaryasyon.fiyat) : Number(urun.fiyat) || 0;
  
  // 🚀 EKRANDA 45 YAZDIRAN SAĞLAM RAKAM BURASI
  const indirimOrani = urun.havaleIndirimi || 5; 
  const havaleFiyati = (anaFiyat * (1 - (indirimOrani / 100))).toFixed(0);

  const sepeteFirlat = () => {
    const eklenecekUrun = {
      id: urun._id.toString(),
      isim: urun.isim,
      resim: urun.resimler && urun.resimler.length > 0 ? urun.resimler[0] : "",
      fiyat: anaFiyat,
      varyasyon: seciliVaryasyon ? seciliVaryasyon.model_adi : null,
      // 🚀 BİNGO: Riske girmedik, ekranda çalışan 45 rakamını direkt çantaya yapıştırdık!
      havaleIndirimi: indirimOrani, 
    };
    sepeteEkle(eklenecekUrun); 
  };

  return (
    
    <><div style={{ background: "red", color: "white", padding: "20px", fontSize: "16px", fontWeight: "bold", wordBreak: "break-all" }}>
        {JSON.stringify(urun, null, 2)}
      </div>
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

      <div style={{ background: "#121214", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "0.9rem", color: "#a1a1aa", display: "block" }}>
            {seciliVaryasyon ? `${seciliVaryasyon.model_adi} - Kredi Kartı Tek Çekim` : "Kredi Kartı Tek Çekim"}
          </span>
          <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#ffffff" }}>
            {anaFiyat.toLocaleString()} TL
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid #27272a", paddingTop: "16px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "700", display: "block" }}>%{indirimOrani} Havale İndirimi</span>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#10b981" }}>
              {Number(havaleFiyati).toLocaleString()} TL
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#a1a1aa", display: "block" }}>Taksit Seçenekleri</span>
            <div style={{ fontSize: "1.0rem", fontWeight: "700", color: "#00e5ff", marginTop: "4px" }}>Peşin Fiyatına 3 Taksit</div>
            <div style={{ fontSize: "0.75rem", color: "#71717a", marginTop: "4px", lineHeight: "1.4" }}>Tüm kredi kartlarına vade farksız taksit imkanı.</div>
          </div>
        </div>
      </div>

      <button onClick={sepeteFirlat} className="masaustu-sepet" style={{ width: "100%", padding: "18px", fontSize: "1.2rem", fontWeight: "900", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "12px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
        Sepete Ekle
      </button>

      <div className="mobil-alt-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(18, 18, 20, 0.98)", borderTop: "1px solid #27272a", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 9999
      }}>
        <div>
          <span style={{ fontSize: "0.75rem", color: "#a1a1aa", display: "block" }}>Toplam Tutar</span>
          <span style={{ fontSize: "1.3rem", fontWeight: "900", color: "#00e5ff" }}>{anaFiyat.toLocaleString()} TL</span>
        </div>
        <button onClick={sepeteFirlat} style={{ padding: "12px 24px", background: "linear-gradient(45deg, #00e5ff, #007acc)", color: "#000", border: "none", borderRadius: "8px", fontWeight: "900", cursor: "pointer" }}>
          Sepete Ekle
        </button>
      </div>
    </>
  );
}
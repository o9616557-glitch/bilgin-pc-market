"use client";
import { useState } from "react";

export default function UrunGorselGalerisi({ resimler }: { resimler: string[] }) {
  // Eğer hiç resim yoksa veya boşsa
  const gecerliResimler = resimler && resimler.length > 0 ? resimler : [];
  const [aktifResim, setAktifResim] = useState(0);

  if (gecerliResimler.length === 0) {
    return (
      <div style={{ width: "100%", height: "450px", backgroundColor: "#121214", borderRadius: "20px", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#52525b" }}>[ GÖRSEL_BEKLENİYOR ]</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      
      {/* ANA BÜYÜK EKRAN */}
      <div style={{ width: "100%", height: "420px", backgroundColor: "#121214", borderRadius: "20px", border: "1px solid #27272a", padding: "16px", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "#ef4444", color: "white", padding: "6px 14px", borderRadius: "30px", fontWeight: "800", fontSize: "0.85rem", boxShadow: "0 0 15px rgba(239,68,68,0.4)" }}>
          İNDİRİM
        </div>
        <img 
          src={gecerliResimler[aktifResim]} 
          alt="Ürün Görseli" 
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transition: "opacity 0.3s ease-in-out" }} 
        />
      </div>

      {/* ALTTAKİ KÜÇÜK RESİMLER (THUMBNAİLS) - Sadece 1'den fazla resim varsa görünür */}
      {gecerliResimler.length > 1 && (
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
          {gecerliResimler.map((resim, index) => (
            <div 
              key={index} 
              onClick={() => setAktifResim(index)}
              style={{ 
                width: "80px", 
                height: "80px", 
                flexShrink: 0,
                backgroundColor: "#121214", 
                borderRadius: "14px", 
                border: aktifResim === index ? "2px solid #3b82f6" : "1px solid #27272a", 
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: aktifResim === index ? 1 : 0.5,
                transition: "all 0.2s ease",
                boxShadow: aktifResim === index ? "0 0 10px rgba(0, 229, 255, 0.2)" : "none"
              }}>
              <img src={resim} alt={`Görsel ${index + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
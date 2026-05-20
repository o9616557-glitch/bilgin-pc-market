"use client"; // Etkileşim (Tıklama) olacağı için bu şart
import { useState } from "react";

export default function EtkilesimliButonlar() {
  const [favori, setFavori] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = () => {
    navigator.clipboard.writeText(window.location.href);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000); // 2 saniye sonra normale döner
  };

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <button 
        onClick={() => setFavori(!favori)}
        style={{ flex: 1, padding: "14px", background: "#18181b", border: "1px solid #27272a", borderRadius: "12px", color: favori ? "#ef4444" : "#a1a1aa", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}
      >
        <span>{favori ? "❤️" : "🤍"}</span> {favori ? "Favorilerde" : "Favorilere Ekle"}
      </button>
      <button 
        onClick={kopyala}
        style={{ padding: "14px 20px", background: "#18181b", border: "1px solid #27272a", borderRadius: "12px", color: kopyalandi ? "#10b981" : "#a1a1aa", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}
      >
        {kopyalandi ? "✓ Kopyalandı" : "🔗 Kopyala"}
      </button>
    </div>
  );
}
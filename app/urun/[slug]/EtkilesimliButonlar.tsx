"use client";
import { useState } from "react";

export default function EtkilesimliButonlar() {
  const [favori, setFavori] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = () => {
    navigator.clipboard.writeText(window.location.href);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  const paylas = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href
        });
      } catch (err) {
        console.log("Paylaşım iptal edildi");
      }
    } else {
      alert("Tarayıcınız bu özelliği desteklemiyor. Linki kopyalayabilirsiniz.");
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
      <button 
        onClick={() => setFavori(!favori)}
        style={{ flex: 1, padding: "12px 0", background: "#18181b", border: "1px solid #27272a", borderRadius: "10px", color: favori ? "#ef4444" : "#a1a1aa", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s", fontSize: "0.9rem" }}
      >
        <span>{favori ? "❤️" : "🤍"}</span> Favori
      </button>
      
      <button 
        onClick={paylas}
        style={{ flex: 1, padding: "12px 0", background: "#18181b", border: "1px solid #27272a", borderRadius: "10px", color: "#a1a1aa", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s", fontSize: "0.9rem" }}
      >
        ↗️ Paylaş
      </button>

      <button 
        onClick={kopyala}
        style={{ flex: 1, padding: "12px 0", background: "#18181b", border: "1px solid #27272a", borderRadius: "10px", color: kopyalandi ? "#10b981" : "#a1a1aa", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s", fontSize: "0.9rem" }}
      >
        {kopyalandi ? "✓ Alındı" : "🔗 Kopyala"}
      </button>
    </div>
  );
}
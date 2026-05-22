"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function BasariliIcerik() {
  const searchParams = useSearchParams();
  const siparisKodu = searchParams?.get("kodu");
  const gosterilecekKod = siparisKodu || "BPC-XXXXXX";

  // Kopyalama butonu için durum tutucu
  const [kopyalandi, setKopyalandi] = useState(false);

  // Kopyalama Fonksiyonu
  const handleKopyala = () => {
    navigator.clipboard.writeText(gosterilecekKod);
    setKopyalandi(true);
    // 2 Saniye sonra butonu eski haline çevir
    setTimeout(() => setKopyalandi(false), 2000);
  };

  return (
    <div style={{ 
      width: "100%",
      padding: "60px 15px", 
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{ 
        width: "100%",
        maxWidth: "500px", 
        background: "#121214", 
        border: "1px solid #27272a", 
        borderRadius: "20px", 
        padding: "40px 30px",
        textAlign: "center", 
        boxShadow: "0 10px 40px rgba(0, 229, 255, 0.08)",
        boxSizing: "border-box"
      }}>
        
        {/* ŞEFİM: İşte o yeşil tiki milimetrik ortaladık! (marginTop hatası silindi) */}
        <div style={{ width: "70px", height: "70px", background: "rgba(16, 185, 129, 0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span style={{ fontSize: "35px" }}>✅</span>
        </div>

        <h1 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "900", marginBottom: "12px", letterSpacing: "-0.5px" }}>Siparişiniz Alındı!</h1>
        <p style={{ color: "#a1a1aa", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "25px" }}>
          Bizi tercih ettiğiniz için teşekkür ederiz. Siparişiniz sistemimize başarıyla düştü ve hazırlık aşamasına geçildi.
        </p>

        <div style={{ background: "#09090b", border: "1px dashed #00e5ff", borderRadius: "12px", padding: "20px", marginBottom: "25px" }}>
          <p style={{ color: "#a1a1aa", fontSize: "0.85rem", marginBottom: "6px" }}>Sipariş Takip Kodunuz:</p>
          <div style={{ color: "#00e5ff", fontSize: "1.6rem", fontWeight: "900", letterSpacing: "2px", marginBottom: "15px" }}>
            {gosterilecekKod}
          </div>
          
          {/* ŞEFİM: YENİ AKILLI KOPYALA BUTONUMUZ */}
          <button 
            onClick={handleKopyala}
            style={{
              background: kopyalandi ? "rgba(16, 185, 129, 0.2)" : "#18181b",
              color: kopyalandi ? "#10b981" : "#e4e4e7",
              border: kopyalandi ? "1px solid #10b981" : "1px solid #27272a",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            {kopyalandi ? (
              <><span>✓</span> Kopyalandı</>
            ) : (
              <><span>📋</span> Kodu Kopyala</>
            )}
          </button>
        </div>

        <p style={{ color: "#71717a", fontSize: "0.8rem", marginBottom: "30px", lineHeight: "1.4" }}>
          Bu kodu kullanarak sitemizdeki "Hesabım &gt; Sipariş Takip" bölümünden kargonuzun durumunu anlık olarak öğrenebilirsiniz.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ flex: 1, minWidth: "130px", padding: "14px", background: "#27272a", color: "#fff", borderRadius: "10px", textDecoration: "none", fontWeight: "700", fontSize: "0.9rem", textAlign: "center" }}>
            Ana Sayfa
          </Link>
          <Link href="/siparis-takip" style={{ flex: 1, minWidth: "130px", padding: "14px", background: "#00e5ff", color: "#000", borderRadius: "10px", textDecoration: "none", fontWeight: "900", fontSize: "0.9rem", textAlign: "center", boxShadow: "0 4px 15px rgba(0, 229, 255, 0.2)" }}>
            Siparişi Takip Et
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SiparisBasariliSayfasi() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "100px", color: "#00e5ff", fontWeight: "900" }}>Yükleniyor...</div>}>
      <BasariliIcerik />
    </Suspense>
  );
}
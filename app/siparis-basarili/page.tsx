"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BasariliIcerik() {
  const searchParams = useSearchParams();
  // ŞEFİM: Araya soru işareti (?) ekledik, kırmızı hata kayboldu!
  const siparisKodu = searchParams?.get("kodu");

  return (
    <div style={{ maxWidth: "600px", margin: "80px auto", padding: "40px", background: "#121214", border: "1px solid #27272a", borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 30px rgba(0, 229, 255, 0.1)" }}>
      
      <div style={{ width: "80px", height: "80px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <span style={{ fontSize: "40px" }}>✅</span>
      </div>

      <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "900", marginBottom: "15px" }}>Tebrikler, Siparişiniz Alındı!</h1>
      <p style={{ color: "#a1a1aa", fontSize: "1rem", lineHeight: "1.6", marginBottom: "30px" }}>
        Bizi tercih ettiğiniz için teşekkür ederiz. Siparişiniz sistemimize başarıyla düştü ve hazırlık aşamasına geçildi.
      </p>

      <div style={{ background: "#09090b", border: "1px dashed #00e5ff", borderRadius: "12px", padding: "20px", marginBottom: "30px" }}>
        <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "5px" }}>Sipariş Takip Kodunuz:</p>
        <div style={{ color: "#00e5ff", fontSize: "1.8rem", fontWeight: "900", letterSpacing: "2px" }}>
          {siparisKodu || "BPC-XXXXXX"}
        </div>
      </div>

      <p style={{ color: "#d4d4d8", fontSize: "0.85rem", marginBottom: "30px", padding: "0 20px" }}>
        Bu kodu kullanarak sitemizdeki "Sipariş Takip" bölümünden kargonuzun durumunu anlık olarak öğrenebilirsiniz.
      </p>

      <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
        <Link href="/" style={{ padding: "14px 24px", background: "#27272a", color: "#fff", borderRadius: "10px", textDecoration: "none", fontWeight: "700", transition: "all 0.2s" }}>
          Ana Sayfaya Dön
        </Link>
        <Link href="/siparis-takip" style={{ padding: "14px 24px", background: "#00e5ff", color: "#000", borderRadius: "10px", textDecoration: "none", fontWeight: "900", boxShadow: "0 4px 15px rgba(0, 229, 255, 0.3)" }}>
          Siparişimi Takip Et
        </Link>
      </div>

    </div>
  );
}

export default function SiparisBasariliSayfasi() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "100px", color: "#00e5ff" }}>Yükleniyor...</div>}>
      <BasariliIcerik />
    </Suspense>
  );
}
"use client";
import Link from "next/link";
import { useCart } from "@/app/CartContext";

export default function Header() {
  // 1. Sepet beynini menüye bağlıyoruz
  const { sepet } = useCart();

  // 2. Sepetteki toplam ürün adedini hesaplıyoruz
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);

  return (
    <header style={{ 
      backgroundColor: "rgba(9, 9, 11, 0.8)", 
      borderBottom: "1px solid #27272a", 
      position: "sticky", 
      top: 0, 
      zIndex: 1000, 
      backdropFilter: "blur(12px)" 
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1.6rem", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px", lineHeight: "1" }}>
            BILGIN <span style={{ color: "#00e5ff" }}>PC</span>
          </span>
        </Link>

        {/* ORTA MENÜ LİNKLERİ */}
        <nav style={{ display: "flex", gap: "24px" }}>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Tüm Bilgisayarlar</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Bilgisayar Parçaları</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Aksesuar</Link>
        </nav>

        {/* AKILLI SEPET İKONU */}
        <Link href="/sepet" style={{ 
          position: "relative", 
          textDecoration: "none", 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          background: "#18181b", 
          padding: "10px 16px", 
          borderRadius: "12px", 
          border: "1px solid #27272a",
          transition: "all 0.3s ease"
        }}>
          <span style={{ fontSize: "1.3rem" }}>🛒</span>
          <span style={{ fontWeight: "800", color: "#e4e4e7", letterSpacing: "0.5px" }}>Sepetim</span>
          
          {/* EĞER SEPETTE ÜRÜN VARSA PARLAYAN RAKAMI GÖSTER */}
          {sepetAdedi > 0 && (
            <span style={{ 
              position: "absolute", 
              top: "-8px", 
              right: "-8px", 
              background: "#00e5ff", 
              color: "#000", 
              fontSize: "0.85rem", 
              fontWeight: "900", 
              width: "24px", 
              height: "24px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              borderRadius: "50%",
              boxShadow: "0 0 15px rgba(0, 229, 255, 0.6)",
              animation: "pop 0.3s ease-out"
            }}>
              {sepetAdedi}
            </span>
          )}
        </Link>

      </div>
    </header>
  );
}
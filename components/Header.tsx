"use client";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useState } from "react"; // Hamburger menü için hafıza ekledik

export default function Header() {
  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false); // Menü açık mı kapalı mı?

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

        {/* MASAÜSTÜ MENÜ (Mobilde gizlenir - Tailwind: hidden md:flex) */}
        <nav className="hidden md:flex" style={{ gap: "24px" }}>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Tüm Bilgisayarlar</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Bilgisayar Parçaları</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Aksesuar</Link>
        </nav>

        {/* SAĞ KISIM: Sepet ve Hamburger Butonu */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
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
            {/* Şefim, telefonda yer kaplamasın diye 'Sepetim' yazısını sildik, sadece ikon kaldı */}
            <span className="hidden sm:inline" style={{ fontWeight: "800", color: "#e4e4e7", letterSpacing: "0.5px" }}>Sepetim</span>
            
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

          {/* HAMBURGER BUTONU (Masaüstünde gizlenir - Tailwind: md:hidden) */}
          <button 
            className="md:hidden" 
            onClick={() => setMenuAcik(!menuAcik)}
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              justifyContent: "center"
            }}
          >
            {/* 3 Çizgi (Açıldığında Çarpı X Şeklini Alır) */}
            <span style={{ display: "block", width: "20px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(45deg) translate(4px, 4px)" : "none" }}></span>
            <span style={{ display: "block", width: "20px", height: "2px", background: "#fff", transition: "all 0.3s", opacity: menuAcik ? 0 : 1 }}></span>
            <span style={{ display: "block", width: "20px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(-45deg) translate(4px, -4px)" : "none" }}></span>
          </button>

        </div>
      </div>

      {/* MOBİL AÇILIR MENÜ (Sadece Hamburger'e basılınca aşağı iner) */}
      {menuAcik && (
        <div className="md:hidden" style={{
          background: "#121214",
          borderTop: "1px solid #27272a",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {/* onClick={...} ile menüden bir yere tıklanınca menünün otomatik kapanmasını sağladık */}
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1.1rem", fontWeight: "600", paddingBottom: "8px", borderBottom: "1px solid #27272a" }}>Tüm Bilgisayarlar</Link>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1.1rem", fontWeight: "600", paddingBottom: "8px", borderBottom: "1px solid #27272a" }}>Bilgisayar Parçaları</Link>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1.1rem", fontWeight: "600" }}>Aksesuar</Link>
        </div>
      )}
    </header>
  );
}
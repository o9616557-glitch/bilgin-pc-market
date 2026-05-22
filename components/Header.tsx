"use client";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  
  const hesabimRef = useRef<HTMLDivElement>(null);
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);

  useEffect(() => {
    function disariTiklandi(event: any) {
      if (hesabimRef.current && !hesabimRef.current.contains(event.target)) {
        setHesabimAcik(false);
      }
    }
    document.addEventListener("mousedown", disariTiklandi);
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, []);

  return (
    <header style={{ 
      backgroundColor: "rgba(9, 9, 11, 0.8)", 
      borderBottom: "1px solid #27272a", 
      position: "sticky", 
      top: 0, 
      zIndex: 1000, 
      backdropFilter: "blur(12px)" 
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* SOL KISIM */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            className="mobil-hamburger"
            onClick={() => setMenuAcik(!menuAcik)}
            style={{ 
              background: "transparent", border: "none", padding: "0", height: "40px", width: "30px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px", justifyContent: "center", alignItems: "center"
            }}>
            <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(45deg) translate(5px, 5px)" : "none" }}></span>
            <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", opacity: menuAcik ? 0 : 1 }}></span>
            <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(-45deg) translate(6px, -6px)" : "none" }}></span>
          </button>

          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px", lineHeight: "1" }}>
              BİLGİN <span style={{ color: "#00e5ff" }}>PC</span>
            </span>
          </Link>
        </div>

        {/* MASAÜSTÜ MENÜ */}
        <nav className="hidden md:flex" style={{ gap: "24px" }}>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>Tüm Bilgisayarlar</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>Bilgisayar Parçaları</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>Aksesuar</Link>
        </nav>

        {/* SAĞ KISIM */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          
          {/* HESABIM */}
          <div ref={hesabimRef} style={{ position: "relative" }}>
            <button 
              onClick={() => setHesabimAcik(!hesabimAcik)}
              style={{
                display: "flex", alignItems: "center", gap: "6px", background: hesabimAcik ? "rgba(0, 229, 255, 0.1)" : "#18181b", color: hesabimAcik ? "#00e5ff" : "#fff", border: hesabimAcik ? "1px solid #00e5ff" : "1px solid #27272a", borderRadius: "10px", padding: "0 14px", height: "40px", boxSizing: "border-box", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem"
              }}
            >
              <span>👤</span> <span className="hidden sm:inline">Hesabım</span>
            </button>

            {/* POPUP MÖNÜSÜ */}
            {hesabimAcik && (
              <div style={{
                position: "absolute", top: "50px", right: "0", background: "#121214", border: "1px solid #27272a", borderRadius: "12px", width: "200px", padding: "6px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", gap: "2px", zIndex: 1001
              }}>
                <div style={{ padding: "8px 10px", borderBottom: "1px solid #27272a", marginBottom: "4px" }}>
                  <p style={{ color: "#fff", fontSize: "0.85rem", fontWeight: "800" }}>Hoş Geldiniz</p>
                </div>
                <Link href="/siparis-takip" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", color: "#d4d4d8", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600", borderRadius: "6px" }} onMouseOver={(e) => e.currentTarget.style.background = "#18181b"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}><span>📦</span> Sipariş Takip</Link>
                <Link href="#" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", color: "#d4d4d8", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600", borderRadius: "6px" }} onMouseOver={(e) => e.currentTarget.style.background = "#18181b"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}><span>🛒</span> Siparişlerim</Link>
                <Link href="#" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", color: "#d4d4d8", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600", borderRadius: "6px" }} onMouseOver={(e) => e.currentTarget.style.background = "#18181b"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}><span>❤️</span> Favorilerim</Link>
                
                {/* ŞEFİM: İŞTE SENİN GİZLİ YÖNETİM PANELİ GEÇİDİN BURADA! */}
                <Link href="/admin" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", color: "#00e5ff", textDecoration: "none", fontSize: "0.85rem", fontWeight: "800", borderRadius: "6px", borderTop: "1px solid #222", marginTop: "4px" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(0, 229, 255, 0.05)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}><span>🛡️</span> Yönetim Paneli</Link>
              </div>
            )}
          </div>

          {/* SEPETİM */}
          <Link href="/sepet" style={{
            position: "relative", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", background: "#18181b", padding: "0 14px", height: "40px", boxSizing: "border-box", borderRadius: "10px", border: "1px solid #27272a"
          }}>
            <span>🛒</span> <span className="hidden sm:inline" style={{ fontWeight: "800", color: "#e4e4e7", fontSize: "0.85rem" }}>Sepetim</span>
            {sepetAdedi > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#00e5ff", color: "#000", fontSize: "0.75rem", fontWeight: "900", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>{sepetAdedi}</span>
            )}
          </Link>
          
        </div>
      </div>

      {/* MOBİL MENÜ */}
      {menuAcik && (
        <div className="md:hidden" style={{ background: "#121214", borderTop: "1px solid #27272a", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1rem", fontWeight: "600" }}>Tüm Bilgisayarlar</Link>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1rem", fontWeight: "600" }}>Bilgisayar Parçaları</Link>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1rem", fontWeight: "600" }}>Aksesuar</Link>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) { .mobil-hamburger { display: none !important; } }
      `}} />
    </header>
  );
}
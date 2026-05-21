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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* ŞEFİM: SOL KISIM (Mobilde Hamburger + Logo) */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          
          {/* HAMBURGER BUTONU (Sadece Mobilde Görünür, PC'de Gizlenir) */}
          <button 
            className="md:hidden" 
            onClick={() => setMenuAcik(!menuAcik)}
            style={{ 
              background: "transparent", // Mobilde daha şık durması için arkasını şeffaf yaptık
              border: "none", 
              padding: "0", 
              height: "30px", 
              width: "30px",
              cursor: "pointer", 
              display: "flex", 
              flexDirection: "column", 
              gap: "6px", 
              justifyContent: "center",
              alignItems: "center"
            }}>
            <span style={{ display: "block", width: "24px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(45deg) translate(5px, 5px)" : "none" }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", background: "#fff", transition: "all 0.3s", opacity: menuAcik ? 0 : 1 }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(-45deg) translate(6px, -6px)" : "none" }}></span>
          </button>

          {/* LOGO */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px", lineHeight: "1" }}>
              BİLGİN <span style={{ color: "#00e5ff" }}>PC</span>
            </span>
          </Link>
        </div>

        {/* MASAÜSTÜ MENÜ (Mobilde gizlenir) */}
        <nav className="hidden md:flex" style={{ gap: "24px" }}>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Tüm Bilgisayarlar</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Bilgisayar Parçaları</Link>
          <Link href="/" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", transition: "color 0.2s" }}>Aksesuar</Link>
        </nav>

        {/* SAĞ KISIM: Hesabım ve Sepet */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          {/* HESABIM BUTONU VE POPUP KUTUSU */}
          <div ref={hesabimRef} style={{ position: "relative" }}>
            <button 
              onClick={() => setHesabimAcik(!hesabimAcik)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: hesabimAcik ? "rgba(0, 229, 255, 0.1)" : "#18181b",
                color: hesabimAcik ? "#00e5ff" : "#fff",
                border: hesabimAcik ? "1px solid rgba(0, 229, 255, 0.3)" : "1px solid #27272a",
                borderRadius: "12px",
                padding: "10px 16px",
                height: "46px", 
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.9rem",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>👤</span>
              <span className="hidden sm:inline">Hesabım</span>
            </button>

            {/* HESABIM AÇILIR MENÜ (POPUP) */}
            {hesabimAcik && (
              <div style={{
                position: "absolute",
                top: "60px",
                right: "0",
                background: "#121214",
                border: "1px solid #27272a",
                borderRadius: "16px",
                width: "220px",
                padding: "8px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                zIndex: 1001,
                animation: "fadeIn 0.2s ease-out"
              }}>
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #27272a", marginBottom: "4px" }}>
                  <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: "800" }}>Hoş Geldiniz</p>
                  <p style={{ color: "#a1a1aa", fontSize: "0.75rem" }}>Bilgin PC Müşterisi</p>
                </div>
                
                <Link href="/siparis-takip" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#d4d4d8", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", borderRadius: "8px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#18181b"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                  <span>📦</span> Sipariş Takip
                </Link>
                <Link href="#" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#d4d4d8", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", borderRadius: "8px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#18181b"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                  <span>🛒</span> Tüm Siparişlerim
                </Link>
                <Link href="#" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#d4d4d8", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", borderRadius: "8px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#18181b"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                  <span>❤️</span> Favorilerim
                </Link>
                <Link href="#" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#d4d4d8", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", borderRadius: "8px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#18181b"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                  <span>📍</span> Adreslerim
                </Link>
              </div>
            )}
          </div>

          {/* AKILLI SEPET İKONU */}
          <Link href="/sepet" style={{
            position: "relative",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#18181b",
            padding: "10px 16px",
            height: "46px",
            borderRadius: "12px",
            border: "1px solid #27272a",
            transition: "all 0.3s ease"
          }}>
            <span style={{ fontSize: "1.3rem" }}>🛒</span>
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
          
        </div>
      </div>

      {/* MOBİL AÇILIR MENÜ (Sadece Hamburger'e basılınca iner) */}
      {menuAcik && (
        <div className="md:hidden" style={{ 
          background: "#121214", 
          borderTop: "1px solid #27272a", 
          padding: "16px 20px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "16px" 
        }}>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1.1rem", fontWeight: "600", paddingBottom: "8px", borderBottom: "1px solid #27272a" }}>Tüm Bilgisayarlar</Link>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1.1rem", fontWeight: "600", paddingBottom: "8px", borderBottom: "1px solid #27272a" }}>Bilgisayar Parçaları</Link>
          <Link href="/" onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1.1rem", fontWeight: "600" }}>Aksesuar</Link>
        </div>
      )}

      {/* Ufak Animasyonlar İçin */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </header>
  );
}
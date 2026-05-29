"use client";

import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter(); 
  const pathname = usePathname();
  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  const hesabimRef = useRef<HTMLDivElement>(null);
  
  // Sepetteki toplam ürün sayısını hesapla
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);

  const { data: session } = useSession();

  // Admin kontrolü
  const ADMIN_EMAIL = "o9616557@gmail.com";
  const isAdmin = session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Dışarı tıklayınca Hesabım menüsünü kapat
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
    <>
      <header style={{ backgroundColor: "rgba(9, 9, 11, 0.9)", borderBottom: "1px solid #27272a", position: "sticky", top: 0, zIndex: 1000, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* SOL TARAF: HAMBURGER & LOGO */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="mobil-hamburger" onClick={() => setMenuAcik(!menuAcik)} style={{ background: "transparent", border: "none", padding: "0", height: "40px", width: "30px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
              <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(45deg) translate(5px, 5px)" : "none" }}></span>
              <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", opacity: menuAcik ? 0 : 1 }}></span>
              <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(-45deg) translate(6px, -6px)" : "none" }}></span>
            </button>

            <Link href="/" prefetch={true} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px", lineHeight: "1" }}>BİLGİN <span style={{ color: "#00e5ff" }}>PC</span></span>
            </Link>
          </div>

          {/* ORTA: MASAÜSTÜ MENÜ */}
          <nav className="hidden md:flex" style={{ gap: "24px" }}>
            <Link href="/" prefetch={true} style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>Tüm Bilgisayarlar</Link>
            <Link href="/" prefetch={true} style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>Bilgisayar Parçaları</Link>
            <Link href="/" prefetch={true} style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>Aksesuar</Link>
          </nav>

          {/* SAĞ TARAF (Hesabım & Sepet) */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

            {/* HESABIM MENÜSÜ */}
            <div ref={hesabimRef} style={{ position: "relative" }}>
              <button onClick={() => setHesabimAcik(!hesabimAcik)} style={{ display: "flex", alignItems: "center", gap: "6px", background: hesabimAcik ? "rgba(0, 229, 255, 0.1)" : "#18181b", color: "#fff", border: "1px solid #27272a", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                <span style={{ fontSize: "16px" }}>👤</span>
                <span className="hidden sm:inline" style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                  {session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}
                </span>
              </button>

              {hesabimAcik && (
                <div style={{ position: "absolute", top: "50px", right: "0", background: "#09090b", border: "1px solid #27272a", borderRadius: "12px", width: "220px", padding: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>

                  {/* KARGO TAKİP BUTONU (NİTROLUNDU) */}
                  <Link href="/siparis-takip" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#00e5ff", background: "rgba(0, 229, 255, 0.05)", textDecoration: "none", fontSize: "0.85rem", borderRadius: "8px", fontWeight: "bold", marginBottom: "4px" }}>
                    <span>📦</span> Kargo / Sipariş Takip
                  </Link>

                  <div style={{ height: "1px", background: "#27272a", margin: "4px 0" }}></div>

                  {session ? (
                    <>
                      <div style={{ padding: "8px 12px", borderBottom: "1px solid #27272a", marginBottom: "4px" }}>
                        <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: "700" }}>Hoş Geldin, 👋</p>
                        <p style={{ color: "#00e5ff", fontSize: "0.8rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{session.user?.name || session.user?.email}</p>
                      </div>

                      {/* 🚀 BİNGO: SİPARİŞLERİM SAYFASINA PREFETCH MOTORU TAKILDI! */}
                      <Link href="/siparislerim" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#a1a1aa", textDecoration: "none", fontSize: "0.85rem" }}>
                        <span>📋</span> Siparişlerim
                      </Link>

                      {/* 🚀 BİNGO: ADRESLERİM SAYFASINA PREFETCH MOTORU TAKILDI! */}
                      <Link href="/adreslerim" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#a1a1aa", textDecoration: "none", fontSize: "0.85rem" }}>
                        <span>📍</span> Adreslerim
                      </Link>

                     <button 
  onClick={(e) => {
    e.preventDefault();
    setHesabimAcik(false); // 1. Açılır menüyü kapat
    router.push("/favorilerim"); // 2. Favoriler sayfasına git
    router.refresh(); // 🚀 3. BÜYÜLÜ KOD: Gittiğin an eski hafızayı çöpe at, taze veriyi çek!
  }}
  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 m-0 text-base"
>
  <span>❤️</span> <span>Favorilerim</span>
</button>
                      <div style={{ height: "1px", background: "#27272a", margin: "4px 0" }}></div>

                      {isAdmin && (
                        <>
                          <Link href="/admin" onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)", textDecoration: "none", fontSize: "0.85rem", borderRadius: "8px", fontWeight: "bold" }}>
                            <span>👑</span> Yönetim Paneli
                          </Link>
                          <div style={{ height: "1px", background: "#27272a", margin: "4px 0" }}></div>
                        </>
                      )}

                      <button onClick={() => { setHesabimAcik(false); signOut({ callbackUrl: '/' }); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#ef4444", background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontSize: "0.85rem" }}>
                        <span>🚪</span> Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#ffffff", background: "rgba(0, 229, 255, 0.1)", textDecoration: "none", fontSize: "0.85rem", borderRadius: "8px" }}>
                        <span>🔑</span> Giriş Yap
                      </Link>
                      <Link href="/kayit" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#fff", textDecoration: "none", fontSize: "0.85rem" }}>
                        <span>📝</span> Yeni Kayıt
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* SEPETİM BUTONU */}
            <Link href="/sepet" prefetch={true} style={{ position: "relative", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", background: "#18181b", padding: "8px 14px", height: "42px", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #27272a", color: "#fff" }}>
              <span style={{ fontSize: "16px" }}>🛒</span>
              <span className="hidden sm:inline" style={{ fontWeight: "600", color: "#a1a1aa", fontSize: "0.85rem" }}>Sepetim</span>
              {sepetAdedi > 0 && (
                <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#00e5ff", color: "#000", fontSize: "0.7rem", fontWeight: "900", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                  {sepetAdedi}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBİL MENÜ */}
        {menuAcik && (
          <div className="md:hidden" style={{ background: "#18181b", borderTop: "1px solid #27272a", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <Link href="/" prefetch={true} onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1rem", fontWeight: "600" }}>Tüm Bilgisayarlar</Link>
            <Link href="/" prefetch={true} onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1rem", fontWeight: "600" }}>Bilgisayar Parçaları</Link>
            <Link href="/" prefetch={true} onClick={() => setMenuAcik(false)} style={{ color: "#d4d4d8", textDecoration: "none", fontSize: "1rem", fontWeight: "600" }}>Aksesuar</Link>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 768px) { .mobil-hamburger { display: none !important; } }
        `}} />
      </header>
    </>
  );
}
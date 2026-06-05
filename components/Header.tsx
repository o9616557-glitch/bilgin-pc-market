"use client";

import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

// ŞEFİN MEGA MENÜ KATEGORİ LİSTESİ
const menuCategories = [
  {
    title: "Bilgisayar Bileşenleri",
    items: [
      { name: "Anakart", slug: "anakart" },
      { name: "Ekran Kartı", slug: "ekran-karti" },
      { name: "İşlemci (CPU)", slug: "islemci" },
      { name: "RAM Bellek", slug: "ram" },
      { name: "SSD & M.2 Disk", slug: "ssd" },
      { name: "Sabit Disk (HDD)", slug: "hdd" },
      { name: "Bilgisayar Kasası", slug: "kasa" },
      { name: "Güç Kaynakları (PSU)", slug: "psu" },
      { name: "Soğutma Sistemleri", slug: "sogutma" },
    ]
  },
  {
    title: "Çevre Birimleri & Oyuncu",
    items: [
      { name: "Oyuncu Monitörleri", slug: "monitor" },
      { name: "Klavye", slug: "klavye" },
      { name: "Mouse & Mouse Pad", slug: "mouse" },
      { name: "Oyuncu Kulaklıkları", slug: "kulaklik" },
      { name: "Yayıncı Mikrofonları", slug: "mikrofon" },
      { name: "Oyun Kolu & Direksiyon", slug: "oyun-kolu" },
      { name: "Simülasyon Ürünleri", slug: "simulasyon" },
      { name: "Hoparlör (Speaker)", slug: "hoparlor" },
    ]
  },
  {
    title: "Sistem, Laptop & Yazılım",
    items: [
      { name: "Hazır Oyun Bilgisayarı", slug: "hazir-sistem" },
      { name: "Premium Laptop & Notebook", slug: "laptop" },
      { name: "Masaüstü Bilgisayar", slug: "masaustu" },
      { name: "MacBook & Mac", slug: "macbook" },
      { name: "OEM Paketler (Toplama PC)", slug: "oem-paket" },
      { name: "İşletim Sistemi", slug: "isletim-sistemi" },
      { name: "Microsoft Office & Yazılım", slug: "yazilim" },
      { name: "Güvenlik & Antivirüs", slug: "antivirus" },
    ]
  },
  {
    title: "Ağ, Aksesuar & Kablo",
    items: [
      { name: "Modem & Network", slug: "modem" },
      { name: "USB Bellek & Hafıza Kartı", slug: "usb-bellek" },
      { name: "Kablolar & Çeviriciler", slug: "kablolar" },
      { name: "Akım Koruyucu Priz", slug: "akim-koruyucu" },
      { name: "Notebook Soğutucu", slug: "notebook-aksesuar" },
      { name: "Şarj Aletleri & Powerbank", slug: "sarj-powerbank" },
      { name: "Bluetooth Hoparlör", slug: "bluetooth-ses" },
      { name: "Termal Macun", slug: "termal-macun" },
    ]
  }
];

export default function Header() {
  const pathname = usePathname();

  // 🚀 GİZLEME MOTORU: Bu sayfalarda menü görünmez!
  const gizlenecekSayfalar = ["/sepet", "/odeme", "/giris", "/kayit", "/checkout"];
  if (gizlenecekSayfalar.includes(pathname)) {
    return null; 
  }

  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hesabimRef = useRef<HTMLDivElement>(null);
  
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);
  const { data: session } = useSession();

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
      {/* ŞEF DİKKAT: position: "sticky", top: 0 ile sayfa kaydıkça menüyü tepeye çiviledik */}
      <header style={{ backgroundColor: "rgba(9, 9, 11, 0.9)", borderBottom: "1px solid #27272a", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* SOL TARAF: LOGO */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" prefetch={true} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px", lineHeight: "1" }}>BİLGİN <span style={{ color: "#00e5ff" }}>PC</span></span>
            </Link>
          </div>

          {/* ORTA: MEGA MENÜ VE VİTRİN KATEGORİLERİ (Masaüstü) */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* MEGA MENÜ TETİKLEYİCİSİ */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff", background: "rgba(0, 229, 255, 0.1)", border: "1px solid rgba(0, 229, 255, 0.2)", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                Tüm Kategoriler
              </button>

              {/* AÇILAN DEV MEGA MENÜ PANELİ */}
              {dropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: "-100px", paddingTop: "16px", width: "1100px", zIndex: 100 }}>
                  <div style={{ background: "rgba(9, 9, 11, 0.98)", backdropFilter: "blur(16px)", border: "1px solid #27272a", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", padding: "40px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px" }}>
                      {menuCategories.map((category, index) => (
                        <div key={index}>
                          <h3 style={{ color: "#00e5ff", fontWeight: "700", fontSize: "0.875rem", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "24px", borderBottom: "1px solid #27272a", paddingBottom: "12px" }}>
                            {category.title}
                          </h3>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                            {category.items.map((item) => (
                              <li key={item.slug}>
                                <Link 
                                  href={`/kategori/${item.slug}`} 
                                  style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "1rem", transition: "all 0.2s" }}
                                  onMouseOver={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateX(4px)"; }}
                                  onMouseOut={(e) => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.transform = "none"; }}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* VİTRİN LİNKLERİ */}
            <nav style={{ display: "flex", gap: "24px" }}>
              <Link href="/kategori/ekran-karti" prefetch={true} style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.95rem", fontWeight: "600" }} onMouseOver={(e) => e.currentTarget.style.color = "#00e5ff"} onMouseOut={(e) => e.currentTarget.style.color = "#a1a1aa"}>Ekran Kartları</Link>
              <Link href="/kategori/islemci" prefetch={true} style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.95rem", fontWeight: "600" }} onMouseOver={(e) => e.currentTarget.style.color = "#00e5ff"} onMouseOut={(e) => e.currentTarget.style.color = "#a1a1aa"}>İşlemciler</Link>
              <Link href="/kategori/anakart" prefetch={true} style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.95rem", fontWeight: "600" }} onMouseOver={(e) => e.currentTarget.style.color = "#00e5ff"} onMouseOut={(e) => e.currentTarget.style.color = "#a1a1aa"}>Anakartlar</Link>
            </nav>
          </div>

          {/* SAĞ TARAF (Hesabım, Sepet, Hamburger) */}
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

                      <Link href="/siparislerim" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#a1a1aa", textDecoration: "none", fontSize: "0.85rem" }}>
                        <span>📋</span> Siparişlerim
                      </Link>

                      <Link href="/adreslerim" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#a1a1aa", textDecoration: "none", fontSize: "0.85rem" }}>
                        <span>📍</span> Adreslerim
                      </Link>

                      <Link href="/favorilerim" prefetch={true} onClick={() => setHesabimAcik(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", color: "#a1a1aa", textDecoration: "none", fontSize: "0.85rem" }}>
                        <span>❤️</span> Favorilerim
                      </Link>

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

            {/* MOBİL HAMBURGER BUTONU */}
            <button className="md:hidden flex flex-col justify-center items-center ml-2" onClick={() => setMenuAcik(!menuAcik)} style={{ background: "transparent", border: "none", padding: "0", height: "40px", width: "30px", cursor: "pointer", gap: "6px" }}>
              <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(45deg) translate(5px, 5px)" : "none" }}></span>
              <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", opacity: menuAcik ? 0 : 1 }}></span>
              <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", transition: "all 0.3s", transform: menuAcik ? "rotate(-45deg) translate(6px, -6px)" : "none" }}></span>
            </button>
          </div>
        </div>

        {/* MOBİL MENÜ İÇERİĞİ (Hamburger'e basınca açılır) */}
        {menuAcik && (
          <div className="md:hidden" style={{ background: "#09090b", borderTop: "1px solid #27272a", maxHeight: "70vh", overflowY: "auto", padding: "16px" }}>
            
            {/* Mobil Vitrin Linkleri */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderBottom: "1px solid #27272a", paddingBottom: "16px", marginBottom: "16px" }}>
              <Link href="/kategori/ekran-karti" onClick={() => setMenuAcik(false)} style={{ color: "#00e5ff", textDecoration: "none", fontSize: "1.1rem", fontWeight: "700" }}>Ekran Kartları</Link>
              <Link href="/kategori/islemci" onClick={() => setMenuAcik(false)} style={{ color: "#00e5ff", textDecoration: "none", fontSize: "1.1rem", fontWeight: "700" }}>İşlemciler</Link>
              <Link href="/kategori/anakart" onClick={() => setMenuAcik(false)} style={{ color: "#00e5ff", textDecoration: "none", fontSize: "1.1rem", fontWeight: "700" }}>Anakartlar</Link>
            </div>

            {/* Mobil Kategoriler Listesi */}
            {menuCategories.map((category, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "0.9rem", textTransform: "uppercase", marginBottom: "10px", paddingBottom: "5px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {category.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {category.items.map((item) => (
                    <Link 
                      key={item.slug} 
                      href={`/kategori/${item.slug}`} 
                      onClick={() => setMenuAcik(false)} 
                      style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "1rem", paddingLeft: "8px", borderLeft: "2px solid transparent" }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
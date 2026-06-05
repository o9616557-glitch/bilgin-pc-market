"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

// ŞEFİN JİLET GİBİ 4 KOLONLU MEGA MENÜ ENVANTERİ
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

  // 🚀 GİZLEME MOTORU: Bu sayfalarda Header ASLA görünmez!
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
    <header className="bg-[#050814]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* SOL TARAF: HAMBURGER & LOGO */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button 
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none" 
              onClick={() => setMenuAcik(!menuAcik)}
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuAcik ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${menuAcik ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${menuAcik ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>

            <Link href="/" prefetch={true} className="text-white font-black text-2xl tracking-tight flex items-center">
              BİLGİN <span className="text-blue-500 ml-1">PC</span>
            </Link>
          </div>

          {/* ORTA: MASAÜSTÜ MEGA MENÜ VE VİTRİN */}
          <div className="hidden md:flex items-center space-x-8">
            
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="flex items-center space-x-2 text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/20 px-4 py-2 rounded-md font-semibold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                <span>Tüm Kategoriler</span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-6 w-[1100px] z-50">
                  <div className="bg-[#09090b]/98 backdrop-blur-xl border border-gray-800 rounded-lg shadow-2xl p-10">
                    <div className="grid grid-cols-4 gap-12">
                      {menuCategories.map((category, index) => (
                        <div key={index}>
                          <h3 className="text-blue-500 font-bold text-sm tracking-wider uppercase mb-6 border-b border-gray-800 pb-3">
                            {category.title}
                          </h3>
                          <ul className="space-y-4">
                            {category.items.map((item) => (
                              <li key={item.slug}>
                                <Link href={`/kategori/${item.slug}`} prefetch={true} className="text-gray-400 hover:text-white hover:translate-x-1 hover:text-blue-400 transition-all duration-200 block text-base">
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

            <nav className="flex items-center space-x-6">
              <Link href="/kategori/hazir-sistem" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-bold transition-colors">🔥 Hazır Sistemler</Link>
              <Link href="/kategori/ekran-karti" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">Ekran Kartları</Link>
              <Link href="/kategori/islemci" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">İşlemciler</Link>
              <Link href="/kategori/anakart" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">Anakartlar</Link>
            </nav>
          </div>

          {/* SAĞ TARAF: HESABIM VE SEPET (İkonlar Değişti!) */}
          <div className="flex items-center space-x-1 md:space-x-3">

            <div ref={hesabimRef} className="relative">
              <button 
                onClick={() => setHesabimAcik(!hesabimAcik)} 
                className={`flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-2 md:space-x-2 rounded-md transition-colors ${hesabimAcik ? 'text-blue-500 md:bg-blue-600/20 md:border-blue-500/30' : 'text-gray-300 hover:text-white hover:bg-gray-800/50 md:bg-gray-900 md:border md:border-gray-800'}`}
              >
                {/* YENİ JİLET GİBİ HESABIM İKONU */}
                <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span className="hidden sm:block text-sm font-semibold">
                  {session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}
                </span>
              </button>

              {hesabimAcik && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-[#09090b] border border-gray-800 rounded-lg shadow-2xl p-2 z-50">
                  <Link href="/siparis-takip" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-md text-sm font-bold mb-1 transition-colors">
                    📦 Kargo / Sipariş Takip
                  </Link>

                  <div className="h-px bg-gray-800 my-2"></div>

                  {session ? (
                    <>
                      <div className="px-3 py-2 border-b border-gray-800 mb-1">
                        <p className="text-white text-sm font-bold">Hoş Geldin, 👋</p>
                        <p className="text-blue-400 text-xs font-semibold truncate">{session.user?.name || session.user?.email}</p>
                      </div>

                      <Link href="/siparislerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md text-sm transition-colors">
                        📋 Siparişlerim
                      </Link>

                      <Link href="/adreslerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md text-sm transition-colors">
                        📍 Adreslerim
                      </Link>

                      <Link href="/favorilerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md text-sm transition-colors">
                        ❤️ Favorilerim
                      </Link>

                      <div className="h-px bg-gray-800 my-2"></div>

                      {isAdmin && (
                        <>
                          <Link href="/admin" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-md text-sm font-bold transition-colors">
                            👑 Yönetim Paneli
                          </Link>
                          <div className="h-px bg-gray-800 my-2"></div>
                        </>
                      )}

                      <button onClick={() => { setHesabimAcik(false); signOut({ callbackUrl: '/' }); }} className="flex items-center gap-3 px-3 py-2 w-full text-left text-red-500 hover:bg-red-500/10 rounded-md text-sm transition-colors">
                        🚪 Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold mb-2 transition-colors">
                        🔑 Giriş Yap
                      </Link>
                      <Link href="/kayit" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md text-sm transition-colors">
                        📝 Yeni Kayıt
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* SEPETİM BÖLÜMÜ */}
            <Link href="/sepet" prefetch={true} className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-2 md:space-x-2 rounded-md transition-colors text-gray-300 hover:text-white hover:bg-gray-800/50 md:bg-gray-900 md:border md:border-gray-800 md:hover:border-gray-600">
              {/* YENİ JİLET GİBİ SEPET İKONU */}
              <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="hidden sm:block text-sm font-semibold text-gray-300">Sepetim</span>
              {sepetAdedi > 0 && (
                <span className="absolute top-0 right-0 md:-top-2 md:-right-2 bg-blue-500 text-white text-[10px] md:text-xs font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-lg">
                  {sepetAdedi}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      {menuAcik && (
        <div className="md:hidden bg-[#050814]/98 backdrop-blur-lg border-t border-gray-800 max-h-[75vh] overflow-y-auto px-4 py-4 space-y-6">
          {menuCategories.map((category, index) => (
            <div key={index}>
              <h3 className="text-blue-500 font-bold text-sm tracking-wider uppercase mb-2 border-b border-gray-800 pb-1">
                {category.title}
              </h3>
              <div className="flex flex-col space-y-3">
                {category.items.map((item) => (
                  <Link key={item.slug} href={`/kategori/${item.slug}`} prefetch={true} onClick={() => setMenuAcik(false)} className="text-gray-300 hover:text-white text-base py-1.5 pl-2 border-l border-gray-800/50 hover:border-blue-500">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
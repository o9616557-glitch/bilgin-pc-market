"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

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
  const router = useRouter();

  // 🚀 GİZLEME MOTORU
  const gizlenecekSayfalar = ["/sepet", "/odeme", "/giris", "/kayit", "/checkout"];
  if (gizlenecekSayfalar.includes(pathname)) {
    return null; 
  }

  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // 🔥 ARAMA KUTUSUNUN HAFIZASI
  const [aramaMetni, setAramaMetni] = useState("");
  
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

  // 🔥 ARAMAYI TETİKLEYEN JİLET GİBİ FONKSİYON (Ters tırnaklar iptal edildi, kırılmaz yapıldı)
  const handleArama = (e: React.FormEvent) => {
    e.preventDefault();
    if (aramaMetni.trim()) {
      setMenuAcik(false);
      router.push("/arama?q=" + encodeURIComponent(aramaMetni));
    }
  };

  return (
    <header className="bg-[#050814]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* SOL TARAF: HAMBURGER & LOGO */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button 
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none" 
              onClick={() => setMenuAcik(!menuAcik)}
            >
              <span className={"block w-6 h-0.5 bg-white transition-all duration-300 " + (menuAcik ? "rotate-45 translate-y-1.5" : "")}></span>
              <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "opacity-0" : "")}></span>
              <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "-rotate-45 -translate-y-1.5" : "")}></span>
            </button>

            <Link href="/" prefetch={true} className="text-white font-black text-2xl tracking-tight flex items-center">
              BİLGİN <span className="text-blue-500 ml-1">PC</span>
            </Link>
          </div>

          {/* ORTA: MEGA MENÜ, LİNKLER VE ŞEFİN GLOBAL ARAMA ÇUBUĞU */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 px-4 justify-center">
            
            {/* Mega Menü Butonu */}
            <div 
              className="relative shrink-0"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="flex items-center space-x-2 text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/20 px-4 py-2.5 rounded-xl font-bold transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                <span>Tüm Kategoriler</span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-6 w-[1000px] z-50">
                  <div className="bg-[#09090b]/98 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-10">
                    <div className="grid grid-cols-4 gap-12">
                      {menuCategories.map((category, index) => (
                        <div key={index}>
                          <h3 className="text-blue-500 font-bold text-sm tracking-wider uppercase mb-6 border-b border-gray-800 pb-3">
                            {category.title}
                          </h3>
                          <ul className="space-y-4">
                            {category.items.map((item) => (
                              <li key={item.slug}>
                                <Link href={"/kategori/" + item.slug} prefetch={true} className="text-gray-400 hover:text-white hover:translate-x-1 hover:text-blue-400 transition-all duration-200 block text-sm font-medium">
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

            {/* Hızlı Linkler */}
            <nav className="hidden xl:flex items-center space-x-6 shrink-0">
              <Link href="/kategori/hazir-sistem" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-bold transition-colors">🔥 Hazır Sistemler</Link>
              <Link href="/kategori/ekran-karti" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-bold transition-colors">Ekran Kartları</Link>
            </nav>

            {/* 🔥 GLOBAL ARAMA ÇUBUĞU (PC İÇİN) 🔥 */}
            <form onSubmit={handleArama} className="relative group w-full max-w-[300px] xl:max-w-md shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 group-focus-within:text-[#00d2ff] transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Ürün veya marka ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-full h-10 bg-[#121212] border border-white/10 hover:border-white/20 focus:border-[#00d2ff] focus:bg-black/60 rounded-xl pl-10 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[0_0_15px_rgba(0,210,255,0.15)]"
              />
              {aramaMetni && (
                <button 
                  type="button"
                  onClick={() => setAramaMetni("")} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#00d2ff] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

          </div>

          {/* SAĞ TARAF: HESABIM VE SEPET */}
          <div className="flex items-center space-x-1 md:space-x-3 shrink-0">

            <div ref={hesabimRef} className="relative">
              <button 
                onClick={() => setHesabimAcik(!hesabimAcik)} 
                className={"flex items-center justify-center w-10 h-10 md:w-auto md:h-10 md:px-3 md:space-x-2 rounded-xl transition-colors " + (hesabimAcik ? "text-blue-500 md:bg-blue-600/20 md:border-blue-500/30" : "text-gray-300 hover:text-white hover:bg-white/5 md:bg-[#121212] md:border md:border-white/10")}
              >
                <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">
                  {session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}
                </span>
              </button>

              {hesabimAcik && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-3 z-50">
                  <Link href="/siparis-takip" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#00d2ff] bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 rounded-xl text-sm font-bold mb-2 transition-colors">
                    📦 Kargo / Sipariş Takip
                  </Link>

                  <div className="h-px bg-white/5 my-2"></div>

                  {session ? (
                    <>
                      <div className="px-3 py-2 border-b border-white/5 mb-2">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Hoş Geldin,</p>
                        <p className="text-white text-sm font-bold truncate mt-1">{session.user?.name || session.user?.email}</p>
                      </div>

                      <Link href="/siparislerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-colors">
                        📋 Siparişlerim
                      </Link>

                      <Link href="/adreslerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-colors">
                        📍 Adreslerim
                      </Link>

                      <Link href="/favorilerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-colors">
                        ❤️ Favorilerim
                      </Link>

                      <div className="h-px bg-white/5 my-2"></div>

                      {isAdmin && (
                        <>
                          <Link href="/admin" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2.5 text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20 rounded-xl text-sm font-bold transition-colors">
                            👑 Yönetim Paneli
                          </Link>
                          <div className="h-px bg-white/5 my-2"></div>
                        </>
                      )}

                      <button onClick={() => { setHesabimAcik(false); signOut({ callbackUrl: "/" }); }} className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-colors mt-1">
                        🚪 Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center justify-center gap-2 px-3 py-2.5 text-black bg-[#00d2ff] hover:bg-[#00b8e6] rounded-xl text-sm font-black mb-2 transition-colors">
                        🔑 GİRİŞ YAP
                      </Link>
                      <Link href="/kayit" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center justify-center gap-2 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 rounded-xl text-sm font-bold transition-colors">
                        📝 YENİ KAYIT
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* SEPETİM BÖLÜMÜ */}
            <Link href="/sepet" prefetch={true} className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-10 md:px-4 md:space-x-2 rounded-xl transition-colors text-gray-300 hover:text-white hover:bg-white/5 md:bg-[#121212] md:border md:border-white/10 hover:border-[#00d2ff]/50">
              <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="hidden sm:block text-xs font-bold uppercase tracking-wider text-gray-300">Sepet</span>
              {sepetAdedi > 0 && (
                <span className="absolute top-0 right-0 md:-top-2 md:-right-2 bg-[#10b981] text-white text-[10px] md:text-xs font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  {sepetAdedi}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      {/* 🔥 MOBİL MENÜ (İÇİNDE JİLET GİBİ ARAMA ÇUBUĞU İLE BİRLİKTE) 🔥 */}
      {menuAcik && (
        <div className="md:hidden bg-[#050814]/98 backdrop-blur-xl border-t border-gray-800 max-h-[85vh] overflow-y-auto px-4 py-6 space-y-6 shadow-2xl">
          
          {/* MOBİL İÇİN ARAMA MOTORU */}
          <form onSubmit={handleArama} className="relative group w-full mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 group-focus-within:text-[#00d2ff] transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Ürün veya marka ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="w-full h-12 bg-[#121212] border border-white/10 hover:border-white/20 focus:border-[#00d2ff] focus:bg-black/60 rounded-xl pl-12 pr-10 text-base text-white placeholder-gray-500 outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[0_0_15px_rgba(0,210,255,0.15)]"
            />
            {aramaMetni && (
              <button 
                type="button"
                onClick={() => setAramaMetni("")} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#00d2ff] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {menuCategories.map((category, index) => (
            <div key={index}>
              <h3 className="text-[#00d2ff] font-bold text-xs tracking-widest uppercase mb-3 border-b border-white/10 pb-2">
                {category.title}
              </h3>
              <div className="flex flex-col space-y-2">
                {category.items.map((item) => (
                  <Link key={item.slug} href={"/kategori/" + item.slug} prefetch={true} onClick={() => setMenuAcik(false)} className="text-gray-300 hover:text-white text-sm py-2 pl-3 border-l-2 border-transparent hover:border-[#00d2ff] bg-white/[0.01] hover:bg-white/[0.03] rounded-r-lg transition-all font-medium">
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
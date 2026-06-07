"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

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

  const gizlenecekSayfalar = ["/sepet", "/odeme", "/giris", "/kayit", "/checkout"];
  if (gizlenecekSayfalar.includes(pathname)) return null; 

  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // 🔥 CANLI ARAMA HAFIZALARI 🔥
  const [aramaMetni, setAramaMetni] = useState("");
  const [canliSonuclar, setCanliSonuclar] = useState<any[]>([]);
  const [aramaYukleniyor, setAramaYukleniyor] = useState(false);
  
  const hesabimRef = useRef<HTMLDivElement>(null);
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email?.toLowerCase() === "o9616557@gmail.com";

  useEffect(() => {
    function disariTiklandi(event: any) {
      if (hesabimRef.current && !hesabimRef.current.contains(event.target)) setHesabimAcik(false);
    }
    document.addEventListener("mousedown", disariTiklandi);
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, []);

  // 🔥 HER YAZI YAZILDIĞINDA TETİKLENEN MOTOR 🔥
  useEffect(() => {
    if (aramaMetni.trim().length >= 2) {
      setAramaYukleniyor(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch("/api/arama?q=" + encodeURIComponent(aramaMetni));
          const data = await res.json();
          setCanliSonuclar(data);
        } catch (e) {
          setCanliSonuclar([]);
        }
        setAramaYukleniyor(false);
      }, 300); // 300ms gecikme (Adam yazarken sistemi yormamak için)
      return () => clearTimeout(timer);
    } else {
      setCanliSonuclar([]);
    }
  }, [aramaMetni]);

  // ENTER'A BASINCA TÜM SONUÇLAR SAYFASINA GİDER
  const handleAramaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aramaMetni.trim()) {
      setMenuAcik(false);
      setAramaMetni(""); // Kutuyu temizle
      window.location.href = "/arama?q=" + encodeURIComponent(aramaMetni);
    }
  };

  return (
    <header className="bg-[#050814]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* SOL: LOGO VE HAMBURGER */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button className="md:hidden flex flex-col justify-center items-center w-8 h-8" onClick={() => setMenuAcik(!menuAcik)}>
              <span className={"block w-6 h-0.5 bg-white transition-all duration-300 " + (menuAcik ? "rotate-45 translate-y-1.5" : "")}></span>
              <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "opacity-0" : "")}></span>
              <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "-rotate-45 -translate-y-1.5" : "")}></span>
            </button>
            <Link href="/" prefetch={true} className="text-white font-black text-2xl tracking-tight flex items-center">
              BİLGİN <span className="text-blue-500 ml-1">PC</span>
            </Link>
          </div>

          {/* ORTA: MENÜ VE PC ARAMA */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 px-4 justify-center relative">
            
            <div className="relative shrink-0" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button className="flex items-center space-x-2 text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/20 px-4 py-2.5 rounded-xl font-bold transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                <span>Tüm Kategoriler</span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-6 w-[1000px] z-[60]">
                  <div className="bg-[#09090b]/98 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-10">
                    <div className="grid grid-cols-4 gap-12">
                      {menuCategories.map((category, index) => (
                        <div key={index}>
                          <h3 className="text-blue-500 font-bold text-sm tracking-wider uppercase mb-6 border-b border-gray-800 pb-3">{category.title}</h3>
                          <ul className="space-y-4">
                            {category.items.map((item) => (
                              <li key={item.slug}>
                                <Link href={"/kategori/" + item.slug} prefetch={true} className="text-gray-400 hover:text-white hover:translate-x-1 hover:text-blue-400 transition-all duration-200 block text-sm font-medium">{item.name}</Link>
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

            <nav className="hidden xl:flex items-center space-x-6 shrink-0">
              <Link href="/kategori/hazir-sistem" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-bold transition-colors">🔥 Hazır Sistemler</Link>
              <Link href="/kategori/ekran-karti" prefetch={true} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-bold transition-colors">Ekran Kartları</Link>
            </nav>

            {/* 🔥 CANLI PC ARAMA KUTUSU 🔥 */}
            <div className="relative w-full max-w-[300px] xl:max-w-md shrink-0 z-50">
              <form onSubmit={handleAramaSubmit} className="relative group w-full">
                <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 cursor-pointer">
                  <Search className="w-4 h-4 text-gray-500 hover:text-[#00d2ff] group-focus-within:text-[#00d2ff] transition-colors duration-300" />
                </button>
                <input
                  type="text"
                  placeholder="Ürün veya marka ara..."
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  className="w-full h-10 bg-[#121212] border border-white/10 focus:border-[#00d2ff] focus:bg-black/80 rounded-xl pl-10 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
                />
                {aramaMetni && (
                  <button type="button" onClick={() => setAramaMetni("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white z-10">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* 🎯 YAZILDIKÇA AŞAĞI AÇILAN CANLI LİSTE 🎯 */}
              {aramaMetni.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  {aramaYukleniyor ? (
                    <div className="flex items-center justify-center p-6 text-[#00d2ff]"><Loader2 className="w-5 h-5 animate-spin" /></div>
                  ) : canliSonuclar.length > 0 ? (
                    <div className="flex flex-col">
                      {canliSonuclar.map((urun) => (
                         <Link key={urun._id} href={"/product/" + urun.slug} onClick={() => setAramaMetni("")} className="flex items-center gap-4 p-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                           <img src={urun.resim} alt={urun.isim} className="w-12 h-12 object-contain bg-white/5 rounded-md p-1" />
                           <div className="flex flex-col overflow-hidden">
                             <span className="text-xs text-white font-medium line-clamp-1">{urun.isim}</span>
                             <span className="text-sm font-black text-[#00d2ff] mt-0.5">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                           </div>
                         </Link>
                      ))}
                      <button onClick={handleAramaSubmit} className="w-full p-3 bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-black text-xs font-black tracking-widest uppercase transition-colors">
                        TÜM SONUÇLARI GÖR
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 text-center text-sm text-gray-400">"{aramaMetni}" bulunamadı</div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* SAĞ: HESABIM & SEPET */}
          <div className="flex items-center space-x-1 md:space-x-3 shrink-0">
            <div ref={hesabimRef} className="relative">
              <button onClick={() => setHesabimAcik(!hesabimAcik)} className={"flex items-center justify-center w-10 h-10 md:w-auto md:h-10 md:px-3 md:space-x-2 rounded-xl transition-colors " + (hesabimAcik ? "text-blue-500 md:bg-blue-600/20 md:border-blue-500/30" : "text-gray-300 hover:text-white md:bg-[#121212] md:border border-white/10")}>
                <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span className="hidden sm:block text-xs font-bold uppercase">{session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}</span>
              </button>

              {hesabimAcik && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-3 z-[60]">
                  {session ? (
                    <>
                      <Link href="/siparislerim" onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-colors">📋 Siparişlerim</Link>
                      {isAdmin && <Link href="/admin" onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-[#10b981] bg-[#10b981]/10 rounded-xl text-sm font-bold mt-2">👑 Yönetim</Link>}
                      <button onClick={() => { setHesabimAcik(false); signOut({ callbackUrl: "/" }); }} className="flex items-center w-full gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-sm mt-2">🚪 Çıkış</button>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" onClick={() => setHesabimAcik(false)} className="flex items-center justify-center gap-2 px-3 py-2 text-black bg-[#00d2ff] rounded-xl text-sm font-black mb-2">🔑 GİRİŞ YAP</Link>
                      <Link href="/kayit" onClick={() => setHesabimAcik(false)} className="flex items-center justify-center gap-2 px-3 py-2 text-gray-300 border border-white/10 rounded-xl text-sm font-bold">📝 YENİ KAYIT</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/sepet" prefetch={true} className="relative flex items-center justify-center w-10 h-10 md:w-auto md:h-10 md:px-4 md:space-x-2 rounded-xl text-gray-300 md:bg-[#121212] md:border border-white/10 hover:border-[#00d2ff]/50">
              <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="hidden sm:block text-xs font-bold uppercase">Sepet</span>
              {sepetAdedi > 0 && <span className="absolute top-0 right-0 md:-top-2 md:-right-2 bg-[#10b981] text-white text-[10px] md:text-xs font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">{sepetAdedi}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* 🔥 MOBİL MENÜ VE CANLI ARAMA 🔥 */}
      {menuAcik && (
        <div className="md:hidden bg-[#050814]/98 backdrop-blur-xl border-t border-gray-800 max-h-[85vh] overflow-y-auto px-4 py-6 space-y-6">
          <div className="relative w-full z-50">
            <form onSubmit={handleAramaSubmit} className="relative group w-full">
              <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center z-10 cursor-pointer">
                <Search className="w-5 h-5 text-gray-500 group-focus-within:text-[#00d2ff]" />
              </button>
              <input type="text" placeholder="Ürün veya marka ara..." value={aramaMetni} onChange={(e) => setAramaMetni(e.target.value)} className="w-full h-12 bg-[#121212] border border-white/10 focus:border-[#00d2ff] rounded-xl pl-12 pr-10 text-base text-white" />
              {aramaMetni && <button type="button" onClick={() => setAramaMetni("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"><X className="w-5 h-5" /></button>}
            </form>

            {/* MOBİL CANLI ARAMA KUTUSU */}
            {aramaMetni.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]">
                {aramaYukleniyor ? (
                  <div className="p-6 text-center text-[#00d2ff] flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>
                ) : canliSonuclar.length > 0 ? (
                  <div className="flex flex-col">
                    {canliSonuclar.map((urun) => (
                       <Link key={urun._id} href={"/product/" + urun.slug} onClick={() => {setAramaMetni(""); setMenuAcik(false);}} className="flex items-center gap-4 p-3 border-b border-white/5">
                         <img src={urun.resim} className="w-10 h-10 object-contain" />
                         <div className="flex flex-col">
                           <span className="text-xs text-white line-clamp-1">{urun.isim}</span>
                           <span className="text-sm font-black text-[#00d2ff]">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                         </div>
                       </Link>
                    ))}
                    <button onClick={handleAramaSubmit} className="p-4 w-full bg-[#00d2ff] text-black font-black text-xs">TÜM SONUÇLARA GİT</button>
                  </div>
                ) : (
                  <div className="p-5 text-center text-sm text-gray-400">Bulunamadı</div>
                )}
              </div>
            )}
          </div>
          
          {menuCategories.map((c, i) => (
            <div key={i}>
              <h3 className="text-[#00d2ff] font-bold text-xs uppercase mb-3">{c.title}</h3>
              <div className="flex flex-col space-y-2">
                {c.items.map((item) => (
                  <Link key={item.slug} href={"/kategori/" + item.slug} onClick={() => setMenuAcik(false)} className="text-gray-300 text-sm py-2">{item.name}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
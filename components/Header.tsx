"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Clock, Flame, ArrowRight, Loader2 } from "lucide-react";

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

const POPULER_KELIMELER = ["Asus ROG", "RTX 4090", "Intel 14. Nesil", "DDR5 RAM", "Samsung 990 Pro"];

// 🔥 ŞEFİN GÜNCELLENMİŞ AKILLI KATEGORİ RADARI 🔥
const akilliKategoriBul = (metin: string) => {
  if (!metin) return null;
  const k = metin.toLowerCase();
  
  if (k.includes("ekran") || k.includes("rtx") || k.includes("gtx") || k.includes("rx ") || k.includes("4070") || k.includes("4080") || k.includes("4090") || k.includes("5070") || k.includes("5080") || k.includes("5090") || k.includes("vga")) return { isim: "Ekran Kartları", slug: "ekran-karti" };
  if (k.includes("işlemci") || k.includes("islemci") || k.includes("intel") || k.includes("ryzen") || k.includes("cpu")) return { isim: "İşlemciler", slug: "islemci" };
  if (k.includes("anakart") || k.includes("motherboard") || k.includes("z790") || k.includes("b650") || k.includes("x670")) return { isim: "Anakartlar", slug: "anakart" };
  if (k.includes("laptop") || k.includes("notebook") || k.includes("macbook")) return { isim: "Laptoplar", slug: "laptop" };
  if (k.includes("kasa") || k.includes("kabin")) return { isim: "Kasalar", slug: "kasa" };
  if (k.includes("hazır") || k.includes("hazir") || k.includes("sistem")) return { isim: "Hazır Sistemler", slug: "hazir-sistem" };
  if (k.includes("ram") || k.includes("bellek") || k.includes("ddr")) return { isim: "RAM Bellekler", slug: "ram" };
  if (k.includes("monitör") || k.includes("monitor") || k.includes("ekran")) return { isim: "Monitörler", slug: "monitor" };
  
  return null;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const gizlenecekSayfalar = ["/sepet", "/odeme", "/giris", "/kayit", "/checkout"];
  if (gizlenecekSayfalar.includes(pathname)) return null; 

  const { sepet } = useCart();
  const [menuAcik, setMenuAcik] = useState(false);
  const [hesabimAcik, setHesabimAcik] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [aramaAcik, setAramaAcik] = useState(false);
  const [aramaMetni, setAramaMetni] = useState("");
  const [canliSonuclar, setCanliSonuclar] = useState<any[]>([]);
  const [populerUrunler, setPopulerUrunler] = useState<any[]>([]);
  const [sonAramalar, setSonAramalar] = useState<string[]>([]);
  const [aramaYukleniyor, setAramaYukleniyor] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hesabimRef = useRef<HTMLDivElement>(null);
  
  const sepetAdedi = sepet.reduce((toplam: number, urun: any) => toplam + (urun.adet || 1), 0);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email?.toLowerCase() === "o9616557@gmail.com";

  useEffect(() => {
    const kayitliAramalar = localStorage.getItem("sonAramalar");
    if (kayitliAramalar) setSonAramalar(JSON.parse(kayitliAramalar));
  }, []);

  useEffect(() => {
    fetch("/api/arama?init=true")
      .then(res => res.json())
      .then(data => setPopulerUrunler(data))
      .catch(() => setPopulerUrunler([]));
  }, []);

  useEffect(() => {
    if (aramaAcik) {
      setTimeout(() => searchInputRef.current?.focus(), 30);
    } else {
      setAramaMetni("");
    }
  }, [aramaAcik]);

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
      }, 150); 
      return () => clearTimeout(timer);
    } else {
      setCanliSonuclar([]);
    }
  }, [aramaMetni]);

  useEffect(() => {
    function disariTiklandi(event: any) {
      if (hesabimRef.current && !hesabimRef.current.contains(event.target)) setHesabimAcik(false);
    }
    document.addEventListener("mousedown", disariTiklandi);
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, []);

  const handleAramaSubmit = (e?: React.FormEvent, ozelKelime?: string) => {
    if (e) e.preventDefault();
    const aranacak = ozelKelime || aramaMetni;
    
    if (aranacak.trim()) {
      const yeniAramalar = [aranacak, ...sonAramalar.filter(k => k !== aranacak)].slice(0, 3);
      setSonAramalar(yeniAramalar);
      localStorage.setItem("sonAramalar", JSON.stringify(yeniAramalar));
      
      setAramaAcik(false);
      window.location.href = "/arama?q=" + encodeURIComponent(aranacak);
    }
  };

  const gecmisAramayiSil = (kelime: string) => {
    const yeni = sonAramalar.filter(k => k !== kelime);
    setSonAramalar(yeni);
    localStorage.setItem("sonAramalar", JSON.stringify(yeni));
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[99] bg-[#050814]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* SOL TARAF: HAMBURGER & LOGO */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none z-[100]" onClick={() => setMenuAcik(!menuAcik)}>
                <span className={"block w-6 h-0.5 bg-white transition-all duration-300 " + (menuAcik ? "rotate-45 translate-y-1.5" : "")}></span>
                <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "opacity-0" : "")}></span>
                <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "-rotate-45 -translate-y-1.5" : "")}></span>
              </button>
              <Link href="/" prefetch={true} className="text-white font-black text-2xl tracking-tight flex items-center relative z-[100]">
                BİLGİN <span className="text-[#00d2ff] ml-1">PC</span>
              </Link>
            </div>

            {/* ORTA: MASAÜSTÜ MEGA MENÜ */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button className="flex items-center space-x-2 text-white bg-white/5 hover:bg-[#00d2ff]/10 border border-white/10 hover:border-[#00d2ff]/30 px-4 py-2 rounded-xl font-semibold transition-all text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  <span>Tüm Kategoriler</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 pt-6 w-[1100px] z-50">
                    <div className="bg-[#09090b]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] p-10">
                      <div className="grid grid-cols-4 gap-12">
                        {menuCategories.map((category, index) => (
                          <div key={index}>
                            <h3 className="text-[#00d2ff] font-bold text-sm tracking-wider uppercase mb-6 border-b border-white/10 pb-3">{category.title}</h3>
                            <ul className="space-y-4">
                              {category.items.map((item) => (
                                <li key={item.slug}>
                                  <Link href={"/kategori/" + item.slug} prefetch={true} className="text-gray-400 hover:text-white hover:translate-x-1 hover:text-[#00d2ff] transition-all duration-200 block text-base">{item.name}</Link>
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
                <Link href="/kategori/hazir-sistem" prefetch={true} className="text-gray-300 hover:text-white hover:text-[#00d2ff] text-sm font-bold transition-colors">🔥 Hazır Sistemler</Link>
                <Link href="/kategori/ekran-karti" prefetch={true} className="text-gray-300 hover:text-white hover:text-[#00d2ff] text-sm font-medium transition-colors">Ekran Kartları</Link>
                <Link href="/kategori/islemci" prefetch={true} className="text-gray-300 hover:text-white hover:text-[#00d2ff] text-sm font-medium transition-colors">İşlemciler</Link>
                <Link href="/kategori/anakart" prefetch={true} className="text-gray-300 hover:text-white hover:text-[#00d2ff] text-sm font-medium transition-colors">Anakartlar</Link>
              </nav>
            </div>

            {/* 🎯 SAĞ TARAF: BÜYÜTEÇ, HESABIM VE SEPET (TEK TİP UYUM) 🎯 */}
            <div className="flex items-center space-x-2 shrink-0">
              
              <button onClick={() => setAramaAcik(true)} className="flex items-center justify-center h-10 px-3 md:px-4 space-x-2 rounded-xl text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00d2ff]/50 hover:text-white transition-all group">
                <Search className="w-5 h-5 text-gray-400 group-hover:text-[#00d2ff] transition-colors" />
                <span className="hidden md:block text-xs font-bold uppercase tracking-wider">Ürün Ara...</span>
              </button>

              <div ref={hesabimRef} className="relative">
                <button onClick={() => setHesabimAcik(!hesabimAcik)} className={`flex items-center justify-center h-10 px-3 md:px-4 space-x-2 rounded-xl transition-all border ${hesabimAcik ? "bg-[#00d2ff]/10 border-[#00d2ff]/50 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-[#00d2ff]/50 hover:text-white"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">{session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}</span>
                </button>

                {hesabimAcik && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-[#09090b] border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] p-2 z-50">
                    <Link href="/siparis-takip" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-[#00d2ff] bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 rounded-xl text-sm font-bold mb-1 transition-colors">📦 Sipariş Takip</Link>
                    <div className="h-px bg-white/5 my-2"></div>
                    {session ? (
                      <>
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <p className="text-white text-sm font-bold">Hoş Geldin, 👋</p>
                          <p className="text-[#00d2ff] text-xs font-semibold truncate">{session.user?.name || session.user?.email}</p>
                        </div>
                        <Link href="/siparislerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-colors">📋 Siparişlerim</Link>
                        <Link href="/adreslerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-colors">📍 Adreslerim</Link>
                        <Link href="/favorilerim" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-colors">❤️ Favorilerim</Link>
                        <div className="h-px bg-white/5 my-2"></div>
                        {isAdmin && (
                          <>
                            <Link href="/admin" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center gap-3 px-3 py-2 text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20 rounded-xl text-sm font-bold transition-colors">👑 Yönetim Paneli</Link>
                            <div className="h-px bg-white/5 my-2"></div>
                          </>
                        )}
                        <button onClick={() => { setHesabimAcik(false); signOut({ callbackUrl: "/" }); }} className="flex items-center gap-3 px-3 py-2 w-full text-left text-red-500 hover:bg-red-500/10 rounded-xl text-sm transition-colors">🚪 Çıkış Yap</button>
                      </>
                    ) : (
                      <>
                        <Link href="/giris" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center justify-center gap-2 px-3 py-2 text-black bg-[#00d2ff] hover:bg-[#00c4db] rounded-xl text-sm font-bold mb-2 transition-colors">🔑 Giriş Yap</Link>
                        <Link href="/kayit" prefetch={true} onClick={() => setHesabimAcik(false)} className="flex items-center justify-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl text-sm font-bold transition-colors">📝 Yeni Kayıt</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link href="/sepet" prefetch={true} className="relative flex items-center justify-center h-10 px-3 md:px-4 space-x-2 rounded-xl transition-all text-gray-300 bg-white/5 border border-white/10 hover:border-[#00d2ff]/50 hover:bg-white/10 hover:text-white group">
                <svg className="w-5 h-5 group-hover:text-[#00d2ff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">Sepet</span>
                {sepetAdedi > 0 && <span className="absolute -top-2 -right-2 bg-[#10b981] text-white text-[10px] md:text-xs font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">{sepetAdedi}</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* 📱 ŞEFİN YENİ TAM EKRAN MOBİL MENÜSÜ 📱 */}
        <div className={`md:hidden fixed inset-0 bg-[#050814]/95 backdrop-blur-2xl z-40 transition-all duration-300 flex flex-col ${menuAcik ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"}`}>
          <div className="flex-1 overflow-y-auto px-6 py-24 space-y-8">
            {menuCategories.map((category, index) => (
              <div key={index} className="animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <h3 className="text-[#00d2ff] font-black text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">{category.title}</h3>
                <div className="flex flex-col space-y-4">
                  {category.items.map((item) => (
                    <Link key={item.slug} href={"/kategori/" + item.slug} prefetch={true} onClick={() => setMenuAcik(false)} className="text-gray-300 hover:text-white text-lg font-bold flex items-center justify-between group">
                      {item.name}
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#00d2ff] transform group-hover:translate-x-2 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 🔥 RAZER STYLE TAM EKRAN ARAMA MODALI 🔥 */}
      {aramaAcik && (
        <div className="fixed inset-0 z-[99999] bg-[#09090b]/98 backdrop-blur-3xl flex flex-col overflow-hidden animate-in fade-in duration-100">
          <div className="p-4 md:p-6 border-b border-white/10 flex items-center gap-4">
            <form onSubmit={handleAramaSubmit} className="relative w-full max-w-4xl mx-auto flex-1">
              <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center z-10">
                <Search className="w-5 h-5 text-[#00d2ff]" />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ürün, Marka veya Kategori Ara..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 focus:border-[#00d2ff] focus:bg-[#121212] rounded-2xl pl-12 pr-12 text-lg text-white placeholder-gray-500 outline-none transition-all"
              />
              {aramaMetni && (
                <button type="button" onClick={() => setAramaMetni("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white z-10">
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
            <button onClick={() => setAramaAcik(false)} className="text-gray-400 hover:text-white p-2 font-bold text-sm">Kapat</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full pb-32">
            
            {/* YAZI YAZILDIYSA CANLI SONUÇLAR */}
            {aramaMetni.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  {aramaYukleniyor ? <Loader2 className="w-4 h-4 animate-spin text-[#00d2ff]" /> : <Search className="w-4 h-4" />}
                  ARAMA SONUÇLARI
                </h3>
                
                {canliSonuclar.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {canliSonuclar.map((urun) => (
                      <Link 
                        key={urun._id} 
                        href={"/product/" + urun.slug} 
                        prefetch={true} 
                        onClick={() => setAramaAcik(false)} 
                        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00d2ff]/30 rounded-2xl transition-all group"
                      >
                        <div className="w-16 h-16 bg-black/50 rounded-xl p-2 flex shrink-0 items-center justify-center">
                          <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">{urun.isim}</span>
                          <span className="text-lg font-black text-[#00d2ff]">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  !aramaYukleniyor && <div className="text-center py-10 text-gray-500">Aradığınız kriterde ürün bulunamadı.</div>
                )}
                
                {canliSonuclar.length > 0 && (
                  <div className="mt-4 px-2">
                    {(akilliKategoriBul(aramaMetni) || akilliKategoriBul(canliSonuclar[0]?.isim)) ? (
                      <Link 
                        href={`/kategori/${(akilliKategoriBul(aramaMetni) || akilliKategoriBul(canliSonuclar[0]?.isim))?.slug}`} 
                        onClick={() => setAramaAcik(false)} 
                        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#00d2ff]/10 to-transparent hover:from-[#00d2ff]/20 border border-[#00d2ff]/20 hover:border-[#00d2ff]/50 rounded-2xl text-[#00d2ff] transition-all group shadow-[0_0_15px_rgba(0,210,255,0.05)] hover:shadow-[0_0_25px_rgba(0,210,255,0.15)]"
                      >
                        <span className="font-bold tracking-wide text-sm">
                          Tüm {(akilliKategoriBul(aramaMetni) || akilliKategoriBul(canliSonuclar[0]?.isim))?.isim}
                        </span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <button onClick={() => handleAramaSubmit()} className="w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-gray-300 hover:text-white transition-all group">
                        <span className="font-bold tracking-wide text-sm">
                          Tüm "{aramaMetni}" Sonuçları
                        </span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* KUTU BOŞSA VİTRİN */
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-100">
                
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Flame className="w-4 h-4 text-[#00d2ff]" /> POPÜLER KELİMELER
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULER_KELIMELER.map((kelime) => (
                      <button key={kelime} onClick={() => handleAramaSubmit(undefined, kelime)} className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#00d2ff]/50 hover:bg-[#00d2ff]/10 text-gray-300 hover:text-white rounded-full text-sm transition-all">
                        {kelime}
                      </button>
                    ))}
                  </div>
                </div>

                {sonAramalar.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4" /> SON ARAMALAR
                    </h3>
                    <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      {sonAramalar.map((kelime, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleAramaSubmit(undefined, kelime)}>
                          <span className="text-gray-300 group-hover:text-[#00d2ff]">"{kelime}"</span>
                          <button onClick={(e) => { e.stopPropagation(); gecmisAramayiSil(kelime); }} className="text-gray-500 hover:text-red-500 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {populerUrunler.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">EN ÇOK SATANLAR</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {populerUrunler.map((urun) => (
                        <Link 
                          key={urun._id} 
                          href={"/product/" + urun.slug} 
                          prefetch={true} 
                          onClick={() => setAramaAcik(false)} 
                          className="bg-[#121212] border border-white/5 hover:border-[#00d2ff]/30 p-3 rounded-2xl group transition-colors flex flex-col"
                        >
                          <div className="aspect-square bg-black/40 rounded-xl mb-3 flex items-center justify-center p-2">
                             <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="text-xs text-gray-300 font-medium line-clamp-2 flex-1 mb-2">{urun.isim}</h4>
                          <span className="text-sm font-black text-white">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
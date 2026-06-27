"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Clock, Flame, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
      { name: "Oyun Kolu", slug: "oyun-kolu" },
      { name: "Oyun Direksiyonu", slug: "oyun-direksiyonu" },
      { name: "Hoparlör (Speaker)", slug: "hoparlor" },
    ]
  },
  {
    title: "Sistem, Laptop & Yazılım",
    items: [
     { name: "Oyun Bilgisayarı", slug: "oyun-bilgisayari" },
      { name: "Premium Laptop & Notebook", slug: "laptop" },
      { name: "Masaüstü Bilgisayar", slug: "masaustu" },
      { name: "OEM Paketler (Toplama PC)", slug: "oem-paket" },
      { name: "İşletim Sistemi", slug: "isletim-sistemi" },
      { name: "Microsoft Office & Yazılım", slug: "yazilim" },
    ]
  },
  {
    title: "Ağ, Aksesuar & Kablo",
    items: [
      { name: "Modem", slug: "modem" },
      { name: "USB Bellek & Hafıza Kartı", slug: "usb" },
      { name: "Kablolar & Çeviriciler", slug: "kablolar" },
      { name: "Akım Koruyucu Priz", slug: "akim-koruyucu" },
      { name: "Notebook Soğutucu", slug: "notebook-aksesuar" },
      { name: "Şarj Aletleri & Powerbank", slug: "sarj-powerbank" },
      { name: "Bluetooth Hoparlör", slug: "bluetooth-ses" },
      { name: "Termal Macun", slug: "termal-macun" },
    ]
  }
];


function akilliKategoriBul(metin: string) {
  if (!metin) return null;
  const k = metin.toLowerCase();

  if (k.includes("topla") || k.includes("kendin") || k.includes("sihirbaz")) return { isim: "Kendin Topla", slug: "kendin-topla" };
  if (k.includes("ekran") || k.includes("rtx") || k.includes("gtx") || k.includes("rx ") || k.includes("4070") || k.includes("4080") || k.includes("4090") || k.includes("5070") || k.includes("5080") || k.includes("5090") || k.includes("vga")) return { isim: "Ekran Kartları", slug: "ekran-karti" };
  if (k.includes("işlemci") || k.includes("islemci") || k.includes("intel") || k.includes("ryzen") || k.includes("cpu")) return { isim: "İşlemciler", slug: "islemci" };
  if (k.includes("anakart") || k.includes("motherboard") || k.includes("z790") || k.includes("b650") || k.includes("x670")) return { isim: "Anakartlar", slug: "anakart" };
  if (k.includes("laptop") || k.includes("notebook")) return { isim: "Laptoplar", slug: "laptop" };
  if (k.includes("kasa") || k.includes("kabin")) return { isim: "Kasalar", slug: "kasa" };
  if (k.includes("ram") || k.includes("bellek") || k.includes("ddr")) return { isim: "RAM Bellekler", slug: "ram" };
  if (k.includes("monitör") || k.includes("monitor") || k.includes("ekran")) return { isim: "Monitörler", slug: "monitor" };

  return null;
}

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
  const [cikisOnayAcik, setCikisOnayAcik] = useState(false); // 🚀 YENİ EKLEDİĞİMİZ MERKEZİ ONAY MOTORU
  // 🚀 GÜVENLİK MOTORU: Çıkış yaparken çırağın defterini yakar
  const guvenliCikisYap = async () => {
    localStorage.removeItem("bilgin_kayitli_sistemler");
    await signOut(); 
  };
  // 🚀 KAPIDAKİ AKILLI ÇIRAK MOTORU (SADECE GİRİŞ YAPINCA ÇALIŞIR)
  useEffect(() => {
    // Şefim giriş yapmadıysa çırak yerinden kıpırdamaz, bekler.
    if (!session?.user?.email) return;

    const cirakDepoyaKossun = async () => {
      try {
        const res = await fetch("/api/sistemlerim?t=" + new Date().getTime());
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            localStorage.setItem("bilgin_kayitli_sistemler", JSON.stringify(data.systems));
          }
        }
      } catch (error) {}
    };

    cirakDepoyaKossun();
  }, [session]);
// 🔥 ŞEFİN KUSURSUZ KATEGORİ BULUCU MOTORU 🔥
const kelimeTemizle = (metin: string) => {
  return metin.toLowerCase()
    .replace(/[\s-]/g, '') 
    .replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g');
};

const aramaMetniTemiz = kelimeTemizle(aramaMetni);

const bulunanKategoriler = aramaMetniTemiz.length > 1 
  ? menuCategories.flatMap(kat => kat.items).filter(item => 
      kelimeTemizle(item.name).includes(aramaMetniTemiz) || 
      kelimeTemizle(item.slug).includes(aramaMetniTemiz)
    )
  : [];
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
// 🚀 HAMBURGER VEYA HESABIM AÇILINCA SAYFAYI BETON GİBİ DONDURAN KİLİT
  useEffect(() => {
    if (menuAcik || hesabimAcik) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuAcik, hesabimAcik]);
const handleAramaSubmit = (e?: React.FormEvent, ozelKelime?: string) => {
    if (e) e.preventDefault();
    const aranacak = ozelKelime || aramaMetni;
    
    if (aranacak.trim()) {
      const yeniAramalar = [aranacak, ...sonAramalar.filter(k => k !== aranacak)].slice(0, 3);
      setSonAramalar(yeniAramalar);
      localStorage.setItem("sonAramalar", JSON.stringify(yeniAramalar));
      
      setAramaAcik(false);
      
      // ❌ ESKİ KOD: Sayfayı tamamen yenileyip loading ekranına düşürüyordu
      // window.location.href = "/arama?q=" + encodeURIComponent(aranacak);
      
      // ✅ YENİ KOD: Sayfa yenilenmeden, fişek gibi arama sonuçlarına geçer
      router.push("/arama?q=" + encodeURIComponent(aranacak));
    }
  };

  const gecmisAramayiSil = (kelime: string) => {
    const yeni = sonAramalar.filter(k => k !== kelime);
    setSonAramalar(yeni);
    localStorage.setItem("sonAramalar", JSON.stringify(yeni));
  };

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-[99] bg-[#050814]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">

            {/* SOL TARAF: HAMBURGER & LOGO */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <button className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none z-[100]" onClick={() => setMenuAcik(!menuAcik)}>
                <span className={"block w-6 h-0.5 bg-white transition-all duration-300 " + (menuAcik ? "rotate-45 translate-y-1.5" : "")}></span>
                <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "opacity-0" : "")}></span>
                <span className={"block w-6 h-0.5 bg-white mt-1 transition-all duration-300 " + (menuAcik ? "-rotate-45 -translate-y-1.5" : "")}></span>
              </button>
            <Link href="/" prefetch={false} className={`text-white font-black text-2xl tracking-tight flex items-center relative z-[100] transition-all duration-300 ${menuAcik ? "pointer-events-none opacity-20 md:pointer-events-auto md:opacity-100" : ""}`}>
  BİLGİN <span className="text-[#3b82f6] ml-1">PC</span>
</Link>
            </div>

            {/* ORTA: MASAÜSTÜ MEGA MENÜ */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center h-full">
              <div className="relative flex items-center h-full" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button className="flex items-center space-x-2 text-white hover:text-[#3b82f6] py-2 font-semibold transition-colors text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  <span>Tüm Kategoriler</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-[60px] left-0 pt-[20px] w-[1100px] z-50">
                    <div className="bg-[#09090b]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_30px_50px_rgba(0,0,0,0.8)] p-10">
                      <div className="grid grid-cols-4 gap-12">
                        {menuCategories.map((category, index) => (
                          <div key={index}>
                            <h3 className="text-[#3b82f6] font-bold text-sm tracking-wider uppercase mb-6 border-b border-white/10 pb-3">{category.title}</h3>
                            <ul className="space-y-4">
                              {category.items.map((item) => (
                                <li key={item.slug}>
                                  <Link href={"/kategori/" + item.slug} prefetch={false} className="text-gray-400 hover:text-white hover:translate-x-1 hover:text-[#3b82f6] transition-all duration-200 block text-base">{item.name}</Link>
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
          {/* 🔥 ŞEFİM, YER DEĞİŞTİ! ÜST MENÜDE ARTIK KENDİN TOPLA EN BAŞTA PARLIYOR! */}
          <Link href="/kendin-topla" prefetch={false} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">🔧 Kendin Topla</Link>
          <Link href="/kategori/ekran-karti" prefetch={false} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">Ekran Kartları</Link>
          <Link href="/kategori/islemci" prefetch={false} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">İşlemciler</Link>
          <Link href="/kategori/anakart" prefetch={false} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">Anakartlar</Link>
        </nav>
            </div>

            {/* SAĞ TARAF: SİMGE SOLDA, YAZI SAĞDA */}
           <div className={`flex items-center gap-2 md:gap-4 shrink-0 h-full transition-all duration-300 ${menuAcik ? "pointer-events-none opacity-20 md:pointer-events-auto md:opacity-100" : ""}`}>
              
              {/* ARAMA */}
              <button onClick={() => setAramaAcik(true)} className="flex items-center gap-2 text-gray-300 hover:text-[#3b82f6] transition-colors p-2 group">
                <span className="hidden md:block text-sm font-bold">Ara</span>
                <Search className="w-5 h-5 md:w-5 md:h-5 shrink-0 group-hover:scale-110 transition-transform" />
              </button>

         {/* HESABIM (DİREKT LÜKS GARAJA GİDER) */}
              <div className="relative flex items-center h-full">
                {/* 🚀 ARTIK HERKESİ HESABIM SAYFASINA ALIYORUZ, VİTRİNİ ORADA GÖRECEKLER */}
                <Link href="/hesabim" prefetch={false} className="flex items-center gap-2 p-2 text-gray-300 hover:text-[#3b82f6] transition-colors group">
                  <span className="hidden sm:block text-sm font-bold">
                    {session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}
                  </span>
                  <svg className="w-5 h-5 md:w-5 md:h-5 shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </Link>
              </div>

              {/* SEPET ALANI */}
              <Link href="/sepet" prefetch={false} className="relative flex items-center gap-2 p-2 text-gray-300 hover:text-[#3b82f6] transition-colors group">
                <span className="hidden md:block text-sm font-bold">Sepet</span>
                <div className="relative">
                  <svg className="w-5 h-5 md:w-5 md:h-5 shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  {/* Sayacın parlaması bir tık daha düşürüldü şefim */}
                  {sepetAdedi > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050814] shadow-[0_0_4px_rgba(239,68,68,0.4)] select-none leading-none pt-[0.5px]">
                      {sepetAdedi}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 📱 KUSURSUZ MOBİL MENÜ 📱 */}
      <div className={`md:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-[#050814] z-[98] overflow-y-auto transition-transform duration-300 ${menuAcik ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-6 py-8 pb-32">
          
      {/* 🚀 ÖZEL MENÜ BÖLÜMÜ (KUTUSUZ, SADE VE YEŞİL TASARIM) */}
          <div className="flex flex-col mb-8">
            
            {/* 2. KENDİN TOPLA (ALTTA) */}
            <Link
              href="/kendin-topla"
              prefetch={false}
              onClick={() => setMenuAcik(false)}
              className="flex items-center justify-between py-4 border-b border-emerald-500/20 group mb-2"
            >
              <span className="font-black tracking-widest text-emerald-400 uppercase text-sm flex items-center gap-3">
                🔧 Kendin Topla
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-400 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </Link>
            
          </div>
          {menuCategories.map((category, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-[#3b82f6] font-black text-sm tracking-widest uppercase mb-4 border-b border-white/10 pb-3">{category.title}</h3>
              <div className="flex flex-col">
                {category.items.map((item) => (
                  <Link 
                    key={item.slug} 
                    href={"/kategori/" + item.slug} 
                    prefetch={false} 
                    onClick={() => setMenuAcik(false)} 
                    className="text-white text-base font-bold py-3.5 border-b border-white/5 flex items-center justify-between group"
                  >
                    {item.name}
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#3b82f6] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 TAM EKRAN ARAMA MODALI 🔥 */}
      {aramaAcik && (
        <div className="fixed inset-0 z-[99999] bg-[#09090b]/98 backdrop-blur-3xl flex flex-col overflow-hidden animate-in fade-in duration-100">
         <div className="border-b border-white/10">
      {/* 🚀 İKİSİNİ AYNI HİZAYA SOKAN VE DIŞARI TAŞIRMAYAN ANA KUTU */}
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 flex items-center gap-4">
        
        {/* ARAMA ÇUBUĞU KISMI */}
        <form onSubmit={handleAramaSubmit} className="relative flex-1 w-full">
          <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center z-10">
            <Search className="w-5 h-5 text-[#3b82f6]" />
          </button>
          
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Ürün, Marka veya Kategori Ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="w-full h-14 bg-white/5 border border-white/10 focus:border-[#3b82f6] focus:bg-[#121212] rounded-2xl pl-12 pr-12 text-lg text-white placeholder-gray-500 outline-none transition-all"
          />
          
          {aramaMetni && (
            <button type="button" onClick={() => setAramaMetni("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white z-10">
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* 🔥 KAPAT BUTONU ARTIK KUTUNUN İÇİNDE, SAĞA KAÇAMAZ! */}
        <button onClick={() => setAramaAcik(false)} className="text-gray-400 hover:text-white p-2 font-bold text-sm shrink-0 uppercase tracking-widest transition-colors">
          KAPAT
        </button>

      </div>
    </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full pb-32">
         {aramaMetni.length > 0 ? (
              // ANA DÜZEN: Mobilde alt alta, PC'de yan yana (Sol: Kategoriler, Sağ: Ürünler)
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start animate-in fade-in duration-300">
                
            {/* ⬅️ SOL SÜTUN: KATEGORİLER */}
                <div className="w-full md:w-[280px] shrink-0">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <Search className="w-3.5 h-3.5 text-[#3b82f6]" /> İLGİLİ KATEGORİLER
                  </h3>
                  
                  {bulunanKategoriler.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {bulunanKategoriler.map((kat) => (
                        <Link 
                          key={kat.slug} 
                          href={"/kategori/" + kat.slug} 
                          prefetch={false}
                          onClick={() => setAramaAcik(false)} 
                          className="relative overflow-hidden px-4 py-3.5 bg-black/40 border border-white/5 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/[0.02] text-gray-400 hover:text-white rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-bold group"
                        >
                          {/* 1. Efekt: Üstüne gelince solda beliren mavi neon çizgi */}
                          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-gradient-to-b from-[#3b82f6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* 2. Efekt: Modern, parlayan çip/nokta tasarımı */}
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#3b82f6]/30 group-hover:bg-[#3b82f6]/10 flex items-center justify-center shrink-0 transition-all duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-[#3b82f6] group-hover:shadow-[0_0_10px_#3b82f6] transition-all duration-300"></div>
                          </div>
                          
                          {/* Kategori Adı */}
                          <span className="flex-1 tracking-wide transition-colors">{kat.name}</span>
                          
                          {/* 3. Efekt: Sağdan kayarak gelen şık ok işareti */}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-[#3b82f6] transition-all duration-300" />
                        </Link>
                      ))}
                    </div>
                 ) : null}
                </div>
                {/* ➡️ SAĞ SÜTUN: ÜRÜN SONUÇLARI */}
                <div className="w-full flex-1 min-w-0">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    {aramaYukleniyor ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3b82f6]" /> : <Search className="w-3.5 h-3.5" />}
                    ÜRÜN SONUÇLARI
                  </h3>
                  
                  {canliSonuclar.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {canliSonuclar.map((urun) => (
                        <Link 
                          key={urun._id} 
                          href={"/product/" + urun.slug} 
                          prefetch={false} 
                          onClick={() => setAramaAcik(false)} 
                          className="flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#3b82f6]/30 rounded-2xl transition-all group"
                        >
                          <div className="w-16 h-16 bg-black/50 rounded-xl p-2 flex shrink-0 items-center justify-center">
                            <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">{urun.isim}</span>
                            <span className="text-lg font-black text-[#3b82f6]">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !aramaYukleniyor && (
                      <div className="text-center py-16 flex flex-col items-center justify-center bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
                        <span className="text-4xl mb-3 opacity-20">🔍</span>
                        <span className="text-gray-500 font-medium text-sm">Aradığınız kriterde ürün bulunamadı.</span>
                      </div>
                    )
                  )}
                </div>

              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-100">
             <div>
        
        </div>
                {sonAramalar.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4" /> SON ARAMALAR
                    </h3>
                    <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      {sonAramalar.map((kelime, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleAramaSubmit(undefined, kelime)}>
                          <span className="text-gray-300 group-hover:text-[#3b82f6]">"{kelime}"</span>
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
                          prefetch={false} 
                          onClick={() => setAramaAcik(false)} 
                          className="bg-[#121212] border border-white/5 hover:border-[#3b82f6]/30 p-3 rounded-2xl group transition-colors flex flex-col"
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
      {/* 🚀 HEM PC HEM MOBİLDE EKRANIN TAM ORTASINA ÇÖKEN ULTRA LÜKS ONAY PANELİ */}
      {cikisOnayAcik && (
        <div className="fixed inset-0 z-[100005] flex items-center justify-center bg-[#050814]/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          
          <div className="bg-[#09090b] border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-150">
            
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl mb-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                🚪
              </div>
              <h3 className="text-white font-bold text-base mb-1 tracking-wide">Çıkış Yapılıyor</h3>
              <p className="text-gray-400 text-xs leading-relaxed px-2">Hesabınızdan güvenli bir şekilde ayrılmak istediğinize emin misiniz?</p>
            </div>

            <div className="flex border-t border-white/5 bg-[#121215]">
              <button onClick={() => setCikisOnayAcik(false)} className="w-full border-r border-white/5 px-4 py-3 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors tracking-wide">
                İptal Et
              </button>
              <button onClick={async () => { 
                setCikisOnayAcik(false); 
                setHesabimAcik(false); 
                localStorage.removeItem("bilgin_kayitli_sistemler"); 
                await signOut({ redirect: false }); 
              }} className="w-full px-4 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors tracking-wide uppercase">
                Çıkış Yap
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
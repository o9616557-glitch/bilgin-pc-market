"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, X, Clock, ArrowRight, ChevronRight, ChevronDown, Loader2, 
  Menu, Cpu, Mouse, Keyboard, Monitor, Headphones, Speaker, 
  Server, Laptop, Wifi, Palette, CheckCircle2, Wrench, Gamepad2, Cable 
} from "lucide-react";

// ŞEFİN YENİ BÖLÜNMÜŞ, 6 PARÇALI MEGA MENÜ ENVANTERİ
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
    title: "Çevre Birimleri",
    items: [
      { name: "Oyuncu Monitörleri", slug: "monitor" },
      { name: "Klavye", slug: "klavye" },
      { name: "Mouse & Mouse Pad", slug: "mouse" },
      { name: "Hoparlör (Speaker)", slug: "hoparlor" },
    ]
  },
  {
    title: "Oyuncu Ekipmanları",
    items: [
      { name: "Oyuncu Kulaklıkları", slug: "kulaklik" },
      { name: "Yayıncı Mikrofonları", slug: "mikrofon" },
      { name: "Oyun Kolu", slug: "oyun-kolu" },
      { name: "Oyun Direksiyonu", slug: "oyun-direksiyonu" },
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
    title: "Ağ Ürünleri & Kablolar",
    items: [
      { name: "Modem & Router", slug: "modem" },
      { name: "Kablolar & Çeviriciler", slug: "kablolar" },
    ]
  },
  {
    title: "Aksesuar & Güç",
    items: [
      { name: "USB Bellek & Hafıza Kartı", slug: "usb" },
      { name: "Akım Koruyucu Priz", slug: "akim-koruyucu" },
      { name: "Notebook Soğutucu", slug: "notebook-aksesuar" },
      { name: "Şarj Aletleri & Powerbank", slug: "sarj-powerbank" },
      { name: "Bluetooth Hoparlör", slug: "bluetooth-ses" },
      { name: "Termal Macun", slug: "termal-macun" },
    ]
  }
];

// 🎨 15'Lİ GENİŞLETİLMİŞ RENK PALETİ VE SİYAH/DARK SEÇENEĞİ
const Ikonlar: any = { Cpu, Mouse, Keyboard, Monitor, Headphones, Speaker, Server, Laptop, Wifi, Wrench, Gamepad2, Cable };
const renkSecenekleri = [
  { border: "border-cyan-500/50", hoverBorder: "hover:border-cyan-400", ikon: "text-cyan-400", hex: "bg-cyan-400" },
  { border: "border-blue-500/50", hoverBorder: "hover:border-blue-400", ikon: "text-blue-400", hex: "bg-blue-500" },
  { border: "border-indigo-500/50", hoverBorder: "hover:border-indigo-400", ikon: "text-indigo-400", hex: "bg-indigo-500" },
  { border: "border-purple-500/50", hoverBorder: "hover:border-purple-400", ikon: "text-purple-400", hex: "bg-purple-500" },
  { border: "border-fuchsia-500/50", hoverBorder: "hover:border-fuchsia-400", ikon: "text-fuchsia-400", hex: "bg-fuchsia-500" },
  { border: "border-pink-500/50", hoverBorder: "hover:border-pink-400", ikon: "text-pink-400", hex: "bg-pink-500" },
  { border: "border-rose-500/50", hoverBorder: "hover:border-rose-400", ikon: "text-rose-400", hex: "bg-rose-500" },
  { border: "border-red-500/50", hoverBorder: "hover:border-red-400", ikon: "text-red-400", hex: "bg-red-500" },
  { border: "border-orange-500/50", hoverBorder: "hover:border-orange-400", ikon: "text-orange-400", hex: "bg-orange-500" },
  { border: "border-amber-500/50", hoverBorder: "hover:border-amber-400", ikon: "text-amber-400", hex: "bg-amber-500" },
  { border: "border-yellow-400/50", hoverBorder: "hover:border-yellow-300", ikon: "text-yellow-400", hex: "bg-yellow-400" },
  { border: "border-lime-500/50", hoverBorder: "hover:border-lime-400", ikon: "text-lime-400", hex: "bg-lime-400" },
  { border: "border-emerald-500/50", hoverBorder: "hover:border-emerald-400", ikon: "text-emerald-400", hex: "bg-emerald-500" },
  { border: "border-slate-400/50", hoverBorder: "hover:border-slate-300", ikon: "text-slate-300", hex: "bg-slate-400" },
  { border: "border-white/10", hoverBorder: "hover:border-white/30", ikon: "text-slate-500", hex: "bg-[#020617] border border-slate-600" },
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
  const [cikisOnayAcik, setCikisOnayAcik] = useState(false);

  // 🚀 KİBAR VE SÜRÜKLENEBİLİR TAM EKRAN MOTORU
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [seciliKategoriId, setSeciliKategoriId] = useState<string | null>(null);
  const [acikAkordiyon, setAcikAkordiyon] = useState<string | null>(null); 
  
  const suruklenenRef = useRef<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // V4: Standart Cyan renkle (0) başlayan temiz kurulum hafızası
  const [mobilKategoriler, setMobilKategoriler] = useState(() => {
    if(typeof window !== "undefined") {
       const saved = localStorage.getItem("bilgin_mobil_kategoriler_v4");
       if(saved) return JSON.parse(saved);
    }
    return [
       { id: "kendin", isim: "Kendin Topla", ikonId: "Wrench", renkIndex: 0, isLink: true, link: "/kendin-topla" },
       { id: "bilesen", isim: "Bilgisayar Bileşenleri", ikonId: "Cpu", renkIndex: 0, subItems: menuCategories[0].items },
       { id: "cevre", isim: "Çevre Birimleri", ikonId: "Monitor", renkIndex: 0, subItems: menuCategories[1].items },
       { id: "oyuncu", isim: "Oyuncu Ekipmanları", ikonId: "Gamepad2", renkIndex: 0, subItems: menuCategories[2].items },
       { id: "sistem", isim: "Sistem, Laptop & Yazılım", ikonId: "Laptop", renkIndex: 0, subItems: menuCategories[3].items },
       { id: "ag", isim: "Ağ Ürünleri & Kablolar", ikonId: "Wifi", renkIndex: 0, subItems: menuCategories[4].items },
       { id: "aksesuar", isim: "Aksesuar & Güç", ikonId: "Cable", renkIndex: 0, subItems: menuCategories[5].items },
    ];
  });

  // 🚀 BİNGO 1: GİRİŞ YAPILDIĞINDA MONGODB'DEN KAYITLARI ÇEK
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/menu-ayarlari?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.mobilKategoriler && data.data.mobilKategoriler.length > 0) {
            setMobilKategoriler(data.data.mobilKategoriler);
            localStorage.setItem("bilgin_mobil_kategoriler_v4", JSON.stringify(data.data.mobilKategoriler));
          }
        })
        .catch(e => console.error("Mobil kategori çekme hatası:", e));
    }
  }, [session]);

  // 🚀 BİNGO 2: YENİ DİZİLİMİ VE RENKLERİ MONGODB'YE KAYDET
  const veritabaninaKaydet = async (guncelListe: any[]) => {
    if (!session?.user?.email) return;
    try {
      await fetch('/api/menu-ayarlari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kullaniciEmail: session.user.email,
          mobilKategoriler: guncelListe
        })
      });
    } catch (error) {
      console.error("Mobil kategori kaydetme hatası:", error);
    }
  };

  useEffect(() => {
    if(typeof window !== "undefined") {
      localStorage.setItem("bilgin_mobil_kategoriler_v4", JSON.stringify(mobilKategoriler));
    }
  }, [mobilKategoriler]);

  useEffect(() => {
    if (!menuAcik) {
      const timer = setTimeout(() => {
        setAcikAkordiyon(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [menuAcik]);

  const handleDragEnter = (hedefIndex: number) => {
    const suruklenenIndex = suruklenenRef.current;
    if (suruklenenIndex === null || suruklenenIndex === hedefIndex) return;

    setMobilKategoriler((eskiListe: any) => {
      const yeniListe = [...eskiListe];
      const suruklenenOge = yeniListe.splice(suruklenenIndex, 1)[0];
      yeniListe.splice(hedefIndex, 0, suruklenenOge);
      return yeniListe;
    });
    
    suruklenenRef.current = hedefIndex;
    setDraggedIndex(hedefIndex);
  };

  const renkUygula = (renkIndex: number) => {
    if (seciliKategoriId !== null) {
      setMobilKategoriler((eski: any[]) => 
        eski.map(k => k.id === seciliKategoriId ? { ...k, renkIndex } : k)
      );
    }
  };

  const toggleAkordiyon = (id: string) => {
    if (isPaletteOpen) return; 
    setAcikAkordiyon(prev => prev === id ? null : id);
  };

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

  useEffect(() => {
    if (menuAcik || hesabimAcik || aramaAcik) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuAcik, hesabimAcik, aramaAcik]);

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
      {/* ANA MASAÜSTÜ HEADER */}
      <header className="sticky top-0 left-0 w-full z-[999999] bg-[#050814]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">

            <div className="flex-shrink-0 flex items-center gap-3">
              <button className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none z-[100]" onClick={() => setMenuAcik(true)}>
                <span className="block w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></span>
                <span className="block w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"></span>
                <span className="block w-6 h-0.5 bg-white transition-all duration-300"></span>
              </button>
              
              <Link href="/" prefetch={true} className="text-white font-black text-2xl tracking-tight flex items-center relative z-[100] transition-all duration-300">
                BİLGİN<span className="text-[#3b82f6]">PC</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center h-full">
              <div className="relative flex items-center h-full" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button className="flex items-center space-x-2 text-white hover:text-[#3b82f6] py-2 font-semibold transition-colors text-sm">
                  <Menu className="w-5 h-5" />
                  <span>Tüm Kategoriler</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-[60px] left-0 pt-[20px] w-[1100px] z-50">
                    <div className="bg-[#09090b]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_30px_50px_rgba(0,0,0,0.8)] p-10">
                      <div className="grid grid-cols-3 gap-x-12 gap-y-10">
                        {menuCategories.map((category, index) => (
                          <div key={index}>
                            <h3 className="text-[#3b82f6] font-bold text-sm tracking-wider uppercase mb-6 border-b border-white/10 pb-3">{category.title}</h3>
                            <ul className="space-y-4">
                              {category.items.map((item) => (
                                <li key={item.slug}>
                                  <Link href={"/kategori/" + item.slug} prefetch={true} className="text-gray-400 hover:text-white hover:translate-x-1 hover:text-[#3b82f6] transition-all duration-200 block text-base">{item.name}</Link>
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
                <Link href="/kendin-topla" prefetch={true} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">🔧 Kendin Topla</Link>
                <Link href="/kategori/ekran-karti" prefetch={true} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">Ekran Kartları</Link>
                <Link href="/kategori/islemci" prefetch={true} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">İşlemciler</Link>
                <Link href="/kategori/anakart" prefetch={true} className="text-gray-300 hover:text-[#3b82f6] text-sm font-medium transition-colors">Anakartlar</Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-4 shrink-0 h-full transition-all duration-300">
              <button onClick={() => setAramaAcik(true)} className="flex items-center gap-2 text-gray-300 hover:text-[#3b82f6] transition-colors p-2 group">
                <span className="hidden md:block text-sm font-bold">Ara</span>
                <Search className="w-5 h-5 md:w-5 md:h-5 shrink-0 group-hover:scale-110 transition-transform" />
              </button>

              <div className="relative flex items-center h-full">
                <Link href="/hesabim" prefetch={true} className="flex items-center gap-2 p-2 text-gray-300 hover:text-[#3b82f6] transition-colors group">
                  <span className="hidden sm:block text-sm font-bold">
                    {session?.user?.name ? session.user.name.split(" ")[0] : "Hesabım"}
                  </span>
                  <svg className="w-5 h-5 md:w-5 md:h-5 shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </Link>
              </div>

              <Link href="/sepet" prefetch={true} className="relative flex items-center gap-2 p-2 text-gray-300 hover:text-[#3b82f6] transition-colors group">
                <span className="hidden md:block text-sm font-bold">Sepet</span>
                <div className="relative">
                  <svg className="w-5 h-5 md:w-5 md:h-5 shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
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

      {/* 📱 ULTRA LÜKS TAM EKRAN (FULL-SCREEN) MOBİL MENÜ 📱 */}
      <div 
        className={`md:hidden fixed inset-0 w-full h-full bg-[#0b1121]/95 backdrop-blur-xl z-[9999999] flex flex-col transition-all duration-300 ease-out transform ${menuAcik ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/5 shrink-0 bg-[#050814]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none" onClick={() => setMenuAcik(false)}>
              <span className="block w-6 h-0.5 bg-white rotate-45 translate-y-1.5 transition-all duration-300"></span>
              <span className="block w-6 h-0.5 bg-white mt-1 opacity-0 transition-all duration-300"></span>
              <span className="block w-6 h-0.5 bg-white mt-1 -rotate-45 -translate-y-1.5 transition-all duration-300"></span>
            </button>
            
            <span className="text-white font-black text-2xl tracking-tight select-none">
              BİLGİN<span className="text-[#3b82f6]">PC</span>
            </span>
          </div>
          
          <button 
            onClick={() => {
              const yeniDurum = !isPaletteOpen;
              setIsPaletteOpen(yeniDurum);
              if(!yeniDurum) {
                // 🚀 BİNGO: Palet kapandığı an kalıcı olarak veritabanına kaydet!
                veritabaninaKaydet(mobilKategoriler);
                setSeciliKategoriId(null);
              } else {
                setAcikAkordiyon(null);
              }
            }}
            className={`p-2 rounded-xl transition-all mr-1 ${isPaletteOpen ? 'bg-emerald-900 border border-emerald-500/50' : 'bg-[#0f172a] hover:bg-slate-800/50 border border-transparent'}`}
          >
            <Palette className={`w-5 h-5 ${isPaletteOpen ? 'text-emerald-400' : 'text-slate-400'}`} />
          </button>
        </div>

        {isPaletteOpen && (
          <div className="p-3 border-b border-slate-800/50 bg-slate-900/50 flex flex-col items-center gap-2 shrink-0 animate-in slide-in-from-top-2 duration-200">
            {!seciliKategoriId ? (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-900 text-center w-full">
                Boyamak istediğiniz bir kutuyu seçin
              </span>
            ) : (
               <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-center w-full">
                Şimdi paletten bir renk seçin (Kapatınca kalıcı kaydedilir)
              </span>
            )}
            
            <div className="flex flex-wrap justify-center gap-2.5 w-full pt-1 max-w-[280px] mx-auto">
              {renkSecenekleri.map((renk, idx) => (
                <button 
                  key={idx}
                  onClick={() => renkUygula(idx)}
                  disabled={!seciliKategoriId}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-lg transition-transform flex items-center justify-center ${renk.hex} ${!seciliKategoriId ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:scale-110 opacity-100 cursor-pointer'}`}
                ></button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mobilKategoriler.map((kategori: any, index: number) => {
            const Ikon = Ikonlar[kategori.ikonId] || ChevronRight;
            const isDuzenlemeSecili = seciliKategoriId === kategori.id;
            const duzenlemeModu = isPaletteOpen;
            const isDragged = draggedIndex === index;
            const renk = renkSecenekleri[kategori.renkIndex] || renkSecenekleri[0];
            const isAkordiyonAcik = acikAkordiyon === kategori.id;

            return (
              <div key={kategori.id} className="flex flex-col">
                <div 
                  draggable={duzenlemeModu}
                  onDragStart={() => {
                    suruklenenRef.current = index;
                    setDraggedIndex(index);
                    setAcikAkordiyon(null);
                  }}
                  onDragEnter={() => duzenlemeModu && handleDragEnter(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={() => {
                    suruklenenRef.current = null;
                    setDraggedIndex(null);
                  }}
                  onClick={() => {
                    if (duzenlemeModu) {
                      setSeciliKategoriId(isDuzenlemeSecili ? null : kategori.id);
                    } else {
                      if (kategori.isLink) {
                          setMenuAcik(false);
                          router.push(kategori.link);
                      } else {
                          toggleAkordiyon(kategori.id);
                      }
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 transition-all duration-300 select-none border relative z-20
                    ${isAkordiyonAcik && !duzenlemeModu ? 'rounded-t-xl border-b-0 bg-white/[0.04]' : 'rounded-xl bg-[#0f172a] hover:bg-white/[0.03]'}
                    ${duzenlemeModu ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} 
                    ${isDragged ? 'opacity-40 border-dashed scale-95 shadow-none' : 'opacity-100 scale-100'} 
                    ${renk.border} 
                    ${!duzenlemeModu && !isAkordiyonAcik ? renk.hoverBorder : ''} 
                    ${isDuzenlemeSecili ? 'bg-slate-800 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-[#020617] border border-slate-800 shadow-inner transition-transform duration-300`}>
                      <Ikon className={`w-4 h-4 ${renk.ikon}`} />
                    </div>
                    <span className={`font-bold text-sm tracking-wide transition-colors ${isDuzenlemeSecili ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {kategori.isim}
                    </span>
                  </div>
                  
                  {duzenlemeModu && isDuzenlemeSecili ? (
                     <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                     kategori.isLink ? (
                         <ArrowRight className="w-4 h-4 text-slate-500 transition-transform duration-300 group-hover:translate-x-1" />
                     ) : (
                         <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isAkordiyonAcik ? 'rotate-180 text-white' : ''}`} />
                     )
                  )}
                </div>

                {!kategori.isLink && !duzenlemeModu && (
                  <div className={`grid transition-all duration-300 ease-in-out ${isAkordiyonAcik ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className={`overflow-hidden border border-t-0 rounded-b-xl bg-white/[0.02] ${renk.border}`}>
                        <div className="flex flex-col p-1.5">
                          {kategori.subItems?.map((sub: any, subIdx: number) => (
                            <Link 
                              key={sub.slug}
                              href={"/kategori/" + sub.slug}
                              onClick={() => setMenuAcik(false)}
                              className={`flex items-center justify-between p-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors group ${subIdx !== kategori.subItems.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                              <span className="text-xs font-medium tracking-wide pl-2">{sub.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#3b82f6]" />
                            </Link>
                          ))}
                        </div>
                      </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 TAM EKRAN ARAMA MODALI 🔥 */}
      {aramaAcik && (
        <div className="fixed inset-0 z-[9999999] bg-[#09090b]/98 backdrop-blur-3xl flex flex-col overflow-hidden animate-in fade-in duration-100">
          <div className="border-b border-white/10">
            <div className="w-full max-w-4xl mx-auto p-4 md:p-6 flex items-center gap-4">
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
              <button onClick={() => setAramaAcik(false)} className="text-gray-400 hover:text-white p-2 font-bold text-sm shrink-0 uppercase tracking-widest transition-colors">
                KAPAT
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full pb-32">
            {aramaMetni.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start animate-in fade-in duration-300">
                <div className="w-full md:w-[280px] shrink-0">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <Search className="w-3.5 h-3.5 text-[#3b82f6]" /> İLGİLİ KATEGORİLER
                  </h3>
                  {bulunanKategoriler.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {bulunanKategoriler.map((kat) => (
                        <Link key={kat.slug} href={"/kategori/" + kat.slug} onClick={() => setAramaAcik(false)} className="relative overflow-hidden px-4 py-3.5 bg-black/40 border border-white/5 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/[0.02] text-gray-400 hover:text-white rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-bold group">
                          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-gradient-to-b from-[#3b82f6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#3b82f6]/30 group-hover:bg-[#3b82f6]/10 flex items-center justify-center shrink-0 transition-all duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-[#3b82f6] group-hover:shadow-[0_0_10px_#3b82f6] transition-all duration-300"></div>
                          </div>
                          <span className="flex-1 tracking-wide transition-colors">{kat.name}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-[#3b82f6] transition-all duration-300" />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                
                <div className="w-full flex-1 min-w-0">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    {aramaYukleniyor ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3b82f6]" /> : <Search className="w-3.5 h-3.5" />} ÜRÜN SONUÇLARI
                  </h3>
                  {canliSonuclar.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {canliSonuclar.map((urun) => (
                        <Link key={urun._id} href={"/product/" + urun.slug} prefetch={true} onClick={() => setAramaAcik(false)} className="flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#3b82f6]/30 rounded-2xl transition-all group">
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
                  ) : (!aramaYukleniyor && (
                      <div className="text-center py-16 flex flex-col items-center justify-center bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
                        <span className="text-4xl mb-3 opacity-20">🔍</span>
                        <span className="text-gray-500 font-medium text-sm">Aradığınız kriterde ürün bulunamadı.</span>
                      </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-100">
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
                        <Link key={urun._id} href={"/product/" + urun.slug} prefetch={true} onClick={() => setAramaAcik(false)} className="bg-[#121212] border border-white/5 hover:border-[#3b82f6]/30 p-3 rounded-2xl group transition-colors flex flex-col">
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

      {/* 🚀 LÜKS ÇIKIŞ YAP ONAY MODALI */}
      {cikisOnayAcik && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-[#050814]/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#09090b] border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl mb-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">🚪</div>
              <h3 className="text-white font-bold text-base mb-1 tracking-wide">Çıkış Yapılıyor</h3>
              <p className="text-gray-400 text-xs leading-relaxed px-2">Hesabınızdan güvenli bir şekilde ayrılmak istediğinize emin misiniz?</p>
            </div>
            <div className="flex border-t border-white/5 bg-[#121215]">
              <button onClick={() => setCikisOnayAcik(false)} className="w-full border-r border-white/5 px-4 py-3 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors tracking-wide">İptal Et</button>
              <button onClick={async () => { setCikisOnayAcik(false); setHesabimAcik(false); localStorage.removeItem("bilgin_kayitli_sistemler"); await signOut({ redirect: false }); }} className="w-full px-4 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors tracking-wide uppercase">Çıkış Yap</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
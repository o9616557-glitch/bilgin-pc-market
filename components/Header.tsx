"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/CartContext";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Clock, Flame, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// 4 Ana kategori + altlarındaki ürün kategorileri (resimli popup için)
const ANA_KATEGORILER = [
  {
    id: "bilesen",
    isim: "Bilgisayar Bileşenleri",
    renk: "from-blue-700 to-blue-950",
    renk2: "#1d4ed8",
    resim: "",
    altlar: [
      { slug: "islemci",    isim: "İşlemciler",     renk: "from-blue-600 to-blue-900",     resim: "" },
      { slug: "ekran-karti",isim: "Ekran Kartları", renk: "from-green-600 to-emerald-900", resim: "" },
      { slug: "anakart",   isim: "Anakartlar",      renk: "from-purple-600 to-purple-900", resim: "" },
      { slug: "ram",       isim: "RAM Bellek",       renk: "from-cyan-600 to-cyan-900",    resim: "" },
      { slug: "ssd",       isim: "SSD & M.2 Disk",  renk: "from-orange-600 to-orange-900",resim: "" },
      { slug: "kasa",      isim: "Kasalar",          renk: "from-slate-600 to-slate-900",  resim: "" },
      { slug: "psu",       isim: "Güç Kaynakları",  renk: "from-yellow-600 to-yellow-900",resim: "" },
      { slug: "sogutma",   isim: "Soğutma",          renk: "from-sky-600 to-sky-900",      resim: "" },
    ],
  },
  {
    id: "cevre",
    isim: "Çevre Birimleri",
    renk: "from-rose-700 to-rose-950",
    renk2: "#be123c",
    resim: "",
    altlar: [
      { slug: "monitor",   isim: "Monitörler",       renk: "from-indigo-600 to-indigo-900",resim: "" },
      { slug: "klavye",    isim: "Klavye",            renk: "from-rose-600 to-rose-900",   resim: "" },
      { slug: "mouse",     isim: "Mouse & Mousepad", renk: "from-teal-600 to-teal-900",   resim: "https://res.cloudinary.com/dtnbkoa9s/image/upload/v1782720094/Ads%C4%B1z_tasar%C4%B1m_-_2026-06-29T105744.333_xnstan.png" },
      { slug: "kulaklik",  isim: "Kulaklık",          renk: "from-pink-600 to-pink-900",   resim: "" },
      { slug: "mikrofon",  isim: "Mikrofon",          renk: "from-red-600 to-red-900",     resim: "" },
      { slug: "hoparlor",  isim: "Hoparlör",          renk: "from-amber-600 to-amber-900", resim: "" },
    ],
  },
  {
    id: "sistem",
    isim: "Sistem & Yazılım",
    renk: "from-violet-700 to-violet-950",
    renk2: "#6d28d9",
    resim: "",
    altlar: [
      { slug: "oyun-bilgisayari",isim: "Oyun PC",    renk: "from-violet-600 to-violet-900",resim: "" },
      { slug: "laptop",          isim: "Laptop",      renk: "from-purple-600 to-purple-900",resim: "" },
      { slug: "masaustu",        isim: "Masaüstü PC", renk: "from-fuchsia-600 to-fuchsia-900",resim: "" },
      { slug: "isletim-sistemi", isim: "İşletim Sis.",renk: "from-blue-600 to-blue-900",   resim: "" },
      { slug: "yazilim",         isim: "Office & Yazılım",renk: "from-cyan-600 to-cyan-900",resim: "" },
    ],
  },
  {
    id: "ag",
    isim: "Ağ, Aksesuar & Kablo",
    renk: "from-emerald-700 to-emerald-950",
    renk2: "#047857",
    resim: "",
    altlar: [
      { slug: "modem",           isim: "Modem",       renk: "from-emerald-600 to-emerald-900",resim: "" },
      { slug: "usb",             isim: "USB Bellek",  renk: "from-teal-600 to-teal-900",   resim: "" },
      { slug: "kablolar",        isim: "Kablolar",    renk: "from-green-600 to-green-900",  resim: "" },
      { slug: "sarj-powerbank",  isim: "Şarj & Powerbank",renk: "from-lime-600 to-lime-900",resim: "" },
      { slug: "termal-macun",    isim: "Termal Macun",renk: "from-slate-600 to-slate-900",  resim: "" },
    ],
  },
];

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

function MobilKategoriAccordion({ onClose }: { onClose: () => void }) {
  const [acikAna, setAcikAna] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {ANA_KATEGORILER.map((ana) => (
        <div key={ana.id} className="rounded-xl overflow-hidden border border-white/[0.07]">
          {/* Ana kategori başlığı */}
          <button
            onClick={() => setAcikAna(acikAna === ana.id ? null : ana.id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <div className={`relative w-9 h-9 rounded-lg shrink-0 overflow-hidden bg-gradient-to-br ${ana.renk}`}>
              {ana.resim && <Image src={ana.resim} alt={ana.isim} fill className="object-contain" unoptimized />}
            </div>
            <span className="flex-1 text-left text-sm font-bold text-white">{ana.isim}</span>
            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${acikAna === ana.id ? "rotate-90" : ""}`} />
          </button>

          {/* Alt kategoriler */}
          {acikAna === ana.id && (
            <div className="border-t border-white/[0.06] bg-white/[0.02]">
              {ana.altlar.map((k, i) => (
                <Link
                  key={k.slug}
                  href={`/kategori/${k.slug}`}
                  prefetch={false}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 group transition-colors hover:bg-white/[0.04] ${i !== 0 ? "border-t border-white/[0.04]" : ""}`}
                >
                  <div className={`relative w-8 h-8 rounded-lg shrink-0 overflow-hidden ${!k.resim ? `bg-gradient-to-br ${k.renk}` : ""}`}>
                    {k.resim && <Image src={k.resim} alt={k.isim} fill className="object-contain" unoptimized />}
                  </div>
                  <span className="flex-1 text-sm text-slate-300 group-hover:text-white transition-colors">{k.isim}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-[#3b82f6] transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MobilLogoAlani({ menuAcik }: { menuAcik: boolean }) {
  const { data: session, status } = useSession();
  const userImage = session?.user?.image;
  const userName  = session?.user?.name || "";

  if (status === "loading") {
    return <div className="md:hidden w-8 h-8 rounded-full bg-white/[0.06] animate-pulse" />;
  }

  if (userImage) {
    return (
      <Link
        href="/hesabim"
        prefetch={false}
        className={`md:hidden relative z-[100] transition-all ${menuAcik ? "opacity-20 pointer-events-none" : ""}`}
      >
        <Image
          src={userImage}
          alt={userName}
          width={36}
          height={36}
          className="rounded-full object-cover ring-2 ring-[#3b82f6]/40"
        />
      </Link>
    );
  }

  if (status === "authenticated") {
    const basHarf = (userName[0] || "U").toUpperCase();
    return (
      <Link
        href="/hesabim"
        prefetch={false}
        className={`md:hidden relative z-[100] w-9 h-9 rounded-full bg-gradient-to-b from-cyan-800 to-[#020617] border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-sm transition-all ${menuAcik ? "opacity-20 pointer-events-none" : ""}`}
      >
        {basHarf}
      </Link>
    );
  }

  /* Misafir — boş profil dairesi, tıklayınca giriş sayfasına */
  return (
    <Link
      href="/giris"
      prefetch={false}
      className={`md:hidden relative z-[100] w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center transition-all hover:bg-white/[0.1] ${menuAcik ? "opacity-20 pointer-events-none" : ""}`}
    >
      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </Link>
  );
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
  const [seciliAna, setSeciliAna] = useState(ANA_KATEGORILER[0].id);
  
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
      document.body.style.overflow = "hidden";
    } else {
      setAramaMetni("");
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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

              {/* Masaüstü: BİLGİN PC logosu */}
              <Link href="/" prefetch={false} className={`hidden md:flex text-white font-black text-2xl tracking-tight items-center relative z-[100] transition-all duration-300`}>
                BİLGİN <span className="text-[#3b82f6] ml-1">PC</span>
              </Link>

              {/* Mobil: profil fotoğrafı (varsa) veya BİLGİN PC */}
              <MobilLogoAlani menuAcik={menuAcik} />
            </div>

            {/* ORTA: MASAÜSTÜ MEGA MENÜ */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center h-full">
              <div className="relative flex items-center h-full">
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className={`flex items-center space-x-2 py-2 font-semibold transition-colors text-sm ${dropdownOpen ? "text-[#3b82f6]" : "text-white hover:text-[#3b82f6]"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  <span>Tüm Kategoriler</span>
                </button>

                {dropdownOpen && (
                  <>
                    {/* Dışına tıklayınca kapat */}
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />

                    {/* Resimli popup — tek sıra, yatay */}
                    <div
                      className="fixed left-0 right-0 top-[80px] z-50 px-4 sm:px-8"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="max-w-7xl mx-auto bg-[#07101f]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5">
                        <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
                          {POPUP_KATEGORILER.map((k) => (
                            <Link
                              key={k.slug}
                              href={`/kategori/${k.slug}`}
                              prefetch={false}
                              onClick={() => setDropdownOpen(false)}
                              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
                            >
                              <div className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 ${!k.resim ? `bg-gradient-to-br ${k.renk}` : ""}`}>
                                {k.resim && <Image src={k.resim} alt={k.isim} fill className="object-contain" unoptimized />}
                              </div>
                              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white text-center leading-tight transition-colors line-clamp-2">
                                {k.isim}
                              </span>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-end">
                          <Link href="/kategoriler" prefetch={false} onClick={() => setDropdownOpen(false)}
                            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
                            Tüm kategorileri gör <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
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

      {/* 📱 MOBİL MENÜ */}
      <div className={`md:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-[#050814] z-[98] overflow-y-auto transition-transform duration-300 ${menuAcik ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-6 pb-32">

          {/* Kendin Topla */}
          <Link
            href="/kendin-topla"
            prefetch={false}
            onClick={() => setMenuAcik(false)}
            className="flex items-center justify-between px-4 py-3.5 mb-5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 group"
          >
            <span className="font-semibold text-emerald-400 text-sm flex items-center gap-2.5">
              🔧 Kendin Topla
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-500/60 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Kategoriler */}
          <div className="space-y-6">
            {menuCategories.map((category, index) => (
              <div key={index}>
                <p className="text-[10px] font-semibold text-[#3b82f6]/80 uppercase tracking-[0.15em] mb-2 px-1">{category.title}</p>
                <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                  {category.items.map((item, i) => (
                    <Link
                      key={item.slug}
                      href={"/kategori/" + item.slug}
                      prefetch={false}
                      onClick={() => setMenuAcik(false)}
                      className={`flex items-center justify-between px-4 py-3.5 group transition-colors hover:bg-white/[0.04] ${i !== 0 ? "border-t border-white/[0.05]" : ""}`}
                    >
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#3b82f6] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Arama paneli — site tasarımına uyumlu */}
      {aramaAcik && (
        <div className="fixed inset-0 z-[99999] site-page flex flex-col overflow-hidden animate-in fade-in duration-200">
          <div className="site-glow-top top-0 left-1/2 -translate-x-1/2 w-[min(700px,100vw)] h-[200px] pointer-events-none" />

          <div className="glass-panel border-b border-white/[0.06] rounded-none shrink-0 relative z-10">
            <div className="site-container max-w-4xl py-4 flex items-center gap-3 sm:gap-4">
              <form onSubmit={handleAramaSubmit} className="relative flex-1 w-full">
                <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center z-10">
                  <Search className="w-5 h-5 text-site-accent" />
                </button>

                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Ürün, marka veya kategori ara..."
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  className="w-full h-12 sm:h-14 bg-site-shell/60 border border-white/[0.08] focus:border-site-accent/50 focus:bg-site-shell rounded-xl pl-12 pr-12 text-base sm:text-lg text-white placeholder-slate-500 outline-none transition-all"
                />

                {aramaMetni && (
                  <button type="button" onClick={() => setAramaMetni("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white z-10">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </form>

              <button onClick={() => setAramaAcik(false)} className="text-slate-400 hover:text-white p-2 font-medium text-xs sm:text-sm shrink-0 transition-colors">
                Kapat
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto site-container max-w-4xl py-6 sm:py-8 pb-28 relative z-10 site-content-in">
         {aramaMetni.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start">
                <div className="w-full md:w-[280px] shrink-0">
                  <h3 className="site-label flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
                    <Search className="w-3.5 h-3.5 text-site-accent" /> İlgili kategoriler
                  </h3>

                  {bulunanKategoriler.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {bulunanKategoriler.map((kat) => (
                        <Link
                          key={kat.slug}
                          href={"/kategori/" + kat.slug}
                          prefetch={false}
                          onClick={() => setAramaAcik(false)}
                          className="glass-panel px-4 py-3 hover:border-site-accent/30 text-slate-300 hover:text-white rounded-xl transition-all flex items-center gap-3 text-sm font-medium group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-site-accent/30 flex items-center justify-center shrink-0 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-site-accent transition-all" />
                          </div>
                          <span className="flex-1">{kat.name}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-site-accent transition-all" />
                        </Link>
                      ))}
                    </div>
                 ) : null}
                </div>
                <div className="w-full flex-1 min-w-0">
                  <h3 className="site-label flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
                    {aramaYukleniyor ? <Loader2 className="w-3.5 h-3.5 animate-spin text-site-accent" /> : <Search className="w-3.5 h-3.5" />}
                    Ürün sonuçları
                  </h3>

                  {canliSonuclar.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {canliSonuclar.map((urun) => (
                        <Link
                          key={urun._id}
                          href={"/product/" + urun.slug}
                          prefetch={false}
                          onClick={() => setAramaAcik(false)}
                          className="glass-card p-4 hover:border-site-accent/25 rounded-xl transition-all flex items-center gap-4 group"
                        >
                          <div className="w-16 h-16 bg-site-shell rounded-xl p-2 flex shrink-0 items-center justify-center border border-white/[0.06]">
                            <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">{urun.isim}</span>
                            <span className="text-base font-semibold text-site-accent">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !aramaYukleniyor && (
                      <div className="text-center py-16 flex flex-col items-center justify-center glass-card border-dashed">
                        <span className="text-3xl mb-3 opacity-30">🔍</span>
                        <span className="site-body text-sm">Aradığınız kriterde ürün bulunamadı.</span>
                      </div>
                    )
                  )}
                </div>

              </div>
            ) : (
              <div className="space-y-8">
                {sonAramalar.length > 0 && (
                  <div>
                    <h3 className="site-label flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4" /> Son aramalar
                    </h3>
                    <div className="flex flex-col glass-card overflow-hidden divide-y divide-white/[0.06]">
                      {sonAramalar.map((kelime, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors group cursor-pointer" onClick={() => handleAramaSubmit(undefined, kelime)}>
                          <span className="text-slate-300 group-hover:text-site-accent text-sm">&ldquo;{kelime}&rdquo;</span>
                          <button onClick={(e) => { e.stopPropagation(); gecmisAramayiSil(kelime); }} className="text-slate-500 hover:text-red-400 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {populerUrunler.length > 0 && (
                  <div>
                    <h3 className="site-label mb-4">En çok satanlar</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {populerUrunler.map((urun) => (
                        <Link
                          key={urun._id}
                          href={"/product/" + urun.slug}
                          prefetch={false}
                          onClick={() => setAramaAcik(false)}
                          className="glass-card p-3 hover:border-site-accent/25 group transition-all flex flex-col"
                        >
                          <div className="aspect-square bg-site-shell rounded-xl mb-3 flex items-center justify-center p-2 border border-white/[0.06]">
                             <img src={urun.resim} alt={urun.isim} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="text-xs text-slate-300 font-medium line-clamp-2 flex-1 mb-2">{urun.isim}</h4>
                          <span className="text-sm font-semibold text-site-accent">{Number(urun.fiyat).toLocaleString("tr-TR")} ₺</span>
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
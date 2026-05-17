"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function ProductClient({ product }: { product: Record<string, any> }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("aciklama");

  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  // FPS SİMÜLATÖR STATE'LERİ
  const [selectedCpu, setSelectedCpu] = useState("mid");
  const [selectedRes, setSelectedRes] = useState<"1080p" | "1440p">("1080p");

  // CANLI GERÇEK ÜRÜN VE ARAMA MOTORU STATE'LERİ
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCompareProduct, setSelectedCompareProduct] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  // Dışarı tıklayınca arama listesini kapatma motoru
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  // CANLI KARGO GERI SAYIM MOTORU
  useEffect(() => {
    const calculateShipping = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      if (currentHour < 16) {
        const hoursLeft = 15 - currentHour;
        const minutesLeft = 59 - currentMinute;
        const secondsLeft = 59 - currentSecond;
        const pad = (n: number) => n.toString().padStart(2, '0');
        setTimeLeft(`${pad(hoursLeft)}:${pad(minutesLeft)}:${pad(secondsLeft)} içinde sipariş verirseniz`);
        setShippingMessage("BUGÜN KARGODA!");
      } else {
        setTimeLeft("Saat 16:00'ı geçtiği için siparişiniz");
        setShippingMessage("YARIN KARGODA!");
      }
    };

    calculateShipping();
    const timer = setInterval(calculateShipping, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] flex flex-col items-center justify-center text-white px-4">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-md flex items-center justify-center text-red-400 text-3xl mb-4 animate-bounce">⚠️</div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Ürün Bulunamadı Şefim!</h2>
        <button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-md transition-all">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  const galleryImages = product.images || [];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (galleryImages.length > 0) setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (galleryImages.length > 0) setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price || product.regular_price,
        image: galleryImages[0]?.src || "/placeholder.png",
        slug: product.slug,
        quantity: quantity
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage")); 
    
    setTimeout(() => {
      setAddingToCart(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000); 
    }, 800);
  };

  const stoktaVar = product.stock_status === "instock";
  const hasMultipleImages = galleryImages.length > 1;
  
  // WOOCOMMERCE INDIRIM HESAPLAMA MOTORU
  const regularPrice = Number(product.regular_price || 0);
  const currentPrice = Number(product.price || 0);
  const isSale = product.on_sale === true || product.on_sale === "true" || (regularPrice > currentPrice && currentPrice > 0);

  const kartFiyati = currentPrice;
  const eskiFiyat = regularPrice > currentPrice ? regularPrice : (isSale ? Math.round(currentPrice * 1.15) : 0);
  const havaleFiyati = kartFiyati * 0.95;

  // KATEGORİ RADARI
  const productCategories = product.categories?.map((cat: any) => cat.slug?.toLowerCase()) || [];
  const isKoltuk = productCategories.some((s: string) => s.includes("koltuk"));
  const isSSD = productCategories.some((s: string) => s.includes("ssd"));
  const isPCorGPU = !isKoltuk && !isSSD && productCategories.some((slug: string) => 
    ["hazir-sistem", "ekran-karti", "masaustu-bilgisayarlar", "laptop-bilgisayar", "hazir-sistem-bilgisayarlar", "ekran-kartlari"].includes(slug)
  );

  const currentCategoryType = isKoltuk ? "oyuncu-koltugu" : isSSD ? "ssd" : isPCorGPU ? "ekran-karti" : "genel";

  // MASTER KATEGORI ACF HARİTASI
  const categoryMappings: Record<string, Record<string, string>> = {
    "ekran-karti": {
      model: "Model", grafik_motoru: "Grafik Motoru", ai_performansi: "AI Performansı", bus_standarti: "Bus Standartı",
      opengl: "OpenGL", bellek: "Bellek Kapasitesi", saat_hizi: "Saat Hızı", cuda_cekirdegi: "CUDA Çekirdeği",
      bellek_hizi: "Bellek Hızı", bellek_arayuzu: "Bellek Arayüzü", cozunurluk: "Maksimum Çözünürlük",
      boyutlar: "Boyutlar", tavsiye_edilen_guc_kaynagi: "Tavsiye Edilen PSU", guc_baglantilari: "Güç Bağlantıları",
      yuva: "Yuva Tipi", aura_sync: "Aura Sync / RGB"
    },
    "oyuncu-koltugu": {
      malzeme_tipi: "Döşeme Malzemesi", kol_destegi: "Kol Desteği Sınıfı", amortisör: "Amortisör Klasmanı",
      tasima_kapasitesi: "Maksimum Taşıma", mekanizma: "Yatış Mekanizması", ayak_malzemesi: "Ayak Yıldız Tabanı",
      yastik_destegi: "Bel & Boyun Yastığı", koltuk_boyutu: "Ürün Ölçüleri / Boyut"
    },
    "ssd": {
      okuma_hizi: "Okuma Hızı (MB/s)", yazma_hizi: "Yazma Hızı (MB/s)", arabirim: "Bağlantı Arayüzü",
      tbw_degeri: "Yazım Ömrü (TBW)", nvme_versiyon: "NVMe Sürümü", flash_tipi: "NAND Flash Tipi"
    },
    "genel": { garanti: "Garanti Süresi", mensei: "Üretim Yeri" }
  };

  const activeMapping = categoryMappings[currentCategoryType] || categoryMappings["genel"];

  const dynamicCustomSpecs = Object.entries(activeMapping).map(([key, label]) => {
    const metaValue = product.meta_data?.find((m: any) => m.key === key)?.value || product.acf?.[key];
    return { label, value: metaValue };
  }).filter(spec => spec.value !== undefined && spec.value !== null && spec.value !== "");

  const finalTechSpecs = dynamicCustomSpecs.length > 0 
    ? dynamicCustomSpecs 
    : (product.attributes?.map((attr: any) => ({ label: attr.name, value: attr.options?.join(', ') })) || []);

  // REAL-TIME API VERI CEKME VE YEDEKLİ HAVUZ MOTORU
  useEffect(() => {
    if (!product || !product.categories || product.categories.length === 0) return;

    const fetchAlternatives = async () => {
      setLoadingProducts(true);
      try {
        const categoryId = product.categories[0].id;
        const res = await fetch(`/api/products?category=${categoryId}&per_page=30`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const filtered = data.filter((p: any) => p.id !== product.id);
          setCategoryProducts(filtered);
          if (filtered.length > 0) {
            setSelectedCompareProduct(filtered[0]);
          }
        }
      } catch (err) {
        console.error("Canlı alternatif veriler akamadı şefim:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAlternatives();
  }, [product]);

  // BACKUP YEREL RAKİP VERİ TABANI (API GECİKİRSE EKRAN BOŞ KALMASIN DİYE)
  const backupDatabase: Record<string, Array<{ name: string; specs: Record<string, string> }>> = {
    "ekran-karti": [
      { name: "NVIDIA GeForce RTX 4060 Ti Gümrük Serisi", specs: { model: "RTX 4060 Ti", grafik_motoru: "NVIDIA GeForce RTX 4060 Ti", ai_performansi: "Orta Seviye (160 TOPS)", bus_standarti: "PCIe 4.0", opengl: "OpenGL 4.6", bellek: "8GB GDDR6", saat_hizi: "2535 MHz", cuda_cekirdegi: "4352", bellek_hizi: "18 Gbps", bellek_arayuzu: "128-bit", cozunurluk: "7680 x 4320", boyutlar: "260 x 120 x 45 mm", tavsiye_edilen_guc_kaynagi: "600W", guc_baglantilari: "1x 8-pin", yuva: "2.2 Slot", aura_sync: "RGB Uyumlu" }},
      { name: "NVIDIA GeForce RTX 4070 SUPER Master", specs: { model: "RTX 4070 SUPER", grafik_motoru: "NVIDIA GeForce RTX 4070 SUPER", ai_performansi: "Üst Seviye (520 TOPS)", bus_standarti: "PCIe 4.0", opengl: "OpenGL 4.6", bellek: "12GB GDDR6X", saat_hizi: "2475 MHz", cuda_cekirdegi: "5888", bellek_hizi: "21 Gbps", bellek_arayuzu: "192-bit", cozunurluk: "7680 x 4320", boyutlar: "300 x 120 x 50 mm", tavsiye_edilen_guc_kaynagi: "650W", guc_baglantilari: "1x 16-pin", yuva: "2.5 Slot", aura_sync: "ARGB Senkron" }}
    ],
    "oyuncu-koltugu": [
      { name: "XDrive Fırtına Profesyonel Koltuk", specs: { malzeme_tipi: "Premium PU Suni Deri", kol_destegi: "3D Kol", amortisör: "Class 4", tasima_kapasitesi: "120 kg", mekanizma: "135 Derece Yatış", ayak_malzemesi: "Metal", yastik_destegi: "Mevcut", koltuk_boyutu: "68 x 70 x 132 cm" }},
      { name: "Hawk Gaming Chair Fab V5", specs: { malzeme_tipi: "Terletmez Kumaş", kol_destegi: "4D Kol", amortisör: "Class 4", tasima_kapasitesi: "140 kg", mekanizma: "180 Derece Yatış", ayak_malzemesi: "Alüminyum", yastik_destegi: "Mevcut", koltuk_boyutu: "70 x 72 x 135 cm" }}
    ],
    "ssd": [
      { name: "Samsung 990 Pro M.2 NVMe", specs: { okuma_hizi: "7450 MB/s", yazma_hizi: "6900 MB/s", arabirim: "PCIe Gen 4", tbw_degeri: "1200 TBW", nvme_versiyon: "NVMe 2.0", flash_tipi: "TLC NAND" }}
    ]
  };

  const localItems = backupDatabase[currentCategoryType] || [];
  const compareOptions = categoryProducts.length > 0 ? categoryProducts : localItems;

  const filteredOptions = compareOptions.filter((item: any) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // DİNAMİK CANLI KIYAS MATRİSİ
  const comparisonRows = Object.entries(activeMapping).map(([key, label]) => {
    const currentProductValue = product.meta_data?.find((m: any) => m.key === key)?.value || product.acf?.[key] || "-";
    
    const opponentValue = selectedCompareProduct?.meta_data?.find((m: any) => m.key === key)?.value || 
                          selectedCompareProduct?.acf?.[key] || 
                          selectedCompareProduct?.specs?.[key] || "-";
    
    return { label, current: currentProductValue, opponent: opponentValue };
  }).filter(row => row.current !== "-" || row.opponent !== "-");

  // İŞLEMCİ ÇARPANLARI
  const cpuMultipliers: Record<string, number> = { entry: 0.85, mid: 0.93, high: 1.00, extreme: 1.10 };
  
  // FOTOĞRAFTAKİ GERÇEK ACF ANAHTARLARIYLA BİREBİR FPS MOTORU MAPLEMESİ
  const gamesConfig = [
    { id: "pubg", label: "PUBG: BATTLEGROUNDS", maxFps: 400, default1080p: 210, default1440p: 140, color: "from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.3)]" },
    { id: "valorant", label: "VALORANT", maxFps: 600, default1080p: 450, default1440p: 320, color: "from-rose-500 to-red-600 shadow-[0_0_15px_rgba(244,63,94,0.3)]" },
    { id: "cs2", label: "Counter-Strike 2 (CS2)", maxFps: 550, default1080p: 380, default1440p: 260, color: "from-sky-500 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]" },
    { id: "cyberpunk", label: "Cyberpunk 2077", maxFps: 200, default1080p: 110, default1440p: 65, color: "from-purple-500 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.3)]" },
    { id: "rdr2", label: "Red Dead Redemption 2", maxFps: 200, default1080p: 95, default1440p: 60, color: "from-emerald-500 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]" }
  ];

  const currentCpuMultiplier = cpuMultipliers[selectedCpu] || 1.0;

  const processedFpsData = gamesConfig.map(game => {
    // 🚀 Fotoğraftaki tam isim şablonu: pubg_1080p_fps / valorant_1440p_fps
    const acfKey = `${game.id}_${selectedRes}_fps`; 
    const metaValue = product.meta_data?.find((m: any) => m.key === acfKey)?.value || product.acf?.[acfKey];
    const baseFps = metaValue ? Number(metaValue) : (selectedRes === "1080p" ? game.default1080p : game.default1440p);
    const finalFps = Math.round(baseFps * currentCpuMultiplier);
    const percentage = Math.min((finalFps / game.maxFps) * 100, 100);
    return { label: game.label, fps: finalFps, percentage, color: game.color };
  });

  return (
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white pt-2 pb-24 md:py-8 px-3 sm:px-6 lg:px-8 relative overflow-hidden font-medium">
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          
          <div className="flex flex-col gap-4">
            <div className="w-full bg-transparent p-0 sm:p-6 rounded-md overflow-hidden aspect-square relative group flex items-center justify-center cursor-pointer">
              {galleryImages.map((img: any, index: number) => (
                <PhotoView key={index} src={img.src}>
                  <img 
                    src={img.src} 
                    alt={product.name} 
                    className={`max-h-full max-w-full object-contain transform group-hover:scale-[1.03] transition-transform duration-700 ease-out drop-shadow-2xl ${
                      activeImageIndex === index ? "block" : "hidden"
                    }`}
                  />
                </PhotoView>
              ))}
              <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/20 w-8 h-8 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-[#050814]/40 border border-white/5 p-2 rounded-md">
              <button onClick={prevImage} disabled={!hasMultipleImages} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 disabled:opacity-10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div className="flex-1 flex justify-center items-center">
                {hasMultipleImages ? (
                  <>
                    <div className="hidden sm:flex flex-wrap gap-2 justify-center items-center">
                      {galleryImages.map((img: any, index: number) => (
                        <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-10 h-10 sm:w-12 sm:h-12 bg-transparent border rounded-md p-1 transition-all flex items-center justify-center ${activeImageIndex === index ? 'border-blue-500 scale-110 bg-white/5' : 'border-white/10 opacity-40 hover:opacity-100 hover:bg-white/5'}`}>
                          <img src={img.src} alt="" className="max-w-full max-h-full object-contain drop-shadow-md" />
                        </button>
                      ))}
                    </div>
                    <div className="flex sm:hidden justify-center items-center gap-1.5 flex-wrap">
                      {galleryImages.map((_: any, index: number) => (
                        <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === index ? 'bg-blue-500 w-4' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </>
                ) : <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tek Görsel</span>}
              </div>

              <button onClick={nextImage} disabled={!hasMultipleImages} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 disabled:opacity-10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between py-1">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {isSale && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                    🔥 BÜYÜK İNDİRİM
                  </span>
                )}
                {stoktaVar ? (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span> STOKTA
                  </span>
                ) : (
                  <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">TÜKENDİ</span>
                )}
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">💎 ORİJİNAL</span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">⚡ HIZLI TESLİMAT</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="text-amber-400 text-xs tracking-tighter">⭐⭐⭐⭐⭐</div>
                <span className="text-[11px] font-bold text-slate-400">5.0 / (0) Değerlendirme</span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight">
                {product.name}
              </h1>
              
              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-md mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-inner">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">Havale / EFT Fiyatı</span>
                  <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    {havaleFiyati.toLocaleString('tr-TR')} TL
                  </span>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 block font-bold">Kredi Kartı / Tek Çekim</span>
                  
                  {isSale && eskiFiyat > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                      <span className="text-xs line-through text-red-500 font-extrabold">{eskiFiyat.toLocaleString('tr-TR')} TL</span>
                      <span className="text-sm sm:text-base font-black text-slate-200 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{kartFiyati.toLocaleString('tr-TR')} TL</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-slate-300">{kartFiyati.toLocaleString('tr-TR')} TL</span>
                  )}
                  
                  <span className="text-[10px] text-blue-400 font-black bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block w-max sm:ml-auto">
                    12 Taksit İmkanı
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4 bg-[#050814]/30 border border-white/5 p-2 rounded-md w-max">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Paylaş:</span>
                <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-[11px] cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">🔗</div>
                  <div className="w-7 h-7 rounded-md bg-green-500/10 flex items-center justify-center text-[11px] text-green-400 cursor-pointer hover:bg-green-500 hover:text-white transition-colors">WP</div>
                  <div className="w-7 h-7 rounded-md bg-blue-500/10 flex items-center justify-center text-[11px] text-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors">X</div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2 bg-[#050814]/50 border border-blue-500/20 p-3 rounded-md shadow-inner">
                <div className="text-2xl sm:text-3xl text-blue-400 animate-pulse">🚚</div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    <strong className="text-blue-400">{timeLeft}</strong>
                  </span>
                  <span className={`text-xs sm:text-sm font-black uppercase tracking-widest ${shippingMessage === "BUGÜN KARGODA!" ? "text-emerald-400" : "text-amber-400"}`}>
                    {shippingMessage}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-2 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-md p-1.5 min-w-[110px]">
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500 rounded-md" disabled={!stoktaVar}>-</button>
                  <span className="px-2 font-black text-sm text-white">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500 rounded-md" disabled={!stoktaVar}>+</button>
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || addedSuccess || !stoktaVar}
                    className={`flex-1 font-black py-3 px-6 rounded-md uppercase tracking-wider transition-all shadow-lg active:scale-[0.99] disabled:opacity-80 text-xs sm:text-sm ${
                      addedSuccess 
                        ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                        : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                    }`}
                  >
                    {addingToCart ? "Ekleniyor..." : addedSuccess ? "✅ SEPETE EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}
                  </button>

                  <button 
                    onClick={() => setIsFav(!isFav)}
                    disabled={!stoktaVar} 
                    className={`w-11 h-11 rounded-md border flex items-center justify-center transition-all ${
                      isFav ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AKORDEON DEPARTMANI */}
        <div className="max-w-6xl mx-auto mt-6 sm:mt-10 relative z-10 flex flex-col gap-6 sm:gap-8">
          <div className="bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden">
            
            {/* 1. ÜRÜN AÇIKLAMASI */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("aciklama")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">🛠️</span> Ürün Açıklaması
                </span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 transform transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 overflow-hidden transition-all duration-500 ${openAccordion === "aciklama" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 sm:pt-4">
                    <div 
                      className="text-slate-300 text-base md:text-lg leading-relaxed space-y-4 prose prose-invert font-normal max-w-none prose-p:my-2 prose-headings:text-white prose-headings:font-black prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-[0_10px_30px_rgba(0,0,0,0.4)] prose-img:w-full prose-img:my-6 sm:prose-img:my-10"
                      dangerouslySetInnerHTML={{ __html: product.description || "Bu canavar için henüz detaylı bir teknik açıklama girilmemiş şefim." }}
                    />
                 </div>
              </div>
            </div>

            {/* 2. TEKNİK ÖZELLİKLER */}
            {finalTechSpecs.length > 0 && (
              <div className="border-b border-white/5 last:border-0">
                <button 
                  onClick={() => toggleAccordion("teknik")}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl">⚙️</span> Teknik Özellikler
                  </span>
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-500 ${openAccordion === "teknik" ? "rotate-180 text-blue-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`px-4 sm:px-5 text-slate-300 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "teknik" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                     <div className="border-t border-white/5 pt-3 sm:pt-4">
                       <div className="overflow-x-auto">
                         <table className="w-full text-left border-collapse">
                           <tbody>
                             {finalTechSpecs.map((spec: any, i: number) => (
                               <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                 <td className="py-3.5 pr-4 font-bold text-slate-400 w-5/12 md:w-1/4">{spec.label}</td>
                                 <td className="py-3.5 text-slate-300 font-medium">{spec.value}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </div>
                </div>
              </div>
            )}

            {/* 3. OYUN PERFORMANS TESTİ */}
            {isPCorGPU && (
              <div className="border-b border-white/5 last:border-0">
                <button 
                  onClick={() => toggleAccordion("performans")}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl">🎮</span> Oyun Performans Testi
                  </span>
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-500 ${openAccordion === "performans" ? "rotate-180 text-blue-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`px-4 sm:px-5 text-slate-300 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "performans" ? "max-h-[5000px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                   <div className="border-t border-white/5 pt-4 space-y-6">
                     
                     <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-slate-400 text-xs space-y-2 leading-relaxed shadow-inner">
                       <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-wider text-[11px]">
                         <span>📊</span> BilginPC Donanım Laboratuvarı Bildirisi:
                       </div>
                       <p className="font-normal text-slate-400">
                         Bu simülatörde listelenen FPS değerleri, BilginPC mühendisleri birleşik test verileridir. Donanım ailesine, sürücü versiyonunuza ve anlık oyun içi aksiyon yoğunluğuna göre kare hızlarında oynamalar görülmesi tamamen doğaldır.
                       </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#050814]/40 p-4 rounded-xl border border-white/5 shadow-inner">
                       <div className="flex flex-col gap-1.5">
                         <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">SİSTEM İŞLEMCİSİ (CPU)</label>
                         <select 
                           value={selectedCpu} 
                           onChange={(e) => setSelectedCpu(e.target.value)}
                           className="w-full bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                         >
                           <option value="entry">Giriş Seviyesi (Ryzen 5 5600 / Core i3-i5)</option>
                           <option value="mid">Orta Seviye (Ryzen 5 7600 / Core i5)</option>
                           <option value="high">Üst Seviye (Ryzen 7 7800X3D / Core i7)</option>
                           <option value="extreme">Ekstrem Seviye (Ryzen 9 9950X / Core i9)</option>
                         </select>
                       </div>

                       <div className="flex flex-col gap-1.5">
                         <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">ÇÖZÜNÜRLÜK MODU</label>
                         <div className="grid grid-cols-2 bg-[#0b1329] p-1 rounded-lg border border-white/10 h-[38px] items-center">
                           <button 
                             onClick={() => setSelectedRes("1080p")} 
                             className={`h-full text-xs font-black rounded-md uppercase tracking-wider transition-all ${selectedRes === "1080p" ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]" : "text-slate-400 hover:text-white"}`}
                           >
                             1080p
                           </button>
                           <button 
                             onClick={() => setSelectedRes("1440p")} 
                             className={`h-full text-xs font-black rounded-md uppercase tracking-wider transition-all ${selectedRes === "1440p" ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]" : "text-slate-400 hover:text-white"}`}
                           >
                             1440p (2K)
                           </button>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-4 pt-2">
                       {processedFpsData.map((spec, i) => (
                         <div key={i} className="space-y-1">
                           <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-300">
                             <span className="tracking-wide">{spec.label}</span>
                             <span className="text-emerald-400 font-black tracking-tight text-right text-sm">{spec.fps} FPS</span>
                           </div>
                           <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                             <div 
                               className={`h-full bg-gradient-to-r ${spec.color} rounded-full transition-all duration-500 ease-out`}
                               style={{ width: `${spec.percentage}%` }}
                             />
                           </div>
                         </div>
                       ))}
                     </div>

                   </div>
                </div>
              </div>
            )}

            {/* 4. ÜRÜN KARŞILAŞTIRMA */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("karsilastirma")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">⚖️</span> Ürün Karşılaştırma
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-500 ${openAccordion === "karsilastirma" ? "rotate-180 text-blue-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 text-slate-300 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "karsilastirma" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-4 space-y-4">
                   
                   {/* DİNAMİK CANLI ARAMA INPUT ALANI */}
                   <div ref={dropdownRef} className="flex flex-col gap-1.5 relative">
                     <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Kıyaslanacak Alternatif Ürünü Yazın</label>
                     <div className="relative">
                       <input 
                         type="text"
                         value={searchQuery}
                         onChange={(e) => {
                           setSearchQuery(e.target.value);
                           setIsDropdownOpen(true);
                         }}
                         onFocus={() => setIsDropdownOpen(true)}
                         placeholder={selectedCompareProduct ? `Şu an kıyaslanan: ${selectedCompareProduct.name}` : "Örn: 4060, Pro SSD, Hawk..."}
                         className="w-full bg-[#0b1329] border border-white/10 text-slate-200 rounded-lg p-3 pr-10 text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">🔍</span>
                     </div>

                     {/* DROP DOWN LİSTESİ */}
                     {isDropdownOpen && searchQuery && (
                       <div className="absolute top-[100%] left-0 right-0 bg-[#0b1329] border border-white/10 mt-1 rounded-xl shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto backdrop-blur-xl bg-opacity-95 divide-y divide-white/5 animate-fade-in">
                         {loadingProducts ? (
                           <div className="p-3 text-xs text-slate-500 text-center">Canlı veriler taranıyor...</div>
                         ) : filteredOptions.length > 0 ? (
                           filteredOptions.map((item, idx) => (
                             <button
                               key={idx}
                               type="button"
                               onClick={() => {
                                 setSelectedCompareProduct(item);
                                 setSearchQuery(""); 
                                 setIsDropdownOpen(false);
                               }}
                               className="w-full p-3 text-left text-xs font-bold text-slate-300 hover:bg-blue-600 hover:text-white transition-colors block truncate"
                             >
                               ✨ {item.name}
                             </button>
                           ))
                         ) : (
                           <div className="p-3 text-xs text-slate-500 italic text-center">Kategoride eşleşen gerçek ürün bulunamadı şefim.</div>
                         )}
                       </div>
                     )}
                   </div>

                   {/* KIYASLAMA TABLOSU */}
                   {selectedCompareProduct ? (
                     <div className="overflow-x-auto pt-2 animate-fade-in">
                       <table className="w-full text-left border-collapse table-fixed">
                         <thead>
                           <tr className="border-b border-white/10 bg-white/5 text-[11px] sm:text-xs uppercase tracking-wider font-black text-slate-400">
                             <th className="py-2.5 px-2 w-1/3">Özellik</th>
                             <th className="py-2.5 px-2 w-1/3 text-blue-400 truncate">Bu Ürün</th>
                             <th className="py-2.5 px-2 w-1/3 text-amber-400 truncate">{selectedCompareProduct.name}</th>
                           </tr>
                         </thead>
                         <tbody>
                           {comparisonRows.map((row, i) => (
                             <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-xs sm:text-sm">
                               <td className="py-3 px-2 font-bold text-slate-400 truncate">{row.label}</td>
                               <td className="py-3 px-2 text-slate-200 font-medium break-words">{row.current}</td>
                               <td className="py-3 px-2 text-slate-400 font-normal break-words">{row.opponent}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   ) : (
                     <p className="text-slate-500 italic py-2">Kıyaslamak istediğiniz modeli yukarıdaki kutuya yazarak seçin şefim.</p>
                   )}

                 </div>
              </div>
            </div>

            {/* 5. TOPLULUK DEĞERLENDİRME */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("topluluk")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">💬</span> Topluluk Değerlendirme
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-500 ${openAccordion === "topluluk" ? "rotate-180 text-blue-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 text-slate-300 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "topluluk" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 sm:pt-4 flex flex-col items-center justify-center gap-2 py-6">
                   <div className="text-amber-400 text-2xl tracking-widest">⭐⭐⭐⭐⭐</div>
                   <p className="text-slate-300 font-bold text-lg mt-2">5.0 / 5 Mükemmel</p>
                   <p className="text-slate-500 text-center max-w-md">Bu canavarı test eden ilk kişilerden biri olun! Deneyimlerinizi bizimle paylaşın.</p>
                 </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* MOBİL YAPIŞKAN PANEL */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1329]/90 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between z-50 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.6)] animate-fade-in">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Havale Fiyatı</span>
            <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {havaleFiyati.toLocaleString('tr-TR')} TL
            </span>
            {isSale ? (
              <span className="text-[9px] text-red-500 font-black animate-pulse">🔥 İNDİRİMLİ ÜRÜN</span>
            ) : (
              <span className="text-[8px] text-blue-400 font-bold">12 Taksit İmkanı</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFav(!isFav)}
              disabled={!stoktaVar} 
              className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all ${
                isFav ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <svg className="w-4 h-4" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || addedSuccess || !stoktaVar}
              className={`font-black py-2.5 px-4 rounded-md uppercase text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 disabled:opacity-80 ${
                addedSuccess ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              }`}
            >
              {addingToCart ? "Ekleniyor..." : addedSuccess ? "✅ EKLENDİ" : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}
            </button>
          </div>
        </div>

      </div>
    </PhotoProvider>
  );
}
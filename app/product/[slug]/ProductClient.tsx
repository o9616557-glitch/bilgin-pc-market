"use client";

import React, { useState, useEffect } from "react";
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

  // 🚀 KARGO MOTORU STATE'LERİ
  const [timeLeft, setTimeLeft] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  // 🚀 ŞEFİN V8 KARGO MOTORU (Canlı Geri Sayım)
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
        
        // Tek haneli sayıların başına 0 ekleme (örn: 03:05:09)
        const pad = (n: number) => n.toString().padStart(2, '0');
        
        setTimeLeft(`${pad(hoursLeft)}:${pad(minutesLeft)}:${pad(secondsLeft)} içinde sipariş verirseniz`);
        setShippingMessage("BUGÜN KARGODA!");
      } else {
        setTimeLeft("Saat 16:00'ı geçtiği için siparişiniz");
        setShippingMessage("YARIN KARGODA!");
      }
    };

    calculateShipping(); // Sayfa açıldığında hemen hesapla
    const timer = setInterval(calculateShipping, 1000); // Her 1 saniyede bir güncelle

    return () => clearInterval(timer); // Bileşen kapanınca motoru durdur
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
  const kartFiyati = Number(product.price || product.regular_price || 0);
  const havaleFiyati = kartFiyati * 0.95;

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
                  <span className="text-sm font-bold text-slate-300">{kartFiyati.toLocaleString('tr-TR')} TL</span>
                  <span className="text-[10px] text-blue-400 font-black bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block w-max sm:ml-auto">
                    12 Taksit İmkanı
                  </span>
                </div>
              </div>

              {/* 🚀 GERİ DÖNEN PAYLAŞIM İKONLARI */}
              <div className="flex items-center gap-3 mb-4 bg-[#050814]/30 border border-white/5 p-2 rounded-md w-max">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Paylaş:</span>
                <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-[11px] cursor-pointer hover:bg-blue-600 hover:text-white transition-colors" title="Kopyala">🔗</div>
                  <div className="w-7 h-7 rounded-md bg-green-500/10 flex items-center justify-center text-[11px] text-green-400 cursor-pointer hover:bg-green-500 hover:text-white transition-colors" title="WhatsApp">WP</div>
                  <div className="w-7 h-7 rounded-md bg-blue-500/10 flex items-center justify-center text-[11px] text-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors" title="X (Twitter)">X</div>
                </div>
              </div>

              {/* 🚀 CANLI KARGO GERİ SAYIM MOTORU */}
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
                      isFav 
                        ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-red-500 hover:bg-red-500/10'
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

        <div className="max-w-6xl mx-auto mt-6 sm:mt-10 relative z-10 flex flex-col gap-6 sm:gap-8">
          <div className="bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden">
            
            {/* 1. ÜRÜN AÇIKLAMASI */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("aciklama")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">🛠️</span> Ürün Açıklaması
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transform transition-transform duration-500 ${openAccordion === "aciklama" ? "rotate-180 text-blue-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 overflow-hidden transition-all duration-500 ${openAccordion === "aciklama" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 sm:pt-4">
                    <div 
                      className="text-slate-200 text-base md:text-lg leading-relaxed space-y-4 prose prose-invert font-normal max-w-none prose-p:my-2 prose-headings:text-white prose-headings:font-black prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-[0_10px_30px_rgba(0,0,0,0.4)] prose-img:w-full prose-img:my-6 sm:prose-img:my-10"
                      dangerouslySetInnerHTML={{ __html: product.description || "Bu canavar için henüz detaylı bir teknik açıklama girilmemiş şefim." }}
                    />
                 </div>
              </div>
            </div>

            {/* 2. TEKNİK ÖZELLİKLER */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("teknik")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">⚙️</span> Teknik Özellikler
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transform transition-transform duration-500 ${openAccordion === "teknik" ? "rotate-180 text-blue-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 text-slate-400 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "teknik" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 sm:pt-4">
                   <p>Teknik veriler buraya çekilecek.</p>
                 </div>
              </div>
            </div>

            {/* 3. OYUN PERFORMANS TESTİ */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("performans")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">🎮</span> Oyun Performans Testi
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transform transition-transform duration-500 ${openAccordion === "performans" ? "rotate-180 text-blue-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 text-slate-400 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "performans" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 sm:pt-4">
                   <p>Oyun FPS değerleri buraya gelecek.</p>
                 </div>
              </div>
            </div>

            {/* 4. ÜRÜN KARŞILAŞTIRMA */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("karsilastirma")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">⚖️</span> Ürün Karşılaştırma
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transform transition-transform duration-500 ${openAccordion === "karsilastirma" ? "rotate-180 text-blue-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 text-slate-400 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "karsilastirma" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 sm:pt-4">
                   <p>Karşılaştırma tabloları burada yer alacak.</p>
                 </div>
              </div>
            </div>

            {/* 5. TOPLULUK DEĞERLENDİRME */}
            <div className="border-b border-white/5 last:border-0">
              <button 
                onClick={() => toggleAccordion("topluluk")}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-400 transition-colors flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">💬</span> Topluluk Değerlendirme
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transform transition-transform duration-500 ${openAccordion === "topluluk" ? "rotate-180 text-blue-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`px-4 sm:px-5 text-slate-400 text-sm overflow-hidden transition-all duration-500 ${openAccordion === "topluluk" ? "max-h-[5000px] pb-4 sm:pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                 <div className="border-t border-white/5 pt-3 sm:pt-4">
                   <p>Müşteri yorumları buraya çekilecek.</p>
                 </div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1329]/90 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between z-50 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.6)] animate-fade-in">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Havale Fiyatı</span>
            <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {havaleFiyati.toLocaleString('tr-TR')} TL
            </span>
            <span className="text-[8px] text-blue-400 font-bold">12 Taksit İmkanı</span>
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
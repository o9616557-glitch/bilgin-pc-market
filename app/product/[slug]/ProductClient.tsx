"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] flex flex-col items-center justify-center text-white px-4">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 text-3xl mb-4 animate-bounce">⚠️</div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Ürün Bulunamadı Şefim!</h2>
        <button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.images && product.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.images && product.images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // 🚀 ADIM 1: SEPETE EKLEME MOTORUNU SADELEŞTİRDİK
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
        image: product.images?.[0]?.src || "/placeholder.png",
        slug: product.slug,
        quantity: quantity
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(currentCart));
    
    // Artık sepete yönlendirme yok, sadece yükleniyor animasyonunu durduruyoruz.
    setTimeout(() => {
      setAddingToCart(false);
      // 🔥 router.push("/sepet"); bu satırı sildik şefim!
    }, 800);
  };

  const stoktaVar = product.stock_status === "instock";
  const hasMultipleImages = product.images && product.images.length > 1;
  const kartFiyati = Number(product.price || product.regular_price || 0);
  const havaleFiyati = kartFiyati * 0.95;

  return (
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white pt-2 pb-24 md:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-medium">
        
        {/* Kozmik arka plan efektleri */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* ÜST BÖLÜM: GÖRSEL VE DETAY KUTUSU */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          
          {/* SOL BÖLÜM: GALERİ SİSTEMİ */}
          <div className="flex flex-col gap-4">
            
            {/* 🚀 ADIM 2: ESKİ KAFA SİYAH ÇERÇEVEYİ BEYAZ YAPTIK! */}
            {/* background: #050814 yerine bg-white kullandık. */}
            <div className="w-full bg-white border border-white/5 p-4 sm:p-6 rounded-2xl overflow-hidden aspect-square relative group shadow-inner flex items-center justify-center cursor-pointer">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl-lg opacity-40"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg opacity-40"></div>
              
              <PhotoView src={product.images?.[activeImageIndex]?.src || "/placeholder.png"}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={product.images?.[activeImageIndex]?.src || "/placeholder.png"} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain transform group-hover:scale-[1.01] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 w-8 h-8 rounded-lg flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </PhotoView>
            </div>

            {/* OKLAR PANELİ */}
            <div className="flex items-center justify-between gap-4 bg-[#050814]/40 border border-white/5 p-2 rounded-xl">
              <button onClick={prevImage} disabled={!hasMultipleImages} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 disabled:opacity-10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div className="flex-1 flex justify-center items-center">
                {hasMultipleImages ? (
                  <>
                    <div className="hidden sm:flex flex-wrap gap-1.5 justify-center items-center">
                      {product.images.map((img: any, index: number) => (
                        <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-10 h-10 bg-[#050814] border rounded-md p-1 transition-all flex items-center justify-center ${activeImageIndex === index ? 'border-blue-500 scale-105' : 'border-white/5 opacity-50'}`}>
                          <img src={img.src} alt="" className="max-w-full max-h-full object-contain" />
                        </button>
                      ))}
                    </div>
                    <div className="flex sm:hidden justify-center items-center gap-1.5">
                      {product.images.map((_: any, index: number) => (
                        <button key={index} onClick={() => setActiveImageIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === index ? 'bg-blue-500 w-4' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </>
                ) : <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tek Görsel</span>}
              </div>

              <button onClick={nextImage} disabled={!hasMultipleImages} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 disabled:opacity-10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* SAĞ BÖLÜM: SATIN ALMA ALANI */}
          <div className="flex flex-col justify-between py-1">
            <div>
              {/* Rozetler ve Kodu */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {stoktaVar ? (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span> STOKTA
                  </span>
                ) : (
                  <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">TÜKENDİ</span>
                )}
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">💎 ORİJİNAL & FATURALI</span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">⚡ HIZLI TESLİMAT</span>
                <span className="bg-slate-500/10 border border-white/5 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider">KOD: BPC-{product.id}</span>
              </div>

              {/* Yıldız Değerlendirme */}
              <div className="flex items-center gap-2 mb-2">
                <div className="text-amber-400 text-xs tracking-tighter">⭐⭐⭐⭐⭐</div>
                <span className="text-[11px] font-bold text-slate-400">5.0 / (0) Değerlendirme</span>
              </div>

              {/* Ürün Adı */}
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight">
                {product.name}
              </h1>
              
              {/* Fiyat Kutusu (Havale İndirimli) */}
              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-xl mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-inner">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">Havale / EFT Özel Fiyatı (%5 İndirim)</span>
                  <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    {havaleFiyati.toLocaleString('tr-TR')} TL
                  </span>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 block font-bold">Kredi Kartı / Tek Çekim</span>
                  <span className="text-sm font-bold text-slate-300">{kartFiyati.toLocaleString('tr-TR')} TL</span>
                  <span className="text-[10px] text-blue-400 font-black bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded mt-0.5 inline-block w-max sm:ml-auto">12 Taksit Seçeneği</span>
                </div>
              </div>

              {/* Paylaş Butonları */}
              <div className="flex items-center gap-3 mb-4 bg-[#050814]/30 border border-white/5 p-2 rounded-xl w-max">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Paylaş:</span>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px]">🔗</div>
                  <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center text-[10px] text-green-400">WP</div>
                  <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-400">X</div>
                </div>
              </div>
            </div>

            {/* MASAÜSTÜ SATIN ALMA PANELİ */}
            <div className="border-t border-white/5 pt-4 mt-2 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-xl p-1.5 min-w-[110px]">
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500 rounded-md" disabled={!stoktaVar}>-</button>
                  <span className="px-2 font-black text-sm text-white">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center font-black text-slate-400 hover:text-blue-500 rounded-md" disabled={!stoktaVar}>+</button>
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || !stoktaVar}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 px-6 rounded-xl uppercase tracking-wider transition-all shadow-lg active:scale-[0.99] disabled:opacity-40 text-xs sm:text-sm"
                  >
                    {addingToCart ? "Sistem Ekleniyor..." : !stoktaVar ? "STOKTA YOK" : "Sisteme ve Sepete Ekle"}
                  </button>

                  <button disabled={!stoktaVar} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </div>
              </div>
              <div className="mt-3 text-center opacity-30 text-[9px] font-bold tracking-wider text-slate-400">🔒 256-Bit SSL Güvenli Alışveriş Altyapısı</div>
            </div>

          </div>
        </div>

        {/* ÜRÜN AÇIKLAMASI (TAM GENİŞLİK ALTA ALINDI) */}
        <div className="max-w-6xl mx-auto mt-8 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          <div className="border-b border-white/5 pb-3 mb-5">
            <h2 className="text-base md:text-lg font-black uppercase tracking-widest text-blue-500 italic flex items-center gap-2">
              🛠️ Donanım & Detaylı Ürün Açıklaması
            </h2>
            <div className="h-1 w-16 bg-blue-500 mt-1.5 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
          </div>
          
          <div 
            className="text-slate-200 text-sm md:text-base lg:text-lg leading-relaxed space-y-4 prose prose-invert font-normal max-w-none prose-p:my-2 prose-headings:text-white prose-headings:font-black"
            dangerouslySetInnerHTML={{ __html: product.description || "Bu canavar için henüz detaylı bir teknik açıklama girilmemiş şefim." }}
          />
        </div>

        {/* 📱 TELEFONLAR İÇİN ALT YAPIŞKAN (STICKY) SEPET PANELİ */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0b1329]/90 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between z-50 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.6)] animate-fade-in">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Havale Fiyatı</span>
            <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {havaleFiyati.toLocaleString('tr-TR')} TL
            </span>
            <span className="text-[8px] text-blue-400 font-bold">Kart ile 12 Taksit</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || !stoktaVar}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-2.5 px-5 rounded-xl uppercase text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 disabled:opacity-40"
          >
            {addingToCart ? "Ekleniyor..." : !stoktaVar ? "STOKTA YOK" : "Sepete Ekle"}
          </button>
        </div>

      </div>
    </PhotoProvider>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// TIKLAYINCA RESİMLERİ TAM EKRAN YAPMAK İÇİN SİHİRLİ BİR KÜTÜPHANE KULLANIYORUZ
// (Şefim, bunu custom yapmak çok uzun ve buglı olurdu, bu kütüphane milimetrik çalışıyor)
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // 🚀 GALERİ SİHİRİ: Aktif resmin indexini tutuyoruz
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Sayfa açıldığında anında en üste kaydırır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] flex flex-col items-center justify-center text-white px-4">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 text-3xl mb-4 animate-bounce">
          ⚠️
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Aradığınız Ürün Bulunamadı Şefim!</h2>
        <button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

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
    
    setTimeout(() => {
      setAddingToCart(false);
      router.push("/sepet");
    }, 800);
  };

  const stoktaVar = product.stock_status === "instock";
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    // 🚀 BÜTÜN SAYFAYI TAM EKRAN GALERİ MOTORUNA SARDIK
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-medium">
        
        {/* Arka plan kozmik neon efektleri */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          
          {/* SOL TARAF: ANA GÖRSEL VE GALERİ (MOBİL/PC UYUMLU) */}
          <div className="flex flex-col gap-4">
            
            {/* ANA RESİM VE TAM EKRAN TETİKLEYİCİSİ */}
            <div className="w-full bg-[#050814]/80 border border-white/5 p-6 sm:p-10 rounded-2xl overflow-hidden aspect-square relative group shadow-inner flex items-center justify-center cursor-pointer">
              {/* Neon Köşe Çizgileri */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 rounded-tl-xl opacity-40 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-xl opacity-40 group-hover:opacity-100 transition-opacity"></div>
              
              {/* 🚀 İşte tam ekran yapan o View motoru */}
              <PhotoView src={product.images?.[activeImageIndex]?.src || "/placeholder.png"}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={product.images?.[activeImageIndex]?.src || "/placeholder.png"} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Büyüteç Simgesi (Hoverda gelir) */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </PhotoView>
            </div>

            {/* 🚀 SİHİRLİ GALERİ ALANI: PC'de Küçük Resim, Mobilde Noktalar */}
            {hasMultipleImages && (
              <>
                {/* 💻 PC: Küçük Resim Kutuları (Altta kalır) */}
                <div className="hidden sm:flex flex-wrap gap-3 justify-center items-center mt-2 w-full">
                  {product.images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-[#050814] border rounded-xl p-2 overflow-hidden transition-all flex items-center justify-center ${
                        activeImageIndex === index 
                          ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' 
                          : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'
                      }`}
                    >
                      <img src={img.src} alt="" className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>

                {/* 📱 MOBİL: Şık Pagination Noktaları */}
                <div className="flex sm:hidden justify-center items-center gap-2 mt-4">
                  {product.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        activeImageIndex === index
                          ? 'bg-blue-500 w-6' // Aktif nokta genişler (Apple stili)
                          : 'bg-white/20'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* 🚀 GİZLİ GALERİ: Tam ekranda oklarla gezerken WordPress'teki tüm resimleri göstermek için buraya gizli PhotoView'lar ekliyoruz */}
            {hasMultipleImages && (
              <div className="hidden">
                {product.images.map((img: any, index: number) => (
                  <PhotoView key={index} src={img.src} />
                ))}
              </div>
            )}

          </div>

          {/* SAĞ TARAF: PREMIUM DETAYLAR */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {/* Üst Rozetler */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {stoktaVar ? (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> Stokta Var
                  </span>
                ) : (
                  <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Tükendi
                  </span>
                )}
                {/* 🔄 DEĞİŞEN GARANTİ ROZETİ: Artık kafa karıştırmayacak */}
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  💎 Orijinal & Faturalı
                </span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  ⚡ Hızlı Teslimat
                </span>
              </div>

              {/* Ürün Adı */}
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight">
                {product.name}
              </h1>
              
              {/* Fiyat Alanı */}
              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-xl mb-6 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 block mb-0.5">Nakit / Havale Fiyatı</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    {Number(product.price || product.regular_price).toLocaleString('tr-TR')} TL
                  </span>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block font-bold">Kredi Kartına</span>
                  <span className="text-sm text-blue-400 font-black">12 Taksit İmkanı</span>
                </div>
              </div>

              {/* 🚀 BÜYÜK YAZILI VE KUTUSUZ (AŞAĞI DOĞRU AKAN) AÇIKLAMA ALANI */}
              <div className="border-t border-white/5 pt-5 mb-6">
                <h3 className="text-xs font-black uppercase text-blue-400 tracking-widest mb-4">Donanım & Ürün Açıklaması</h3>
                <div 
                  className="text-slate-200 text-base md:text-lg leading-relaxed space-y-4 prose prose-invert font-normal max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description || "Bu ürün için detaylı teknik açıklama girilmemiş şefim." }}
                />
              </div>
            </div>

            {/* ADET SEÇİMİ VE SEPET BUTONU */}
            <div className="border-t border-white/5 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Şık Adet Sayacı */}
                <div className="flex items-center justify-between sm:justify-start bg-[#050814] border border-white/10 rounded-xl p-2 min-w-[140px]">
                  <button 
                    onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} 
                    className="w-10 h-10 flex items-center justify-center font-black text-xl text-slate-400 hover:text-blue-500 hover:bg-white/5 rounded-lg transition-all"
                    disabled={!stoktaVar}
                  >
                    -
                  </button>
                  <span className="px-6 font-black text-xl text-center flex-1 sm:flex-none text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="w-10 h-10 flex items-center justify-center font-black text-xl text-slate-400 hover:text-blue-500 hover:bg-white/5 rounded-lg transition-all"
                    disabled={!stoktaVar}
                  >
                    +
                  </button>
                </div>

                {/* RGB Parlamalı Canavar Sepet Butonu */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !stoktaVar}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 px-6 rounded-xl uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-3 text-sm"
                >
                  {addingToCart ? (
                    "Sepete Ekleniyor..."
                  ) : !stoktaVar ? (
                    "STOKTA YOK"
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 010-4zm-8 0a2 2 0 100 4 2 2 0 010-4z" />
                      </svg>
                      Sepete Ekle
                    </>
                  )}
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </PhotoProvider>
  );
}
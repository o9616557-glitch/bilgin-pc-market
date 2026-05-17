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

  // 🚀 OK NAVİGASYON MOTORU
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
    <PhotoProvider>
      <div className="min-h-[calc(100vh-80px)] bg-[#050814] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-medium">
        
        {/* Arka plan kozmik efektler */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* ÜST BÖLÜM: GÖRSEL VE SATIN ALMA KUTUSU */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          
          {/* SOL BÖLÜM: GELİŞMİŞ OKLU GALERİ SİSTEMİ */}
          <div className="flex flex-col gap-6">
            
            {/* ANA RESİM KUTUSU */}
            <div className="w-full bg-[#050814]/80 border border-white/5 p-6 sm:p-10 rounded-2xl overflow-hidden aspect-square relative group shadow-inner flex items-center justify-center cursor-pointer">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 rounded-tl-xl opacity-40 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-xl opacity-40 group-hover:opacity-100 transition-opacity"></div>
              
              <PhotoView src={product.images?.[activeImageIndex]?.src || "/placeholder.png"}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={product.images?.[activeImageIndex]?.src || "/placeholder.png"} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  {/* Büyüteç İkonu */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 w-10 h-10 rounded-xl flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-lg" title="Tam Ekran Görünüm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </PhotoView>
            </div>

            {/* 🚀 SAĞINDA SOLUNDA OK OLAN GELİŞMİŞ ALT KONTROL PANELİ */}
            <div className="flex items-center justify-between gap-4 bg-[#050814]/40 border border-white/5 p-3 rounded-2xl">
              {/* Sol Ok */}
              <button 
                onClick={prevImage}
                disabled={!hasMultipleImages}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:pointer-events-none transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* ORTA: PC'de Küçük Resimler / Mobilde Akıllı Noktalar */}
              <div className="flex-1 flex justify-center items-center overflow-hidden">
                {hasMultipleImages ? (
                  <>
                    {/* PC Modu: Küçük Resimler */}
                    <div className="hidden sm:flex flex-wrap gap-2 justify-center items-center">
                      {product.images.map((img: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-12 h-12 bg-[#050814] border rounded-lg p-1 transition-all flex items-center justify-center ${
                            activeImageIndex === index ? 'border-blue-500 scale-105 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-white/5 opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img src={img.src} alt="" className="max-w-full max-h-full object-contain" />
                        </button>
                      ))}
                    </div>

                    {/* Mobil Modu: Apple Stili Genişleyen Noktalar */}
                    <div className="flex sm:hidden justify-center items-center gap-1.5">
                      {product.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === index ? 'bg-blue-500 w-5' : 'bg-white/20'}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">Tek Görsel Mevcut</span>
                )}
              </div>

              {/* Sağ Ok */}
              <button 
                onClick={nextImage}
                disabled={!hasMultipleImages}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 disabled:opacity-20 disabled:pointer-events-none transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Arka planda tam ekranda gezinme için gizli liste */}
            {hasMultipleImages && (
              <div className="hidden">
                {product.images.map((img: any, index: number) => (
                  <PhotoView key={index} src={img.src} />
                ))}
              </div>
            )}
          </div>

          {/* SAĞ BÖLÜM: SATIN ALMA DETAYLARI (AÇIKLAMASIZ, YALNIZCA ÖZET) */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {/* Üst Satır: Rozetler ve Gizli SKU alanı */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {stoktaVar ? (
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span> STOKTA
                    </span>
                  ) : (
                    <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">TÜKENDİ</span>
                  )}
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">💎 ORİJİNAL & FATURALI</span>
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">⚡ HIZLI TESLİMAT</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold hidden sm:block">ID: #{product.id}</span>
              </div>

              {/* 🚀 YORUMLAR ALANI (PLACEHOLDER - CAN VERİLECEK) */}
              <div className="flex items-center gap-2 mb-2 cursor-pointer group/comment" title="Yorumlar yakında şefim!">
                <div className="flex items-center text-amber-400 text-sm tracking-tighter">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover/comment:text-blue-400 transition-colors">
                  5.0 / (0 Değerlendirme) • <span className="underline decoration-dotted">Can Verilecek</span>
                </span>
              </div>

              {/* Ürün Adı ve Başlığı */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight">
                {product.name}
              </h1>
              
              {/* Fiyat Alanı */}
              <div className="bg-[#050814]/50 border border-white/5 p-4 rounded-xl mb-6 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 block mb-0.5">Nakit / Havale Fiyatı</span>
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    {Number(product.price || product.regular_price).toLocaleString('tr-TR')} TL
                  </span>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block font-bold">Kredi Kartına</span>
                  <span className="text-xs text-blue-400 font-black bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md mt-0.5 inline-block">12 Taksit İmkanı</span>
                </div>
              </div>

              {/* 🚀 SOSYAL MEDYA PAYLAŞIM ALANI (PLACEHOLDER - CAN VERİLECEK) */}
              <div className="flex items-center gap-3 mb-6 bg-[#050814]/30 border border-white/5 p-3 rounded-xl w-max">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Paylaş:</span>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" title="Paylaşım sistemi can verilecek!">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white">🔗</div>
                  <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs text-green-400">WP</div>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs text-blue-400">X</div>
                </div>
              </div>
            </div>

            {/* ADET SEÇİMİ VE SEPETE EKLE BUTONU */}
            <div className="border-t border-white/5 pt-6 mt-4">
              <div className="flex items-stretch sm:items-center gap-4">
                
                {/* Adet Sayacı */}
                <div className="flex items-center justify-between bg-[#050814] border border-white/10 rounded-xl p-1.5 min-w-[120px]">
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="w-8 h-8 flex items-center justify-center font-black text-lg text-slate-400 hover:text-blue-500 hover:bg-white/5 rounded-md transition-all" disabled={!stoktaVar}>-</button>
                  <span className="px-4 font-black text-base text-white">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center font-black text-lg text-slate-400 hover:text-blue-500 hover:bg-white/5 rounded-md transition-all" disabled={!stoktaVar}>+</button>
                </div>

                {/* Sepet Butonu ve FAVORİ KALBİ */}
                <div className="flex-1 flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || !stoktaVar}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3.5 px-6 rounded-xl uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    {addingToCart ? "Sistem Ekleniyor..." : !stoktaVar ? "STOKTA YOK" : "Sisteme ve Sepete Ekle"}
                  </button>

                  {/* 🚀 FAVORİ KALPI BUTONU (PLACEHOLDER - CAN VERİLECEK) */}
                  <button 
                    disabled={!stoktaVar}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 active:scale-95 transition-all shadow-md group/fav"
                    title="Favorilere Ekle (Can Verilecek)"
                  >
                    <svg className="w-5 h-5 transform group-hover/fav:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Şef Bonusu: Güvenli Ödeme Kuşağı */}
              <div className="mt-4 flex items-center justify-center gap-2 opacity-30 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                🔒 256-Bit SSL Teknolojisi ile Güvenli Alışveriş Altyapısı
              </div>
            </div>

          </div>
        </div>

        {/* 🚀 BÜYÜK DEĞİŞİM: KUTUSUZ, TAM GENİŞLİK AŞAĞI DOĞRU AKAN ÜRÜN AÇIKLAMA ALANI */}
        <div className="max-w-6xl mx-auto mt-10 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          <div className="border-b border-white/5 pb-4 mb-6">
            <h2 className="text-lg md:text-xl font-black uppercase tracking-widest text-blue-500 italic flex items-center gap-2">
              🛠️ Donanım & Detaylı Ürün Açıklaması
            </h2>
            <div className="h-1 w-20 bg-blue-500 mt-2 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
          </div>
          
          {/* Yazılar artık kocamandır, aşağıya ferah ferah akar */}
          <div 
            className="text-slate-200 text-base md:text-lg lg:text-xl leading-relaxed space-y-4 prose prose-invert font-normal max-w-none prose-p:my-2 prose-headings:text-white prose-headings:font-black"
            dangerouslySetInnerHTML={{ __html: product.description || "Bu canavar için henüz detaylı bir teknik açıklama girilmemiş şefim." }}
          />
        </div>

      </div>
    </PhotoProvider>
  );
}
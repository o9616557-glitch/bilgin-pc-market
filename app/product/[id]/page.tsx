"use client";

import React, { useState, useEffect } from "react";
// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ProductGallery from "./productgallery";

// AYARLAR
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default function UrunDetay({ params }: { params: any }) {
  const [product, setProduct] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [id, setId] = useState<string>("");

  // Veri Çekme Motoru
  useEffect(() => {
    params.then((p: any) => {
      setId(p.id);
      api.get(`products/${p.id}`).then((res: any) => setProduct(res.data));
    });
  }, [params]);

  if (!product) return <div className="bg-[#050810] min-h-screen flex items-center justify-center text-blue-500 animate-pulse font-black">SİSTEM YÜKLENİYOR...</div>;

  const acf = product.acf || {};

  return (
    <div className="bg-[#050810] min-h-screen pb-20 text-white font-sans selection:bg-blue-500/30">
      
      {/* ========================================== */}
      {/* 1. ÜST MENÜ (HEADER) - SIFIR KUTU, TAM FERAH */}
      {/* ========================================== */}
      <header className="w-full bg-[#050810]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between relative">
          
          {/* SOL: HAMBURGER VE ARAMA */}
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-blue-500 transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button className="text-white hover:text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>

          {/* ORTA: LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2 text-xl font-black tracking-tighter">
            BİLGİN<span className="text-blue-500">PC</span>
          </div>

          {/* SAĞ: HESABIM VE SEPET */}
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-white hover:text-blue-500">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <button className="text-white hover:text-green-500 relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="absolute -top-1 -right-2 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </button>
          </div>
        </div>

        {/* HAMBURGER İÇİ (Açılır Menü) */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full md:w-80 bg-[#0b0f1a] border-b border-white/5 shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-left duration-300">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Mağaza Menüsü</div>
            <a href="/" className="text-2xl font-black hover:text-blue-500 transition-colors">ANA SAYFA</a>
            <a href="#" className="text-2xl font-black hover:text-blue-500 transition-colors">EKRAN KARTLARI</a>
            <a href="#" className="text-2xl font-black hover:text-blue-500 transition-colors">HAZIR SİSTEMLER</a>
            <div className="h-px bg-white/5 w-full my-2"></div>
            <a href="#" className="text-slate-400 font-bold">HESABIM</a>
            <a href="#" className="text-slate-400 font-bold">DESTEK</a>
          </div>
        )}
      </header>

      {/* ========================================== */}
      {/* 2. ÜRÜN BAŞLIĞI VE YILDIZLAR */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-5 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">High Performance</span>
            <h1 className="text-3xl md:text-5xl font-black leading-none uppercase italic tracking-tighter">{product.name}</h1>
            
            {/* Yıldızlar ve Favori */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <span className="text-slate-500 text-xs font-bold">4.9 (124 Yorum)</span>
              <button className="ml-4 text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Favorilere Ekle
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-slate-500 text-[10px] font-black uppercase block">Peşin Fiyatı</span>
            <div className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
              {product.price} <span className="text-blue-500 text-2xl md:text-4xl">TL</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. GALERİ VE SEPETE EKLE (SIFIR KUTU) */}
      {/* ========================================== */}
      <div className="max-w-6xl mx-auto px-5 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Sol: Galeri */}
        <div className="lg:col-span-8">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Sağ: Satın Alma Butonu */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
           <button className="w-full bg-green-500 hover:bg-green-400 text-black h-20 rounded-2xl font-black text-xl uppercase tracking-tighter transition-all shadow-[0_20px_50px_rgba(34,197,94,0.2)] active:scale-95">
              SEPETE EKLE
           </button>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-white/5 rounded-2xl">
                <div className="text-blue-500 text-xl mb-1">🚚</div>
                <div className="text-[9px] font-black text-slate-500 uppercase">Hızlı Kargo</div>
              </div>
              <div className="text-center p-4 border border-white/5 rounded-2xl">
                <div className="text-blue-500 text-xl mb-1">🛡️</div>
                <div className="text-[9px] font-black text-slate-500 uppercase">2 Yıl Garanti</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
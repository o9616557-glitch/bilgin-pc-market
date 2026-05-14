"use client";

import React from "react";
import Link from "next/link";

// Ana sayfadan gelecek olan 'urunler' listesinin veri yapısı
interface Urun {
  id: number;
  ad: string;
  fiyat: string;
  resim: string;
  ozellik: string;
}

export default function ProductGrid({ urunler }: { urunler: Urun[] }) {
  
  // Ürün yoksa bu alanı gizle
  if (!urunler || urunler.length === 0) {
    return null; 
  }

  return (
    <section className="w-full max-w-[1400px] mx-auto px-5 py-16 border-t border-white/5">
      
      {/* BAŞLIK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white">
          Popüler <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 pr-2">Ürünler</span>
        </h2>
      </div>

      {/* IZGARA (GRID) ALANI */}
      {/* grid-cols-2 (telefonda 2'li), md:grid-cols-3 (tablette 3'lü), lg:grid-cols-4 (bilgisayarda 4'lü) düzeni sağlar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        
        {urunler.map((urun) => (
          // ÜRÜN KUTUSU (Hover efektleriyle birlikte)
          <div key={urun.id} className="bg-[#0b0f1a] border border-white/5 rounded-2xl p-3 md:p-4 group hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col h-full relative">
            
            {/* Ürün Görseli */}
            <div className="w-full h-[150px] md:h-[200px] bg-[#050810] rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
              <img src={urun.resim} alt={urun.ad} className="object-contain h-full p-2 md:p-4 group-hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Ürün Detayları */}
            <div className="flex flex-col flex-grow gap-2">
              <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                {urun.ad}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2">
                {urun.ozellik}
              </p>
            </div>
            
            {/* Fiyat ve Sepete Ekle Butonu */}
            <div className="mt-auto pt-4">
              <div className="text-sm md:text-lg font-black text-white mb-3">{urun.fiyat}</div>
              
              <button className="w-full py-2 md:py-2.5 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-lg text-xs md:text-sm font-bold text-white uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Sepete Ekle
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* DAHA FAZLA GÖSTER BUTONU */}
      <div className="mt-12 flex justify-center">
        <button className="px-8 py-3 bg-transparent border border-slate-600 text-slate-400 font-bold text-sm uppercase tracking-widest rounded-lg hover:border-white hover:text-white transition-colors">
          Daha Fazla Ürün Göster
        </button>
      </div>

    </section>
  );
}
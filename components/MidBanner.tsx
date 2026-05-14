"use client";

import React from "react";

export default function MidBanner() {
  return (
    // EĞİTİM NOTU: h-[300px] ile bu alana sabit bir yükseklik verdik. 
    // 'bg-fixed' ve 'bg-grid' mantığında küçük bir desen ekleyerek derinlik kazandırdık.
    <section className="w-full h-[300px] md:h-[400px] relative overflow-hidden flex items-center justify-center border-y border-white/5 bg-[#050810]">
      
      {/* Arka Plan Neon Işıkları */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full"></div>
      
      {/* İÇERİK KUTUSU */}
      <div className="max-w-[1400px] mx-auto px-5 relative z-10 text-center">
        
        {/* Küçük Üst Başlık */}
        <p className="text-blue-500 font-bold text-xs md:text-sm tracking-[0.3em] uppercase mb-4 animate-pulse">
          Maksimum Performans
        </p>

        {/* ANA BÜYÜK BAŞLIK */}
        <h2 className="text-4xl md:text-6xl xl:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
          OYUNUN <br className="md:hidden" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 pr-2">
            HAKİMİ OL
          </span>
        </h2>

        {/* Alt Detay Yazısı */}
        <p className="mt-6 text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed italic">
          Bilgin PC Market ile en düşük gecikme ve en yüksek FPS değerlerine ulaş. <br className="hidden md:block" /> Profesyonellerin tercihi olan donanımlar seni bekliyor.
        </p>

      </div>
    </section>
  );
}
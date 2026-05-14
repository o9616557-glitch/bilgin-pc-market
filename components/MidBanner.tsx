"use client";

import React from "react";

export default function MidBanner() {
  return (
    // EĞİTİM NOTU: py-16 ile üstten alttan boşluk bıraktık, bg-[#050810] ile arka planı koyu yaptık.
    <section className="w-full bg-[#050810] py-16 border-y border-white/5 relative overflow-hidden">
      
      {/* Arka Plan Işık Efekti */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-5 flex flex-col items-center">
        
        {/* İNDİRİM ROZETİ (Yuvarlak ve dikkat çekici) */}
        <div className="mb-6 px-5 py-2 bg-green-500 text-black text-sm font-black uppercase tracking-widest rounded-full animate-bounce shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          %20'ye Varan İndirim
        </div>

        {/* ANA KAMPANYA BAŞLIĞI */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white text-center uppercase tracking-tighter leading-[1.1] mb-6">
          SEÇİLİ SİSTEMLERDE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
            BAHAR KAMPANYASI
          </span>
        </h2>

        {/* DETAY METNİ */}
        <p className="text-slate-400 text-sm md:text-base text-center max-w-2xl mb-12 font-medium">
          NVIDIA GeForce RTX 40 ve 50 serisi hazır sistemlerde geçerli dev indirimleri ve peşin fiyatına 12 taksit fırsatını kaçırma.
        </p>

        {/* GÜVEN VERİCİ ROZETLER (Garanti, Taksit, Bakım) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          
          {/* Rozet 1: Garanti */}
          <div className="flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-blue-500/50 transition-colors">
            <div className="w-16 h-16 mb-4 flex items-center justify-center border-4 border-blue-500 rounded-xl text-blue-500 italic font-black text-3xl transform group-hover:rotate-6 transition-transform">
              4
            </div>
            <h4 className="text-white font-bold uppercase text-sm mb-1">Yıl Garanti</h4>
            <p className="text-[10px] text-slate-500 text-center uppercase font-bold">Tüm Parçalarda Geçerli</p>
          </div>

          {/* Rozet 2: Taksit */}
          <div className="flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-green-500/50 transition-colors">
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-green-500 rounded-full text-black italic font-black text-3xl transform group-hover:scale-110 transition-transform">
              12
            </div>
            <h4 className="text-white font-bold uppercase text-sm mb-1">Peşin Fiyatına</h4>
            <p className="text-[10px] text-slate-500 text-center uppercase font-bold">Vade Farksız Taksit</p>
          </div>

          {/* Rozet 3: Teknik Destek */}
          <div className="flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-blue-500/50 transition-colors">
            <div className="w-16 h-16 mb-4 flex items-center justify-center border-4 border-blue-500 rounded-full text-blue-500 transform group-hover:-rotate-6 transition-transform">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h4 className="text-white font-bold uppercase text-sm mb-1">Ücretsiz Bakım</h4>
            <p className="text-[10px] text-slate-500 text-center uppercase font-bold">Ömür Boyu Teknik Destek</p>
          </div>

        </div>

      </div>
    </section>
  );
}
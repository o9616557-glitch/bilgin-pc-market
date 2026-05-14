"use client";

import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    // EĞİTİM NOTU: h-[500px] yerine mobilde 'h-auto py-16' (otomatik uza ve boşluk bırak) komutunu kullandık. Bilgisayarda ise 'md:h-[500px] xl:h-[600px]' diyerek yine eski boyutunda kalmasını sağladık.
    <section className="relative w-full h-auto py-16 md:py-0 md:h-[500px] xl:h-[600px] bg-[#050810] overflow-hidden border-b border-white/5 flex items-center">
      
      {/* ARKA PLAN EFEKTLERİ */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ANA İÇERİK KUTUSU */}
      <div className="max-w-[1400px] mx-auto px-5 w-full flex flex-col md:flex-row items-center justify-between relative z-10">
        
        {/* SOL TARAF: Yazılar ve Butonlar */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-max">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Yeni Nesil Güç</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl xl:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
            Sınırları <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Zorla</span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-md leading-relaxed">
            NVIDIA RTX 5090 ve AMD Ryzen 9950X3D ile donatılmış, oyun ve madencilik için özel olarak optimize edilen en üst düzey sistemleri hemen keşfet.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link href="/kategori/hazir-sistemler" className="px-6 py-3.5 bg-green-500 hover:bg-green-600 text-black font-black italic uppercase tracking-wider rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              Hemen İncele
            </Link>
            <Link href="/bilesenler" className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider rounded-lg transition-all border border-white/10">
              Parçaları Gör
            </Link>
          </div>

        </div>

        {/* SAĞ TARAF: Görsel Alanı */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative mt-12 md:mt-0">
           {/* Görsel Kutusu */}
           <div className="w-[300px] h-[350px] xl:w-[400px] xl:h-[450px] bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-slate-500 font-black italic tracking-widest uppercase">Görsel Alanı</span>
              <span className="text-slate-600 text-xs mt-2 font-medium">Buraya efsane bir kasa resmi gelecek</span>
           </div>
        </div>

      </div>
    </section>
  );
}
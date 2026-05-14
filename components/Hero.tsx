"use client";

import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    // EĞİTİM NOTU: 'relative' komutu arka plandaki o parlamaların ekrandan taşmasını engeller.
    <section className="relative w-full h-[500px] xl:h-[600px] bg-[#050810] overflow-hidden border-b border-white/5">
      
      {/* ARKA PLAN EFEKTLERİ: Sol tarafa mavi, sağ tarafa yeşil hafif bir neon parlaması veriyoruz */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ANA İÇERİK KUTUSU */}
      <div className="max-w-[1400px] mx-auto px-5 h-full flex flex-col md:flex-row items-center justify-between relative z-10">
        
        {/* SOL TARAF: Yazılar ve Butonlar */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 pt-10 md:pt-0">
          
          {/* Ufak Dikkat Çekici Etiket */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-max">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Yeni Nesil Güç</span>
          </div>
          
          {/* ANA BAŞLIK */}
          <h1 className="text-4xl md:text-5xl xl:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
            Sınırları <br/>
            {/* Yazının içine mavi-yeşil renk geçişi (gradient) ekledik */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Zorla</span>
          </h1>
          
          {/* ALT AÇIKLAMA */}
          <p className="text-sm md:text-base text-slate-400 font-medium max-w-md leading-relaxed">
            NVIDIA RTX 5090 ve AMD Ryzen 9950X3D ile donatılmış, oyun ve madencilik için özel olarak optimize edilen en üst düzey sistemleri hemen keşfet.
          </p>
          
          {/* BUTONLAR */}
          <div className="flex items-center gap-4 mt-4">
            <Link href="/kategori/hazir-sistemler" className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-black font-black italic uppercase tracking-wider rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              Hemen İncele
            </Link>
            <Link href="/bilesenler" className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider rounded-lg transition-all border border-white/10">
              Parçaları Gör
            </Link>
          </div>

        </div>

        {/* SAĞ TARAF: Görsel Alanı */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center relative mt-10 md:mt-0">
           {/* EĞİTİM NOTU: Buraya geçici olarak şık bir kutu koyduk. Gerçek bir PNG kasa görseli bulduğumuzda bu kutunun yerine onu koyacağız. */}
           <div className="w-[300px] h-[400px] xl:w-[400px] xl:h-[500px] bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-slate-500 font-black italic tracking-widest uppercase">Görsel Alanı</span>
              <span className="text-slate-600 text-xs mt-2 font-medium">Buraya efsane bir kasa resmi gelecek</span>
           </div>
        </div>

      </div>
    </section>
  );
}
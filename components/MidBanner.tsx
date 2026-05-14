"use client";

import React from "react";

export default function MidBanner() {
  return (
    <section className="w-full bg-[#050810] py-12 md:py-20 border-y border-white/5 relative overflow-hidden">
      {/* Arka plan derinlik efekti */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.07),transparent)]"></div>

      <div className="max-w-[1400px] mx-auto px-5 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* SOL: Ana Slogan (Sade ve Sert) */}
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
              MÜKEMMEL <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                MÜHENDİSLİK
              </span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-bold uppercase tracking-[0.2em]">
              Bilgin PC Standartları ile Üretildi
            </p>
          </div>

          {/* SAĞ: Teknik Vurgular (Mobilde alt alta değil, yan yana veya kompakt durur) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 border-l-0 lg:border-l border-white/10 lg:pl-12">
            
            <div className="flex flex-col gap-1">
              <span className="text-blue-500 font-black text-xl md:text-2xl italic tracking-tighter">ULTRA-STABLE</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">24 Saat Stress Testi</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-green-500 font-black text-xl md:text-2xl italic tracking-tighter">PRO-BUILT</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Profesyonel Montaj</span>
            </div>

            <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
              <span className="text-white font-black text-xl md:text-2xl italic tracking-tighter">ZERO-LATENCY</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Optimize Yazılım Altyapısı</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
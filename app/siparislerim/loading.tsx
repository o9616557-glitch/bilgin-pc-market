import React from "react";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      
      {/* SİBER NEON ARKA PLAN IŞIKLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ÜST PANEL SKELETON */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-700 pb-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 opacity-50">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              GEÇMİŞ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">SİPARİŞLERİM</span>
            </h1>
          </div>
          {/* Sipariş Sayısı Bölümü Hayaleti (Açık Gri) */}
          <div className="w-36 h-11 bg-slate-500/50 rounded-xl animate-pulse shadow-lg"></div>
        </div>

        {/* 🚀 SİPARİŞ KARTI HAYALETİ */}
        <div className="flex flex-col gap-6">
          {/* Kartın arka planını da hayaletler gözüksün diye hafif aydınlattık */}
          <div className="border border-slate-700 bg-slate-800/30 rounded-2xl overflow-hidden shadow-xl">
            
            {/* Sipariş Üst Bar Hayaleti (Tarih, No, Tutar) */}
            <div className="bg-slate-700/30 border-b border-slate-700/60 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="h-4 bg-slate-500/50 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-slate-500/50 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-5 bg-slate-500/50 rounded w-28 animate-pulse"></div>
            </div>

            {/* Sipariş İçerik Alanı Hayaleti */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-20 h-20 bg-slate-500/50 rounded-xl animate-pulse shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-500/50 rounded w-2/3 mb-3 animate-pulse"></div>
                <div className="h-4 bg-slate-500/50 rounded w-1/4 animate-pulse"></div>
              </div>
              <div className="w-24 h-9 bg-slate-500/50 rounded-lg animate-pulse"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
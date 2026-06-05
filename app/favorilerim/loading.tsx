import React from "react";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      
      {/* SİBER NEON ARKA PLAN IŞIKLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3b82f6] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ÜST PANEL SKELETON */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-700 pb-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 opacity-50">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              FAVORİ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">ÜRÜNLERİM</span>
            </h1>
          </div>
          {/* Aydınlatılmış Ürün Sayısı Hayaleti */}
          <div className="w-32 h-11 bg-slate-500/50 rounded-xl animate-pulse shadow-lg"></div>
        </div>

        {/* 🚀 SADECE 1 TANE HAYALET KUTU (Aydınlatılmış Renkler) */}
        <div className="flex flex-col gap-4">
          <div className="border border-slate-700 bg-slate-800/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden">
            
            {/* Ürün Görseli Hayaleti */}
            <div className="w-full sm:w-24 h-24 bg-slate-500/50 rounded-xl animate-pulse shrink-0"></div>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <div className="flex flex-col flex-1 min-w-0 w-full">
                {/* Yazı Hayaletleri */}
                <div className="h-4 bg-slate-500/50 rounded-md w-3/4 mb-3 animate-pulse"></div>
                <div className="h-6 bg-slate-500/50 rounded-md w-1/3 animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto pt-4 sm:pt-0">
                {/* Buton Hayaletleri */}
                <div className="w-12 h-12 bg-slate-500/50 rounded-xl animate-pulse"></div>
                <div className="h-12 w-full sm:w-36 bg-slate-500/50 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
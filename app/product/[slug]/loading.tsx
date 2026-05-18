import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050814] pt-2 pb-24 md:py-8 px-3 sm:px-6 lg:px-8 relative overflow-hidden font-medium">
      
      {/* 🚀 ARKA PLAN EFEKTİ: Blueprint grid çizgileri (Çok hafif, belli belirsiz) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[size:32px_32px] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-xl shadow-lg relative z-10">
        
        {/* SOL TARAF: ÜRÜN ÇERÇEVESİ (Düz kutu yerine hologram efekti) */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square bg-[#050814]/50 border-2 border-dashed border-blue-500/20 rounded-xl relative flex items-center justify-center animate-pulse">
            
            {/* Köşe süsleri (Blueprint look) */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500/50"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500/50"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500/50"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500/50"></div>
            
            {/* Ortadaki Yükleniyor Vektörü (Spin animasyonu) */}
            <div className="w-24 h-24 text-blue-500 opacity-70">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-[spin_3s_linear_infinite]">
                    <path d="M50 10V30M50 70V90M10 50H30M70 50H90" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M21.7 21.7L35.8 35.8M64.2 64.2L78.3 78.3M21.7 78.3L35.8 64.2M64.2 35.8L78.3 21.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 5"/>
                    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1"/>
                </svg>
            </div>
            
            {/* Sahte Blueprint Yazısı */}
            <span className="absolute bottom-3 left-3 text-[7px] text-slate-700 uppercase tracking-widest font-black">MODEL: [LOADING]//_SYSTEM32</span>
          </div>
          
          {/* Thumbnails (Küçük Blueprint çizgileri) */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-16 bg-[#050814]/50 border border-white/5 rounded-md relative animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
            ))}
          </div>
        </div>

        {/* SAĞ TARAF: BİLGİ VE TEXT ALANI (Düz kutu yerine teknik çizgiler) */}
        <div className="flex flex-col py-2 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-16 h-3 bg-white/5 rounded animate-pulse"></div>
            <div className="w-20 h-3 bg-emerald-500/10 rounded animate-pulse"></div>
          </div>
          
          {/* Başlık Çizgisi (Başında Neon parlama var) */}
          <div className="w-full h-6 border-b border-white/10 relative">
            <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500/30 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>

          {/* Sahte Puan Çizgisi */}
          <div className="flex items-center gap-1.5 w-1/3">
            <div className="w-20 h-4 bg-white/5 rounded animate-pulse"></div>
            <div className="w-10 h-3 bg-slate-800 rounded animate-pulse"></div>
          </div>

          {/* Büyük Veri Bloğu (Fiyat alanı - Sahte Blueprint kutusu) */}
          <div className="w-full h-24 border border-blue-500/10 bg-[#050814]/30 rounded-lg p-4 relative overflow-hidden flex flex-col justify-center gap-2 animate-pulse">
             <div className="w-1/2 h-5 bg-white/5 rounded animate-pulse"></div>
             <div className="w-1/3 h-3 bg-emerald-400/10 rounded animate-pulse"></div>
          </div>
          
          {/* Açıklama Çizgileri (Giderek kısalan) */}
          <div className="space-y-2 mt-4 flex-1">
            <div className="w-full h-2 bg-white/5 rounded animate-pulse"></div>
            <div className="w-full h-2 bg-white/5 rounded animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-full h-2 bg-white/5 rounded animate-pulse" style={{ animationDelay: '400ms' }}></div>
            <div className="w-2/3 h-2 bg-white/5 rounded animate-pulse" style={{ animationDelay: '600ms' }}></div>
          </div>

          {/* Buton Alanı (Mavi Hologram look) */}
          <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6 relative">
            <div className="w-24 h-10 border border-white/10 rounded animate-pulse bg-[#050814]/50"></div>
            <div className="flex-1 h-10 border-2 border-dashed border-blue-500/30 rounded relative flex items-center justify-center animate-pulse bg-[#050814]/50">
                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest animate-pulse">_AWAITING_DATA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
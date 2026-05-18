import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050814] pt-2 pb-24 md:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 p-4 sm:p-8 rounded-xl shadow-lg">
        
        {/* SOL TARAF: RESİM İSKELETİ */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square bg-[#050814]/80 border border-white/5 rounded-xl animate-pulse flex items-center justify-center">
            <div className="text-4xl animate-bounce">📦</div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-[#050814]/80 border border-white/5 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* SAĞ TARAF: YAZI VE BUTON İSKELETLERİ */}
        <div className="flex flex-col py-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-16 h-5 bg-white/5 rounded-full animate-pulse"></div>
            <div className="w-20 h-5 bg-emerald-500/10 rounded-full animate-pulse"></div>
          </div>
          
          <div className="w-3/4 h-8 bg-white/10 rounded-md animate-pulse mb-4"></div>
          <div className="w-1/2 h-6 bg-white/5 rounded-md animate-pulse mb-8"></div>

          <div className="w-full h-16 bg-[#050814]/50 border border-blue-500/10 rounded-md animate-pulse mb-4"></div>
          
          <div className="w-full h-24 bg-[#050814]/50 border border-white/5 rounded-md animate-pulse mb-6"></div>

          <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
            <div className="w-24 h-12 bg-white/5 rounded-md animate-pulse"></div>
            <div className="flex-1 h-12 bg-blue-600/20 rounded-md animate-pulse"></div>
            <div className="w-12 h-12 bg-white/5 rounded-md animate-pulse"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
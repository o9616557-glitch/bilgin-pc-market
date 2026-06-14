"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OkluSlider({ children }: { children: React.ReactNode }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const kaydir = (yon: "sol" | "sag") => {
    if (sliderRef.current) {
      // Bir tıklamada ekranın %80'i kadar kaydırır
      const mesafe = sliderRef.current.clientWidth * 0.8;
      sliderRef.current.scrollBy({ left: yon === "sol" ? -mesafe : mesafe, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* 🚀 ÜST KISIM: KAYDIRMA ALANI (RESİMLERİN ÜSTÜNDE HİÇBİR ŞEY YOK) 🚀 */}
      <div
        ref={sliderRef}
        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-[7.5vw] sm:px-[10vw] lg:px-8 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* 🎯 ALT KISIM: KİBAR VE MODERN KONTROL PANELİ 🎯 */}
      <div className="flex items-center justify-center gap-6 mt-6">
        
        {/* ⬅️ SOL OK */}
        <button
          onClick={() => kaydir("sol")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-[#00d2ff] hover:text-black hover:border-[#00d2ff] transition-all duration-300 shadow-lg hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* ➖ ORTADAKİ ZARİF ÇİZGİ (Neon Efektli) */}
        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-[#00d2ff]/50 to-transparent rounded-full opacity-50"></div>

        {/* ➡️ SAĞ OK */}
        <button
          onClick={() => kaydir("sag")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-[#00d2ff] hover:text-black hover:border-[#00d2ff] transition-all duration-300 shadow-lg hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
      </div>

    </div>
  );
}
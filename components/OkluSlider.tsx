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
    <div className="relative w-full group">
      {/* ⬅️ SOL OK */}
      <button
        onClick={() => kaydir("sol")}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-[#050505]/90 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#00d2ff] hover:border-[#00d2ff] hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.8)] hidden lg:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* ➡️ SAĞ OK */}
      <button
        onClick={() => kaydir("sag")}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-[#050505]/90 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#00d2ff] hover:border-[#00d2ff] hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.8)] hidden lg:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 🚀 KAYDIRMA ALANI - O ÇİRKİN MAVİ ÇİZGİ TAMAMEN GİZLENDİ! 🚀 */}
      <div
        ref={sliderRef}
        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-8 px-[7.5vw] sm:px-[10vw] lg:px-8 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-30"
      >
        {children}
      </div>
    </div>
  );
}
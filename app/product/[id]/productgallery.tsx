"use client";
import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: any[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. KUTU İÇİNDE SADECE RESİM (Oklar kaldırıldı) */}
      <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden bg-[#0b0f1a] rounded-[2rem] border border-slate-800/60 p-4 shadow-lg">
        <img 
          src={images[currentIndex].src} 
          alt={productName} 
          className="w-full h-full object-contain drop-shadow-xl" 
        />
      </div>

      {/* 2. KONTROLLER RESMİN ALTINDA (Oklar ve Noktalar Yan Yana) */}
      <div className="flex items-center gap-6 mt-6">
        {/* Sol Ok */}
        <button onClick={prevImage} className="p-3 md:p-4 text-white bg-[#0b0f1a] border border-slate-700 rounded-full hover:bg-blue-600 hover:border-blue-500 transition-all shadow-md">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        {/* Yuvarlak Noktalar */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-blue-500 w-8 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-700 w-2.5 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        {/* Sağ Ok */}
        <button onClick={nextImage} className="p-3 md:p-4 text-white bg-[#0b0f1a] border border-slate-700 rounded-full hover:bg-blue-600 hover:border-blue-500 transition-all shadow-md">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
      
    </div>
  );
}
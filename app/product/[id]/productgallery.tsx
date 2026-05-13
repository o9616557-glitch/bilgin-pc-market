"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: any[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!images || images.length === 0) {
    return <div className="p-10 text-center text-slate-500 bg-[#0b0f1a] rounded-2xl">Görsel bulunamadı</div>;
  }

  return (
    // EĞİTİM NOTU: flex-col kullanarak noktaları zorunlu olarak resmin altına hizalıyoruz.
    <div className="flex flex-col items-center w-full">
      
      {/* ANA RESİM VE OKLAR */}
      <div className="relative w-full aspect-[4/3] md:aspect-video bg-gradient-to-b from-[#111827] to-[#0b0f1a] rounded-3xl flex items-center justify-center overflow-hidden group border border-slate-800/30">
        
        {/* Ürün Görseli */}
        <img 
          src={images[currentIndex].src} 
          alt={productName} 
          className="object-contain max-h-[80%] max-w-[80%] drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" 
        />

        {/* Sol Ok - Sadece üzerine gelince veya mobilde görünür */}
        <button 
          onClick={prevImage} 
          className="absolute left-2 md:left-6 p-3 md:p-4 bg-[#111827]/80 text-white rounded-full hover:bg-blue-600 transition-all border border-slate-700/50 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        {/* Sağ Ok */}
        <button 
          onClick={nextImage} 
          className="absolute right-2 md:right-6 p-3 md:p-4 bg-[#111827]/80 text-white rounded-full hover:bg-blue-600 transition-all border border-slate-700/50 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      {/* YUVARLAK NOKTALAR (RESMİN ALTINDA) */}
      <div className="flex gap-3 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-blue-500 w-8 shadow-[0_0_10px_rgba(59,130,246,0.5)]" // Aktif olan nokta mavi ve uzun
                : "bg-slate-700 w-2.5 hover:bg-slate-500" // Diğerleri yuvarlak
            }`}
          />
        ))}
      </div>
    </div>
  );
}
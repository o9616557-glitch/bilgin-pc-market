"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: any[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!images || images.length === 0) return null;

  return (
    // Dışarıdaki tüm boşlukları sildik, tam genişlik (w-full) verdik
    <div className="w-full flex flex-col items-center">
      
      {/* SIFIR KUTU, SIFIR ÇERÇEVE: Sadece resim ve oklar */}
      <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden">
        
        <img 
          src={images[currentIndex].src} 
          alt={productName} 
          // Resmin kendisi tüm alanı doldursun
          className="w-full h-full object-contain drop-shadow-xl" 
        />

        {/* Okları sıfıra sıfır kenarlara yapıştırdık */}
        <button 
          onClick={prevImage} 
          className="absolute left-0 p-3 md:p-4 text-white bg-black/40 hover:bg-blue-600 backdrop-blur-sm transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <button 
          onClick={nextImage} 
          className="absolute right-0 p-3 md:p-4 text-white bg-black/40 hover:bg-blue-600 backdrop-blur-sm transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      {/* Yuvarlak Noktalar resmin altında, ferah bir şekilde duruyor */}
      <div className="flex gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-500 w-8" : "bg-slate-600 w-2 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
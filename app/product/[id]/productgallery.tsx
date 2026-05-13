"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: any[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center">
      {/* ANA GÖRSEL: Kutu ve çerçeve tamamen kaldırıldı */}
      <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center bg-transparent overflow-hidden">
        <img 
          src={images[currentIndex].src} 
          alt={productName} 
          className="w-full h-full object-contain cursor-zoom-in"
          onClick={() => setIsFullscreen(true)} // Resme tıklayınca tam ekran
        />

        {/* Oklar: Tam kenarlara yapışık */}
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-0 p-4 text-white bg-black/20 hover:bg-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} className="absolute right-0 p-4 text-white bg-black/20 hover:bg-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* GALERİ YAZISI: Tıklanabilir */}
      <button 
        onClick={() => setIsFullscreen(true)}
        className="mt-2 text-blue-500 text-xs font-black uppercase tracking-widest hover:underline"
      >
        🖼️ Galeriye Göz Atın (Tam Ekran)
      </button>

      {/* Noktalar: Daha yakın ve kompakt */}
      <div className="flex gap-2 mt-4">
        {images.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`h-1.5 rounded-full transition-all ${index === currentIndex ? "bg-blue-500 w-6" : "bg-slate-700 w-1.5"}`} />
        ))}
      </div>

      {/* TAM EKRAN MODU (MODAL) */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-4">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-5 right-5 text-white text-4xl font-bold">×</button>
          <img src={images[currentIndex].src} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
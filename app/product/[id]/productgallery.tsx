"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: any[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full flex flex-col items-center">
      {/* ANA RESİM ALANI */}
      <div className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center bg-transparent group">
        <img 
          src={images[currentIndex].src} 
          alt={productName} 
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        />

        {/* BEĞENDİĞİN OKLAR: Resmin tam üstünde sağda ve solda */}
        <button onClick={prev} className="absolute left-2 p-3 bg-black/40 text-white rounded-full hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100 md:opacity-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={next} className="absolute right-2 p-3 bg-black/40 text-white rounded-full hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100 md:opacity-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* GALERİ YAZISI */}
      <button onClick={() => setIsFullscreen(true)} className="mt-4 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
        🖼️ Galeriye Göz Atın (Tam Ekran)
      </button>

      {/* NOKTALAR */}
      <div className="flex gap-2 mt-4">
        {images.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`h-1 rounded-full transition-all ${index === currentIndex ? "bg-blue-500 w-8" : "bg-slate-800 w-2"}`} />
        ))}
      </div>

      {/* TAM EKRAN MODU: Oklar burada da çalışır */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-10 right-10 text-white text-5xl font-light hover:text-red-500">×</button>
          
          <button onClick={prev} className="absolute left-5 p-6 text-white hover:text-blue-500">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <img src={images[currentIndex].src} className="max-w-[90%] max-h-[90%] object-contain" />

          <button onClick={next} className="absolute right-5 p-6 text-white hover:text-blue-500">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
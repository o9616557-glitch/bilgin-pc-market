"use client";

import React, { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function ProductGallery({ images, productName }: { images: any[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const next = () => { if (images.length > 0) setActiveIndex((prev) => (prev + 1) % images.length); };
  const prev = () => { if (images.length > 0) setActiveIndex((prev) => (prev - 1 + images.length) % images.length); };

  return (
    <div className="flex flex-col gap-4 relative group">
      <div className="w-full bg-transparent p-0 sm:p-6 rounded-md overflow-hidden aspect-square relative flex items-center justify-center cursor-pointer">
        {images.map((img: any, idx: number) => (
          <PhotoView key={idx} src={img.src}>
            <img src={img.src} alt={productName} className={`max-h-full max-w-full object-contain transform group-hover:scale-[1.02] transition-transform duration-500 ${activeIndex === idx ? "block" : "hidden"}`} />
          </PhotoView>
        ))}
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-between gap-3 bg-[#050814]/40 border border-white/5 p-2 rounded-md">
          <button type="button" onClick={prev} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 block"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <div className="flex-1 flex justify-center items-center gap-1.5 flex-wrap">
            {images.map((_: any, idx: number) => (
              <button key={idx} type="button" onClick={() => setActiveIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${activeIndex === idx ? 'bg-blue-500 w-4' : 'bg-white/20'}`} />
            ))}
          </div>
          <button type="button" onClick={next} className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 block"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
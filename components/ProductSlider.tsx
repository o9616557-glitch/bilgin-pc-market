"use client";

import React from "react";
import Link from "next/link";

// Ana sayfadan gelecek olan 'urunler' listesinin yapısı
interface Urun {
  id: number;
  ad: string;
  fiyat: string;
  resim: string;
  ozellik: string;
}

export default function ProductSlider({ urunler }: { urunler: Urun[] }) {
  
  if (!urunler || urunler.length === 0) {
    return <div className="text-center text-slate-500 py-10">Ürünler yükleniyor veya bulunamadı...</div>;
  }

  return (
    <section className="w-full max-w-[1400px] mx-auto px-5 py-16">
      
      {/* 1. DÜZELTME: BAŞLIK VE BUTON ARASINDAKİ SIKIŞIKLIK ÇÖZÜLDÜ */}
      {/* EĞİTİM NOTU: 'flex-col sm:flex-row' ile mobilde alt alta, PC'de yan yana durmalarını sağladık. 'gap-4' ile aralarına ferah bir boşluk koyduk. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        
        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white">
          Yeni Gelen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Sistemler</span>
        </h2>
        
        {/* 2. DÜZELTME: 404 HATASI ÇÖZÜMÜ */}
        {/* EĞİTİM NOTU: href="#" yaparak sayfa bulunamadı hatasını engelledik. İleride bu kategori sayfasını yapınca burayı güncelleyeceğiz. */}
        <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 w-max">
          Tümünü Gör <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </Link>

      </div>

      {/* KAYDIRMALI BANT (SLIDER) ALANI - Buraya dokunmadık, mükemmel çalışıyor */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {urunler.map((urun) => (
          <div key={urun.id} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] flex-shrink-0 snap-start bg-[#0b0f1a] border border-white/5 rounded-2xl p-4 group hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg">
            
            <div className="w-full h-[200px] bg-[#050810] rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
              <img src={urun.resim} alt={urun.ad} className="object-contain h-full p-4 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-bold text-white uppercase tracking-wider hover:bg-white/20">Hızlı Bakış</button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight min-h-[40px] group-hover:text-blue-400 transition-colors">
                {urun.ad}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                {urun.ozellik}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-black text-white">{urun.fiyat}</span>
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
              </div>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
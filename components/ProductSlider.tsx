"use client";

import React from "react";
import Link from "next/link";

interface Urun {
  id: number;
  ad: string;
  fiyat: string;
  resim: string;
  ozellik: string;
  slug?: string; // 🚀 Linkleme için slug alanını opsiyonel olarak ekledik şefim
}

export default function ProductSlider({ urunler }: { urunler: Urun[] }) {
  if (!urunler || urunler.length === 0) {
    return (
      <div className="text-center text-slate-500 py-10">
        Ürünler yükleniyor veya bulunamadı...
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1400px] mx-auto px-5 py-16">
      
      {/* BAŞLIK ALANI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white">
          Yeni Gelen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 pr-2">Sistemler</span>
        </h2>
        <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 w-max">
          Tümünü Gör 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ÜRÜN KARTLARI LİSTESİ */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {urunler.map((urun) => {
          
          // 🚀 EĞER SLUG YOKSA ÜRÜN İSMİNDEN OTOMATİK TERTEMİZ LİNK ÜRETEN SİHİR:
          const urunLink = urun.slug || urun.ad
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "") // Özel karakterleri uçur
            .replace(/\s+/g, "-"); // Boşlukları tire yap

          return (
            /* ⚡ Eski <div> yerine <Link> koyduk; artık kartın neresine tıklarsan tıkla sayfaya uçacak */
            <Link
              href={`/product/${urunLink}`}
              key={urun.id}
              className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] flex flex-col flex-shrink-0 snap-start bg-[#0b0f1a] border border-white/5 rounded-2xl p-4 group hover:border-white/20 transition-all hover:-translate-y-1 duration-300"
            >
              {/* ÜRÜN RESMİ */}
              <div className="w-full h-[200px] bg-[#050810] rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
                <img
                  src={urun.resim}
                  alt={urun.ad}
                  className="object-contain h-full p-4 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-bold text-white uppercase tracking-wider">
                    Detayları İncele
                  </span>
                </div>
              </div>

              {/* ÜRÜN BİLGİLERİ */}
              <div className="flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight min-h-[40px] group-hover:text-blue-400 transition-colors">
                    {urun.ad}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mt-1">
                    {urun.ozellik}
                  </p>
                </div>

                {/* FİYAT VE EKLEME BUTONU */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-white">{urun.fiyat}</span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
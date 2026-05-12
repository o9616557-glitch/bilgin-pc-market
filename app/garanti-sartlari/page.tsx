"use client";

import React from 'react';
import Link from 'next/link';

export default function GarantiSartlariPage() {
  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* ÜST MENÜ */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-[#0b1120]/90 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-lg md:text-xl font-black tracking-tighter uppercase italic group">
          BİLGİN <span className="text-blue-600 underline decoration-2 underline-offset-4 group-hover:text-blue-400 transition-colors">PC MARKET</span>
        </Link>
        <Link href="/" className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-blue-600 transition-all">
          ← ANA SAYFAYA DÖN
        </Link>
      </nav>

      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-24 flex-grow">
        
        {/* SAYFA BAŞLIĞI */}
        <div className="mb-16 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">RESMİ GÜVENCE PANELİ</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            GARANTİ <span className="text-blue-600">STANDARTLARIMIZ.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Bilgin PC Market üzerinden aldığınız her donanım, resmi distribütör ve marka güvencesiyle koruma altındadır. Performansınız bizim için değerlidir.
          </p>
        </div>

        {/* ANA BÖLÜMLER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Garanti Kapsamı */}
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 font-black text-xl italic">01</div>
              <h3 className="text-2xl font-black uppercase tracking-tight italic">GARANTİ KAPSAMI</h3>
            </div>
            <div className="space-y-4 pt-2">
              {[
                "Ürünler üretici veya resmi distribütör garantisindedir.",
                "Arızalı parçalar yetkili servis kontrolüne yönlendirilir.",
                "Garanti süresi ürünün resmi faturasıyla tescillenir."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-300 text-sm font-medium border-l-2 border-blue-600/50 pl-4 py-1 tracking-wide">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Garanti Süreci */}
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 font-black text-xl italic">02</div>
              <h3 className="text-2xl font-black uppercase tracking-tight italic">İŞLEYİŞ SÜRECİ</h3>
            </div>
            <div className="space-y-4 pt-2">
              {[
                "Arıza tespiti durumunda teknik inceleme başlatılır.",
                "Kullanıcı hatası olmayan her durumda onarım veya değişim esastır.",
                "Süreç sonucu şeffaf bir şekilde alıcıya raporlanır."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-300 text-sm font-medium border-l-2 border-blue-600/50 pl-4 py-1 tracking-wide">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DİKKAT EDİLMESİ GEREKENLER (GECE MAVİSİ BÖLÜM) */}
        <div className="p-8 md:p-12 bg-[#0d1629] border border-blue-900/40 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 group-hover:opacity-10 transition-opacity text-blue-500">⚙️</div>
          
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-blue-400 mb-8 italic">
            GARANTİ KAPSAMI DIŞINDA KALAN DURUMLAR
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              "Fiziksel hasarlar ve darbeler",
              "Sıvı teması ve nemlenme",
              "Yanlış montaj veya kullanıcı kaynaklı zorlamalar",
              "Ürün üzerinde yetkisiz teknik müdahale",
              "Ambalajı zarar görmüş veya eksik parçalı iadeler"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-300 font-medium text-sm pb-3 border-b border-white/5">
                <span className="text-blue-600 font-black text-lg">■</span> {item}
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 text-center mt-auto">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 BİLGİN PC MARKET – GÜVENLİ TEKNOLOJİ ÜSSÜ.
        </p>
      </footer>

    </div>
  );
}
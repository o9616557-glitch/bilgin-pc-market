"use client";

import React from 'react';
import Link from 'next/link';

export default function HakkimizdaPage() {
  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* ÜST MENÜ */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-[#0b1120]/90 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-lg md:text-xl font-black tracking-tighter uppercase italic group">
          BİLGİN <span className="text-blue-600 underline decoration-2 underline-offset-4 group-hover:text-blue-400 transition-colors">PC MARKET</span>
        </Link>
        <Link href="/" className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-blue-600 transition-all active:scale-95">
          ← ANA SAYFAYA DÖN
        </Link>
      </nav>

      <main className="max-w-[1100px] mx-auto px-6 py-12 md:py-20 flex-grow">
        
        {/* ÜST BAŞLIK ALANI */}
        <div className="space-y-6 mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">YENİ NESİL TEKNOLOJİ DURAĞI</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
            TEKNOLOJİYE <br /> <span className="text-blue-600">YENİ BİR BAKIŞ.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Bilgin PC Market, performans tutkunları için kurulmuş, modern donanım mimarilerini saf güçle birleştiren bir teknoloji platformudur.
          </p>
        </div>

        {/* ÖZEL BİLGİ KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Teknoloji Anlayışımız */}
          <div className="p-8 md:p-12 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6">
            <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl">⚙️</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">TEKNOLOJİ ANLAYIŞIMIZ</h3>
            <p className="text-slate-300 leading-relaxed font-medium text-sm md:text-base">
              Dünya hızla değişiyor. Biz sadece kutulu ürün satmıyoruz; en doğru donanım eşleşmelerini analiz ediyor, performans mimarisini en baştan kurguluyoruz.
            </p>
          </div>

          {/* Sunduğumuz Çözümler */}
          <div className="p-8 md:p-12 bg-blue-600 border border-blue-500 rounded-[3rem] space-y-8 shadow-2xl shadow-blue-600/20">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl text-white">🚀</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">SUNDUĞUMUZ ÇÖZÜMLER</h3>
            <div className="space-y-4">
              {[
                "Yeni nesil ekran kartları",
                "Güncel işlemci platformları",
                "Yüksek hızlı SSD depolama çözümleri",
                "Performans odaklı bilgisayar sistemleri"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-blue-50 font-medium text-sm border-b border-white/10 pb-3">
                  <span className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRENSİPLERİMİZ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "ŞEFFAFLIK", d: "Net ve şeffaf satış politikası ile ne aldığınızı her zaman bilirsiniz." },
            { n: "02", t: "GARANTİ", d: "Tüm ürünlerimiz distribütör garantili ve %100 orijinaldir." },
            { n: "03", t: "VİZYON", d: "Geleceğin donanım standartlarını bugünden dükkanınıza getiriyoruz." }
          ].map((p, i) => (
            <div key={i} className="p-8 border border-white/5 rounded-[2rem] space-y-4 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="text-blue-500 font-black text-xs tracking-widest uppercase">{p.n}. {p.t}</div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 text-center mt-auto">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 BİLGİN PC MARKET – PERFORMANS BURADA BAŞLAR.
        </p>
      </footer>

    </div>
  );
}
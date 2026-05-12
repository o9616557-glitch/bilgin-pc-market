"use client";

import React from 'react';
import Link from 'next/link';

export default function IletisimPage() {
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

      <main className="max-w-[1100px] mx-auto px-6 py-12 md:py-24 flex-grow w-full">
        
        {/* BAŞLIK */}
        <div className="mb-16 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest">KESİNTİSİZ DESTEK HATTI</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            BİZE <br /> <span className="text-blue-600 italic">ULAŞIN.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Sipariş, ürün bilgisi veya teknik destek... Bilgin PC Market ekibi olarak her sorunuz için buradayız. Bizimle dilediğiniz kanaldan iletişime geçebilirsiniz.
          </p>
        </div>

        {/* İLETİŞİM MODÜLLERİ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* WhatsApp Modülü */}
          <a href="https://wa.me/905327345023" target="_blank" className="p-8 md:p-10 bg-green-500/5 border border-green-500/20 rounded-[3rem] group hover:bg-green-500 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-green-500/20 group-hover:bg-white group-hover:text-green-500 transition-colors">💬</div>
              <span className="text-[10px] font-black text-green-500 group-hover:text-white/80 tracking-[0.2em]">CANLI</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-white">WHATSAPP DESTEK</h3>
            <p className="text-slate-300 text-sm md:text-base font-medium group-hover:text-green-50">
              0532 734 50 23
            </p>
          </a>

          {/* Müşteri Hizmetleri Modülü */}
          <a href="tel:08503055968" className="p-8 md:p-10 bg-blue-600/5 border border-blue-500/20 rounded-[3rem] group hover:bg-blue-600 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-600/20 group-hover:bg-white group-hover:text-blue-600 transition-colors">📞</div>
              <span className="text-[10px] font-black text-blue-500 group-hover:text-white/80 tracking-[0.2em]">KURUMSAL</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-white">MÜŞTERİ HİZMETLERİ</h3>
            <p className="text-slate-300 text-sm md:text-base font-medium group-hover:text-blue-50">
              0850 305 59 68
            </p>
          </a>

          {/* E-Posta Modülü */}
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl text-blue-400">✉️</div>
            <h3 className="text-xl font-black uppercase tracking-tighter">E-POSTA ADRESLERİ</h3>
            <div className="space-y-3">
              <p className="text-slate-300 text-sm font-medium break-all">
                info@bilginpcmarket.com
              </p>
              <p className="text-slate-400 text-sm font-medium break-all">
                destek@bilginpcmarket.com
              </p>
            </div>
          </div>
        </div>

        {/* ALT BİLGİ KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="text-4xl md:text-5xl">🕒</div>
            <div>
              <h4 className="text-lg md:text-xl font-black uppercase italic text-white mb-2">ÇALIŞMA SAATLERİ</h4>
              <p className="text-slate-300 text-sm font-medium">
                Hafta içi: 09:00 - 18:00
              </p>
              <p className="text-blue-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-2">TÜRKİYE GENELİ HİZMET</p>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 group">
            <div className="text-4xl md:text-5xl group-hover:rotate-12 transition-transform">🌐</div>
            <div>
              <h4 className="text-lg md:text-xl font-black uppercase italic text-white mb-2">WEB SİTEMİZ</h4>
              <p className="text-slate-300 text-sm font-medium">
                www.bilginpcmarket.com
              </p>
            </div>
          </div>

        </div>

      </main>

      <footer className="border-t border-white/5 py-12 px-6 text-center mt-auto">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 BİLGİN PC MARKET – BİZE HER ZAMAN ULAŞABİLİRSİNİZ.
        </p>
      </footer>

    </div>
  );
}
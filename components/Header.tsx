"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  // Hamburger menünün açık/kapalı durumunu tutan hafıza
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#050810] border-b border-slate-800/50 sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between relative">
        
        {/* SOL: HAMBURGER VE ARAMA */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-slate-300 hover:text-white"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <button className="text-slate-300 hover:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>

        {/* ORTA: LOGO */}
        <Link href="/" className="text-xl font-black tracking-widest text-white uppercase absolute left-1/2 -translate-x-1/2">
          BİLGİN <span className="text-blue-500">PC</span>
        </Link>

        {/* SAĞ: HESABIM VE SEPET */}
        <div className="flex items-center gap-5">
          <button className="text-slate-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </button>

          <button className="text-slate-300 hover:text-green-400 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="absolute -top-1 -right-1 bg-green-500 text-[#050810] text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </button>
        </div>

      </div>

      {/* HAMBURGER MENÜ AÇILIR LİSTESİ */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-64 bg-[#111827] border-r border-b border-slate-800/50 shadow-2xl flex flex-col p-6 gap-4">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Kategoriler</span>
          <Link href="/kategori/ekran-kartlari" className="text-white hover:text-blue-400 font-bold transition-colors">Ekran Kartları</Link>
          <Link href="/kategori/islemciler" className="text-white hover:text-blue-400 font-bold transition-colors">İşlemciler</Link>
          <Link href="/kategori/anakartlar" className="text-white hover:text-blue-400 font-bold transition-colors">Anakartlar</Link>
        </div>
      )}

    </header>
  );
}
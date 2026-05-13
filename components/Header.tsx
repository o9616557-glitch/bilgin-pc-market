/**
 * BİLGİN PC MARKET - MODÜLER HEADER BİLEŞENİ
 * Bu bileşen PC ve Mobil görünümleri otomatik ayarlar ve ödeme sayfasında gizlenir.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Ödeme sayfasında menüyü göstermeme mantığı
  const isCheckoutPage = pathname.includes("/odeme") || pathname.includes("/checkout");
  if (isCheckoutPage) return null;

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100] h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-5 w-full flex items-center justify-between relative">
        
        {/* SOL: MOBİLDE HAMBURGER / PC'DE YAZILI MENÜ */}
        <div className="flex items-center gap-6">
          {/* Mobil Hamburger Butonu */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white md:hidden p-2"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Arama İkonu (Her iki görünümde de var) */}
          <button className="text-slate-400 hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* PC YAZILI MENÜ (md:flex ile sadece bilgisayarda gözükür) */}
          <nav className="hidden md:flex items-center gap-8 ml-4">
            <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors">Ana Sayfa</Link>
            <Link href="/sistemler" className="text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors">Sistemler</Link>
            <Link href="/parcalar" className="text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors">Parçalar</Link>
          </nav>
        </div>

        {/* ORTA: LOGO (Amblem) */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-black italic tracking-tighter">
          BİLGİN<span className="text-blue-500 uppercase not-italic">PC</span>
        </Link>

        {/* SAĞ: HESABIM VE SEPETİM */}
        <div className="flex items-center gap-6">
          <Link href="/hesabim" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <Link href="/sepet" className="text-slate-400 hover:text-green-500 relative transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1.5 -right-2 bg-green-500 text-[#050810] text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </Link>
        </div>
      </div>

      {/* MOBİL AÇILIR MENÜ ALANI */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0b0f1a] border-b border-white/5 p-6 flex flex-col gap-5 md:hidden animate-in fade-in slide-in-from-top-4">
          <Link href="/" className="text-lg font-black italic uppercase text-white">Ana Sayfa</Link>
          <Link href="/sistemler" className="text-lg font-black italic uppercase text-white">Sistemler</Link>
          <Link href="/parcalar" className="text-lg font-black italic uppercase text-white">Parçalar</Link>
        </div>
      )}
    </header>
  );
}
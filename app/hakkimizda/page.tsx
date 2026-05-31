"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Alanı */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 uppercase tracking-wider">
                Bilgin PC
              </span>
            </Link>
          </div>

          {/* Masaüstü Menü Linkleri */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/kategori/ekran-karti" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Ekran Kartı
              </Link>
              <Link href="/kategori/islemci" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                İşlemci
              </Link>
              <Link href="/kategori/anakart" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Anakart
              </Link>
              <Link href="/hakkimizda" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Hakkımızda
              </Link>
            </div>
          </div>

          {/* Arama, Sepet ve Kullanıcı */}
          <div className="hidden md:flex items-center gap-6">
            {/* Arama Çubuğu */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Ürün, marka veya model ara..." 
                className="bg-slate-900 border border-slate-700 text-gray-300 text-sm rounded-full focus:ring-cyan-500 focus:border-cyan-500 block w-64 pl-4 pr-10 py-2 transition-all group-hover:border-slate-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            {/* Sepet İkonu */}
            <Link href="/sepet" className="relative p-2 text-gray-300 hover:text-cyan-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {/* Sepet Bildirim Balonu */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                2
              </span>
            </Link>

            {/* Kullanıcı Girişi */}
            <Link href="/giris" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-cyan-500/20">
              Giriş Yap
            </Link>
          </div>

          {/* Mobil Menü Butonu */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü Açılır Alanı */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/kategori/ekran-karti" className="text-gray-300 hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium">Ekran Kartı</Link>
            <Link href="/kategori/islemci" className="text-gray-300 hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium">İşlemci</Link>
            <Link href="/kategori/anakart" className="text-gray-300 hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium">Anakart</Link>
            <Link href="/hakkimizda" className="text-gray-300 hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium">Hakkımızda</Link>
            <Link href="/sepet" className="text-cyan-400 font-bold block px-3 py-2 rounded-md text-base mt-4 border border-slate-800">Sepete Git (2)</Link>
          </div>
        </div>
      )}
    </header>
  );
}
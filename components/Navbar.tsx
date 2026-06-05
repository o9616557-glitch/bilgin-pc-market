"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Siyah cam efekti ve alt sınır çizgisi
    <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 fixed w-full z-50 top-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Sol Taraf: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-2xl tracking-wider">
              BİLGİN <span className="text-blue-500">PC MARKET</span>
            </Link>
          </div>

          {/* Orta/Sağ Taraf: Masaüstü Menü (Telefonda gizlenir) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/kategori/anakart" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Anakartlar
              </Link>
              <Link href="/kategori/islemci" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                İşlemciler
              </Link>
              <Link href="/kategori/ekran-karti" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Ekran Kartları
              </Link>
            </div>
          </div>

          {/* Sağ Taraf: Mobil Hamburger Butonu (Sadece telefonda görünür) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors"
            >
              <span className="sr-only">Menüyü Aç</span>
              {!isOpen ? (
                // Kapalıyken 3 çizgili hamburger ikonu
                <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                // Açıkken X (Kapatma) ikonu
                <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü İçeriği (Hamburger'e basılınca aşağı açılır) */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-2 sm:px-3">
            <Link href="/kategori/anakart" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium border border-gray-800/50">
              Anakartlar
            </Link>
            <Link href="/kategori/islemci" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium border border-gray-800/50">
              İşlemciler
            </Link>
            <Link href="/kategori/ekran-karti" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium border border-gray-800/50">
              Ekran Kartları
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // fixed ve top-0 kaldırıldı, artık Header'ın hemen altında normal bir şerit gibi akacak
    <nav className="bg-black/60 backdrop-blur-md border-b border-gray-800 w-full z-40 transition-all duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center md:justify-start h-14"> {/* İnce ve şık durması için yüksekliği h-14'e çektik */}
          
          {/* Masaüstü Kategori Menüsü (Telefonda gizlenir) */}
          <div className="hidden md:block w-full">
            <div className="flex items-center space-x-8">
              <Link href="/kategori/anakart" className="text-gray-300 hover:text-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Anakartlar
              </Link>
              <Link href="/kategori/islemci" className="text-gray-300 hover:text-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                İşlemciler
              </Link>
              <Link href="/kategori/ekran-karti" className="text-gray-300 hover:text-white hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Ekran Kartları
              </Link>
            </div>
          </div>

          {/* Mobil Görünüm: Sağ Taraf Hamburger Butonu (Sadece telefonda görünür) */}
          <div className="flex md:hidden w-full justify-between items-center">
            <span className="text-gray-300 text-sm font-medium tracking-wider pl-2">KATEGORİLER</span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors"
            >
              <span className="sr-only">Kategorileri Aç</span>
              {!isOpen ? (
                // Kapalıyken 3 çizgili hamburger ikonu
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                // Açıkken X (Kapatma) ikonu
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü İçeriği (Hamburger'e basılınca aşağı açılır) */}
      {isOpen && (
        <div className="md:hidden bg-[#050814]/95 backdrop-blur-lg border-b border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-2 sm:px-3">
            <Link href="/kategori/anakart" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-blue-500 block px-3 py-3 rounded-md text-base font-medium border border-gray-800/50">
              Anakartlar
            </Link>
            <Link href="/kategori/islemci" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-blue-500 block px-3 py-3 rounded-md text-base font-medium border border-gray-800/50">
              İşlemciler
            </Link>
            <Link href="/kategori/ekran-karti" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-blue-500 block px-3 py-3 rounded-md text-base font-medium border border-gray-800/50">
              Ekran Kartları
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
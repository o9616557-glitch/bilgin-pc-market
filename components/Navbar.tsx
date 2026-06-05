"use client";
import { useState } from 'react';
import Link from 'next/link';

// ŞEF, TÜM KATEGORİLERİ BURAYA LİSTE OLARAK EKLİYORUZ. 
// Kod ameleliği yok, sistem burayı okuyup otomatik ekrana basacak.
const allCategories = [
  { name: "Anakartlar", slug: "anakart" },
  { name: "İşlemciler", slug: "islemci" },
  { name: "Ekran Kartları", slug: "ekran-karti" },
  { name: "RAM Bellekler", slug: "ram" },
  { name: "M.2 SSD'ler", slug: "ssd" },
  { name: "Sıvı Soğutmalar", slug: "sivi-sogutma" },
  { name: "Oyuncu Kasaları", slug: "oyuncu-kasasi" },
  { name: "Güç Kaynakları (PSU)", slug: "psu" },
  // ... Buraya 100 tane bile ekleyebilirsin ...
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ana şeritte görünecek ilk 4 popüler kategori
  const popularCategories = allCategories.slice(0, 4);

  return (
    <nav className="bg-black/60 backdrop-blur-md border-b border-gray-800 w-full z-40 transition-all duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-start h-14">
          
          {/* MASAÜSTÜ GÖRÜNÜM */}
          <div className="hidden md:flex items-center space-x-8 w-full">
            
            {/* TÜM KATEGORİLER AÇILIR MENÜSÜ (DROPDOWN) */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="flex items-center space-x-2 text-white bg-blue-600/20 hover:bg-blue-600/40 px-4 py-2 rounded-md font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                <span>Tüm Kategoriler</span>
              </button>

              {/* Açılan Devasa Liste (Scroll edilebilir) */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-[#09090b] border border-gray-800 rounded-md shadow-xl py-2 max-h-96 overflow-y-auto z-50">
                  {allCategories.map((cat) => (
                    <Link 
                      key={cat.slug} 
                      href={`/kategori/${cat.slug}`} 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* HIZLI ERİŞİM VİTRİN KATEGORİLERİ */}
            <div className="flex items-center space-x-6">
              {popularCategories.map((cat) => (
                <Link key={cat.slug} href={`/kategori/${cat.slug}`} className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* MOBİL GÖRÜNÜM - HAMBURGER */}
          <div className="flex md:hidden w-full justify-between items-center">
            <span className="text-gray-300 text-sm font-medium tracking-wider pl-2">MENÜ</span>
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800">
              {isOpen ? "Kapat X" : "Aç ≡"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL AÇILIR MENÜ (100 Kategori telefonda kaydırılabilir olacak) */}
      {isOpen && (
        <div className="md:hidden bg-[#050814]/95 backdrop-blur-lg border-b border-gray-800 max-h-[70vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
            {allCategories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/kategori/${cat.slug}`} 
                onClick={() => setIsOpen(false)} 
                className="text-gray-300 hover:text-blue-500 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-800/30"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
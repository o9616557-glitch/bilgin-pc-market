"use client";
import { useState } from 'react';
import Link from 'next/link';

// ŞEF, İŞTE MEGA MENÜ MANTIĞI: ANA BAŞLIKLAR VE ALTINDAKİ ÜRÜNLER
const menuCategories = [
  {
    title: "Bilgisayar Bileşenleri",
    items: [
      { name: "Anakartlar", slug: "anakart" },
      { name: "İşlemciler", slug: "islemci" },
      { name: "Ekran Kartları", slug: "ekran-karti" },
      { name: "RAM Bellekler", slug: "ram" },
      { name: "M.2 ve SATA SSD", slug: "ssd" },
      { name: "Oyuncu Kasaları", slug: "kasa" },
      { name: "Güç Kaynakları (PSU)", slug: "psu" },
      { name: "Soğutma Sistemleri", slug: "sogutma" },
    ]
  },
  {
    title: "Çevre Birimleri",
    items: [
      { name: "Oyuncu Monitörleri", slug: "monitor" },
      { name: "Klavyeler", slug: "klavye" },
      { name: "Oyuncu Mouseları", slug: "mouse" },
      { name: "Kulaklıklar", slug: "kulaklik" },
      { name: "Mousepadler", slug: "mousepad" },
      { name: "Oyuncu Koltukları", slug: "koltuk" },
    ]
  },
  {
    title: "Ağ & Aksesuarlar",
    items: [
      { name: "Modem ve Router", slug: "modem" },
      { name: "USB Bellekler", slug: "usb" },
      { name: "Görüntü Kabloları", slug: "kablo" },
      { name: "Termal Macunlar", slug: "termal-macun" },
      { name: "Web Kameralar", slug: "webcam" },
      { name: "Kasa Fanları", slug: "fan" },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-black/60 backdrop-blur-md border-b border-gray-800 w-full z-40 transition-all duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-start h-14">
          
          {/* MASAÜSTÜ GÖRÜNÜM */}
          <div className="hidden md:flex items-center space-x-8 w-full">
            
            {/* MEGA MENÜ TETİKLEYİCİSİ */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="flex items-center space-x-2 text-white bg-blue-600/20 hover:bg-blue-600/40 px-4 py-2 rounded-md font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                <span>Tüm Kategoriler</span>
              </button>

              {/* AÇILAN DEV MEGA MENÜ PANELİ */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[800px] bg-[#09090b]/95 backdrop-blur-xl border border-gray-800 rounded-lg shadow-2xl p-6 z-50">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Kategorileri döngüyle kolonlara ayırıyoruz */}
                    {menuCategories.map((category, index) => (
                      <div key={index}>
                        <h3 className="text-blue-500 font-bold text-sm tracking-wider uppercase mb-4 border-b border-gray-800 pb-2">
                          {category.title}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li key={item.slug}>
                              <Link 
                                href={`/kategori/${item.slug}`} 
                                className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 block text-sm"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* VİTRİN: EN ÇOK ARANAN 4 KATEGORİ */}
            <div className="flex items-center space-x-6">
              <Link href="/kategori/ekran-karti" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">Ekran Kartları</Link>
              <Link href="/kategori/islemci" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">İşlemciler</Link>
              <Link href="/kategori/anakart" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">Anakartlar</Link>
              <Link href="/kategori/monitor" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">Monitörler</Link>
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

      {/* MOBİL İÇİN AKORDİYON MENÜ */}
      {isOpen && (
        <div className="md:hidden bg-[#050814]/95 backdrop-blur-lg border-b border-gray-800 max-h-[70vh] overflow-y-auto px-4 py-4 space-y-6">
          {menuCategories.map((category, index) => (
            <div key={index}>
              <h3 className="text-blue-500 font-bold text-sm tracking-wider uppercase mb-2 border-b border-gray-800 pb-1">
                {category.title}
              </h3>
              <div className="flex flex-col space-y-2">
                {category.items.map((item) => (
                  <Link 
                    key={item.slug} 
                    href={`/kategori/${item.slug}`} 
                    onClick={() => setIsOpen(false)} 
                    className="text-gray-300 hover:text-white text-sm py-1 pl-2 border-l border-gray-800/50 hover:border-blue-500"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
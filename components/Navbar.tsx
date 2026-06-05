"use client";
import { useState } from 'react';
import Link from 'next/link';

// ŞEF, VATAN'DAN SÜZÜLMÜŞ FULL ENVANTER LİSTESİ BURADA!
const menuCategories = [
  {
    title: "Bilgisayar Bileşenleri",
    items: [
      { name: "Anakart", slug: "anakart" },
      { name: "Ekran Kartı", slug: "ekran-karti" },
      { name: "İşlemci (CPU)", slug: "islemci" },
      { name: "RAM Bellek", slug: "ram" },
      { name: "SSD & M.2 Disk", slug: "ssd" },
      { name: "Sabit Disk (HDD)", slug: "hdd" },
      { name: "Bilgisayar Kasası", slug: "kasa" },
      { name: "Güç Kaynakları (PSU)", slug: "psu" },
      { name: "Soğutma Sistemleri", slug: "sogutma" },
    ]
  },
  {
    title: "Çevre Birimleri & Oyuncu",
    items: [
      { name: "Oyuncu Monitörleri", slug: "monitor" },
      { name: "Klavye", slug: "klavye" },
      { name: "Mouse & Mouse Pad", slug: "mouse" },
      { name: "Oyuncu Kulaklıkları", slug: "kulaklik" },
      { name: "Yayıncı Mikrofonları", slug: "mikrofon" },
      { name: "Oyun Kolu & Direksiyon", slug: "oyun-kolu" },
      { name: "Simülasyon Ürünleri", slug: "simulasyon" },
      { name: "Hoparlör (Speaker)", slug: "hoparlor" },
      { name: "Grafik Tabletler", slug: "grafik-tablet" },
    ]
  },
  {
    title: "Sistem, Laptop & Yazılım",
    items: [
      { name: "Hazır Oyun Bilgisayarı", slug: "hazir-sistem" },
      { name: "Premium Laptop & Notebook", slug: "laptop" },
      { name: "Masaüstü Bilgisayar", slug: "masaustu" },
      { name: "MacBook & Mac", slug: "macbook" },
      { name: "Tablet & iPad", slug: "tablet" },
      { name: "OEM Paketler (Toplama PC)", slug: "oem-paket" },
      { name: "İşletim Sistemi", slug: "isletim-sistemi" },
      { name: "Microsoft Office & Yazılım", slug: "yazilim" },
      { name: "Güvenlik & Antivirüs", slug: "antivirus" },
    ]
  },
  {
    title: "Ağ, Aksesuar & Kablo",
    items: [
      { name: "Modem & Network", slug: "modem" },
      { name: "USB Bellek & Hafıza Kartı", slug: "usb-bellek" },
      { name: "Kablolar & Çeviriciler", slug: "kablolar" },
      { name: "Çoklayıcılar (Hub)", slug: "coklayici" },
      { name: "Akım Koruyucu Priz", slug: "akim-koruyucu" },
      { name: "Notebook Soğutucu & Çanta", slug: "notebook-aksesuar" },
      { name: "Şarj Aletleri & Powerbank", slug: "sarj-powerbank" },
      { name: "Bluetooth Hoparlör & Kulaklık", slug: "bluetooth-ses" },
      { name: "Termal Macun & Temizlik", slug: "termal-macun" },
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
                <div className="absolute top-full left-0 mt-1 w-[1100px] bg-[#09090b]/98 backdrop-blur-xl border border-gray-800 rounded-lg shadow-2xl p-8 z-50">
                  <div className="grid grid-cols-4 gap-8">
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

            {/* VİTRİN: EN ÇOK ARANAN ŞERİT KATEGORİLERİ */}
            <div className="flex items-center space-x-6">
              <Link href="/kategori/hazir-sistem" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-bold transition-colors">🔥 Hazır Sistemler</Link>
              <Link href="/kategori/ekran-karti" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">Ekran Kartları</Link>
              <Link href="/kategori/islemci" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">İşlemciler</Link>
              <Link href="/kategori/oem-paket" className="text-gray-300 hover:text-white hover:text-blue-500 text-sm font-medium transition-colors">PC Toplama Sihirbazı</Link>
            </div>
          </div>

          {/* MOBİL GÖRÜNÜM - HAMBURGER */}
          <div className="flex md:hidden w-full justify-between items-center">
            <span className="text-gray-300 text-sm font-medium tracking-wider pl-2">KATEGORİLER</span>
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800">
              {isOpen ? "Kapat X" : "Aç ≡"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL İÇİN AKORDİYON MENÜ */}
      {isOpen && (
        <div className="md:hidden bg-[#050814]/98 backdrop-blur-lg border-b border-gray-800 max-h-[75vh] overflow-y-auto px-4 py-4 space-y-6">
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
                    className="text-gray-300 hover:text-white text-sm py-1.5 pl-2 border-l border-gray-800/50 hover:border-blue-500"
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
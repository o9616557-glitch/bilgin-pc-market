"use client";

import React, { useState } from "react";
import Link from "next/link";

// 1. ADIM: KATEGORİ VERİLERİ (Not Defterine bu yapıyı kaydedebilirsin)
// Her ana kategori (name) ve ona bağlı alt kategoriler (subs) burada.
const navigation = [
  { name: "Ekran kartları", subs: ["Nvidia GeForce", "AMD Radeon", "İş istasyonu"] },
  { name: "İşlemciler", subs: ["Intel Core", "AMD Ryzen", "Sunucu İşlemcileri"] },
  { name: "Anakartlar", subs: ["Intel Uyumlu", "AMD Uyumlu", "Oyuncu Anakartları"] },
  { name: "Bellekler (RAM)", subs: ["DDR4", "DDR5", "RGB Bellekler"] },
  { name: "Depolama", subs: ["NVMe SSD", "SATA SSD", "Harddisk"] },
  { name: "Hazır sistemler", subs: ["Oyuncu Bilgisayarı", "Ofis PC", "Render Sistemleri"] },
  { name: "Kasa & Güç kaynağı", subs: ["Full Tower", "Mid Tower", "80+ Gold PSU"] },
  { name: "Aksesuar", subs: ["Klavye", "Mouse", "Kulaklık"] },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null); // Hangi alt menü açık?

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between relative">
        
        {/* SOL: HAMBURGER (MOBİL) + PC MENU */}
        <div className="flex items-center gap-6">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white md:hidden p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          {/* PC İÇİN YAZI HALİNDE MENÜ (Masaüstünde hamburger yerine bu çıkar) */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.slice(0, 4).map((item) => ( // Yer kalması için ilk 4'ü gösterdik
              <Link key={item.name} href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* ORTA: LOGO */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-black italic tracking-tighter">
          BİLGİN<span className="text-blue-500 uppercase not-italic">PC</span>
        </Link>

        {/* SAĞ: SEPET & HESABIM */}
        <div className="flex items-center gap-5">
           <button className="text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
           <Link href="/sepet" className="text-slate-400 relative">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             <span className="absolute -top-1 -right-2 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
           </Link>
        </div>
      </div>

      {/* 2. ADIM: MOBİL KATEGORİ MENÜSÜ (Hamburger tıklanınca açılan yer) */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0b0f1a] border-b border-white/5 h-[calc(100vh-80px)] overflow-y-auto z-[99] md:hidden animate-in fade-in slide-in-from-left-5">
          <div className="p-6 space-y-4">
            <h2 className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-6">Kategoriler</h2>
            
            {navigation.map((cat) => (
              <div key={cat.name} className="border-b border-white/5 pb-4">
                {/* ANA KATEGORİ BAŞLIĞI */}
                <button 
                  onClick={() => setOpenSub(openSub === cat.name ? null : cat.name)}
                  className="w-full flex justify-between items-center group"
                >
                  <span className="text-lg font-bold text-white capitalize">{cat.name}</span>
                  <span className={`text-blue-500 transition-transform ${openSub === cat.name ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {/* ALT KATEGORİLER (Sadece tıklandığında açılır) */}
                {openSub === cat.name && (
                  <div className="mt-4 ml-4 flex flex-col gap-3 border-l border-blue-500/20 pl-4 animate-in slide-in-from-top-2">
                    {cat.subs.map((sub) => (
                      <Link key={sub} href="#" className="text-slate-400 text-sm font-medium capitalize hover:text-white">
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
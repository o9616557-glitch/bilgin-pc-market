"use client";

import React, { useState } from "react";
import Link from "next/link";

// YENİ KATEGORİ LİSTESİ (Senin belirlediğin 7 ana katalog ve altları)
const navigation = [
  { 
    name: "Tüm bilgisayarlar", 
    subs: ["Tüm bilgisayarlar"] 
  },
  { 
    name: "Masaüstü bilgisayarlar", 
    subs: ["Tüm masaüstü bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] 
  },
  { 
    name: "Laptop bilgisayar", 
    subs: ["Tüm laptop bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] 
  },
  { 
    name: "Hazır sistem bilgisayarlar", 
    subs: ["Tüm hazır sistem bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] 
  },
  { 
    name: "Bilgisayar parçaları", 
    subs: ["Kasa", "Anakart", "İşlemci", "Ekran kartı", "RAM", "SSD", "Sıvı soğutma", "Güç kaynağı"] 
  },
  { 
    name: "Bilgisayar ekipmanları", 
    subs: ["Monitör", "Mouse", "Klavye", "Kulaklık", "Mikrofon", "Hoparlör", "Direksiyon seti", "Webcam", "RGB aydınlatma", "Mousepad", "Oyuncu ve ofis koltuğu"] 
  },
  { 
    name: "Aksesuar ve bağlantı", 
    subs: ["HDMI kablo", "Display port kablo", "USB kablo", "Dönüştürücü adaptör", "Uzatma kablosu", "Wi-Fi adaptörü", "Çoklayıcı", "İnternet kablosu", "Laptop standı", "Kulaklık standı", "Temizlik malzemesi"] 
  }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100]">
      {/* ÜST KATMAN: LOGO, ARAMA, HESABIM, SEPET */}
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between relative border-b border-white/5">
        
        {/* SOL: HAMBURGER (Sadece Mobil & Tablet) */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white lg:hidden p-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* ORTA: LOGO */}
        <Link href="/" className="text-xl lg:text-2xl font-black italic tracking-tighter">
          BİLGİN<span className="text-blue-500 uppercase not-italic">PC</span>
        </Link>

        {/* SAĞ: HESABIM & SEPET */}
        <div className="flex items-center gap-4 lg:gap-6">
           <button className="text-slate-400 hidden sm:block hover:text-white transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </button>
           
           {/* HESABIM */}
           <Link href="/hesabim" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
             <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">Hesabım</span>
           </Link>

           {/* SEPET */}
           <Link href="/sepet" className="text-slate-400 hover:text-green-500 relative transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
             <span className="absolute -top-1 -right-2 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
           </Link>
        </div>
      </div>

      {/* ALT KATMAN: 7 KATEGORİ (Sadece PC) */}
      {/* EĞİTİM NOTU: Hata veren yorum satırı buradan kaldırıldı. Kod artık tertemiz. */}
      <nav className="hidden lg:flex items-center justify-center gap-6 h-12 bg-[#0b0f1a]/50 px-4">
        {navigation.map((item) => (
          <Link key={item.name} href="#" className="text-[10px] font-black capitalize tracking-widest text-slate-400 hover:text-white transition-colors whitespace-nowrap">
            {item.name}
          </Link>
        ))}
      </nav>

      {/* MOBİL & TABLET MENÜ (Açılır Hamburger) */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[64px] bg-[#050810] z-[99] lg:hidden overflow-y-auto pb-20">
          <div className="p-6 space-y-4">
            {navigation.map((cat) => (
              <div key={cat.name} className="border-b border-white/5 pb-4">
                <button 
                  onClick={() => setOpenSub(openSub === cat.name ? null : cat.name)}
                  className="w-full flex justify-between items-center"
                >
                  <span className="text-lg font-bold text-white capitalize">{cat.name}</span>
                  <span className={`text-blue-500 transition-transform ${openSub === cat.name ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {openSub === cat.name && (
                  <div className="mt-4 ml-4 flex flex-col gap-3 border-l border-blue-500/20 pl-4">
                    {cat.subs.map((sub) => (
                      <Link key={sub} href="#" className="text-slate-400 text-sm font-medium capitalize hover:text-white transition-colors">
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
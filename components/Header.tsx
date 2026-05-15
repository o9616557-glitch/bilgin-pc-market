"use client";

import React, { useState } from "react";
import Link from "next/link";

const navigation = [
  { name: "Tüm bilgisayarlar", subs: ["Tüm bilgisayarlar"] },
  { name: "Masaüstü bilgisayarlar", subs: ["Tüm masaüstü bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] },
  { name: "Laptop bilgisayar", subs: ["Tüm laptop bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] },
  { name: "Hazır sistem bilgisayarlar", subs: ["Tüm hazır sistem bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] },
  { name: "Bilgisayar parçaları", subs: ["Kasa", "Anakart", "İşlemci", "Ekran kartı", "RAM", "SSD", "Sıvı soğutma", "Güç kaynağı"] },
  { name: "Bilgisayar ekipmanları", subs: ["Monitör", "Mouse", "Klavye", "Kulaklık", "Mikrofon", "Hoparlör", "Direksiyon seti", "Webcam", "RGB aydınlatma", "Mousepad", "Oyuncu ve ofis koltuğu"] },
  { name: "Aksesuar ve bağlantı", subs: ["HDMI kablo", "Display port kablo", "USB kablo", "Dönüştürücü adaptör", "Uzatma kablo", "Wi-Fi adaptörü", "Çoklayıcı", "İnternet kablosu", "Laptop standı", "Kulaklık standı", "Temizlik"] }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100]">
      
      {/* ANA ÇERÇEVE */}
      <div className="max-w-[1400px] mx-auto px-4 xl:px-5 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center flex-shrink-0">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white lg:hidden p-2 -ml-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href="/" className="text-xl lg:text-2xl font-black italic tracking-tighter">
            BİLGİN<span className="text-blue-500 uppercase not-italic">PC</span>
          </Link>
        </div>

        {/* ORTA MENÜ - LAPTOP UYUMLU VE SIFIR TİTREME */}
        <nav className="hidden lg:flex items-center justify-center flex-1 h-full">
          {navigation.map((item) => (
            <div key={item.name} className="group h-full flex items-center">
              
              <Link 
                href="#" 
                className="text-[11px] xl:text-[13px] font-medium capitalize tracking-tight text-slate-300 group-hover:text-white transition-colors whitespace-nowrap px-2 xl:px-3 h-full flex items-center"
              >
                {item.name}
              </Link>

              {/* MEGA MENÜ - ARKASI GÖZÜKMEYEN VE SABİT DURAN */}
              <div className="absolute top-full left-0 w-full bg-[#0b0f1a] border-t border-b border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110] shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
                <div className="max-w-[1400px] mx-auto px-10 py-12 flex gap-16">
                  
                  {/* Alt Kategoriler */}
                  <div className="w-1/3 flex flex-col gap-5">
                    <h3 className="text-[11px] text-blue-500 font-black uppercase tracking-widest border-b border-white/5 pb-3">Kategoriyi Keşfet</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {item.subs.map((sub) => (
                        <Link key={sub} href="#" className="flex items-center justify-between text-slate-300 hover:text-white font-medium text-sm capitalize group/link">
                          {sub}
                          <svg className="w-4 h-4 text-slate-700 group-hover/link:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="w-px bg-white/5"></div>

                  {/* Yardım ve Detay */}
                  <div className="w-2/3 flex flex-col gap-5">
                     <h3 className="text-[11px] text-slate-500 font-black uppercase tracking-widest border-b border-white/5 pb-3">Bilgin PC Ayrıcalıkları</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <Link href="#" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5">
                           <div className="text-white font-bold text-sm mb-1">Yeni Modeller</div>
                           <div className="text-slate-500 text-xs">En son çıkan donanımları inceleyin.</div>
                        </Link>
                        <Link href="#" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5">
                           <div className="text-white font-bold text-sm mb-1">Destek Merkezi</div>
                           <div className="text-slate-500 text-xs">Teknik yardım ve kurulum rehberleri.</div>
                        </Link>
                     </div>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </nav>

        {/* SAĞ İKONLAR */}
        <div className="flex items-center gap-4 xl:gap-6 flex-shrink-0 relative">
          
          <button className="text-slate-400 hover:text-white p-1">
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {/* HESABIM POP-UP (OK İŞARETLİ) */}
          <div 
            className="relative flex items-center h-full group"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            <div className="text-slate-400 group-hover:text-white transition-colors p-1 cursor-pointer">
              <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>

            {/* OK İŞARETLİ MENÜ */}
            <div className={`absolute top-[80%] right-[-10px] pt-5 transition-all duration-300 z-[120] ${isAccountOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="absolute top-[12px] right-[18px] w-4 h-4 bg-[#0b0f1a] border-l border-t border-white/10 rotate-45 z-0"></div>
              <div className="relative z-10 w-48 bg-[#0b0f1a] border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
                <Link href="/siparis" className="px-5 py-4 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5">Sipariş Takip</Link>
                <Link href="/favoriler" className="px-5 py-4 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5">Favorilerim</Link>
                <Link href="/hesabim" className="px-5 py-4 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5">Hesabım Ayarları</Link>
                <Link href="/giris" className="px-5 py-4 text-xs font-black text-green-500 hover:bg-green-500/10 transition-colors">GİRİŞ YAP</Link>
              </div>
            </div>
          </div>

          {/* SEPET */}
          <Link href="/sepet" className="text-slate-400 hover:text-green-500 relative p-1">
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </Link>

        </div>
      </div>

      {/* MOBİL MENÜ (Aynı mantıkla stabil) */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[80px] bg-[#050810] z-[99] lg:hidden overflow-y-auto pb-20">
          <div className="p-4">
            {navigation.map((cat) => (
              <div key={cat.name} className="border-b border-white/5">
                <button onClick={() => setOpenSub(openSub === cat.name ? null : cat.name)} className="w-full flex justify-between items-center py-5">
                  <span className="text-base font-medium text-slate-200">{cat.name}</span>
                  <svg className={`w-5 h-5 transition-transform ${openSub === cat.name ? 'rotate-90 text-blue-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                {openSub === cat.name && (
                  <div className="pb-5 pl-4 flex flex-col gap-4">
                    {cat.subs.map((sub) => (
                      <Link key={sub} href="#" className="text-slate-400 text-sm">{sub}</Link>
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
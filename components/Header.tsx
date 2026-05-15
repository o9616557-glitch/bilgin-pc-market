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
  { name: "Aksesuar ve bağlantı", subs: ["HDMI kablo", "Display port kablo", "USB kablo", "Dönüştürücü adaptör", "Uzatma kablosu", "Wi-Fi adaptörü", "Çoklayıcı", "İnternet kablosu", "Laptop standı", "Kulaklık standı", "Temizlik"] }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  
  // EĞİTİM NOTU: Mobilde hesabım menüsünün sorunsuz açılması için State ekledik.
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100] relative">
      
      {/* ANA ÇERÇEVE */}
      <div className="max-w-[1400px] mx-auto px-4 xl:px-5 h-20 flex items-center justify-between">
        
        {/* 1. SOL BÖLÜM: MOBİL HAMBURGER VE LOGO */}
        {/* EĞİTİM NOTU: flex-shrink-0 ile logonun laptoplarda ezilmesini engelledik. */}
        <div className="flex items-center flex-shrink-0">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white lg:hidden p-2 -ml-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href="/" className="text-xl lg:text-2xl font-black italic tracking-tighter">
            BİLGİN<span className="text-blue-500 uppercase not-italic">PC</span>
          </Link>
        </div>

        {/* 2. ORTA BÖLÜM: BİLGİSAYAR (LAPTOP) KAYMA SORUNU ÇÖZÜLDÜ */}
        {/* EĞİTİM NOTU: flex-1 ile ortaya yayıldı, ekran küçüldükçe yazılar ufalarak sığar. */}
        <nav className="hidden lg:flex items-center justify-center flex-1 px-2 h-full gap-2 xl:gap-4">
          {navigation.map((item) => (
            <div key={item.name} className="group h-full flex items-center cursor-pointer">
              
              <Link href="#" className="text-[10px] xl:text-[13px] font-medium capitalize tracking-wide text-slate-300 group-hover:text-white transition-colors whitespace-nowrap px-1 xl:px-2">
                {item.name}
              </Link>

              {/* MEGA MENÜ KUTUSU */}
              <div className="absolute top-full left-0 w-full bg-[#0b0f1a] border-t border-b border-white/5 hidden group-hover:block z-[110] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                <div className="max-w-[1400px] mx-auto px-5 py-10 flex gap-12">
                  
                  {/* Sol Taraf: Alt Kategoriler */}
                  <div className="w-1/3 flex flex-col gap-4">
                    <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Keşfet</h3>
                    {item.subs.map((sub) => (
                      <Link key={sub} href="#" className="flex items-center justify-between text-slate-300 hover:text-white font-medium text-sm capitalize group/link transition-colors">
                        {sub}
                        <svg className="w-4 h-4 text-slate-600 group-hover/link:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    ))}
                  </div>

                  {/* Orta Dikey Çizgi */}
                  <div className="w-px bg-white/5"></div>

                  {/* Sağ Taraf: Yardım ve Keşif */}
                  <div className="w-2/3 flex flex-col gap-4">
                     <h3 className="text-[10px] xl:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Yardım ve Keşif</h3>
                     <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Tüm Ürünleri Gör</Link>
                     <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Yeni Gelen Modeller</Link>
                     <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Sıkça Sorulan Sorular (S.S.S)</Link>
                     <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Destek ve İletişim</Link>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </nav>

        {/* 3. SAĞ BÖLÜM: İKONLAR */}
        {/* EĞİTİM NOTU: flex-shrink-0 ile bu kısmın sıkışmasını engelledik. */}
        <div className="flex items-center gap-5 xl:gap-8 h-full flex-shrink-0 relative">
          
          {/* ARAMA */}
          <button className="text-slate-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {/* HESABIM (MOBİL VE OK İŞARETİ DÜZELTİLDİ) */}
          <div 
            className="relative flex items-center h-full cursor-pointer"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
            onClick={() => setIsAccountOpen(!isAccountOpen)}
          >
            <div className="text-slate-400 hover:text-white transition-colors p-1 relative z-10">
              <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>

            {/* AÇILIR MENÜ VE OK İŞARETİ */}
            <div className={`absolute top-[85%] right-[-10px] pt-4 transition-all duration-300 z-[120] ${isAccountOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-3'}`}>
              
              {/* YUKARI BAKAN OK (ÜÇGEN) */}
              <div className="absolute top-[8px] right-[18px] w-4 h-4 bg-[#0b0f1a] border-l border-t border-white/10 rotate-45 z-0"></div>

              {/* LİNK KUTUSU */}
              <div className="relative z-10 w-48 bg-[#0b0f1a] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col overflow-hidden">
                <Link href="/siparis" className="px-5 py-3.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">Sipariş Takip</Link>
                <Link href="/favoriler" className="px-5 py-3.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">Favorilerim</Link>
                <Link href="/hesabim" className="px-5 py-3.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">Hesabım</Link>
                <Link href="/giris" className="px-5 py-3.5 text-xs font-bold text-green-500 hover:bg-green-500/10 transition-colors">Giriş Yap</Link>
              </div>

            </div>
          </div>

          {/* SEPET */}
          <Link href="/sepet" className="text-slate-400 hover:text-green-500 relative transition-colors p-1">
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </Link>

        </div>
      </div>

      {/* MOBİL & TABLET MENÜ */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[80px] bg-[#050810] z-[99] lg:hidden overflow-y-auto pb-20 animate-in fade-in slide-in-from-left-5">
          <div className="p-4">
            {navigation.map((cat) => (
              <div key={cat.name} className="border-b border-white/5">
                <button onClick={() => setOpenSub(openSub === cat.name ? null : cat.name)} className="w-full flex justify-between items-center py-5">
                  <span className="text-lg font-medium text-slate-200 capitalize">{cat.name}</span>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openSub === cat.name ? 'rotate-90 text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {openSub === cat.name && (
                  <div className="pb-5 pl-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {cat.subs.map((sub) => (
                      <Link key={sub} href="#" className="text-slate-400 hover:text-white capitalize transition-colors text-sm font-medium flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-600 before:rounded-full">
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
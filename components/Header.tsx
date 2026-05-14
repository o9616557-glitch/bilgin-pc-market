"use client";

import React, { useState } from "react";
import Link from "next/link";

// KATEGORİ LİSTESİ (7 Ana Katalog ve Alt Kategoriler)
const navigation = [
  { name: "Tüm bilgisayarlar", subs: ["Tüm bilgisayarlar"] },
  { name: "Masaüstü bilgisayarlar", subs: ["Tüm masaüstü bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] },
  { name: "Laptop bilgisayar", subs: ["Tüm laptop bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] },
  { name: "Hazır sistem bilgisayarlar", subs: ["Tüm hazır sistem bilgisayarlar", "Ofis ve günlük", "Performans", "Gaming", "3D ve tasarım", "Pro sistemler"] },
  { name: "Bilgisayar parçaları", subs: ["Kasa", "Anakart", "İşlemci", "Ekran kartı", "RAM", "SSD", "Sıvı soğutma", "Güç kaynağı"] },
  { name: "Bilgisayar ekipmanları", subs: ["Monitör", "Mouse", "Klavye", "Kulaklık", "Mikrofon", "Hoparlör", "Direksiyon seti", "Webcam", "RGB aydınlatma", "Mousepad", "Oyuncu ve ofis koltuğu"] },
  { name: "Aksesuar ve bağlantı", subs: ["HDMI kablo", "Display port kablo", "USB kablo", "Dönüştürücü adaptör", "Uzatma kablosu", "Wi-Fi adaptörü", "Çoklayıcı", "İnternet kablosu", "Laptop standı", "Kulaklık standı", "Temizlik malzemesi"] }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobil Hamburger Menü Hafızası
  const [openSub, setOpenSub] = useState<string | null>(null); // Mobil Alt Menü Hafızası
  
  // YENİ: Hesabım Popup'ı için hafıza (tıklayınca açılıp kapanmasını sağlar)
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100]">
      {/* ÜST KATMAN: LOGO, ARAMA, HESABIM, SEPET */}
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between relative border-b border-white/5">
        
        {/* SOL: HAMBURGER (Mobil) */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white lg:hidden p-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* ORTA: LOGO */}
        <Link href="/" className="text-xl lg:text-2xl font-black italic tracking-tighter">
          BİLGİN<span className="text-blue-500 uppercase not-italic">PC</span>
        </Link>

        {/* SAĞ: ARAMA, HESABIM & SEPET */}
        <div className="flex items-center gap-4 lg:gap-6">
           
           {/* ARAMA İKONU */}
           <button className="text-slate-400 hover:text-white transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </button>
           
           {/* HESABIM POPUP SİSTEMİ */}
           <div className="relative">
             {/* Yazı silindi, sadece ikon kaldı. Tıklanınca isAccountOpen durumunu değiştirir */}
             <button 
               onClick={() => setIsAccountOpen(!isAccountOpen)} 
               className={`flex items-center text-slate-400 hover:text-white transition-colors p-1 rounded-full ${isAccountOpen ? 'bg-white/10 text-white' : ''}`}
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
             </button>

             {/* Tıklanınca Açılan Kutu (Popup) */}
             {isAccountOpen && (
               <div className="absolute top-full right-0 mt-4 w-48 bg-[#0b0f1a] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col z-[120] overflow-hidden animate-in fade-in slide-in-from-top-2">
                 <Link href="/siparis" className="px-5 py-3.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">Sipariş Takip</Link>
                 <Link href="/hesabim" className="px-5 py-3.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">Hesabım</Link>
                 <Link href="/giris" className="px-5 py-3.5 text-xs font-bold text-green-500 hover:bg-green-500/10 transition-colors">Giriş Yap</Link>
               </div>
             )}
           </div>

           {/* SEPET */}
           <Link href="/sepet" className="text-slate-400 hover:text-green-500 relative transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
             <span className="absolute -top-1 -right-2 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
           </Link>
        </div>
      </div>

      {/* ALT KATMAN: PC İÇİN RAZER STİLİ MEGA MENÜ */}
      <nav className="hidden lg:flex items-center justify-center gap-6 h-12 bg-[#0b0f1a]/50 px-4">
        {navigation.map((item) => (
          // Her kategori bir 'group' tur. Fare üzerine gelince gizli menüyü tetikler.
          <div key={item.name} className="group h-full flex items-center">
            
            <Link href="#" className="text-[10px] font-black capitalize tracking-widest text-slate-400 group-hover:text-white transition-colors whitespace-nowrap h-full flex items-center px-2">
              {item.name}
            </Link>

            {/* MEGA MENÜ (Ekranı boydan boya kaplayan tasarım) */}
            {/* absolute top-full left-0 w-full komutları, menünün Header'ın hemen altına ve tam genişlikte açılmasını sağlar. */}
            <div className="absolute top-full left-0 w-full bg-[#0b0f1a] border-t border-b border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              <div className="max-w-7xl mx-auto px-5 py-10 flex gap-12">
                
                {/* MEGA MENÜ SOL KOLON: Alt Kategoriler (Görseldeki gibi oklarla) */}
                <div className="w-1/3 flex flex-col gap-4">
                  <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Keşfet</h3>
                  {item.subs.map((sub) => (
                    <Link key={sub} href="#" className="flex items-center justify-between text-slate-300 hover:text-white font-bold text-sm capitalize group/link transition-colors">
                      {sub}
                      {/* Sağa bakan ince ok */}
                      <svg className="w-4 h-4 text-slate-600 group-hover/link:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>

                {/* MEGA MENÜ ORTA: Dikey İnce Çizgi */}
                <div className="w-px bg-white/5"></div>

                {/* MEGA MENÜ SAĞ KOLON: Görseldeki 'Daha Fazla Hakkında' Alanı */}
                <div className="w-2/3 flex flex-col gap-4">
                  <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Daha Fazla Hakkında</h3>
                  {/* Bu kısım görseli tamamlamak için şimdilik sabit konuldu, isteğine göre güncelleyebiliriz */}
                  <Link href="#" className="text-slate-400 hover:text-white text-xs font-bold transition-colors">Popüler {item.name} Ürünleri</Link>
                  <Link href="#" className="text-slate-400 hover:text-white text-xs font-bold transition-colors">Yeni Gelen Modeller</Link>
                  <Link href="#" className="text-slate-400 hover:text-white text-xs font-bold transition-colors">Kurulum ve Kullanım Rehberi</Link>
                  <Link href="#" className="text-slate-400 hover:text-white text-xs font-bold transition-colors">Müşteri Destek Merkezi</Link>
                </div>

              </div>
            </div>

          </div>
        ))}
      </nav>

      {/* MOBİL & TABLET MENÜ (Dokunulmadı, bir önceki adımda mükemmel ayarlamıştık) */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[64px] bg-[#050810] z-[99] lg:hidden overflow-y-auto pb-20 animate-in fade-in slide-in-from-left-5">
          <div className="p-4">
            {navigation.map((cat) => (
              <div key={cat.name} className="border-b border-white/5">
                <button onClick={() => setOpenSub(openSub === cat.name ? null : cat.name)} className="w-full flex justify-between items-center py-5">
                  <span className="text-lg font-bold text-slate-200 capitalize">{cat.name}</span>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openSub === cat.name ? 'rotate-90 text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {openSub === cat.name && (
                  <div className="mb-4 ml-2 flex flex-col gap-4 border-l border-blue-500/20 pl-4">
                    {cat.subs.map((sub) => (
                      <Link key={sub} href="#" className="text-slate-400 text-sm font-medium capitalize hover:text-white transition-colors">{sub}</Link>
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
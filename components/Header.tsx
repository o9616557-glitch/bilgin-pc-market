"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  // NEW: State for full-page search overlay and search results
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // NEW: Ref to focus the search input when overlay opens
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  const activeNavData = navigation.find(item => item.name === activeHover);

  // NEW: Effect to focus input and handle keyboard navigation (close on ESC)
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSearchOpen && event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  // NEW: Local filtering logic for navigation data
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const filtered = navigation.reduce((acc, item) => {
      const categoryMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const subCategoryMatches = item.subs.filter(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));
      if (categoryMatch) {
        acc.push({ type: 'category', name: item.name, subs: item.subs });
      }
      subCategoryMatches.forEach(sub => acc.push({ type: 'sub_category', name: sub, parentCategory: item.name }));
      return acc;
    }, []);
    setSearchResults(filtered);
  }, [searchTerm]);

  // NEW: Search Result Item Renderer
  const renderSearchResultItem = (item) => {
    let title, description;
    if (item.type === 'category') {
      title = item.name;
      description = `Kategori: ${item.subs.length} alt kategori içerir.`;
    } else {
      title = item.name;
      description = `Alt Kategori: ${item.parentCategory} kategorisinde bulunur.`;
    }
    return (
      <div key={item.name} className="bg-white/5 border border-white/5 hover:border-white/10 p-5 rounded-3xl group/card transition-all duration-300 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-[#050810] border border-white/5 rounded-full flex items-center justify-center p-3">
              {item.type === 'category' ? (
                <svg className="w-full h-full text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              ) : (
                <svg className="w-full h-full text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              )}
            </div>
            <h4 className="text-xl font-bold italic tracking-tighter uppercase text-white leading-tight group-hover/card:text-blue-500 transition-colors">
              {title}
            </h4>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-4">{description}</p>
        </div>
        <Link href="#" className="w-full inline-flex items-center justify-center py-3 bg-white/5 hover:bg-blue-600 rounded-xl text-center text-xs font-black uppercase tracking-widest text-white group-hover/card:bg-blue-600 transition-all">
          Ürün Ara <svg className="w-4 h-4 ml-2 group-hover/card:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Link>
      </div>
    );
  };

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100]">
      
      <div className="max-w-[1400px] mx-auto px-4 xl:px-5 h-20 flex items-center justify-between relative">
        
        {/* LOGO */}
        <div className="flex items-center flex-shrink-0">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white lg:hidden p-2 -ml-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href="/" className="text-xl lg:text-2xl font-black italic tracking-tighter">
            BİLGİN<span className="text-blue-500 uppercase not-italic">PC</span>
          </Link>
        </div>

        {/* ORTA MENÜ */}
        <nav 
          className="hidden lg:flex items-center justify-center flex-1 h-full mx-2"
          onMouseLeave={() => setActiveHover(null)}
        >
          {navigation.map((item) => (
            <div 
              key={item.name} 
              className="h-full flex items-center px-1.5 xl:px-3 cursor-pointer"
              onMouseEnter={() => setActiveHover(item.name)}
            >
              <Link 
                href="#" 
                className={`text-[11px] xl:text-[12px] font-medium capitalize tracking-tight whitespace-nowrap transition-colors ${activeHover === item.name ? "text-white" : "text-slate-300 hover:text-white"}`}
              >
                {item.name}
              </Link>
            </div>
          ))}

          {/* TEK VE SABİT MEGA MENÜ KUTUSU */}
          <div 
            className={`absolute top-full left-0 w-full bg-[#0b0f1a] border-t border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] z-[110] transition-all duration-200 ease-in-out ${
              activeHover ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
            }`}
          >
            {activeNavData && (
              <div className="max-w-[1400px] mx-auto px-10 py-10 flex gap-10">
                
                {/* Sol Taraf: Alt Kategoriler (Subs) */}
                <div className="w-1/3 flex flex-col gap-4">
                  <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-white/5 pb-2">Keşfet</h3>
                  <div className="flex flex-col gap-2.5">
                    {activeNavData.subs.map((sub) => (
                      <Link key={sub} href="#" className="flex items-center justify-between text-slate-300 hover:text-white font-medium text-sm capitalize group/link transition-colors">
                        {sub}
                        <svg className="w-4 h-4 text-slate-700 group-hover/link:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="w-px bg-white/5 h-auto"></div>

                {/* Sağ Taraf: Yardım ve Keşif */}
                <div className="w-2/3 flex flex-col gap-4">
                   <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-white/5 pb-2">Yardım ve Keşif</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Tüm {activeNavData.name} Ürünlerini Gör</Link>
                      <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Yeni Gelen Modeller</Link>
                      <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Sıkça Sorulan Sorular</Link>
                      <Link href="#" className="text-slate-400 hover:text-white text-xs font-medium transition-colors">Destek ve İletişim</Link>
                   </div>
                </div>

              </div>
            )}
          </div>
        </nav>

        {/* SAĞ İKONLAR */}
        <div className="flex items-center gap-4 xl:gap-7 flex-shrink-0 relative">
          
          {/* SEARCH (TIKLAYINCA AÇILIR) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Arama sayfasını aç"
          >
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {/* HESABIM (Düzeltilmiş Tıklama) */}
          <div 
            className="relative flex items-center h-full group"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
            onClick={() => setIsAccountOpen(!isAccountOpen)}
          >
            <div className="text-slate-400 group-hover:text-white transition-colors p-1 cursor-pointer">
              <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>

            <div className={`absolute top-[80%] right-[-10px] pt-5 transition-all duration-300 z-[120] ${isAccountOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="absolute top-[12px] right-[18px] w-4 h-4 bg-[#0b0f1a] border-l border-t border-white/10 rotate-45"></div>
              <div className="relative z-10 w-48 bg-[#0b0f1a] border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
                <Link href="/siparis" className="px-5 py-3.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5">Sipariş Takip</Link>
                <Link href="/favoriler" className="px-5 py-3.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5">Favorilerim</Link>
                <Link href="/hesabim" className="px-5 py-3.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white border-b border-white/5">Hesabım</Link>
                <Link href="/giris" className="px-5 py-4 text-xs font-black text-green-500 hover:bg-green-500/10 uppercase tracking-widest transition-colors">Giriş Yap</Link>
              </div>
            </div>
          </div>

          {/* SEPET */}
          <Link href="/sepet" className="text-slate-400 hover:text-green-500 relative p-1 transition-colors">
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </Link>

        </div>
      </div>

      {/* NEW: Full-page Search Overlay (TIKLAYINCA AÇILIR, ARKASI GÜZEL MODERN BİR SAYFA) */}
      {isSearchOpen && (
        <div ref={searchOverlayRef} className="fixed inset-0 bg-black/80 z-[200] p-5 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="searchHeading">
          <div className="absolute top-5 right-5 flex space-x-3 items-center">
            <span className="text-slate-600 text-xs font-medium uppercase tracking-widest">[ESC] ile kapat</span>
            <button 
              onClick={() => setIsSearchOpen(false)} 
              className="w-10 h-10 bg-white/5 border border-white/5 hover:border-white/10 rounded-full flex items-center justify-center p-2 text-white transition-colors"
              aria-label="Arama sayfasını kapat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="max-w-[1400px] mx-auto mt-20 relative bg-[#050810] bg-grid-white/5 p-10 rounded-3xl border border-white/5 min-h-[calc(100vh-10rem)] shadow-[0_0_100px_rgba(34,197,94,0.1)]">
            <h1 id="searchHeading" className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white leading-none mb-10 text-center">
              Ürün <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 pr-2">Ara</span>
            </h1>
            
            <div className="relative mb-16">
              <input 
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ürün, marka veya kategori ara..." 
                className="w-full bg-[#0b1120] p-6 pl-20 rounded-full text-4xl font-black italic text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-shadow transition-colors"
                aria-label="Arama terimini gir"
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-slate-600 hover:text-white transition-colors" aria-label="Arama terimini temizle">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* RESULTS AREA */}
            <div className="space-y-10">
              {searchTerm.length === 0 ? (
                <div className="text-center py-20 text-slate-600 font-medium italic">Aramaya başlamak için bir şeyler yazın...</div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-20 text-red-500/60 font-medium">Aramanızla eşleşen ürün bulunamadı. Lütfen teriminizi değiştirip tekrar deneyin.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map(renderSearchResultItem)}
                  </div>
                  <div className="flex items-center justify-center pt-8 border-t border-white/5 space-x-3">
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Sitede</span>
                    <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{searchResults.length} sonuç</span>
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">bulundu</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBİL MENÜ */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[80px] bg-[#050810] z-[99] lg:hidden overflow-y-auto pb-20">
          <div className="p-4">
            {navigation.map((cat) => (
              <div key={cat.name} className="border-b border-white/5">
                <button onClick={() => setOpenSub(openSub === cat.name ? null : cat.name)} className="w-full flex justify-between items-center py-5">
                  <span className="text-base font-medium text-slate-200">{cat.name}</span>
                  <svg className={`w-5 h-5 transition-transform duration-200 ${openSub === cat.name ? 'rotate-90 text-blue-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                {openSub === cat.name && (
                  <div className="pb-5 pl-4 flex flex-col gap-4">
                    {cat.subs.map((sub) => (
                      <Link key={sub} href="#" className="text-slate-400 text-sm transition-colors">{sub}</Link>
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
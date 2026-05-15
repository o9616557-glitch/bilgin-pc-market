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

const quickSearches = ["Ekran Kartı", "RTX", "Gaming Laptop", "Monitör", "Kasa"];
const featuredCategories = ["Masaüstü Bilgisayarlar", "Laptop Bilgisayar", "Bilgisayar Ekipmanları"];

export default function Header() {
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  // ARAMA EKRANI İÇİN DEĞİŞKENLER
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false); // Yükleniyor efekti için
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  const activeNavData = navigation.find(item => item.name === activeHover);

  // Arama açılınca otomatik imleci kutuya koyar, ESC'ye basınca kapatır
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSearchOpen && event.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // CANLI ARAMA MOTORU (WordPress'e Bağlanıyor)
  useEffect(() => {
    // 3 harften az yazılırsa veya boşsa API'yi yorma
    if (searchTerm.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    
    // Kullanıcı yazmayı bıraktıktan yarım saniye sonra WooCommerce'e istek atar
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${searchTerm}`);
        const data = await res.json();
        setSearchResults(data || []);
      } catch (error) {
        console.error("Ürünler çekilemedi:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // GERÇEK ÜRÜN KARTINI EKRANA BASMA (WooCommerce Verileriyle)
  const renderProductCard = (product: any) => {
    // WooCommerce'den gelen resim varsa kullan, yoksa boş resim koy
    const productImage = product.images && product.images.length > 0 
      ? product.images[0].src 
      : "https://via.placeholder.com/300x300/0b1120/ffffff?text=Gorsel+Yok";

    // WooCommerce kategorisi varsa yazdır
    const categoryName = product.categories && product.categories.length > 0 
      ? product.categories[0].name 
      : "Donanım";

    return (
      <div key={product.id} className="bg-white/5 border border-white/5 hover:border-white/10 p-5 rounded-3xl group/card transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl">
        <div className="space-y-1">
          <div className="w-full h-48 bg-[#050810] border border-white/5 rounded-3xl overflow-hidden mb-4 p-4 flex items-center justify-center">
              <img src={productImage} alt={product.name} className="max-w-full max-h-full object-contain group-hover/card:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{categoryName}</span>
              <h4 className="text-sm font-bold italic tracking-tighter uppercase text-white leading-tight group-hover/card:text-blue-500 transition-colors line-clamp-2">
                {product.name}
              </h4>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5 mt-auto">
          <span className="text-xl font-black text-green-500 tracking-tighter">{product.price} TL</span>
          <Link href={`/product/${product.id}`} onClick={() => setIsSearchOpen(false)} className="w-32 py-3 bg-green-500 text-black font-black uppercase rounded-xl hover:scale-105 transition-transform text-[11px] tracking-widest flex items-center justify-center">
            İncele
          </Link>
        </div>
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
              className="h-full flex items-center px-1.5 xl:px-3 cursor-pointer relative"
              onMouseEnter={() => setActiveHover(item.name)}
            >
              <Link 
                href="#" 
                className={`text-[11px] xl:text-[12px] font-medium capitalize tracking-tight whitespace-nowrap transition-colors ${activeHover === item.name ? "text-white" : "text-slate-300 hover:text-white"}`}
              >
                {item.name}
              </Link>
              {activeHover === item.name && (
                <div className="absolute top-[80%] left-0 w-full h-px bg-blue-500 transition-transform origin-left scale-x-100"></div>
              )}
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
          
          {/* SEARCH İKONU */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {/* HESABIM */}
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
                <Link href="/giris" className="px-5 py-4 text-xs font-black text-green-500 hover:bg-green-500/10 tracking-widest transition-colors">Giriş Yap</Link>
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

      {/* DEV EKRAN ARAMA SAYFASI (WordPress'e Canlı Bağlı) */}
      {isSearchOpen && (
        <div ref={searchOverlayRef} className="fixed inset-0 bg-[#050810]/95 z-[200] overflow-y-auto backdrop-blur-md animate-in fade-in">
          
          <div className="sticky top-0 w-full h-20 px-5 border-b border-white/5 flex items-center justify-between z-10 bg-[#050810]/80">
            <Link href="/" onClick={() => setIsSearchOpen(false)} className="text-xl font-black italic tracking-tighter">
                BİLGİN<span className="text-blue-500 not-italic">PC</span>
            </Link>
            
            <div className="flex space-x-4 items-center">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-widest hidden md:block">[ESC] Kapat</span>
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center p-2 text-slate-300 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>
          
          <div className="max-w-[1400px] mx-auto p-5 md:p-10 pt-16 flex flex-col md:flex-row gap-12">
            
            <aside className="w-full md:w-1/4 space-y-12">
                <div className="space-y-4">
                  <h3 className="text-[11px] text-blue-500 font-black uppercase tracking-widest border-b border-white/5 pb-3">Popüler Aramalar</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {quickSearches.map(term => (
                      <button key={term} onClick={() => setSearchTerm(term)} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-slate-300 hover:text-white hover:border-white/10 hover:bg-white/10 text-xs font-medium capitalize transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] text-slate-500 font-black uppercase tracking-widest border-b border-white/5 pb-3">Öne Çıkan Kategoriler</h3>
                  <div className="flex flex-col gap-2.5">
                    {featuredCategories.map(cat => (
                      <Link key={cat} href="#" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-2.5 text-slate-300 hover:text-white font-medium text-sm capitalize group/link transition-colors">
                        <svg className="w-4 h-4 text-slate-600 group-hover/link:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
            </aside>

            <main className="w-full md:w-3/4 space-y-12">
                
                <div className="relative max-w-3xl">
                  <input 
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Sistem, marka veya donanım ara..." 
                    className="w-full bg-[#0b1120] p-6 pl-20 rounded-2xl text-2xl md:text-3xl font-black italic text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 border border-white/5 transition-all"
                  />
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2">
                    {/* YÜKLENİYOR İKONU (Gerçekten aranırken döner) */}
                    {isSearching ? (
                        <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-t-2 border-b-2 border-blue-500"></div>
                    ) : (
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    )}
                  </div>
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-slate-500 hover:text-white transition-colors">
                      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

                {/* SONUÇLAR */}
                <div className="space-y-10">
                  {searchTerm.length < 3 ? (
                    <div className="text-center py-20 text-slate-500 font-medium italic text-lg bg-white/5 rounded-3xl border border-white/5">
                        Aramaya başlamak için en az 3 harf yazın... (Örn: "RTX", "Laptop", "Asus")
                    </div>
                  ) : searchResults.length === 0 && !isSearching ? (
                    <div className="text-center py-20 text-slate-400 font-medium bg-white/5 rounded-3xl border border-white/5">
                        Aradığınız kriterlere uygun ürün bulunamadı. Lütfen farklı bir kelime deneyin.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map(renderProductCard)}
                      </div>
                      
                      {!isSearching && searchResults.length > 0 && (
                          <div className="flex items-center justify-center pt-8 border-t border-white/5 space-x-3">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sistemde</span>
                            <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{searchResults.length} sonuç</span>
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">bulundu</span>
                          </div>
                      )}
                    </>
                  )}
                </div>
            </main>

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
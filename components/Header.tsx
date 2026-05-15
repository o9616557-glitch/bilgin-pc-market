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
  
  // ARAMA STATELERİ
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeNavData = navigation.find(item => item.name === activeHover);

  // GERÇEK ÜRÜN ÇEKME FONKSİYONU (API Bağlantısı)
  const fetchProducts = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      // Şefim buraya kendi site adresini ve API bilgilerini içeren Next.js API rotanı bağlayabilirsin.
      // Örnek olarak /api/search?q=query şeklinde bir yapı en sağlıklısıdır.
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Arama hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Yazma durduktan 500ms sonra aramayı başlatır (Sistemi yormaz)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) fetchProducts(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  // ÜRÜN KARTI
  const renderProductCard = (product: any) => (
    <Link 
      key={product.id} 
      href={`/product/${product.id}`}
      onClick={() => setIsSearchOpen(false)}
      className="bg-white/5 border border-white/5 hover:border-blue-500/30 p-4 rounded-3xl group transition-all flex flex-col justify-between space-y-4 shadow-xl"
    >
      <div className="w-full h-40 bg-black/40 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
        <img src={product.images?.[0]?.src || "/placeholder.png"} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white line-clamp-2 uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors">{product.name}</h4>
        <p className="text-lg font-black text-green-500">{product.price} TL</p>
      </div>
      <button className="w-full py-2.5 bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[10px] font-black uppercase rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
        İNCELE
      </button>
    </Link>
  );

  return (
    <header className="w-full bg-[#050810] border-b border-white/5 sticky top-0 z-[100]">
      <div className="max-w-[1400px] mx-auto px-4 xl:px-5 h-20 flex items-center justify-between relative">
        
        {/* LOGO */}
        <div className="flex items-center flex-shrink-0">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white lg:hidden p-2 -ml-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href="/" className="text-xl lg:text-2xl font-black italic tracking-tighter text-white">
            BİLGİN<span className="text-blue-500 not-italic uppercase">PC</span>
          </Link>
        </div>

        {/* MENÜ (Kataloglar Arası Sabit Geçişli) */}
        <nav className="hidden lg:flex items-center justify-center flex-1 h-full mx-2" onMouseLeave={() => setActiveHover(null)}>
          {navigation.map((item) => (
            <div key={item.name} className="h-full flex items-center px-1.5 xl:px-3 cursor-pointer" onMouseEnter={() => setActiveHover(item.name)}>
              <Link href="#" className={`text-[11px] xl:text-[12px] font-medium capitalize tracking-tight whitespace-nowrap transition-colors ${activeHover === item.name ? "text-white" : "text-slate-300 hover:text-white"}`}>
                {item.name}
              </Link>
            </div>
          ))}

          {/* MEGA MENÜ */}
          <div className={`absolute top-full left-0 w-full bg-[#0b0f1a] border-t border-white/10 shadow-2xl z-[110] transition-all duration-200 ${activeHover ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
            {activeNavData && (
              <div className="max-w-[1400px] mx-auto px-10 py-10 flex gap-10">
                <div className="w-1/3 flex flex-col gap-4">
                  <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-white/5 pb-2">Keşfet</h3>
                  <div className="flex flex-col gap-2.5">
                    {activeNavData.subs.map((sub) => (
                      <Link key={sub} href="#" className="flex items-center justify-between text-slate-300 hover:text-white font-medium text-sm capitalize group/link">
                        {sub}
                        <svg className="w-4 h-4 text-slate-700 group-hover/link:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="w-px bg-white/5"></div>
                <div className="w-2/3 flex flex-col gap-4">
                   <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-white/5 pb-2">Destek ve Keşif</h3>
                   <div className="grid grid-cols-2 gap-4 text-slate-400 text-xs">
                      <Link href="#" className="hover:text-white transition-colors">Tüm Modeller</Link>
                      <Link href="#" className="hover:text-white transition-colors">Yeni Gelenler</Link>
                      <Link href="#" className="hover:text-white transition-colors">Sık Sorulanlar</Link>
                      <Link href="#" className="hover:text-white transition-colors">İletişim</Link>
                   </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* İKONLAR */}
        <div className="flex items-center gap-4 xl:gap-7 flex-shrink-0 relative">
          <button onClick={() => setIsSearchOpen(true)} className="text-slate-400 hover:text-white p-1">
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {/* HESABIM */}
          <div className="relative flex items-center h-full group" onMouseEnter={() => setIsAccountOpen(true)} onMouseLeave={() => setIsAccountOpen(false)} onClick={() => setIsAccountOpen(!isAccountOpen)}>
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

          <Link href="/sepet" className="text-slate-400 hover:text-green-500 relative p-1 transition-colors">
            <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </Link>
        </div>
      </div>

      {/* MODERNA ARAMA SAYFASI (WooCommerce Destekli) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] overflow-y-auto animate-in fade-in duration-300 backdrop-blur-md">
          <div className="max-w-[1400px] mx-auto p-5 md:p-10">
            
            {/* Kapama ve Logo */}
            <div className="flex justify-between items-center mb-16">
              <span className="text-xl font-black italic tracking-tighter text-white">BİLGİN<span className="text-blue-500 not-italic uppercase">PC</span></span>
              <button onClick={() => setIsSearchOpen(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500/20 text-red-500 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-12">
              {/* Sol: Hızlı Seçimler */}
              <div className="w-full md:w-1/4 space-y-8">
                <h3 className="text-[10px] text-blue-500 font-black uppercase tracking-widest border-b border-white/5 pb-2">Hızlı Kategoriler</h3>
                <div className="flex flex-col gap-3">
                  {["Hazır Sistemler", "Ekran Kartları", "Gaming Laptop", "Oyuncu Ekipmanları"].map(item => (
                    <button key={item} onClick={() => setSearchTerm(item)} className="text-left text-slate-400 hover:text-white transition-colors text-sm font-medium">{item}</button>
                  ))}
                </div>
              </div>

              {/* Sağ: Arama ve Ürünler */}
              <div className="w-full md:w-3/4 space-y-10">
                <div className="relative">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ürün veya kategori yazın..." 
                    className="w-full bg-white/5 border-b-2 border-white/10 p-6 text-3xl md:text-5xl font-black italic text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  {isLoading && <div className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchTerm.length < 3 ? (
                    <div className="col-span-full py-20 text-center text-slate-600 italic">Aramak istediğiniz ürünün adını yazın...</div>
                  ) : searchResults.length === 0 && !isLoading ? (
                    <div className="col-span-full py-20 text-center text-slate-500">Aradığınız kriterlere uygun ürün bulunamadı.</div>
                  ) : (
                    searchResults.map(renderProductCard)
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
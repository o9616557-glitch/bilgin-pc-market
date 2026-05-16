"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface FavoriteProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  slug: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Sayfa açıldığında yerel hafızadaki favori ürünleri yükleyen radar
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem("user_favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Favoriler yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Ürünü favorilerden diskalifiye eden fonksiyon
  const handleRemoveFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("user_favorites", JSON.stringify(updatedFavorites));
    
    // Modern Toast Bildirimi
    setToastMessage("Ürün favorilerinizden kaldırıldı. ✓");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Ürünü doğrudan sepete fırlatan fonksiyon
  const handleAddToCart = (product: FavoriteProduct) => {
    try {
      const storedCart = localStorage.getItem("user_cart");
      let cart = storedCart ? JSON.parse(storedCart) : [];
      
      // Ürün sepette zaten var mı kontrolü
      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("user_cart", JSON.stringify(cart));
      
      // Sepet sayacını tetiklemek için global event fırlatıyoruz şefim
      window.dispatchEvent(new Event("cart_updated"));

      setToastMessage("Ürün başarıyla sepetinize eklendi! ✓");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      setToastMessage("Ürün sepete eklenirken bir hata oluştu.");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Favorilerim Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-10 px-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* TERTEMİZ NEON TOAST BİLDİRİMİ */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#0b1120] border border-blue-500/30 text-blue-400 font-black uppercase text-[11px] tracking-wider px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* BAŞLIK ALANI */}
        <div className="border-b border-white/5 pb-5">
          <h1 className="text-2xl font-black uppercase tracking-wide">Favori Ürünlerim</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">İlginizi çeken ve takibe aldığınız tüm donanımlar burada listelenir.</p>
        </div>

        {/* 🌟 DURUM 1: LİSTE BOMBOŞSA ÇALIŞACAK ALAN */}
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-[#0b1120] border border-white/5 rounded-3xl space-y-6 shadow-xl max-w-xl mx-auto">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Listeniz Henüz Boş</h2>
              <p className="text-slate-600 text-[11px] font-medium max-w-xs mx-auto">Takip etmek istediğiniz ürünleri dükkanımızdan seçerek buraya ekleyebilirsiniz.</p>
            </div>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          /* 🌟 DURUM 2: FAVORİDE ÜRÜN VARSA ÇALIŞACAK RESPONSIVE GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-[#0b1120] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between p-4 transition-all hover:border-white/10 group relative shadow-lg">
                
                {/* LİSTEDEN KALDIRMA BUTONU (KUTUNUN SAĞ ÜSTÜNDE ŞIK ÇARPI) */}
                <button 
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 bg-[#050810]/80 backdrop-blur-md border border-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-500/20 transition-all shadow-md"
                  title="Listeden Kaldır"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* ÜRÜN GÖRSELİ VE DETAY KÖPRÜSÜ */}
                <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full bg-[#050810] rounded-xl overflow-hidden mb-4 border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image || "https://via.placeholder.com/300"} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* ÜRÜN KÜNYESİ */}
                <div className="space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${product.slug}`} className="text-white font-bold text-xs uppercase line-clamp-2 tracking-wide hover:text-blue-500 transition-colors">
                      {product.name}
                    </Link>
                  </div>
                  
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fiyat</span>
                    <span className="text-sm font-black text-blue-500 tracking-wide">{product.price} TL</span>
                  </div>
                </div>

                {/* AKSİYON BUTONU (SEPETE FIRLAT) */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-md shadow-blue-600/5 flex items-center justify-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Sepete Ekle
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
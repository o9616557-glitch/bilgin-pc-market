"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart, HeartCrack, ArrowLeft } from "lucide-react";
import { useCart } from "../CartContext"; 

export default function FavorilerPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { sepeteEkle } = useCart();
  const [toastMessage, setToastMessage] = useState("");

  // ŞEFİM: Şimdilik tarayıcı hafızasından çekiyoruz, veritabanına bağlayacağız.
  useEffect(() => {
    const fetchFavs = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("user_favorites") || "[]");
        setFavorites(stored);
      } catch (error) {}
    };
    fetchFavs();
    
    // Ürün sayfasından eklenirse anında burası da güncellensin diye dinleyici
    window.addEventListener("favoritesUpdated", fetchFavs);
    return () => window.removeEventListener("favoritesUpdated", fetchFavs);
  }, []);

  const handleRemove = (id: string) => {
    const updatedFavs = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavs);
    localStorage.setItem("user_favorites", JSON.stringify(updatedFavs));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const handleAddToCart = (product: any) => {
    sepeteEkle({
      id: String(product.id),
      isim: product.name,
      fiyat: Number(product.price),
      resim: product.image,
      varyasyon: "Standart Model"
    });
    
    setToastMessage("✅ Sepete Eklendi!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white p-4 sm:p-8 font-sans overflow-x-hidden">
      
      {/* ŞIK BİLDİRİM EKRANI */}
      <div className={`fixed top-24 right-5 z-[9999] bg-[#10b981] border border-[#10b981]/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-black px-6 py-4 rounded-xl font-black flex items-center gap-3 transition-all duration-500 transform ${toastMessage ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <p className="text-sm tracking-wider uppercase">{toastMessage}</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 text-[#00e5ff] mb-2 hover:underline text-sm font-bold uppercase tracking-wider">
              <ArrowLeft size={16} /> Mağazaya Dön
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              Favori Ürünlerim
            </h1>
            <p className="text-slate-400 text-sm mt-1">Gözüne kestirdiğin efsanevi donanımlar burada şefim.</p>
          </div>
          <div className="bg-[#09090b] border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3">
            <span className="text-2xl">❤️</span>
            <span className="text-xl font-black text-[#00e5ff]">{favorites.length}</span>
            <span className="text-slate-400 text-xs font-bold uppercase">Ürün</span>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#09090b] border border-dashed border-white/10 rounded-3xl">
            <HeartCrack size={64} className="text-slate-700 mb-6" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Favorileriniz Boş</h2>
            <p className="text-slate-400 mb-6 text-center max-w-md">Henüz hiçbir donanımı gözünüze kestirmediniz. Hemen mağazaya dönüp efsanevi parçaları keşfedin!</p>
            <Link href="/" className="bg-[#00e5ff] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#00e5ff]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] flex flex-col">
                
                <div className="relative h-48 bg-white/5 p-4 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                    title="Favorilerden Çıkar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <Link href={`/product/${product.slug}`} className="text-white font-bold text-sm leading-snug mb-3 hover:text-[#00e5ff] transition-colors line-clamp-2 flex-1">
                    {product.name}
                  </Link>
                  
                  <div className="flex items-end justify-between mt-auto mb-4">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-0.5">Fiyat</span>
                      <span className="text-[#00e5ff] font-black text-lg">{product.price.toLocaleString("tr-TR")} TL</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white/5 hover:bg-[#00e5ff] text-white hover:text-black border border-white/10 hover:border-[#00e5ff] py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Sepete Ekle
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
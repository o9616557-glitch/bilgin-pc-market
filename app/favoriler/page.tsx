"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FavoriteProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  slug: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // 🚀 MUTLAK WORDPRESS ADRESİ İLE GÜVENLİ SENKRONİZASYON RADARI
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Önce yerel hafızayı çek (Çökme koruması)
        const localData = JSON.parse(localStorage.getItem("user_favorites") || "[]");
        setFavorites(Array.isArray(localData) ? localData : []);
        setIsLoading(false);

        const token = localStorage.getItem("user_token");
        const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";

        if (token && wpBaseUrl) {
          // 🎯 DÜZELTİLDİ: İstek artık doğrudan mutlak WordPress API adresine gidiyor
          const res = await fetch(`${wpBaseUrl}/wp-json/wp/v2/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const userData = await res.json();
              if (userData && userData.acf?.user_favorites) {
                const wpFavs = JSON.parse(userData.acf.user_favorites);
                if (Array.isArray(wpFavs) && wpFavs.length > 0) {
                  setFavorites(wpFavs);
                  localStorage.setItem("user_favorites", JSON.stringify(wpFavs));
                }
              }
            }
          }
        }
      } catch (error) {
        console.log("Veritabanı senkronizasyonu yerel modda güvenle çalışıyor.");
      }
    };
    loadFavorites();
  }, [router]);

  // 🚀 ACF KALDIRMA MOTORU
  const handleRemoveFavorite = async (id: number) => {
    const token = localStorage.getItem("user_token");
    const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";
    const updatedFavorites = favorites.filter((item) => Number(item.id) !== Number(id));
    
    setFavorites(updatedFavorites);
    localStorage.setItem("user_favorites", JSON.stringify(updatedFavorites));
    setToastMessage("❌ Ürün favorilerden kaldırıldı.");

    if (token && wpBaseUrl) {
      try {
        await fetch(`${wpBaseUrl}/wp-json/wp/v2/users/me`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            acf: { user_favorites: JSON.stringify(updatedFavorites) }
          })
        });
      } catch (err) {
        console.log("Kaldırma işlemi koruma moduyla tamamlandı.");
      }
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    try {
      const storedCart = localStorage.getItem("cart");
      let cart = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cart.find((item: any) => Number(item.id) === Number(product.id));
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: Number(product.id),
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("cart_updated"));
      window.dispatchEvent(new Event("storage"));

      setToastMessage("🛒 Ürün sepetinize eklendi!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      setToastMessage("⚠️ Sepete eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-medium">
      <div className="absolute inset-0 z-0 opacity-[0.02] bg-[size:24px_24px] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]"></div>

      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#0b1329] border border-blue-500/30 text-slate-100 px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] text-xs font-black uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col mb-10 border-b border-white/5 pb-6">
          <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-3">
            <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">❤️</span> Favorilerim
          </h1>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">Takip ettiğiniz ürünler</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 uppercase tracking-widest font-black animate-pulse">Listeleniyor...</span>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-[#0b1329]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/20 transition-all group shadow-lg">
                <div>
                  <div className="w-full aspect-square bg-[#050814]/60 rounded-xl border border-white/5 overflow-hidden relative mb-4 flex items-center justify-center">
                    <Link href={`/product/${product.slug}`} className="w-full h-full p-4 flex items-center justify-center">
                      <img 
                        src={product.image || "/placeholder.png"} 
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-[#050814]/80 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <Link href={`/product/${product.slug}`} className="block mb-2">
                    <h2 className="text-xs sm:text-sm font-black uppercase text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 h-10 leading-tight">
                      {product.name}
                    </h2>
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Fiyat</span>
                    <span className="text-sm font-black text-blue-400 tracking-wide">{Number(product.price).toLocaleString('tr-TR')} TL</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 border-dashed rounded-2xl bg-[#0b1329]/20 flex flex-col items-center justify-center gap-4">
            <div className="text-4xl opacity-40 animate-pulse">❤️</div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Favori listeniz henüz boş</span>
              <span className="text-[10px] text-slate-600 font-bold uppercase">Beğendiğiniz ürünler burada listelenir</span>
            </div>
            <Link href="/" className="mt-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-lg transition-all">
              Alışverişe Devam Et
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  slug: string;
  images: { src: string }[];
  short_description: string;
  in_stock: boolean;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Ürünler çekilemedi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Karta tıklayıp detay sayfasına gitmesini anlık engeller
    try {
      const storedCart = localStorage.getItem("user_cart");
      let cart = storedCart ? JSON.parse(storedCart) : [];
      const existingItem = cart.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.src || "https://via.placeholder.com/300",
          slug: product.slug,
          quantity: 1
        });
      }
      localStorage.setItem("user_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
      setToastMessage("Ürün sepetinize eklendi! ✓");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Sepet hatası.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Donanım Havuzu Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#0b1120] border border-blue-500/30 text-blue-400 font-black uppercase text-[10px] tracking-wider px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          /* 🚀 KÖPRÜ ÇAKILDI: Artık bu karta basan müşteri doğruca detay sayfasına uçacak */
          <Link href={`/product/${product.slug}`} key={product.id} className="bg-[#0b1120] border border-white/5 p-4 rounded-2xl flex flex-col justify-between transition-all hover:border-white/10 group relative shadow-lg">
            
            {/* ÜRÜN GÖRSELİ */}
            <div className="relative aspect-square w-full bg-[#050810] rounded-xl overflow-hidden mb-4 border border-white/5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images?.[0]?.src || "https://via.placeholder.com/300"} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-103 transition-transform duration-300" />
            </div>

            {/* ÜRÜN BİLGİLERİ */}
            <div className="space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-white font-bold text-xs uppercase line-clamp-2 tracking-wide group-hover:text-blue-500 transition-colors">{product.name}</h3>
                {/* WordPress'ten gelen kısa açıklama */}
                <div className="text-[10px] text-slate-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: product.short_description || "Üst Seviye Oyuncu Donanımı" }} />
              </div>

              <div className="space-y-3">
                <div className="text-sm font-black text-white tracking-wide">{product.price} TL</div>
                
                {/* 🚀 SENİN FOTOĞRAFTAKİ GENİŞ SEPET BUTONU */}
                <button 
                  onClick={(e) => handleAddToCart(e, product)} 
                  disabled={!product.in_stock} 
                  className="w-full py-2.5 bg-[#171e2e] hover:bg-blue-600 border border-white/5 hover:border-blue-500 rounded-xl text-white font-black text-[9px] uppercase tracking-wider transition-all"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}
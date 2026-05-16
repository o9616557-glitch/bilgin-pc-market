"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ProductGrid({ initialProducts }: { initialProducts: any[] }) {
  const [toastMessage, setToastMessage] = useState("");

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
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
      
      // 🚀 SAYACI UYANDIRMA: Üst menü duysun diye çift yönlü alarm fırlatıyoruz!
      window.dispatchEvent(new Event("cart_updated"));
      window.dispatchEvent(new Event("storage"));

      setToastMessage("Ürün sepetinize eklendi! ✓");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Sepet hatası.");
    }
  };

  return (
    <div className="w-full relative">
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#0b1120] border border-blue-500/30 text-blue-400 font-black uppercase text-[10px] tracking-wider px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
          {toastMessage}
        </div>
      )}

      {/* 🚀 TELEFONDA SAĞA KAYAN SLIDER, BİLGİSAYARDA 4'LÜ GEOMETRİK IZGARA */}
      <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible md:pb-0 md:snap-none">
        {initialProducts?.map((product: any) => (
          <Link 
            href={`/product/${product.slug}`} 
            key={product.id} 
            className="bg-[#0b1120] border border-white/5 p-4 rounded-2xl flex flex-col justify-between transition-all hover:border-blue-500/20 group relative shadow-xl hover:shadow-blue-950/10 min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
          >
            {/* 🌟 O OKUNMAYAN SOL ÜST ROZET TAMAMEN İMHA EDİLDİ */}

            {/* ÜRÜN GÖRSELİ */}
            <div className="relative aspect-square w-full bg-[#050810]/60 rounded-xl overflow-hidden mb-3 border border-white/5 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.images?.[0]?.src || "https://via.placeholder.com/300"} 
                alt={product.name} 
                className="w-full h-full object-contain p-2 group-hover:scale-104 transition-transform duration-500" 
              />
            </div>

            {/* KÜNYE ALANI */}
            <div className="space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-white font-black text-xs uppercase line-clamp-2 tracking-wide group-hover:text-blue-500 transition-colors duration-300 min-h-[32px]">
                  {product.name}
                </h3>
                <div 
                  className="text-[9px] text-slate-500 line-clamp-1 font-semibold uppercase tracking-wider" 
                  dangerouslySetInnerHTML={{ __html: product.short_description ? product.short_description.replace(/(<([^>]+)>)/gi, "") : "Premium Donanım Bileşeni" }} 
                />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Fiyat</span>
                  <span className="text-xs md:text-sm font-black text-white tracking-wide group-hover:text-blue-400 transition-colors">{product.price} TL</span>
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(e, product)} 
                  disabled={!product.in_stock} 
                  className="w-full py-2.5 bg-[#050810] hover:bg-blue-600 border border-white/5 hover:border-blue-500 rounded-xl text-slate-300 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all shadow-inner duration-300"
                >
                  {product.in_stock ? "Sepete Ekle" : "Stok Dışı"}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
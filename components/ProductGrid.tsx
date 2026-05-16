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
      window.dispatchEvent(new Event("cart_updated"));
      window.dispatchEvent(new Event("storage"));
      setToastMessage("Sisteme eklendi ✓");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Sepet hatası.");
    }
  };

  return (
    <div className="w-full relative">
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#070b14]/90 backdrop-blur-md border border-blue-500/30 text-blue-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {initialProducts?.map((product: any) => (
          <Link 
            href={`/product/${product.slug}`} 
            key={product.id} 
            className="group relative bg-[#0b1120]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-3 md:p-5 flex flex-col justify-between transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 flex items-center justify-center p-3 md:p-4 bg-gradient-to-b from-[#050810] to-transparent border border-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images?.[0]?.src || "https://via.placeholder.com/300"} alt={product.name} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out" />
            </div>

            <div className="space-y-3 flex-grow flex flex-col justify-between relative z-10">
              <div className="space-y-1.5">
                <h3 className="text-white font-bold text-[10px] md:text-xs uppercase line-clamp-2 tracking-wide group-hover:text-blue-400 transition-colors duration-300 min-h-[34px]">
                  {product.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-3">
                {/* 🚀 FİYAT ALANI TERTEMİZ OLDU VE RENGİ GÜNCELLENDİ */}
                <div className="flex items-end gap-1">
                  <span className="text-xs md:text-sm font-black text-white tracking-wide">
                    {product.price}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold text-blue-500 mb-[1px]">TL</span>
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(e, product)} 
                  disabled={!product.in_stock} 
                  className="w-full py-2.5 md:py-3 rounded-xl border border-white/5 bg-white/[0.02] text-slate-300 text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-blue-600/10 group-hover:border-blue-500/30 group-hover:text-blue-400"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {product.in_stock ? "Sepete At" : "Tükendi"}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
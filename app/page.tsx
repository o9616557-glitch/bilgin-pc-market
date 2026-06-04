"use client";

import React, { useState } from "react";
import { ShoppingCart, Heart, GitCompare, Eye, Star, Zap } from "lucide-react";

export default function UltimateProductCard() {
  // Örnek Ürün Verisi (Dinamik yapıya kolayca bağlanır)
  const product = {
    brand: "ASUS ROG",
    title: "GeForce RTX 5090 24GB GDDR7 384 Bit Ekran Kartı",
    oldPrice: "85.000",
    price: "79.999",
    discount: 6,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop",
    inStock: true,
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#050505] p-6 font-sans">
      
      {/* 🚀 ULTIMATE KART BAŞLANGICI 🚀 */}
      <div 
        className="group relative w-full max-w-[320px] bg-[#09090b] rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-[#00d2ff]/40 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Görsel Alanı */}
        <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-6 overflow-hidden">
          
          {/* Zarif ve Premium İndirim Rozeti (Glassmorphism) */}
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-red-500/10 backdrop-blur-md border border-red-500/20 px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span className="text-red-500 text-[11px] font-black tracking-wider">% {product.discount} İNDİRİM</span>
            </div>
          )}

          {/* Stok Durumu */}
          <div className="absolute top-4 right-4 z-20">
             <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" title="Stokta Var"></div>
          </div>

          {/* Ürün Görseli (Hover anında hafifçe büyür) */}
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Hızlı Eylem Menüsü (Sadece Hover anında aşağıdan kayarak gelir) */}
          <div className={`absolute bottom-4 left-0 w-full flex justify-center gap-3 transition-all duration-300 z-30 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            <button className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#00d2ff] hover:text-[#00d2ff] text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]" title="Favorilere Ekle">
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#00d2ff] hover:text-[#00d2ff] text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]" title="Karşılaştır">
              <GitCompare className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#00d2ff] hover:text-[#00d2ff] text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]" title="Hızlı İncele">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* İçerik ve Bilgi Alanı */}
        <div className="p-5">
          {/* Marka ve Yıldızlar */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase">{product.brand}</span>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
              <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Ürün Başlığı */}
          <h3 className="text-white text-sm font-bold leading-relaxed line-clamp-2 mb-4 group-hover:text-[#00d2ff] transition-colors">
            {product.title}
          </h3>

          {/* Fiyat ve Sepet Butonu Alanı */}
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5">
            <div className="flex flex-col">
              {product.discount > 0 && (
                <span className="text-gray-600 text-xs line-through font-medium mb-0.5">{product.oldPrice} ₺</span>
              )}
              <span className="text-2xl font-black text-white leading-none">
                {product.price} <span className="text-sm text-[#00d2ff]">₺</span>
              </span>
            </div>

            {/* Dinamik Sepet Butonu */}
            <button className="relative overflow-hidden w-11 h-11 bg-white/5 border border-white/10 hover:bg-[#00d2ff] hover:border-[#00d2ff] rounded-xl flex items-center justify-center group/btn transition-all duration-300">
              <ShoppingCart className="w-5 h-5 text-gray-300 group-hover/btn:text-black transition-colors z-10" />
            </button>
          </div>
        </div>

      </div>
      {/* 🚀 ULTIMATE KART BİTİŞİ 🚀 */}

    </div>
  );
}
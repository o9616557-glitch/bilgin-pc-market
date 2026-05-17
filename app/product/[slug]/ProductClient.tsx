"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Aradığınız Ürün Bulunamadı Şefim!</h2>
        <button onClick={() => router.push("/")} className="bg-blue-600 px-6 py-2 rounded-lg font-bold">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAddingToCart(true);
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price || product.regular_price,
        image: product.images?.[0]?.src || "/placeholder.png",
        slug: product.slug,
        quantity: quantity
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(currentCart));
    
    setTimeout(() => {
      setAddingToCart(false);
      router.push("/sepet");
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#0b1120] border border-white/5 p-8 rounded-xl">
        
        {/* SOL TARAF: ÜRÜN RESMİ */}
        <div className="flex items-center justify-center bg-[#050810] border border-white/5 p-4 rounded-xl overflow-hidden aspect-square">
          <img 
            src={product.images?.[0]?.src || "/placeholder.png"} 
            alt={product.name} 
            className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* SAĞ TARAF: ÜRÜN BİLGİLERİ */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {product.name}
            </h1>
            
            <div className="text-2xl font-black text-emerald-400 mb-6">
              {Number(product.price || product.regular_price).toLocaleString('tr-TR')} TL
            </div>

            <div className="border-t border-white/5 pt-6 mb-6">
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-2">Ürün Açıklaması</h3>
              <div 
                className="text-slate-300 text-sm leading-relaxed space-y-2 prose prose-invert"
                dangerouslySetInnerHTML={{ __html: product.description || "Bu ürün için bir açıklama girilmemiş şefim." }}
              />
            </div>
          </div>

          {/* ADET SEÇİMİ VE SEPETE EKLE BUTONU */}
          <div className="border-t border-white/5 pt-6 mt-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-bold uppercase text-slate-400">ADET:</span>
              <div className="flex items-center bg-[#050810] border border-white/10 rounded-lg">
                <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-3 py-1 font-bold text-xl hover:text-blue-500">-</button>
                <span className="px-4 font-black text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 font-bold text-xl hover:text-blue-500">+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl uppercase tracking-wider transition-colors duration-200 disabled:opacity-50"
            >
              {addingToCart ? "Sepete Ekleniyor..." : "GÜVENLİ ŞEKİLDE SEPETE EKLE"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
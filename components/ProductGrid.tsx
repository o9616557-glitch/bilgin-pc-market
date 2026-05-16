"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  slug: string;
  images: { src: string }[];
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
        console.error("Ürün vitrini yüklenemedi.");
      } finally { // 🚀 İŞTE BURASI DÜZELDİ ŞEFİM: İKİ 'L' İLE finally YAPILDI
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
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
      setToastMessage(`${product.name.substring(0, 15)}... Sepete Eklendi! ✓`);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Hızlı sepet hatası.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#0b1120] border border-blue-500/30 text-blue-400 font-black uppercase text-[10px] tracking-wider px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/product/${product.slug}`} key={product.id} className="bg-[#0b1120] border border-white/5 p-4 rounded-2xl flex flex-col justify-between transition-all hover:border-white/10 group relative shadow-lg">
            <div className="relative aspect-square w-full bg-[#050810] rounded-xl overflow-hidden mb-4 border border-white/5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images?.[0]?.src || "https://via.placeholder.com/300"} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-103 transition-transform duration-300" />
            </div>

            <div className="space-y-3 flex-grow flex flex-col justify-between">
              <h3 className="text-white font-bold text-xs uppercase line-clamp-2 tracking-wide group-hover:text-blue-500 transition-colors">{product.name}</h3>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm font-black text-blue-500 tracking-wide">{product.price} TL</span>
                <button onClick={(e) => handleQuickAddToCart(e, product)} disabled={!product.in_stock} className="p-2.5 bg-white/5 hover:bg-blue-600 border border-white/5 hover:border-blue-500 rounded-xl text-slate-400 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
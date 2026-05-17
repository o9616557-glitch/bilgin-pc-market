"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductSliderProps {
  initialProducts: any[];
}

export default function ProductSlider({ initialProducts }: ProductSliderProps) {
  const router = useRouter();

  // ⚡ Sepete Ekleme Motoru (Artık sunucudan gelen temiz veriyle çalışıyor)
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault(); // Karta tıklama efektini engeller, sadece sepeti çalıştırır
    
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price?.replace(/\./g, '').replace(/,/g, '.'), 
        image: product.images?.[0]?.src || "/placeholder.png",
        slug: product.slug,
        quantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(currentCart));
    router.push("/sepet");
  };

  if (!initialProducts || initialProducts.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto px-5 py-16">
      
      {/* BAŞLIK ALANI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white">
          Yeni Gelen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 pr-2">Sistemler</span>
        </h2>
        <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 w-max">
          Tümünü Gör 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ANINDA AÇILAN MERMİ AKIŞ */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {initialProducts.map((product) => {
          
          const temizAciklama = product.short_description
            ? product.short_description.replace(/<\/?[^>]+(>|$)/g, "")
            : "Üst Seviye Deneyim ve Güncel Teknolojiler...";

          return (
            <Link
              href={`/product/${product.slug}`} // %100 Hatasız Canlı WordPress Linki
              key={product.id}
              className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] flex flex-col flex-shrink-0 snap-start bg-[#0b0f1a] border border-white/5 rounded-2xl p-4 group hover:border-white/20 transition-all hover:-translate-y-1 duration-300"
            >
              {/* ÜRÜN RESMİ */}
              <div className="w-full h-[200px] bg-[#050810] rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
                <img
                  src={product.images?.[0]?.src || "/placeholder.png"}
                  alt={product.name}
                  className="object-contain h-full p-4 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-bold text-white uppercase tracking-wider">
                    İncele
                  </span>
                </div>
              </div>

              {/* ÜRÜN METİNLERİ */}
              <div className="flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight min-h-[40px] group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mt-1">
                    {temizAciklama}
                  </p>
                </div>

                {/* FİYAT VE SEPETE EKLE */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-white">
                    {product.price} TL
                  </span>
                  
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:scale-105 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 z-10"
                    title="Sepete Ekle"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
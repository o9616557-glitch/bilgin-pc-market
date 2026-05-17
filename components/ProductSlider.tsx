"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductSlider() {
  const router = useRouter();
  const [urunler, setUrunler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ⚡ ADIM 1: Ürünleri Doğrudan Canlı WordPress Veritabanından Çekiyoruz
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
        const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";
        const SITE_URL = "https://bilginpcmarket.com";

        // WooCommerce'den en son eklenen yayınlanmış 6 ürünü çekiyoruz
        const res = await fetch(
          `${SITE_URL}/wp-json/wc/v3/products?per_page=6&status=publish&consumer_key=${CK}&consumer_secret=${CS}`,
          { next: { revalidate: 3600 } } // Performans için 1 saat Vercel hafızasında tutar
        );
        
        const data = await res.json();
        if (res.ok) {
          setUrunler(data);
        }
      } catch (error) {
        console.error("Canlı vitrin verisi çekilirken hata oluştu şefim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveProducts();
  }, []);

  // ⚡ ADIM 2: Sepete Ekleme Motoru (Ürün sayfasıyla birebir aynı sistem)
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault(); // 🚀 ÇOK ÖNEMLİ: Artı butonuna basınca detay sayfasına gitmesini engeller!
    
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price || product.regular_price,
        image: product.images?.[0]?.src || "/placeholder.png",
        slug: product.slug,
        quantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(currentCart));
    router.push("/sepet"); // Sepete ekleyip anında fırlatıyoruz şefim
  };

  // ⚡ ADIM 3: Yüklenirken Tasarım Bozulmasın Diye Şık İskelet (Skeleton) Ekranı
  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-5 py-16 animate-pulse">
        <div className="h-8 bg-white/5 w-64 rounded-lg mb-8"></div>
        <div className="flex gap-6 overflow-x-auto pb-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="min-w-[320px] w-[320px] h-[380px] bg-[#0b0f1a] border border-white/5 rounded-2xl p-4">
              <div className="w-full h-[200px] bg-[#050810] rounded-xl mb-4"></div>
              <div className="h-4 bg-white/5 w-3/4 rounded mb-2"></div>
              <div className="h-3 bg-white/5 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!urunler || urunler.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto px-5 py-16">
      
      {/* BAŞLIK VE TÜMÜNÜ GÖR ALANI */}
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

      {/* CANLI ÜRÜN SLIDER AKIŞI */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {urunler.map((product) => {
          
          // WordPress'ten gelen HTML açıklamayı düz metne çeviren sihir
          const temizAciklama = product.short_description
            ? product.short_description.replace(/<\/?[^>]+(>|$)/g, "")
            : "Üst Seviye Deneyim ve Güncel Teknolojiler...";

          return (
            <Link
              href={`/product/${product.slug}`} // 🚀 ARTIK %100 GERÇEK WORDPRESS LINKI! Asla şaşmaz.
              key={product.id}
              className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] flex flex-col flex-shrink-0 snap-start bg-[#0b0f1a] border border-white/5 rounded-2xl p-4 group hover:border-white/20 transition-all hover:-translate-y-1 duration-300"
            >
              {/* ÜRÜN GÖRSELİ */}
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

                {/* FİYAT VE SEPETE EKLEME ARTISI */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-white">
                    {Number(product.price || product.regular_price).toLocaleString('tr-TR')} TL
                  </span>
                  
                  {/* 🚀 İşte can veren o sepet butonu */}
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
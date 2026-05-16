"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 1. Ortak API motorundan tek ürünü slug parametresiyle çeken sistem
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data);
          
          // Bu ürün zaten favorilerde mi kontrolü
          const storedFavs = localStorage.getItem("user_favorites");
          if (storedFavs) {
            const favs = JSON.parse(storedFavs);
            const found = favs.some((item: any) => item.id === data.id);
            setIsFavorite(found);
          }
        } else {
          setError(data.error || "Ürün bilgileri yüklenemedi.");
        }
      } catch (err) {
        setError("Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // SEPETE EKLEME MOTORU
  const handleAddToCart = () => {
    if (!product) return;

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
      
      // Üst menüdeki sepet sayacını tetikle
      window.dispatchEvent(new Event("cart_updated"));

      setToastMessage("Ürün başarıyla sepetinize eklendi! ✓");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setToastMessage("Sepete eklenirken bir sorun oluştu.");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  // FAVORİLERE EKLEME / KALDIRMA MOTORU
  const handleToggleFavorite = () => {
    if (!product) return;

    try {
      const storedFavs = localStorage.getItem("user_favorites");
      let favs = storedFavs ? JSON.parse(storedFavs) : [];

      if (isFavorite) {
        favs = favs.filter((item: any) => item.id !== product.id);
        setIsFavorite(false);
        setToastMessage("Ürün favorilerinizden kaldırıldı.");
      } else {
        favs.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.src || "https://via.placeholder.com/300",
          slug: product.slug
        });
        setIsFavorite(true);
        setToastMessage("Ürün favorilerinize eklendi! ✓");
      }

      localStorage.setItem("user_favorites", JSON.stringify(favs));
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Favori işlemi başarısız.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Ürün Detayları Yükleniyor...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex items-center justify-center text-amber-500 text-xs font-black uppercase tracking-widest p-4">
        {error || "İlgili ürün bulunamadı."}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] text-white py-10 px-4 font-sans relative overflow-hidden">
      
      {/* MODERN NEON TOAST BİLDİRİMİ */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#0b1120] border border-blue-500/30 text-blue-400 font-black uppercase text-[11px] tracking-wider px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
          {toastMessage}
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-[#0b1120] border border-white/5 rounded-3xl shadow-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        
        {/* SOL TARAF: ÜRÜN GÖRSELİ VE FAVORİ BUTONU */}
        <div className="relative aspect-square w-full bg-[#050810] border border-white/5 rounded-2xl p-6 flex items-center justify-center group overflow-hidden">
          
          <button 
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-lg ${isFavorite ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_#3b82f6]" : "bg-[#050810]/80 border-white/5 text-slate-400 hover:text-white"}`}
            title={isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
          >
            <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.images?.[0]?.src || "https://via.placeholder.com/500"} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
          />
        </div>

        {/* SAĞ TARAF: ÜRÜN BİLGİLERİ */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* STOK DURUMU ROZETİ */}
            <div>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${product.in_stock ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-slate-400 bg-slate-500/10 border-white/5"}`}>
                {product.in_stock ? "Stokta Var" : "Stok Dışı"}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wide leading-tight text-white">{product.name}</h1>
            
            {/* FİYAT ALANI */}
            <div className="py-3 px-5 bg-[#050810] border border-white/5 rounded-2xl inline-block">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Ürün Fiyatı</span>
              <span className="text-xl font-black text-blue-500 tracking-wide mt-0.5 block">{product.price} TL</span>
            </div>

            {/* TEKNİK DETAYLAR */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Teknik Özellikler</span>
              <div 
                className="text-xs text-slate-400 leading-relaxed max-h-[180px] overflow-y-auto pr-2 border-t border-white/5 pt-2"
                dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "Bu ürün için detaylı teknik açıklama bulunmamaktadır." }}
              />
            </div>
          </div>

          {/* SEPETE EKLEME AKSİYONU */}
          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-600 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Sepete Ekle
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
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
      const existingItem = cart.find((item: any) => item.id === product._id || item.id === product.id);

      // ŞEFİM: Sepete atarken indirimli fiyat varsa onu, yoksa normal fiyatı alıyoruz!
      const gecerliFiyat = product.indirimliFiyat ? Number(product.indirimliFiyat) : Number(product.price || product.fiyat);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product._id || product.id,
          name: product.name || product.isim,
          price: gecerliFiyat,
          image: product.images?.[0]?.src || product.resim || "https://via.placeholder.com/300",
          slug: product.slug || product._id,
          quantity: 1
        });
      }

      localStorage.setItem("user_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_updated"));
      window.dispatchEvent(new Event("storage"));
      
      setToastMessage("Sepete eklendi ✓");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Sepet hatası:", err);
    }
  };

  // İndirim oranını hesaplayan ufak bir patron matematiği
  const indirimOraniHesapla = (normal: number, indirimli: number) => {
    if (!normal || !indirimli || normal <= indirimli) return 0;
    return Math.round(((normal - indirimli) / normal) * 100);
  };

  return (
    <div className="w-full relative">
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[9999] bg-[#070b14]/90 backdrop-blur-md border border-blue-500/30 text-blue-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {initialProducts?.map((product: any) => {
          
          // 🚀 ŞEFİN ANASAYFA MATEMATİĞİ (Birebir Aynı Kuruş/İndirim)
    const urunAdi = product.isim || product.name || "İsimsiz Ürün";
    const urunResmi = product.resim || (product.images?.[0]?.src) || "https://via.placeholder.com/300";
    const urunLinki = `/product/${product.slug || product._id}`;

    // Anasayfadaki "regular_price" mantığını vitrine entegre ediyoruz
    const rawNormalFiyat = Number(product.regular_price || product.fiyat || product.price || 0);
    const rawGecerliFiyat = Number(product.indirimliFiyat || product.price || product.fiyat || 0);
    const indirimVarMi = rawNormalFiyat > rawGecerliFiyat;

    // Vitrinin tasarımını hiç bozmadan fiyatları jilet gibi oturtuyoruz:
    const normalFiyat = rawNormalFiyat;
    const indirimliFiyat = indirimVarMi ? rawGecerliFiyat : null; 
    const indirimOrani = indirimVarMi ? Math.round(((rawNormalFiyat - rawGecerliFiyat) / rawNormalFiyat) * 100) : 0;

    // Anasayfadaki stok koruma sistemini (0 veya "0" kontrolü) ekliyoruz
    const stokSifirMi = product.stokAdedi === 0 || product.stokAdedi === "0";
    const tukendiMi = product.stokDurumu === "Tükendi" || stokSifirMi;
          return (
            <Link
              href={urunLinki}
              key={product._id || product.id}
              className="group relative bg-[#0b1120]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-3 md:p-5 flex flex-col justify-between transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] overflow-hidden"
            >
              {/* ŞEFİM: İNDİRİM ROZETİ BURADA! Sadece indirim varsa çıkar */}
              {indirimOrani > 0 && !tukendiMi && (
                <div className="absolute top-3 left-3 z-20 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg shadow-red-500/30">
                  %{indirimOrani} İNDİRİM
                </div>
              )}

              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 flex items-center justify-center p-3 md:p-4 bg-gradient-to-b from-[#050810] to-transparent border border-white/[0.03]">
                <img 
                  src={urunResmi} 
                  alt={urunAdi} 
                  className={`w-full h-full object-contain drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-110 ${tukendiMi ? 'grayscale opacity-50' : ''}`}
                />
              </div>

              <div className="space-y-3 flex-grow flex flex-col justify-between relative z-10">
                <div className="space-y-1.5">
                  <h3 className="text-white font-bold text-[10px] md:text-xs uppercase line-clamp-2 tracking-wide group-hover:text-blue-400 transition-colors duration-300 min-h-[34px]">
                    {urunAdi}
                  </h3>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex flex-col items-start justify-center min-h-[40px]">
                    
                    {/* ŞEFİM: FİYAT ŞOVU BURADA! */}
                    {indirimliFiyat ? (
                      <>
                        {/* Üstü çizili eski fiyat */}
                        <div className="flex items-center gap-1 opacity-50">
                          <span className="text-[10px] md:text-xs font-bold text-red-400 line-through tracking-wide">
                            {normalFiyat.toLocaleString("tr-TR")}
                          </span>
                          <span className="text-[8px] font-bold text-red-400 line-through">TL</span>
                        </div>
                        {/* Neon yeni fiyat */}
                        <div className="flex items-end gap-1">
                          <span className="text-sm md:text-base font-black text-[#00e5ff] tracking-wide shadow-blue-500/50 drop-shadow-md">
                            {indirimliFiyat.toLocaleString("tr-TR")}
                          </span>
                          <span className="text-[10px] font-black text-[#00e5ff] mb-[2px]">TL</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-sm md:text-base font-black text-white tracking-wide">
                          {normalFiyat.toLocaleString("tr-TR")}
                        </span>
                        <span className="text-[10px] font-black text-white mb-[2px]">TL</span>
                      </div>
                    )}

                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={tukendiMi}
                    className={`w-full py-2.5 md:py-3 rounded-xl border flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[8px] md:text-[9px] transition-all duration-300
                      ${tukendiMi 
                        ? 'border-red-500/30 bg-red-500/10 text-red-500 cursor-not-allowed' 
                        : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                      }`}
                  >
                    {!tukendiMi && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    )}
                    {tukendiMi ? "TÜKENDİ" : "Sepete At"}
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeartCrack, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// 🚀 Artık ProductGrid'i kullanmayacağız, bunu import etmeye gerek yok.
// import ProductGrid from "@/components/ProductGrid";

export default function FavorilerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 ŞEFİN VERİ ÇEKME MOTORU (Aynen korundu)
  useEffect(() => {
    if (!isOpen) return; 

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const favRes = await fetch("/api/favorites");
        const favData = await favRes.json();

        if (favRes.ok) {
          const ids = favData.favorites || [];

          if (ids.length > 0) {
            const prodRes = await fetch("/api/products");
            const prodData = await prodRes.json();
            const allProducts = prodData.products || prodData || [];

            const matchedProducts = allProducts.filter((urun: any) =>
              ids.includes(urun._id?.toString()) || ids.includes(urun.id?.toString())
            );

            setFavoriteProducts(matchedProducts);
          } else {
            setFavoriteProducts([]);
          }
        } else if (favRes.status === 401) {
          toast.error("Favorilerinizi görmek için giriş yapmalısınız.");
        }
      } catch (error) {
        toast.error("Veriler yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // 🎨 YENİ TASARIM BAŞLIYOR (image_21.png modeline benzeyen)
    
    // ARKAPLAN KARARTMASI VE BULANIKLIK EFEKTİ (image_17.png'deki gibi)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      
      {/* ANA POPUP KUTUSU (Dar ve dikey, Apple/image_21.png tarzı) */}
      <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] relative flex flex-col max-h-[90vh]">
        
        {/* Kapat (X) Butonu (image_21.png'deki gibi sağ üstte) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-6 text-slate-400 hover:text-white text-4xl font-black transition-all z-50"
        >
          &times;
        </button>

        {/* İÇERİK ALANI (Aşağı kaydırılabilir) */}
        <div className="p-6 md:p-10 overflow-y-auto text-white w-full h-full relative z-10">
          
          {/* BAŞLIK (image_21.png gibi mavi vurgulu) */}
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
            FAVORİ <span className="text-[#00e5ff]">ÜRÜNLERİM</span>
          </h1>

          {/* YÜKLENİYOR DURUMU */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[#00e5ff] animate-spin" />
              <p className="text-slate-400 font-medium">Favori ürünleriniz vitrine diziliyor...</p>
            </div>

          // FAVORİ BOŞ DURUMU
          ) : favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#09090b] border border-white/5 rounded-2xl shadow-inner">
              <HeartCrack className="w-16 h-16 text-slate-600 mb-4" />
              <h2 className="text-xl font-bold mb-2 text-white">Favori Ürününüz Yok</h2>
              <p className="text-slate-400 mb-8 font-medium">Henüz beğendiğiniz bir ürün bulunmuyor.</p>
              <Link 
                href="/" 
                onClick={onClose}
                className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-wider hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
              >
                Alışverişe Başla
              </Link>
            </div>

          // ÜRÜNLER VARSA VİTRİNİ GÖSTER
          ) : (
            // 🚀 TEK SÜTUNLU DİKEY DÜZEN (Izgara kaldırıldı)
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pr-1">
                {favoriteProducts.map((urun: any, index: number) => (
                    // 🚀 TEK ÜRÜN KARTI (image_21.png'den esinlenerek)
                    <div key={index} className="flex flex-col sm:flex-row items-center bg-[#121215] border border-white/10 rounded-xl p-4 gap-4 transition-all hover:border-[#00e5ff]/30 relative shadow-lg">
                        
                        {/* Ürün Resmi */}
                        <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-[#09090b] rounded-lg overflow-hidden border border-white/5 flex items-center justify-center p-2 shadow-inner">
                          <img 
                            src={urun.resim || "/placeholder.jpg"} 
                            alt={urun.isim} 
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Ürün Detayları */}
                        <div className="flex-1 flex flex-col text-center sm:text-left">
                            <h3 className="font-bold text-lg md:text-xl text-white mb-1 leading-tight tracking-tight">{urun.isim}</h3>
                            <div className="text-2xl font-black mt-2 sm:mt-auto tracking-tight">
                                {urun.fiyat.toLocaleString("tr-TR")} TL
                            </div>
                        </div>

                        {/* Favori İşlem Butonları (Resim image_21.png'de yok ama favoriler için şart) */}
                        <div className="flex flex-row sm:flex-col items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 justify-center">
                            <button className="flex-1 sm:w-auto bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black text-xs md:text-sm font-black py-2.5 px-5 rounded-lg transition-all whitespace-nowrap uppercase tracking-wider">
                                Sepete Ekle
                            </button>
                            <button className="text-red-400 hover:text-white text-sm font-bold p-1 transition-all whitespace-nowrap">
                                Kaldır
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
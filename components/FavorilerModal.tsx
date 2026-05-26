"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeartCrack, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// SENİN VİTRİN BİLEŞENİN
import ProductGrid from "@/components/ProductGrid";

export default function FavorilerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 ŞEFİN VERİ ÇEKME MOTORU (Sadece modal açıldığında çalışır)
  useEffect(() => {
    if (!isOpen) return; 

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Önce kullanıcının favori ID'lerini veritabanından çekiyoruz
        const favRes = await fetch("/api/favorites");
        const favData = await favRes.json();

        if (favRes.ok) {
          const ids = favData.favorites || [];

          if (ids.length > 0) {
            // 2. Bütün ürünleri çekiyoruz
            const prodRes = await fetch("/api/products");
            const prodData = await prodRes.json();

            // Gelen verinin yapısına göre ürün dizisini alıyoruz
            const allProducts = prodData.products || prodData || [];

            // 3. Eşleştirme yapıyoruz (Sadece favori olanları ayıklıyoruz)
            const matchedProducts = allProducts.filter((urun: any) =>
              ids.includes(urun._id?.toString()) || ids.includes(urun.id?.toString())
            );

            setFavoriteProducts(matchedProducts); // Vitrin hazır!
          } else {
            setFavoriteProducts([]); // Favori yoksa içini boşalt
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

  // Şalter kapalıyken hiçbir şey gösterme
  if (!isOpen) return null;

  return (
    // 1. UÇAN HALI KATMANI (Arkayı karartır ve her şeyin üstüne çıkar)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      
      {/* 2. ANA SİYAH KUTU (Ekranın ortasındaki jilet gibi tasarım) */}
      <div className="w-full max-w-6xl bg-[#050814] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] relative flex flex-col max-h-[90vh]">
        
        {/* KAPAT (X) BUTONU */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-6 text-slate-400 hover:text-[#00e5ff] text-4xl font-black transition-all z-50"
        >
          &times;
        </button>

        {/* 3. İÇERİK ALANI (Aşağı kaydırılabilir) */}
        <div className="p-6 md:p-12 overflow-y-auto text-white w-full h-full relative z-10">
          
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.3)] border-b border-white/10 pb-4">
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
                onClick={onClose} // Tıklayınca hem anasayfaya gider hem popup'ı kapatır
                className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-wider hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
              >
                Alışverişe Başla
              </Link>
            </div>

          // ÜRÜNLER VARSA VİTRİNİ GÖSTER
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ProductGrid initialProducts={favoriteProducts} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
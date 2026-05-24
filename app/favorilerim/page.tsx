"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeartCrack, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// 🚀 SENİN VİTRİN BİLEŞENİNİ BURAYA ÇAĞIRDIK
import ProductGrid from "@/components/ProductGrid"; 

export default function FavorilerimPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Önce kullanıcının favori ID'lerini veritabanından çekiyoruz
        const favRes = await fetch("/api/favorites");
        const favData = await favRes.json();

        if (favRes.ok) {
          const ids = favData.favorites || [];

          if (ids.length > 0) {
            // 2. BÜTÜN ÜRÜNLERİ ÇEKİYORUZ 
            // ⚠️ ŞEFİM DİKKAT: Sistemindeki tüm ürünleri getiren API adresin "/api/products" değilse, aşağıdaki adresi kendine göre düzelt!
            const prodRes = await fetch("/api/products");
            const prodData = await prodRes.json();
            
            // Gelen verinin yapısına göre ürün dizisini alıyoruz (bazen direkt dizi gelir, bazen obje içinde)
            const allProducts = prodData.products || prodData || [];

            // 3. Tüm ürünlerin içinden sadece kullanıcının favori ID'sine sahip olanları ayıklıyoruz
            const matchedProducts = allProducts.filter((urun: any) => 
              ids.includes(urun._id?.toString()) || ids.includes(urun.id?.toString())
            );
            
            setFavoriteProducts(matchedProducts); // Vitrine gönderilecek ürünler hazır!
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
  }, []);

  return (
    <div className="min-h-screen bg-[#050814] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)] border-b border-white/10 pb-4">
          FAVORİLERİM
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#00e5ff] animate-spin" />
            <p className="text-slate-400">Favori ürünleriniz vitrine diziliyor...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#09090b] border border-white/10 rounded-3xl">
            <HeartCrack className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Favori Ürününüz Yok</h2>
            <p className="text-slate-400 mb-6">Henüz beğendiğiniz bir ürün bulunmuyor.</p>
            <Link href="/" className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          
          // 🚀 İŞTE SENİN EFSANE VİTRİNİN BURADA DEVREYE GİRİYOR!
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <ProductGrid initialProducts={favoriteProducts} />
          </div>

        )}

      </div>
    </div>
  );
}
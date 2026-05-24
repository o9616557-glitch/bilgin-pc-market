"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeartCrack, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function FavorilerimPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        const data = await res.json();

        if (res.ok) {
          setFavoriteIds(data.favorites);
        } else if (res.status === 401) {
          toast.error("Favorilerinizi görmek için giriş yapmalısınız.");
        }
      } catch (error) {
        toast.error("Favoriler yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
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
            <p className="text-slate-400">Favorileriniz yükleniyor...</p>
          </div>
        ) : favoriteIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#09090b] border border-white/10 rounded-3xl">
            <HeartCrack className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Favori Ürününüz Yok</h2>
            <p className="text-slate-400 mb-6">Henüz beğendiğiniz bir ürün bulunmuyor.</p>
            <Link href="/" className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Burada normalde ürün datalarınızı map fonksiyonu ile döneceksiniz.
              Örnek kullanım:
              favoriteIds.map((id) => <UrunKarti key={id} productId={id} />)
            */}
            <div className="bg-[#09090b] p-6 rounded-2xl border border-white/10 text-center text-slate-400">
              <p>Veritabanında {favoriteIds.length} adet favori ürün ID'si bulundu.</p>
              <p className="text-sm mt-2">Bu ID'leri kullanarak ürün kartlarınızı burada listeleyebilirsiniz.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
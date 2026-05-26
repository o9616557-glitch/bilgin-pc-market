"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeartCrack, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext";

export default function FavorilerSayfasi() {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  useEffect(() => {
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
              ids.includes(String(urun._id)) || ids.includes(String(urun.id))
            );

            setFavoriteProducts(matchedProducts);
          } else {
            setFavoriteProducts([]);
          }
        } else if (favRes.status === 401) {
          toast.error("Favorilerinizi görmek için giriş yapmalısınız.");
        }
      } catch (error: any) {
        toast.error("Veriler yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteFavorite = async () => {
    if (!productToDelete) return;

    const targetId = String(productToDelete._id || productToDelete.id);
    
    setFavoriteProducts(prev => prev.filter(p => String(p._id || p.id) !== targetId));
    setProductToDelete(null);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: targetId })
      });

      if (!res.ok) {
        throw new Error("Veritabanı işlemi reddetti");
      }
      
      toast.success("Ürün favorilerden çıkarıldı.");
    } catch (error: any) {
      toast.error("Hata: Ürün veritabanından silinemedi!");
    }
  };

  const handleSepeteEkle = (urun: any) => {
    const targetId = urun._id || urun.id;

    sepeteEkle({
      id: targetId,
      isim: urun.isim || urun.title,
      fiyat: urun.fiyat,
      resim: urun.resim || urun.image,
      adet: 1,
      varyasyon: "Standart" 
    });

    setSepeteEklenenler(prev => [...prev, targetId]);

    setTimeout(() => {
      setSepeteEklenenler(prev => prev.filter(id => id !== targetId));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white pt-8 md:pt-12 pb-12 px-4 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-15 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700 pb-6 mb-8 mt-2">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-[#00e5ff] transition-all mb-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-md">
              FAVORİ <span className="text-[#00e5ff]">ÜRÜNLERİM</span>
            </h1>
          </div>
          <div className="text-white text-sm font-semibold bg-[#121215] border border-slate-600 py-2 px-4 rounded-xl self-start sm:self-center shadow-sm">
            Toplam: <span className="text-[#00e5ff] font-black">{favoriteProducts.length}</span> Ürün
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#121215] border border-slate-700 rounded-2xl">
            <Loader2 className="w-10 h-10 text-[#00e5ff] animate-spin" />
            <p className="text-slate-300 font-medium">Favori ürünleriniz vitrine diziliyor...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center p-12 bg-[#121215] border border-slate-700 rounded-2xl shadow-lg">
            <HeartCrack className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-white">Henüz Favori Ürününüz Yok</h2>
            <p className="text-slate-400 mb-8 font-medium">Beğendiğiniz donanımları kalbe basarak buraya ekleyebilirsiniz.</p>
            <Link href="/" className="inline-block bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-wider hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favoriteProducts.map((urun: any, index: number) => {
              const isAdded = sepeteEklenenler.includes(urun._id || urun.id);

              return (
                <div key={index} className="border border-slate-600 bg-[#121215] rounded-2xl p-4 sm:p-6 transition-all hover:border-[#00e5ff]/50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row sm:items-center gap-4">
                  
                  <div className="w-full sm:w-28 h-36 sm:h-28 bg-[#18181b] rounded-xl border border-slate-700 p-2 flex items-center justify-center shrink-0 mt-0">
                    <img 
                      src={urun.resim || "/placeholder.jpg"} 
                      alt={urun.isim} 
                      className="w-full h-full object-contain drop-shadow-lg" 
                    />
                  </div>

                  <div className="flex-1 flex flex-row items-center justify-between text-left gap-4 w-full">
                      
                      <div className="flex flex-col flex-1">
                          <h3 className="text-base font-bold text-white mb-2 leading-snug pr-0">{urun.isim}</h3>
                          <div className="text-2xl font-black text-[#00e5ff] tracking-tight whitespace-nowrap">
                              {urun.fiyat.toLocaleString("tr-TR")} <span className="text-sm font-medium text-slate-400">TL</span>
                          </div>
                      </div>

                      {/* 🚀 ÇÖP TENEKESİ: Kırmızı kaldırıldı, premium koyu gri/beyaz hover yapıldı */}
                      <button 
                        onClick={() => setProductToDelete(urun)} 
                        className="p-2.5 text-slate-400 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-xl transition-all shrink-0"
                        title="Favorilerden Çıkar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button 
                      onClick={() => handleSepeteEkle(urun)}
                      disabled={isAdded}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 ${
                        isAdded 
                          ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border-none" 
                          : "bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black border border-[#00e5ff]/30" 
                      }`}
                    >
                      {isAdded ? (
                        <><span>✅</span> Eklendi!</>
                      ) : (
                        "Sepete Ekle"
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* SİLME ONAY KUTUSU */}
      {productToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-slate-600 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
            
            {/* 🚀 ONAY KUTUSUNDAKİ ÇÖP İKONU: Kırmızıdan metalik griye çevrildi */}
            <div className="w-16 h-16 rounded-full border border-slate-600 flex items-center justify-center mb-4 bg-slate-800/50">
              <Trash2 className="w-8 h-8 text-slate-300" />
            </div>
            
            <h3 className="text-xl font-black text-white mb-2">Favoriyi Sil</h3>
            
            {/* 🚀 GEREKSİZ UYARI YAZISI SİLİNDİ, Boşluk (mb-8) buraya alındı */}
            <p className="text-slate-300 text-sm mb-8">Bu ürünü favorilerinizden çıkarmak istediğinize emin misiniz?</p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setProductToDelete(null)} 
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-all border border-slate-600"
              >
                İptal
              </button>
              <button 
                onClick={handleDeleteFavorite} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg"
              >
                Evet, Sil
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeartCrack, Loader2, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext"; // 🚀 SEPET MOTORUNU İÇERİ ALDIK

export default function FavorilerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // SİLME İŞLEMİ İÇİN ŞALTER VE HAFIZA
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  // 🚀 SEPET MOTORU VE "EKLENDİ" ANİMASYONU İÇİN HAFIZA
  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  // VİTRİN MOTORU
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
      } catch (error: any) {
        toast.error("Veriler yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // 🚀 GELİŞMİŞ ÜRÜN SİLME MOTORU
  const handleDeleteFavorite = async () => {
    if (!productToDelete) return;

    const targetId = productToDelete._id || productToDelete.id;
    
    // 1. Önce ekrandan gizle (Kullanıcı beklemesin)
    setFavoriteProducts(prev => prev.filter(p => (p._id || p.id) !== targetId));
    setProductToDelete(null);

    // 2. Veritabanına emri gönder
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: targetId })
      });

      // Eğer API silmeyi reddederse hata ver
      if (!res.ok) {
        throw new Error("Veritabanı silmeyi reddetti");
      }
      
      toast.success("Ürün favorilerden çıkarıldı.");
    } catch (error: any) {
      toast.error("Hata: Ürün veritabanından silinemedi!");
      // İstersen ürünü ekrana geri getirme kodu buraya yazılabilir
    }
  };

  // 🚀 SEPETE EKLEME VE ANİMASYON MOTORU
  const handleSepeteEkle = (urun: any) => {
    const targetId = urun._id || urun.id;

    // 1. Ürünü sepet formatına çevir ve sepete fırlat
    sepeteEkle({
      id: targetId,
      isim: urun.isim || urun.title,
      fiyat: urun.fiyat,
      resim: urun.resim || urun.image,
      adet: 1,
      varyasyon: "Standart" 
    });

    // 2. Butonu "Eklendi" yapmak için hafızaya al
    setSepeteEklenenler(prev => [...prev, targetId]);

    // 3. 2 saniye sonra "Eklendi" yazısını geri al
    setTimeout(() => {
      setSepeteEklenenler(prev => prev.filter(id => id !== targetId));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050814] md:bg-slate-900/80 md:backdrop-blur-sm p-0 md:p-4">
      
      <div className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl bg-[#09090b] md:border md:border-slate-800/50 md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* ÜST BAŞLIK */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/50 bg-[#09090b] sticky top-0 z-20">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#00e5ff]">
            FAVORİLERİM
          </h1>
          <button onClick={onClose} className="p-2 sm:p-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all text-slate-400 hover:text-white">
            <X className="w-6 h-6 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* İÇERİK */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 text-white relative">
          
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#00e5ff] h-10 w-10 mb-4" />
              <p className="text-slate-400">Vitrin hazırlanıyor...</p>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className="text-center p-12 bg-slate-800/20 border border-slate-700/50 rounded-2xl mt-4">
              <HeartCrack className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-6">Henüz beğendiğiniz bir ürün bulunmuyor.</p>
              <Link href="/" onClick={onClose} className="bg-[#00e5ff] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#00c4db] transition-all">
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-10">
              {favoriteProducts.map((urun: any, index: number) => {
                const isAdded = sepeteEklenenler.includes(urun._id || urun.id);

                return (
                <div key={index} className="border border-slate-800/50 bg-slate-900/30 rounded-2xl p-4 sm:p-6 relative transition-all hover:border-[#00e5ff]/30">
                  
                  {/* ÇÖP TENEKESİ */}
                  <button 
                    onClick={() => setProductToDelete(urun)} 
                    className="absolute top-4 right-4 p-2 sm:p-2.5 text-slate-500 hover:text-red-400 bg-slate-800/30 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8 sm:mt-0 pr-12">
                    {/* Ürün Resmi */}
                    <div className="w-full sm:w-24 h-32 sm:h-24 bg-[#09090b] rounded-lg border border-slate-800/50 p-2 flex items-center justify-center shrink-0">
                      <img src={urun.resim || "/placeholder.jpg"} alt={urun.isim} className="w-full h-full object-contain" />
                    </div>

                    {/* Ürün Bilgisi */}
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">{urun.isim}</h3>
                      <div className="text-xl sm:text-2xl font-black text-[#00e5ff] tracking-tight">
                        {urun.fiyat.toLocaleString("tr-TR")} TL
                      </div>
                    </div>

                    {/* 🚀 AKILLI SEPETE EKLE BUTONU (Attığın Resimdeki Gibi) */}
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      <button 
                        onClick={() => handleSepeteEkle(urun)}
                        disabled={isAdded} // Eklendiyse 2 saniye basılamasın
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold py-3 px-6 rounded-xl transition-all duration-300 ${
                          isAdded 
                            ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" // YEŞİL EKLENDİ DURUMU
                            : "bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black" // NORMAL DURUM
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
                </div>
              )})}
            </div>
          )}
        </div>

        {/* SİLME ONAY KUTUSU */}
        {productToDelete && (
          <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#121215] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center mb-4 bg-red-500/10">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Favoriyi Sil</h3>
              <p className="text-slate-400 text-sm mb-2">Bu ürünü favorilerinizden çıkarmak istediğinize emin misiniz?</p>
              <p className="text-red-500 text-sm font-bold mb-8">Bu işlem geri alınamaz!</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setProductToDelete(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all">
                  İptal
                </button>
                <button onClick={handleDeleteFavorite} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all">
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
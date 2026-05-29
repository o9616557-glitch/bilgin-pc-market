"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeartCrack, ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext";

interface Props {
  initialFavorites: any[];
}

export default function FavoriYoneticisi({ initialFavorites }: Props) {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>(initialFavorites);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  // Sadece yeni veri geldiğinde sessizce listeyi günceller
  useEffect(() => {
    setFavoriteProducts(initialFavorites);
  }, [initialFavorites]);

  // 🚀 HAYALET ÜRÜN SORUNU ÇÖZÜLDÜ:
  // router.refresh() komutlarını sildik. Artık ürün ekrandan anında silinecek ve
  // arka planda sunucu "acaba sildim mi?" diye tekrar sayfayı kırpmayacak!
  const handleDeleteFavorite = async () => {
    if (!productToDelete) return;

    const targetId = String(productToDelete._id || productToDelete.id);
    
    // Ekrandan anında sil (Optimistic UI - Hayalet ürün olmaz)
    setFavoriteProducts(prev => prev.filter(p => String(p._id || p.id) !== targetId));
    setProductToDelete(null);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: targetId })
      });

      if (!res.ok) throw new Error("Veritabanı reddetti");
      toast.success("Ürün favorilerden kaldırıldı. 🤍");
    } catch (error: any) {
      toast.error("Sistem hatası: Veritabanından silinemedi!");
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
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      
      {/* SİBER NEON ARKA PLAN IŞIKLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ÜST PANEL */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
          <div>
            {/* 🚀 GERİ DÖNÜŞ BUTONU HIZLANDIRILDI: prefetch={true} eklendi */}
            <Link href="/" prefetch={true} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00e5ff] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              FAVORİ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">ÜRÜNLERİM</span>
            </h1>
          </div>
          <div className="text-slate-300 text-xs font-black uppercase tracking-wider bg-[#09090b] border border-slate-800/80 py-3 px-5 rounded-xl shadow-lg">
            Listelenen: <span className="text-[#00e5ff] font-black text-sm">{favoriteProducts.length}</span> Donanım
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center p-10 sm:p-16 bg-transparent relative animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-[#121215]/50 border border-slate-800/50 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <HeartCrack className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Henüz Favori Öğe Yok</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">Sistemde beğendiğiniz canavar donanımları kalbe basarak bu gizli bölgeye toplayabilirsiniz.</p>
            {/* 🚀 BOŞ EKRANDAKİ BUTON DA HIZLANDIRILDI */}
            <Link href="/" prefetch={true} className="inline-block bg-[#00e5ff] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">
              Donanımları İncele
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favoriteProducts.map((urun: any, index: number) => {
              const isAdded = sepeteEklenenler.includes(urun._id || urun.id);

              return (
                <div key={index} className="group border border-slate-800 bg-[#09090b] rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-[#00e5ff]/40 shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.03)] flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden">
                  
                  <div className="w-full sm:w-24 h-24 bg-[#121215] rounded-xl border border-slate-800 p-3 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <img 
                      src={urun.resim || "/placeholder.jpg"} 
                      alt={urun.isim} 
                      className="max-w-full max-h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" 
                    />
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left w-full">
                      <div className="flex flex-col flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 leading-snug truncate group-hover:text-[#00e5ff] transition-colors">
                            {urun.isim || urun.name}
                          </h3>
                          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                              {Number(urun.fiyat || 0).toLocaleString("tr-TR")} <span className="text-xs font-bold text-slate-500 uppercase">TL</span>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-800/50 sm:border-none pt-4 sm:pt-0">
                          
                          <button 
                            onClick={() => setProductToDelete(urun)} 
                            className="p-3 text-slate-400 bg-[#121215] border border-slate-800 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 rounded-xl transition-all shadow-md"
                            title="Listeden Çıkar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => handleSepeteEkle(urun)}
                            disabled={isAdded}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md ${
                              isAdded 
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                                : "bg-[#121215] text-slate-300 border border-slate-800 hover:bg-[#00e5ff] hover:text-black hover:border-[#00e5ff] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]" 
                            }`}
                          >
                            {isAdded ? (
                              <><span className="text-sm">✓</span> Eklendi!</>
                            ) : (
                              <><ShoppingCart className="w-3.5 h-3.5" /> Sepete Ekle</>
                            )}
                          </button>

                      </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {productToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <div className="w-14 h-14 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#121215] shadow-inner">
              <Trash2 className="w-6 h-6 text-slate-400" />
            </div>
            
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Öğeyi Kaldır</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Bu donanımı favori listenizden kalıcı olarak düşürmek istediğinize emin misiniz, şefim?</p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setProductToDelete(null)} 
                className="flex-1 bg-[#121215] border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                İptal
              </button>
              <button 
                onClick={handleDeleteFavorite} 
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg"
              >
                Evet, Kaldır
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
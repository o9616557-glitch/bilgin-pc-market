"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartCrack, Trash2, ShoppingCart, Heart, 
  User, ShieldCheck, CreditCard, Star, X, CheckCircle2 
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  initialFavorites: any[];
}

export default function FavoriClient({ initialFavorites }: Props) {
  const router = useRouter();
  const { status } = useSession();
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>(initialFavorites);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteProducts(initialFavorites);
  }, [initialFavorites]);

  useEffect(() => {
    router.refresh();
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

      if (!res.ok) throw new Error("Veritabanı reddetti");
      toast.success("Ürün favorilerden kaldırıldı. 🤍");
      
      router.refresh(); 
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
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip">
      {/* 🚀 ARKA PLAN PARLAMASI (STANDART TURKUAZ) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.05] pointer-events-none rounded-full"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <User className="w-4 h-4 sm:w-5 sm:h-5" /> Profil
              </Link>
              <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> Dijital Cüzdanım
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ İÇERİK */}
        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
          
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Favori Ürünlerim</h1>
                <p className="text-cyan-400/80 text-xs sm:text-sm font-medium tracking-wide">
                  Listelenen: <span className="font-black text-cyan-400">{favoriteProducts.length}</span> Donanım
                </p>
              </div>
            </div>

            <Link 
              href="/" 
              prefetch={true}
              className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl border border-slate-700 bg-[#020617] hover:bg-slate-800 text-white font-black text-xs sm:text-sm uppercase tracking-widest transition-all shrink-0"
            >
              MAĞAZAYA DÖN
            </Link>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="w-20 h-20 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <HeartCrack className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Henüz Favori Öğe Yok</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                İlginizi çeken donanımları kalp ikonuna tıklayarak favori listenize ekleyebilir, dilediğiniz zaman kolayca ulaşabilirsiniz.
              </p>
              <Link 
                href="/" 
                prefetch={true} 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Star className="w-4 h-4" /> Donanımları İncele
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {favoriteProducts.map((urun: any, index: number) => {
                const isAdded = sepeteEklenenler.includes(urun._id || urun.id);
                return (
                  <div key={index} className="group flex flex-col sm:flex-row items-center bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 gap-4 sm:gap-6 transition-all duration-300 hover:border-cyan-500/40 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden">
                    
                    <div className="w-full sm:w-32 h-48 sm:h-32 shrink-0 bg-[#020617] rounded-xl border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden group-hover:border-cyan-500/20 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <img 
                        src={urun.resim || "/placeholder.jpg"} 
                        alt={urun.isim} 
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-110 z-10" 
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-center text-center sm:text-left w-full h-full">
                        <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                          {urun.isim || urun.name}
                        </h3>
                        <div className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight mt-auto">
                          {Number(urun.fiyat || 0).toLocaleString("tr-TR")} <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase">TL</span>
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-slate-800/50">
                        <button 
                          onClick={() => setProductToDelete(urun)} 
                          className="w-12 h-12 flex items-center justify-center text-slate-400 bg-[#020617] border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 rounded-xl transition-all shadow-md shrink-0"
                          title="Favorilerden Kaldır"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleSepeteEkle(urun)} 
                          disabled={isAdded} 
                          className={`flex-1 sm:flex-none h-12 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider px-6 rounded-xl transition-all duration-300 shadow-md ${
                            isAdded 
                            ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white border-none shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                            : "bg-[#020617] text-slate-300 border border-slate-800 hover:bg-cyan-600 hover:text-white hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                          }`}
                        >
                          {isAdded ? (<><CheckCircle2 className="w-4 h-4" /> Eklendi</>) : (<><ShoppingCart className="w-4 h-4" /> Sepete Ekle</>)}
                        </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* SİLME MODALI */}
          {productToDelete && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full"></div>
                
                <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-5 relative z-10">
                  <Trash2 className="w-7 h-7 text-red-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10">Öğeyi Kaldır</h3>
                <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed relative z-10">Bu donanımı favori listenizden kalıcı olarak silmek istediğinize emin misiniz?</p>
                
                <div className="flex w-full gap-3 relative z-10">
                  <button onClick={() => setProductToDelete(null)} className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">İptal</button>
                  <button 
                    onClick={handleDeleteFavorite} 
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                  >
                    Evet, Kaldır
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
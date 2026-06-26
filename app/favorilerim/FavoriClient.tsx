"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HeartCrack, Trash2, ShoppingCart, 
  User, ShieldCheck, CreditCard, Star, CheckCircle2,
  MapPin, Package, Search, Monitor, Headphones, Truck, PackageX, Calendar, Copy
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext";
import { useOrders } from "@/app/OrderContext";

interface Props {
  initialFavorites?: any[];
}

export default function FavoriClient({ initialFavorites = [] }: Props) {
  // 🚀 ARTIK LOADING YOK! Veri doğrudan 'initialFavorites' olarak geldi ve anında ekranda!
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>(initialFavorites);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  
  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);
  const [kargoPopupAcik, setKargoPopupAcik] = useState(false);
  const { orders: localOrders } = useOrders();

  const handleDeleteFavorite = async () => {
    if (!productToDelete) return;

    const targetId = String(productToDelete._id || productToDelete.id);
    
    // Anında ekrandan sil
    const yeniListe = favoriteProducts.filter(p => String(p._id || p.id) !== targetId);
    setFavoriteProducts(yeniListe);
    setProductToDelete(null);

    // Arkadan veritabanına sil komutu gönder
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
      slug: urun.slug || urun.slugPath || urun.productSlug || "", 
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.05] pointer-events-none rounded-full z-0"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* ⬅️ SOL MENÜ */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-2 sm:p-4 shadow-xl overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <nav className="flex flex-row lg:flex-col gap-1.5 min-w-max lg:min-w-0">
              <Link href="/hesabim" className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Profil
              </Link>
              <Link href="/cuzdan" className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Dijital Cüzdanım
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm text-slate-400 hover:text-white hover:bg-[#020617] rounded-lg transition-all font-medium">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* ➡️ SAĞ İÇERİK */}
        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full animate-in fade-in duration-300">
          
          {/* FASULYE MENÜ */}
          <div className="flex flex-nowrap items-center gap-3 w-full overflow-x-auto pt-2 pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <Link href="/siparislerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Package className="w-4 h-4 text-cyan-500" /> Siparişler
            </Link>
            <Link href="/favorilerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-cyan-600/10 border border-cyan-500/30 rounded-full text-xs font-black text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Star className="w-4 h-4 text-cyan-500" /> Favoriler
            </Link>
            <Link href="/adreslerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <MapPin className="w-4 h-4 text-cyan-500" /> Adresler
            </Link>
          </div>

          {/* BAŞLIK KUTUSU */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 z-40 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                <Star className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Favori Ürünlerim</h1>
                <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
                  Listelenen: <span className="font-black text-cyan-400">{favoriteProducts.length}</span> Donanım
                </p>
              </div>
            </div>
          </div>

          {/* ÜRÜNLER ALANI (Animasyon SIFIR, Direkt Gelir) */}
          {favoriteProducts.length === 0 ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="w-20 h-20 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <HeartCrack className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Henüz Favori Öğe Yok</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {favoriteProducts.map((urun: any, index: number) => {
                const isAdded = sepeteEklenenler.includes(urun._id || urun.id);
                return (
                  <div key={index} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 shadow-lg group h-full">
                    
                    <Link href={"/product/" + (urun.slug || urun.id || urun._id)} className="w-full h-40 sm:h-48 shrink-0 bg-[#020617] rounded-xl border border-slate-800/50 flex items-center justify-center p-4 relative overflow-hidden group-hover:border-cyan-500/20 transition-colors mb-4 mt-2">
                      <img 
                        src={urun.resim || "/placeholder.jpg"} 
                        alt={urun.isim} 
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-110 z-10" 
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-start mb-4">
                      <Link href={"/product/" + (urun.slug || urun.id || urun._id)} className="block mb-2 pr-2">
                        <h3 className="text-sm font-bold text-slate-200 leading-snug line-clamp-2 hover:text-cyan-400 transition-colors">
                          {urun.isim || urun.name}
                        </h3>
                      </Link>
                      <div className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight mt-auto">
                        {Number(urun.fiyat || 0).toLocaleString("tr-TR")} <span className="text-xs font-bold text-slate-500 uppercase">TL</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleSepeteEkle(urun)} 
                        disabled={isAdded} 
                        className={`flex-1 h-11 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 border-none ${
                          isAdded 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" 
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                        }`}
                      >
                        {isAdded ? "Eklendi" : "Sepete Ekle"}
                      </button>

                      <button 
                        onClick={() => setProductToDelete(urun)}
                        className="w-11 h-11 shrink-0 flex items-center justify-center bg-[#020617] border border-slate-800 rounded-xl text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeartCrack, ArrowLeft, Trash2, ShoppingCart, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext";
import { useRouter } from "next/navigation";

interface Props {
  initialFavorites: any[];
}

export default function FavoriClient({ initialFavorites }: Props) {
  const router = useRouter();
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>(initialFavorites);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  // 1. Senin orijinal 'page.tsx' dosyan taze veriyi getirdiğinde ekrana basar.
  useEffect(() => {
    setFavoriteProducts(initialFavorites);
  }, [initialFavorites]);

  // 2. 🚀 SİHİRLİ DOKUNUŞ: Sadece sayfa açıldığında 1 kez çalışır.
  // Müşteri sayfaya girdiği an beklemeden eski listeyi görür, bu kod ise
  // arka planda sessizce taze veriyi kontrol eder. Varsa saniyesinde ekrana düşürür!
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
      
      // Sildikten sonra da arka planda sessizce günceller
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

  // 👇 BURADAN AŞAĞISINA (return) DOKUNMA
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
          <div>
            <Link href="/" prefetch={true} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00e5ff] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              FAVORİ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">ÜRÜNLERİM</span>
            </h1>
          </div>
         <div className="flex items-center justify-start gap-2 bg-[#09090b] text-slate-300 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-800/80 shadow-sm w-full md:w-auto">
            LİSTELENEN: <span className="text-[#00e5ff] font-black text-sm">{favoriteProducts.length}</span> DONANIM
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          /* 🚀 BOŞ EKRAN */
          <div className="text-center p-10 sm:p-16 bg-transparent relative">
            <div className="w-20 h-20 rounded-full bg-[#121215]/50 border border-slate-800/50 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <HeartCrack className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Henüz Favori Öğe Yok</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed flex items-center justify-center flex-wrap gap-x-1">
              İlginizi çeken donanımları 
              <Heart className="w-4 h-4 text-white fill-white" />
              ikonuna tıklayarak favori listenize ekleyebilir, dilediğiniz zaman kolayca ulaşabilirsiniz.
            </p>
            <Link href="/" prefetch={true} className="inline-block bg-[#00e5ff] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">
              Donanımları İncele
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {favoriteProducts.map((urun: any, index: number) => {
              const isAdded = sepeteEklenenler.includes(urun._id || urun.id);
              return (
                /* 🚀 YENİ TASARIM: KOMPAKT VE ŞIK YATAY LİSTE */
                <div key={index} className="group flex flex-col sm:flex-row items-center bg-[#09090b] border border-slate-800/60 rounded-2xl p-4 gap-4 sm:gap-6 transition-all duration-300 hover:border-[#00e5ff]/40 shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.05)] relative overflow-hidden">
                  
                  {/* GÖRSEL KUTUSU - Küçültüldü ve dolgunlaştırıldı */}
                  <div className="w-full sm:w-28 h-40 sm:h-28 shrink-0 bg-[#121215] rounded-xl border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden group-hover:border-[#00e5ff]/20 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00e5ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img 
                      src={urun.resim || "/placeholder.jpg"} 
                      alt={urun.isim} 
                      className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-110 z-10" 
                    />
                  </div>

                  {/* BAŞLIK VE FİYAT - Özgür bırakıldı, sıkışmaz */}
                  <div className="flex-1 flex flex-col justify-center text-center sm:text-left w-full h-full">
                      <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2 leading-relaxed break-words whitespace-normal group-hover:text-white transition-colors line-clamp-2">
                        {urun.isim || urun.name}
                      </h3>
                      <div className="text-xl sm:text-2xl font-black text-[#00e5ff] tracking-tight mt-auto">
                        {Number(urun.fiyat || 0).toLocaleString("tr-TR")} <span className="text-sm font-bold text-slate-500 uppercase">TL</span>
                      </div>
                  </div>

                  {/* BUTONLAR - Orantılı ve Şık */}
                  <div className="flex flex-row items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-800/50 sm:border-none">
                      <button 
                        onClick={() => setProductToDelete(urun)} 
                        className="w-12 h-12 flex items-center justify-center text-slate-400 bg-[#121215] border border-slate-800 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-xl transition-all shadow-md shrink-0"
                        title="Favorilerden Kaldır"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleSepeteEkle(urun)} 
                        disabled={isAdded} 
                        className={`flex-1 sm:flex-none h-12 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider px-6 rounded-xl transition-all duration-300 shadow-md ${
                          isAdded 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                          : "bg-[#121215] text-slate-300 border border-slate-800 hover:bg-[#00e5ff] hover:text-black hover:border-[#00e5ff] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                        }`}
                      >
                        {isAdded ? (<><span className="text-sm">✓</span> Eklendi!</>) : (<><ShoppingCart className="w-4 h-4" /> Sepete Ekle</>)}
                      </button>
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
            <div className="w-14 h-14 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#121215] shadow-inner"><Trash2 className="w-6 h-6 text-slate-400" /></div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Öğeyi Kaldır</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Bu donanımı favori listenizden kalıcı olarak silmek istediğinize emin misiniz?</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setProductToDelete(null)} className="flex-1 bg-[#121215] border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">İptal</button>
              <button onClick={handleDeleteFavorite} className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg">Evet, Kaldır</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
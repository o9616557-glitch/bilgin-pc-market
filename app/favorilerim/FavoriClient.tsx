"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartCrack, Trash2, ShoppingCart, 
  User, ShieldCheck, CreditCard, Star, CheckCircle2,
  MapPin, Package, Search, Monitor, Headphones, Truck, PackageX,
  Calendar, Copy
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOrders } from "@/app/OrderContext";

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
  
  // 🚀 KARGO POPUP VE SİPARİŞ MOTORU
  const [kargoPopupAcik, setKargoPopupAcik] = useState(false);
  const { orders: localOrders } = useOrders();

  useEffect(() => {
    setFavoriteProducts(initialFavorites);
  }, [initialFavorites]);

  // 🚀 EKRAN DONDURMA
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (productToDelete || kargoPopupAcik) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => { document.body.style.overflow = 'unset'; }; 
  }, [productToDelete, kargoPopupAcik]);

  const handleDeleteFavorite = async () => {
    if (!productToDelete) return;

    const targetId = String(productToDelete._id || productToDelete.id);
    
    // Anında ekrandan sil
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
      {/* 🚀 ARKA PLAN PARLAMASI */}
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
          
          {/* 🚀 BİNGO: FASULYE MENÜ (Favoriler Çıkarıldı) */}
          <div className="flex flex-nowrap items-center gap-3 w-full overflow-x-auto pt-2 pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <Link href="/siparislerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Package className="w-4 h-4 text-cyan-500" /> Siparişler
            </Link>
            <Link href="/sistemlerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Monitor className="w-4 h-4 text-cyan-500" /> Sistemler
            </Link>
            <Link href="/destek-taleplerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Headphones className="w-4 h-4 text-cyan-500" /> Destek / İade
            </Link>
            <Link href="/siparis-takip" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-cyan-500" /> Sorgula
            </Link>
            <Link href="/adreslerim" className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none">
              <MapPin className="w-4 h-4 text-cyan-500" /> Adresler
            </Link>
            <button onClick={() => setKargoPopupAcik(true)} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 rounded-full transition-all text-xs font-black text-slate-300 hover:text-cyan-400 whitespace-nowrap shadow-sm flex-1 sm:flex-none relative">
              <Truck className="w-4 h-4 text-cyan-500" /> Kargolar
              {localOrders?.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo")).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white shadow-lg">
                  {localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo")).length}
                </span>
              )}
            </button>
          </div>

          {/* 🚀 BAŞLIK KUTUSU */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 z-40 overflow-hidden group">
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

            <div className="flex flex-row items-center gap-2 sm:gap-3 w-full xl:w-auto relative z-50">
              <Link 
                href="/" 
                prefetch={true}
                className="w-full xl:w-auto flex items-center justify-center gap-2 bg-[#020617] hover:bg-slate-800 border border-slate-700 rounded-lg px-4 sm:px-6 py-3 transition-colors text-[10px] sm:text-xs text-white font-black uppercase tracking-widest shadow-lg shrink-0"
              >
                MAĞAZAYA DÖN
              </Link>
            </div>
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
            /* 🚀 BİNGO: KUTU/KARE TASARIMI (Grid Yapısı - Silme Butonu Ayrıldı) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {favoriteProducts.map((urun: any, index: number) => {
                const isAdded = sepeteEklenenler.includes(urun._id || urun.id);
                return (
                  <div key={index} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 shadow-lg group h-full">
                    
                    {/* ÇÖP KUTUSU (Resimden bağımsız, normal akışta en üstte) */}
                    <div className="flex justify-end mb-3">
                      <button 
                        onClick={() => setProductToDelete(urun)}
                        className="w-8 h-8 flex items-center justify-center bg-[#020617] border border-slate-800 rounded-lg text-slate-500 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors shadow-sm"
                        title="Favorilerden Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* ÜRÜN RESMİ (Geniş kutu alanı) */}
                    <Link href={"/product/" + (urun.slug || urun.id || urun._id)} prefetch={true} className="w-full h-40 sm:h-48 shrink-0 bg-[#020617] rounded-xl border border-slate-800/50 flex items-center justify-center p-4 relative overflow-hidden group-hover:border-cyan-500/20 transition-colors mb-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <img 
                        src={urun.resim || "/placeholder.jpg"} 
                        alt={urun.isim} 
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-110 z-10" 
                      />
                    </Link>

                    {/* BİLGİLER (Başlık ve Fiyat) */}
                    <div className="flex-1 flex flex-col justify-start mb-4">
                      <Link href={"/product/" + (urun.slug || urun.id || urun._id)} prefetch={true} className="block mb-2 pr-2">
                        <h3 className="text-sm font-bold text-slate-200 leading-snug line-clamp-2 hover:text-cyan-400 transition-colors">
                          {urun.isim || urun.name}
                        </h3>
                      </Link>
                      <div className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight mt-auto">
                        {Number(urun.fiyat || 0).toLocaleString("tr-TR")} <span className="text-xs font-bold text-slate-500 uppercase">TL</span>
                      </div>
                    </div>

                    {/* SEPETE EKLE BUTONU */}
                    <button 
                      onClick={() => handleSepeteEkle(urun)} 
                      disabled={isAdded} 
                      className={`w-full h-11 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 border-none ${
                        isAdded 
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      }`}
                    >
                      {isAdded ? (<><CheckCircle2 className="w-4 h-4" /> Eklendi</>) : (<><ShoppingCart className="w-4 h-4" /> Sepete Ekle</>)}
                    </button>

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

          {/* 🚀 MİLİMETRİK KARGOLAR POPUP'I */}
          {kargoPopupAcik && (
            <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[40px] pointer-events-none rounded-full"></div>
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 relative z-10 shrink-0">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-5 h-5 text-cyan-400" /> Aktif Kargolarınız
                  </h3>
                  <button 
                    onClick={() => setKargoPopupAcik(false)} 
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white bg-[#020617] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                  {(() => {
                    const kargoSiparisleri = localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo"));
                    
                    if (kargoSiparisleri.length === 0) {
                      return (
                        <div className="text-center py-10 flex flex-col items-center justify-center relative z-10">
                          <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#020617]">
                            <PackageX className="w-7 h-7 text-slate-600" />
                          </div>
                          <p className="text-slate-400 font-medium text-sm">Şu an yolda olan aktif kargonuz bulunmuyor.</p>
                        </div>
                      );
                    }

                    return kargoSiparisleri.map((siparis: any, idx: number) => {
                      const siparisKodu = siparis.siparisKodu || siparis.orderNumber || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
                      const tarih = siparis.createdAt ? new Date(siparis.createdAt).toLocaleDateString("tr-TR") : siparis.tarih ? new Date(siparis.tarih).toLocaleDateString("tr-TR") : "";
                      const firma = siparis.kargoFirmasi || siparis.shippingCompany || "Belirtilmemiş";
                      const takipNo = siparis.takipNo || siparis.kargoTakipNo || siparis.trackingNumber || "Takip No Girilmemiş";

                      return (
                        <div key={siparis._id || idx} className="bg-[#020617] border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors relative z-10 mb-2">
                          <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">#{siparisKodu}</span>
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {tarih}</span>
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">Kargo Firması</span>
                              <span className="font-bold text-white px-2 py-1 bg-[#0f172a] rounded-md border border-slate-800">{firma}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">Takip Numarası</span>
                              <div className="flex items-center gap-2 px-2 py-1 bg-cyan-950/20 rounded-md border border-cyan-500/20">
                                <span className="font-black text-cyan-400">{takipNo}</span>
                                {takipNo !== "Takip No Girilmemiş" && (
                                  <button onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(takipNo);
                                    toast.success("Takip numarası kopyalandı!");
                                  }} className="text-cyan-600 hover:text-cyan-300 transition-colors">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
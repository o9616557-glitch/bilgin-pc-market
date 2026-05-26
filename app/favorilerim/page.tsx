"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeartCrack, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/app/CartContext"; // Kendi sepet context yolunu kontrol et

export default function FavorilerSayfasi() {
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // SİLME İŞLEMİ İÇİN ŞALTER VE HAFIZA
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  // SEPET MOTORU VE ANİMASYON HAFIZASI
  const { sepeteEkle } = useCart();
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  // 🚀 SAYFA AÇILDIĞINDA VERİLERİ ÇEKEN MOTOR
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

  // 🚀 SENİN SİSTEMİNİN ÖZEL SİLME ŞİFRESİ (POST METODLU TOGGLE SİSTEMİ)
  const handleDeleteFavorite = async () => {
    if (!productToDelete) return;

    const targetId = String(productToDelete._id || productToDelete.id);
    
    // 1. Kullanıcı beklemesin diye ekrandan anında düşür
    setFavoriteProducts(prev => prev.filter(p => String(p._id || p.id) !== targetId));
    setProductToDelete(null);

    // 2. Veritabanına senin o çalışan gizli şifrenle emri gönder
    try {
      const res = await fetch("/api/favorites", {
        method: "POST", // Senin sistem POST ile siliyordu, aynen korundu
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

  // 🚀 SEPETE EKLEME VE ANİMASYON MOTORU
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
    // PREMIUM DIŞ TASARIM (Kargo Takip ve Sepet Sayfasıyla Birebir Uyumlu)
    <div className="min-h-screen bg-[#050814] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      
      {/* ARKADAKİ NEON MAVİ PARLAMA EFEKTİ (Gamer/Teknoloji Teması) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00e5ff] blur-[150px] opacity-15 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* ÜST GEZİNTİ BARBARI VE BAŞLIK */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/60 pb-6 mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#00e5ff] transition-all mb-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              FAVORİ <span className="text-[#00e5ff]">ÜRÜNLERİM</span>
            </h1>
          </div>
          <div className="text-slate-400 text-sm font-semibold bg-[#09090b] border border-white/5 py-2 px-4 rounded-xl self-start sm:self-center">
            Toplam: <span className="text-[#00e5ff] font-black">{favoriteProducts.length}</span> Ürün
          </div>
        </div>

        {/* ANA İÇERİK ALANI */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#09090b] border border-white/5 rounded-2xl">
            <Loader2 className="w-10 h-10 text-[#00e5ff] animate-spin" />
            <p className="text-slate-400 font-medium">Favori ürünleriniz vitrine diziliyor...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center p-12 bg-[#09090b] border border-white/5 rounded-2xl shadow-inner">
            <HeartCrack className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Henüz Favori Ürününüz Yok</h2>
            <p className="text-slate-400 mb-8 font-medium">Beğendiğiniz donanımları kalbe basarak buraya ekleyebilirsiniz.</p>
            <Link href="/" className="inline-block bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-wider hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          // 🚀 TEK SÜTUNLU PREMIUM LİSTE (Tıpkı Siparişlerim Gibi)
          <div className="flex flex-col gap-4">
            {favoriteProducts.map((urun: any, index: number) => {
              const isAdded = sepeteEklenenler.includes(urun._id || urun.id);

              return (
                <div key={index} className="border border-slate-800/50 bg-[#09090b]/60 rounded-2xl p-4 sm:p-6 relative transition-all hover:border-[#00e5ff]/30 shadow-lg flex flex-col sm:flex-row sm:items-center gap-4">
                  
                  {/* ÇÖP TENEKESİ BUTONU (Sağ Üstte) */}
                  <button 
                    onClick={() => setProductToDelete(urun)} 
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 bg-slate-800/20 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Favorilerden Çıkar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Ürün Resmi */}
                  <div className="w-full sm:w-24 h-32 sm:h-24 bg-[#09090b] rounded-xl border border-slate-800/40 p-2 flex items-center justify-center shrink-0 mt-6 sm:mt-0">
                    <img 
                      src={urun.resim || "/placeholder.jpg"} 
                      alt={urun.isim} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 text-left">
                    <h3 className="text-base font-bold text-white mb-2 leading-snug pr-8 sm:pr-0">{urun.isim}</h3>
                    <div className="text-2xl font-black text-[#00e5ff] tracking-tight">
                      {urun.fiyat.toLocaleString("tr-TR")} <span className="text-sm font-medium text-slate-400">TL</span>
                    </div>
                  </div>

                  {/* SEPETE EKLE BUTONU (✅ Eklendi! Animasyonlu) */}
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button 
                      onClick={() => handleSepeteEkle(urun)}
                      disabled={isAdded}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 ${
                        isAdded 
                          ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border-none" 
                          : "bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black border border-[#00e5ff]/20" 
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

      {/* 🚨 SİLME ONAY KUTUSU (Popup Kırmızı Ekran) */}
      {productToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
            
            <div className="w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center mb-4 bg-red-500/10">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-xl font-black text-white mb-2">Favoriyi Sil</h3>
            <p className="text-slate-400 text-sm mb-2">Bu ürünü favorilerinizden çıkarmak istediğinize emin misiniz?</p>
            <p className="text-red-500 text-sm font-bold mb-8">Bu işlem geri alınamaz!</p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setProductToDelete(null)} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all"
              >
                İptal
              </button>
              <button 
                onClick={handleDeleteFavorite} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all"
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
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, PackageX } from "lucide-react";
import { useCart } from "@/app/CartContext";

export default function KategoriSayfasi() {
  const params = useParams();
  const rawSlug = params.slug as string; // URL'den gelen kategori adı (örn: ekran-karti)
  
  const { sepeteEkle } = useCart();
  const [urunler, setUrunler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [sepeteEklenenler, setSepeteEklenenler] = useState<string[]>([]);

  // Kategori ismini ekranda güzel göstermek için (örn: ekran-karti -> Ekran Karti)
  const sayfaBasligi = rawSlug
    .replace(/-/g, " ")
    .toUpperCase();

  // Türkçe karakterleri ve boşlukları eşleştirmek için dönüştürücü motor
  const slugify = (text: string) => {
    return (text || "")
      .toString()
      .toLowerCase()
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c")
      .replace(/ö/g, "o").replace(/ğ/g, "g").replace(/ü/g, "u")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  useEffect(() => {
    const urunleriGetir = async () => {
      try {
        const res = await fetch("/api/urunler?t=" + new Date().getTime());
        const data = await res.json();

        // 🚀 BİNGO: Filtreleme Motoru
        // Ürünün veritabanındaki kategorisini slug formatına çevirip URL'deki ile kıyaslıyoruz
        const filtrelenmisUrunler = data.filter((urun: any) => {
          const urunKategorisi = slugify(urun.kategori || urun.category || "");
          return urunKategorisi === rawSlug;
        });

        setUrunler(filtrelenmisUrunler);
      } catch (hata) {
        console.error("Ürünler çekilirken hata oluştu:", hata);
      } finally {
        setYukleniyor(false);
      }
    };

    if (rawSlug) {
      urunleriGetir();
    }
  }, [rawSlug]);

  const handleSepeteEkle = (urun: any) => {
    const targetId = urun._id || urun.id;
    sepeteEkle({
      id: targetId,
      isim: urun.isim || urun.title || urun.name,
      fiyat: urun.fiyat || urun.price,
      resim: urun.resim || urun.image || "/placeholder.jpg",
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
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* ÜST BAŞLIK ALANI */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00e5ff] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                {sayfaBasligi}
              </span> MODELLERİ
            </h1>
          </div>
          <div className="flex items-center justify-start gap-2 bg-[#09090b] text-slate-300 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-800/80 shadow-sm w-full md:w-auto">
            BULUNAN SONUÇ: <span className="text-[#00e5ff] font-black text-sm">{urunler.length}</span> ADET
          </div>
        </div>

        {yukleniyor ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00e5ff]"></div>
          </div>
        ) : urunler.length === 0 ? (
          <div className="text-center p-10 sm:p-16 bg-[#09090b] rounded-3xl border border-slate-800/60 relative">
             <div className="w-20 h-20 rounded-full bg-[#121215]/50 border border-slate-800/50 flex items-center justify-center mx-auto mb-6">
              <PackageX className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wide mb-2 text-white">Bu Kategoride Ürün Bulunamadı</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-medium">
              Şu anda <strong>{sayfaBasligi}</strong> kategorisinde satışa açık ürünümüz bulunmuyor. Yeni stoklar çok yakında eklenecektir.
            </p>
          </div>
        ) : (
          /* ÜRÜN IZGARASI (GRID) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {urunler.map((urun: any, index: number) => {
              const isAdded = sepeteEklenenler.includes(urun._id || urun.id);
              return (
                <div key={index} className="group bg-[#09090b] border border-slate-800/60 rounded-2xl p-5 transition-all duration-300 hover:border-[#00e5ff]/40 shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.05)] flex flex-col h-full relative overflow-hidden">
                  
                  {/* Stok veya İndirim Rozeti (Opsiyonel) */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                     <span className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-[10px] font-black uppercase px-2 py-1 rounded-md">
                        Stokta Var
                     </span>
                  </div>

                  {/* Resim Alanı */}
                  <div className="w-full h-48 bg-[#121215] rounded-xl border border-slate-800 flex items-center justify-center p-4 mb-5 relative overflow-hidden group-hover:border-[#00e5ff]/20 transition-colors mt-2">
                    <img 
                      src={urun.resim || urun.image || "/placeholder.jpg"} 
                      alt={urun.isim || urun.title} 
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-110 z-10" 
                    />
                  </div>

                  {/* Başlık Alanı */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-200 mb-2 leading-relaxed group-hover:text-white transition-colors line-clamp-2">
                      {urun.isim || urun.title || urun.name}
                    </h3>
                  </div>

                  {/* Fiyat ve Buton Alt Kısım */}
                  <div className="mt-4 pt-4 border-t border-slate-800/50">
                    <div className="text-2xl font-black text-[#00e5ff] tracking-tight mb-4">
                      {Number(urun.fiyat || urun.price || 0).toLocaleString("tr-TR")} <span className="text-xs font-bold text-slate-500 uppercase">TL</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/urun/${urun._id || urun.id}`} className="flex-1 bg-[#121215] border border-slate-700 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider text-center">
                        İncele
                      </Link>
                      <button 
                        onClick={() => handleSepeteEkle(urun)} 
                        disabled={isAdded}
                        className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider border ${
                          isAdded 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none" 
                          : "bg-[#121215] border-slate-700 hover:bg-[#00e5ff] hover:text-black hover:border-[#00e5ff]"
                        }`}
                      >
                        {isAdded ? "✓" : <ShoppingCart className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
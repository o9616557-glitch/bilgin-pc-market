"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const turkceSozluk: Record<string, string> = {
  "model": "Model",
  "grafik_motoru": "Grafik Motoru",
  "ai_performansi": "AI Performansı",
  "bus_standarti": "Veri Yolu Standartı",
  "opengl": "OpenGL",
  "bellek": "Bellek",
  "saat_hizi": "Saat Hızı",
  "cuda_cekirdegi": "CUDA Çekirdeği",
  "bellek_hizi": "Bellek Hızı",
  "bellek_arayuzu": "Bellek Arayüzü",
  "cozunurluk": "Çözünürlük",
  "maksimum_ekran_destegi": "Maksimum Ekran Desteği",
  "boyutlar": "Boyutlar",
  "tavsiye_edilen_guc_kaynagi": "Tavsiye Edilen Güç Kaynağı",
  "guc_baglantilari": "Güç Bağlantıları",
  "yuva": "Yuva",
  "aura_sync": "Aura Sync"
};

export default function ProductCompare({
  currentProduct,
  productList // Sayfadan gelen eski listeyi çökmeleri önlemek için tutuyoruz ama aramayı canlı yapacağız
}: {
  currentProduct: { name: string; acf: any };
  productList: { id: number; name: string }[];
}) {
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareData, setCompareData] = useState<{ id: string; name: string; acf: any } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // YENİ: Arama yapıldığını gösteren state
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [liveResults, setLiveResults] = useState<any[]>([]); // YENİ: Canlı arama sonuçlarını tutar

  // ==========================================
  // EĞİTİM BÖLÜMÜ: CANLI ARAMA VE DEBOUNCE MANTIĞI
  // Bu kod bloğu (useEffect), searchTerm (Arama kutusu) her değiştiğinde çalışır.
  // Kullanıcı her harf yazdığında sunucuya istek atmamak için 'setTimeout' ile 400 milisaniye bekleriz.
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Sadece 2 veya daha fazla harf yazıldığında arama yap (Sunucuyu yormamak için)
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        try {
          // Doğrudan WordPress arama motorunu kullanıyoruz, 100 limitine takılmaz.
          const res = await fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2/product?search=${searchTerm}`);
          if (res.ok) {
            const data = await res.json();
            setLiveResults(data);
          }
        } catch (error) {
          console.error("Canlı arama hatası:", error);
        }
        setIsSearching(false);
      } else {
        setLiveResults([]); // Kutuda az harf varsa listeyi boşalt
      }
    }, 400); // 400ms bekleme süresi

    // Eğer 400ms dolmadan yeni bir harf yazılırsa, eski sayacı iptal et (Clean-up)
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Listeden ürün seçme işlemi
  const handleSelectProduct = (product: any) => {
    // WordPress'ten gelen başlık yapısı genelde product.title.rendered şeklindedir
    const productName = product?.title?.rendered || "Bilinmeyen Ürün";
    
    // HTML kodlarını temizle (Örn: &#8211; gibi işaretler)
    const cleanName = productName.replace(/&#(\d+);/g, (match: string, dec: number) => String.fromCharCode(dec));

    setSearchTerm(cleanName); 
    setIsDropdownOpen(false);    
    setCompareData({ id: product.id.toString(), name: cleanName, acf: product.acf || {} });
  };

  const acfKeys = Object.keys(currentProduct?.acf || {}).filter((key) => {
    const val = currentProduct.acf[key];
    return val && typeof val !== "object" && !key.toLowerCase().includes("fps");
  });

  if (!isCompareOpen) {
    return (
      <button 
        onClick={() => setIsCompareOpen(true)}
        className="w-full bg-[#111827] border border-slate-700/50 hover:border-blue-500/50 text-slate-300 font-bold py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
      >
        <span className="text-xl">⚖️</span> Farklı Bir Ekran Kartı İle Kıyasla
      </button>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      
      <div className="flex justify-end">
        <button 
          onClick={() => setIsCompareOpen(false)} 
          className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-red-400 transition-colors"
        >
          ✕ Paneli Kapat
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center bg-[#0b0f1a] p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative z-20">
        
        <div className="flex-1 w-full bg-[#111827] p-5 rounded-2xl border border-slate-700/50 shadow-inner">
          <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest block mb-2">Mevcut Cihaz</span>
          <h4 className="text-white font-bold text-sm md:text-base leading-snug">{currentProduct?.name || "Bilinmeyen Ürün"}</h4>
        </div>

        <div className="text-slate-600 font-black text-2xl italic px-2 lg:px-4">VS</div>

        <div className="flex-[1.5] w-full flex flex-col sm:flex-row gap-4 items-end relative">
          <div className="w-full relative">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2 ml-1">Kıyaslanacak Kartı Ara</span>
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true); 
              }}
              onFocus={() => setIsDropdownOpen(true)} 
              placeholder="Örn: RTX 5090, RX 7800 XT..."
              className="w-full bg-[#111827] border border-slate-700 text-white text-sm rounded-2xl px-5 py-4 font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            />

            {/* AÇILIR LİSTE (DROPDOWN) */}
            {isDropdownOpen && searchTerm.length >= 2 && (
              <ul className="absolute z-50 w-full mt-2 bg-[#111827] border border-slate-700 rounded-xl max-h-52 overflow-y-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] custom-scrollbar">
                
                {isSearching ? (
                  // Yükleniyor durumu
                  <li className="px-5 py-4 text-sm text-blue-400 font-bold animate-pulse text-center">
                    Sistemde Aranıyor...
                  </li>
                ) : liveResults.length > 0 ? (
                  // Sonuçlar bulunduysa listele
                  liveResults.map((p) => (
                    <li 
                      key={p.id} 
                      onClick={() => handleSelectProduct(p)}
                      className="px-5 py-3 border-b border-slate-800/50 hover:bg-blue-600/20 cursor-pointer transition-colors text-sm text-slate-300 font-semibold"
                      dangerouslySetInnerHTML={{ __html: p.title?.rendered || "Bilinmeyen Ürün" }}
                    />
                  ))
                ) : (
                  // Sonuç bulunamadıysa
                  <li className="px-5 py-4 text-sm text-slate-500 italic text-center">
                    Böyle bir ürün bulunamadı...
                  </li>
                )}
                
              </ul>
            )}
          </div>

          {compareData && (
            <Link
              href={`/product/${compareData.id}`}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-4 px-8 rounded-2xl transition-all uppercase tracking-wider text-center shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] shrink-0"
            >
              Ürüne Git
            </Link>
          )}
        </div>
      </div>

      {/* DETAYLAR TABLOSU */}
      <div className="grid grid-cols-1 gap-4 relative z-10">
        {acfKeys.map((key) => (
          <div key={key} className="bg-[#111827] rounded-[1.5rem] border border-slate-800/50 p-5 md:p-6 flex flex-col md:flex-row md:items-center hover:border-slate-700 transition-colors group">
            
            <div className="md:w-1/3 mb-4 md:mb-0">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-lg">
                {turkceSozluk[key.toLowerCase()] || key}
              </span>
            </div>

            <div className="md:w-2/3 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-[#0b0f1a] p-4 rounded-xl border border-slate-800/50 group-hover:border-blue-500/30 transition-colors">
                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold tracking-wider">Mevcut</span>
                <span className="text-white text-sm font-bold capitalize">{String(currentProduct.acf[key])}</span>
              </div>

              <div className="flex-1 bg-[#0b0f1a] p-4 rounded-xl border border-slate-800/50 group-hover:border-purple-500/30 transition-colors">
                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold tracking-wider">Kıyaslanan</span>
                <span className="text-slate-300 text-sm font-bold capitalize">
                  {isLoading ? (
                    <span className="animate-pulse text-blue-500">Çekiliyor...</span>
                  ) : (
                    compareData?.acf?.[key] ? String(compareData.acf[key]) : "-"
                  )}
                </span>
              </div>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}
"use client";

import React, { useState } from "react";
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
  productList
}: {
  currentProduct: { name: string; acf: any };
  productList: { id: number; name: string }[];
}) {
  const [compareData, setCompareData] = useState<{ id: string; name: string; acf: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Ürün seçildiğinde verilerini çeken fonksiyon
  const fetchCompareData = async (selectedId: string, selectedName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2/product/${selectedId}`);
      const data = await res.json();
      setCompareData({ id: selectedId, name: selectedName, acf: data.acf || {} });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  // Arama kutusuna yazı yazıldığında çalışan fonksiyon
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    // Yazılan isim listedeki bir ürünle tam eşleşirse verisini getir
    const foundProduct = productList.find((p) => p.name === val);
    if (foundProduct) {
      fetchCompareData(foundProduct.id.toString(), foundProduct.name);
    } else if (val === "") {
      setCompareData(null);
    }
  };

  // FPS harici teknik özellikleri filtreleme
  const acfKeys = Object.keys(currentProduct.acf || {}).filter((key) => {
    const val = currentProduct.acf[key];
    return val && typeof val !== "object" && !key.toLowerCase().includes("fps");
  });

  return (
    <div className="w-full space-y-8">
      
      {/* SEÇİM VE ARAMA ALANI (Modernize Edildi) */}
      <div className="flex flex-col lg:flex-row gap-6 items-center bg-[#0b0f1a] p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
        
        {/* Sol Taraf: Mevcut Cihaz */}
        <div className="flex-1 w-full bg-[#111827] p-5 rounded-2xl border border-slate-700/50 shadow-inner">
          <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest block mb-2">Mevcut Cihaz</span>
          <h4 className="text-white font-bold text-sm md:text-base leading-snug">{currentProduct.name}</h4>
        </div>

        {/* Ortadaki VS Logosu */}
        <div className="text-slate-600 font-black text-2xl italic px-2 lg:px-4">VS</div>

        {/* Sağ Taraf: Yazarak Arama Kutusu */}
        <div className="flex-[1.5] w-full flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2 ml-1">Kıyaslanacak Ürünü Ara</span>
            {/* Akıllı Input: Datalist ile bağlantılı */}
            <input
              type="text"
              list="product-list"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Ürün adını yazın..."
              className="w-full bg-[#111827] border border-slate-700 text-white text-sm rounded-2xl px-5 py-4 font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            />
            <datalist id="product-list">
              {productList.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>

          {/* Ürüne Git Butonu (Sadece ürün seçilince görünür) */}
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

      {/* KARŞILAŞTIRMA KARTLARI (Mobilde Alt Alta, PC'de Yan Yana) */}
      <div className="grid grid-cols-1 gap-4">
        {acfKeys.map((key) => (
          <div key={key} className="bg-[#111827] rounded-[1.5rem] border border-slate-800/50 p-5 md:p-6 flex flex-col md:flex-row md:items-center hover:border-slate-700 transition-colors group">
            
            {/* Özellik Başlığı (Mobilde En Üstte) */}
            <div className="md:w-1/3 mb-4 md:mb-0">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-lg">
                {turkceSozluk[key.toLowerCase()] || key}
              </span>
            </div>

            {/* Değerler Kutusu */}
            <div className="md:w-2/3 flex flex-col sm:flex-row gap-3">
              
              {/* Mevcut Ürün Değeri */}
              <div className="flex-1 bg-[#0b0f1a] p-4 rounded-xl border border-slate-800/50 group-hover:border-blue-500/30 transition-colors">
                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold tracking-wider">Mevcut</span>
                <span className="text-white text-sm font-bold capitalize">{String(currentProduct.acf[key])}</span>
              </div>

              {/* Kıyaslanan Ürün Değeri */}
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
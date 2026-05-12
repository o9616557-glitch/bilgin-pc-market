"use client";

import { useState } from "react";
import Link from "next/link";

const turkceSozluk: Record<string, string> = {
  "model": "Model",
  "grafik_motoru": "Grafik Motoru",
  "ai_performansi": "AI Performansı",
  "bus_standarti": "Veri Yolu Standartı",
  "opengl": "OpenGL",
  "bellek": "Bellek",
  "saat_hizi": "Saat Hızı",
  "saatr_hizi": "Saat Hızı",
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
  currentProduct: { name: string, acf: any }, 
  productList: { id: number, name: string }[] 
}) {
  const [compareData, setCompareData] = useState<{ id: string, name: string, acf: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) { setCompareData(null); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2/product/${selectedId}`);
      const data = await res.json();
      const selectedName = productList.find(p => p.id.toString() === selectedId)?.name || "Seçilen Ürün";
      setCompareData({ id: selectedId, name: selectedName, acf: data.acf || {} });
    } catch (error) { console.error(error); }
    setIsLoading(false);
  };

  const acfKeys = Object.keys(currentProduct.acf || {}).filter(key => {
    const val = currentProduct.acf[key];
    return val && typeof val !== 'object' && !key.toLowerCase().includes('fps');
  });

  return (
    <div className="w-full">
      {/* SEÇİM ALANI */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-[#111827] p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex-1 w-full bg-[#0b0f1a] p-4 rounded-xl border border-slate-800">
          <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Mevcut Cihaz</span>
          <h4 className="text-blue-400 font-black text-sm uppercase">{currentProduct.name}</h4>
        </div>

        <div className="text-slate-600 font-black text-xl italic px-2">VS</div>

        <div className="flex-[1.5] w-full flex flex-row gap-2">
          <div className="flex-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1 ml-1">Kıyaslanacak Ürün</span>
            <select 
              className="w-full bg-[#0b0f1a] border border-slate-700 text-white text-xs md:text-sm rounded-xl px-4 py-4 font-bold focus:border-slate-400 appearance-none uppercase"
              onChange={handleSelect}
            >
              <option value="">-- ÜRÜN SEÇİN --</option>
              {productList.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {compareData && (
            <div className="flex items-end">
              <Link 
                href={`/product/${compareData.id}`}
                className="bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-black py-4 px-4 rounded-xl transition-all uppercase"
              >
                İncele
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* TABLO */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left min-w-[600px] bg-[#0b0f1a]">
          <thead>
            <tr className="bg-[#1c2536] border-b border-slate-800">
              <th className="py-5 px-4 text-slate-500 font-black text-[10px] uppercase w-1/4">Özellik</th>
              <th className="py-5 px-4 text-blue-400 font-black text-[11px] uppercase w-2/5 border-l border-slate-800">Bu Cihaz</th>
              <th className="py-5 px-4 text-slate-300 font-black text-[11px] uppercase w-2/5 border-l border-slate-800">Kıyaslanan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {acfKeys.map(key => (
              <tr key={key} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 text-slate-500 text-[11px] font-bold capitalize">{turkceSozluk[key.toLowerCase()] || key}</td>
                <td className="py-4 px-4 text-white text-xs font-black border-l border-slate-800/50">{String(currentProduct.acf[key])}</td>
                <td className="py-4 px-4 text-slate-400 text-xs font-black border-l border-slate-800/50">
                  {isLoading ? "..." : (compareData?.acf?.[key] || "-")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
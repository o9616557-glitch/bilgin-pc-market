"use client";

import React, { useState, useRef, useEffect } from "react";

// 🚀 MATRİS DOĞRUDAN İÇERİ ALINDI: Diğer dosyaya bağımlılık bitti, hata ihtimali sıfırlandı!
const activeMapping: Record<string, string> = {
  model: "Model",
  grafik_motoru: "Grafik Motoru",
  ai_performansi: "AI Performansı",
  bus_standarti: "Bus Standartı",
  opengl: "OpenGL",
  bellek: "Bellek Kapasitesi",
  saat_hizi: "Saat Hızı",
  cuda_cekirdegi: "CUDA Çekirdeği",
  bellek_hizi: "Bellek Hızı",
  bellek_arayuzu: "Bellek Arayüzü",
  cozunurluk: "Maksimum Çözünürlük",
  maksimum_ekran_destegi: "Maksimum Ekran Desteği",
  boyutlar: "Boyutlar",
  tavsiye_edilen_guc_kaynagi: "Tavsiye Edilen Güç Kaynağı (PSU)",
  guc_baglantilari: "Güç Bağlantıları",
  yuva: "Yuva Tipi",
  aura_sync: "Aura Sync / RGB"
};

function getSpecsList(targetProduct: any) {
  if (!targetProduct) return [];
  const specs: any[] = [];
  
  Object.entries(activeMapping).forEach(([key, label]: [string, string]) => {
    let value = targetProduct.meta_data?.find((m: any) => m.key === key)?.value || targetProduct.acf?.[key];
    
    if (!value && targetProduct.attributes) {
      const attr = targetProduct.attributes.find((a: any) => a.name?.toLowerCase() === key || a.name?.toLowerCase() === label.toLowerCase());
      if (attr && attr.options) {
        value = attr.options.join(', ');
      }
    }
    
    if (value) {
      specs.push({ label, value: String(value) });
    }
  });
  return specs;
}

export default function ProductCompare({ product, allProducts = [] }: { product: any; allProducts: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allProducts.length > 0 && !selectedProduct) {
      const fallback = allProducts.find((p: any) => p.id !== product.id);
      if (fallback) setSelectedProduct(fallback);
    }
  }, [allProducts, product, selectedProduct]);

  useEffect(() => {
    function clickOutside(e: MouseEvent) { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false); }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const currentSpecs = getSpecsList(product);
  const opponentSpecs = getSpecsList(selectedProduct);
  const compareOptions = allProducts.filter((p: any) => p.id !== product.id);
  const filtered = compareOptions.filter((p: any) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="px-4 pb-6 border-t border-white/5 pt-4">
      <div className="relative mb-5" ref={dropdownRef}>
        <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Kıyaslamak İstediğiniz Diğer Ürünü Seçin</label>
        <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-[#050814] border border-white/10 rounded-lg p-3 text-xs text-left text-slate-300 flex justify-between items-center hover:border-blue-500 transition-colors">
          <span>{selectedProduct ? selectedProduct.name : "Ürün Seçilmedi..."}</span>
          <span>▼</span>
        </button>
        {isDropdownOpen && compareOptions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 max-h-56 bg-[#0b1329] border border-white/10 rounded-lg overflow-y-auto z-50 p-1 shadow-2xl">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ürün adı ara..." className="w-full bg-[#050814] border border-white/5 rounded p-2 text-xs text-white focus:outline-none mb-1" />
            {filtered.map((item: any) => (
              <div key={item.id} onClick={() => { setSelectedProduct(item); setIsDropdownOpen(false); setSearchQuery(""); }} className="p-2 text-xs hover:bg-blue-600 rounded cursor-pointer text-slate-300 hover:text-white uppercase font-bold">{item.name}</div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct ? (
        <div className="w-full bg-[#050814]/40 border border-white/5 rounded-xl p-4 overflow-x-auto shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-black">
                <th className="pb-3 w-4/12">TEKNİK ÖZELLİK</th>
                <th className="pb-3 w-4/12 text-blue-400">BU ÜRÜN</th>
                <th className="pb-3 w-4/12 text-emerald-400">KARŞILAŞTIRILAN ÜRÜN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(activeMapping).map(([key, label], i) => {
                const curVal = currentSpecs.find((s) => s.label === label)?.value || "-";
                const oppVal = opponentSpecs.find((s) => s.label === label)?.value || "-";
                return (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-bold text-slate-400 uppercase tracking-wider text-[10px]">{label}</td>
                    <td className="py-3 text-slate-200 font-bold pr-3">{curVal}</td>
                    <td className="py-3 text-emerald-400 font-bold">{oppVal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-slate-600 text-xs">Kıyaslanacak rakip ürün listesi yüklenemedi şefim.</div>
      )}
    </div>
  );
}
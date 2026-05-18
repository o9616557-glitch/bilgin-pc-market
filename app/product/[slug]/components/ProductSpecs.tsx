"use client";

import React from "react";

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

export default function ProductSpecs({ product }: { product: any }) {
  const specs = getSpecsList(product);
  if (specs.length === 0) return <p className="text-xs text-slate-500 p-4">Teknik özellik bulunamadı şefim.</p>;

  return (
    <div className="px-4 pb-4 border-t border-white/5 pt-3">
      <table className="w-full text-left text-sm">
        <tbody>
          {specs.map((spec: any, i: number) => (
            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
              <td className="py-2.5 font-bold text-slate-400 w-5/12 uppercase tracking-wide text-[11px]">{spec.label}</td>
              <td className="py-2.5 text-slate-200 font-semibold">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
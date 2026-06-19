"use client";

import React, { useState } from "react";
import { useCart } from "@/app/CartContext"; 
import { useCompare } from "@/app/CompareContext"; // Karşılaştır motoru
import { ShoppingCart, Check, GitCompare } from "lucide-react";

export default function VitrinButon({ urun }: { urun: any }) {
  const { sepeteEkle } = useCart();
  const { karsilastirmayaEkle, setPopupAcik } = useCompare();
  const [eklendi, setEklendi] = useState(false);

  const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
  const havaleOrani = urun.havaleIndirimi !== undefined ? Number(urun.havaleIndirimi) : 5;
  const tukendiMi = urun.stokDurumu === "Tükendi" || urun.stokAdedi === 0 || urun.stokAdedi === "0";

  const handleEkle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    sepeteEkle({
      id: String(urun._id || urun.id),
      isim: urun.isim || urun.title || urun.name,
      fiyat: gecerliFiyat,
      resim: (urun.resimler && urun.resimler[0]) || urun.resim || urun.image || "/placeholder.jpg",
      adet: 1,
      varyasyon: "Standart Model",
      havaleIndirimi: havaleOrani,
      slug: urun.slug
    });

    setEklendi(true);
    setTimeout(() => setEklendi(false), 1500);
  };

  const handleKarsilastir = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    karsilastirmayaEkle(urun);
    if (typeof setPopupAcik === "function") setPopupAcik(true);
  };

  if (tukendiMi) {
    return (
      <div className="h-10 px-4 sm:h-11 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center cursor-not-allowed" title="Tükendi">
        <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Tükendi</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 relative z-[60] pointer-events-auto">
      <button 
        onClick={handleKarsilastir} 
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-black border border-white/5 text-gray-500 hover:border-white/30 hover:text-white transition-all"
        title="Karşılaştır"
      >
        <GitCompare className="w-4 h-4" />
      </button>
      <button 
        onClick={handleEkle} 
        disabled={eklendi}
        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all border ${
          eklendi 
          ? "bg-[#10b981] border-[#10b981] text-black scale-95" 
          : "bg-white/10 border-transparent text-white hover:bg-white hover:text-black"
        }`}
        title="Sepete Ekle"
      >
        {eklendi ? <Check className="w-5 h-5 animate-bounce" /> : <ShoppingCart className="w-4 h-4" />}
      </button>
    </div>
  );
}
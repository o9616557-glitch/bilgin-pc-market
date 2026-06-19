"use client";

import React, { useState } from "react";
import { useCart } from "@/app/CartContext"; 
import { ShoppingCart, Check } from "lucide-react";

export default function VitrinButon({ urun }: { urun: any }) {
  const { sepeteEkle } = useCart();
  const [eklendi, setEklendi] = useState(false);

  const normalFiyat = Number(urun.regular_price || urun.fiyat || urun.price || 0);
  const gecerliFiyat = Number(urun.indirimliFiyat || urun.price || urun.fiyat || 0);
  const havaleOrani = urun.havaleIndirimi !== undefined ? Number(urun.havaleIndirimi) : 5;

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

  return (
    <button 
      onClick={handleEkle} 
      disabled={eklendi}
      className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-300 pointer-events-auto border border-transparent shadow-md ${
        eklendi 
        ? "bg-[#10b981] text-white scale-95 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
        : "bg-[#2563eb] text-white hover:bg-[#00d2ff] hover:text-black"
      }`}
      title="Sepete Ekle"
    >
      {eklendi ? <Check className="w-5 h-5 animate-bounce" /> : <ShoppingCart className="w-4 h-4" />}
    </button>
  );
}
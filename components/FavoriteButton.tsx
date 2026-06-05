"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite?: boolean; // Sayfa ilk yüklendiğinde favori mi değil mi?
}

export default function FavoriteButton({ productId, initialIsFavorite = false }: FavoriteButtonProps) {
  const router = useRouter(); // 🚀 1. JET MOTORU TANIMLANDI
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link yönlendirmesini engeller (ürün detayına gitmemesi için)
    setIsLoading(true);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsFavorite(!isFavorite); // Durumu tersine çevir
        toast.success(data.message);
        
        // 🚀 2. BÜYÜLÜ KOD: Kalbe basıldığı an Next.js arka plandaki tüm sayfa hafızalarını temizler,
        // Favorilerim sayfasına tıkladığında ürünün şak diye orada görünmesini sağlar.
        router.refresh(); 
      } else {
        if (res.status === 401) {
          toast.error("Favorilere eklemek için lütfen giriş yapın.");
        } else {
          toast.error(data.message || "Bir hata oluştu.");
        }
      }
    } catch (error) {
      toast.error("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full border transition-all ${
        isFavorite 
          ? "bg-[#3b82f6]/10 border-[#3b82f6] text-[#3b82f6]" 
          : "bg-[#09090b]/50 border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label="Favorilere Ekle"
    >
      <Heart 
        size={20} 
        fill={isFavorite ? "#3b82f6" : "none"} 
        className={isFavorite ? "drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" : ""}
      />
    </button>
  );
}
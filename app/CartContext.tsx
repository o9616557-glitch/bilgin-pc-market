"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sepet, setSepet] = useState<any[]>([]);

  // 1. Sayfa ilk açıldığında bilgisayarın hafızasındaki (localStorage) sepeti getir
  useEffect(() => {
    const hafiza = localStorage.getItem("bilgin-sepet");
    if (hafiza) {
      setSepet(JSON.parse(hafiza));
    }
  }, []);

  // 2. Sepete Ekleme Motoru
  const sepeteEkle = (urun: any) => {
    setSepet((eskiSepet) => {
      // Ürün zaten sepette var mı kontrol et (Seçili varyasyon dahil)
      const varMi = eskiSepet.find(
        (item) => item.id === urun.id && item.varyasyon === urun.varyasyon
      );

      let yeniSepet;
      if (varMi) {
        // Varsa adetini 1 artır
        yeniSepet = eskiSepet.map((item) =>
          item.id === urun.id && item.varyasyon === urun.varyasyon
            ? { ...item, adet: item.adet + 1 }
            : item
        );
      } else {
        // Yoksa sepete yeni ürün olarak ekle (adeti 1 yap)
        yeniSepet = [...eskiSepet, { ...urun, adet: 1 }];
      }

      // Sepeti bilgisayarın çerezlerine kaydet (F5 yapınca silinmesin diye)
      localStorage.setItem("bilgin-sepet", JSON.stringify(yeniSepet));
      return yeniSepet;
    });

    // Ekranda havalı bir uyarı çıkar
    alert("EFSANE SEÇİM! 🛒 Ürün başarıyla sepete eklendi.");
  };

  return (
    <CartContext.Provider value={{ sepet, sepeteEkle }}>
      {children}
    </CartContext.Provider>
  );
}

// İŞTE VERCEL'İN BULAMADIĞI O KRİTİK EKSİK SATIR BURASIYDI:
export const useCart = () => useContext(CartContext);
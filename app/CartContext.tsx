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
      // Ürün zaten sepette var mı kontrol et
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
        // Yoksa sepete yeni ürün olarak ekle
        yeniSepet = [...eskiSepet, { ...urun, adet: 1 }];
      }

      // Sepeti kaydet
      localStorage.setItem("bilgin-sepet", JSON.stringify(yeniSepet));
      return yeniSepet;
    });
    
    // ŞEFİM, SİNİR BOZUCU UYARI (ALERT) MESAJI BURADAN TAMAMEN SİLİNDİ!
  };

  return (
    <CartContext.Provider value={{ sepet, sepeteEkle }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
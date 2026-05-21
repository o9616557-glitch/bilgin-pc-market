"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sepet, setSepet] = useState<any[]>([]);

  useEffect(() => {
    const hafiza = localStorage.getItem("bilgin-sepet");
    if (hafiza) setSepet(JSON.parse(hafiza));
  }, []);

  const sepeteEkle = (urun: any) => {
    setSepet((eskiSepet) => {
      const varMi = eskiSepet.find((i) => i.id === urun.id && i.varyasyon === urun.varyasyon);
      let yeni;
      if (varMi) {
        yeni = eskiSepet.map((i) => i.id === urun.id && i.varyasyon === urun.varyasyon ? { ...i, adet: i.adet + 1 } : i);
      } else {
        yeni = [...eskiSepet, { ...urun, adet: 1 }];
      }
      localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
      return yeni;
    });
  };

  // --- YENİ YETENEKLER ---
  const sepettenSil = (id: string, varyasyon: string) => {
    const yeni = sepet.filter((i) => !(i.id === id && i.varyasyon === varyasyon));
    setSepet(yeni);
    localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
  };

  const adetGuncelle = (id: string, varyasyon: string, miktar: number) => {
    const yeni = sepet.map((i) => {
      if (i.id === id && i.varyasyon === varyasyon) {
        const yeniAdet = Math.max(1, i.adet + miktar);
        return { ...i, adet: yeniAdet };
      }
      return i;
    });
    setSepet(yeni);
    localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
  };

  return (
    <CartContext.Provider value={{ sepet, sepeteEkle, sepettenSil, adetGuncelle }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
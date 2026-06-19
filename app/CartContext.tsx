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
      
      const urunId = String(urun.id || urun._id);
      const urunSlug = urun.slug || "";
      const urunVaryasyon = urun.varyasyon || "Standart Model";

      // 🚀 TİTANYUM ZIRH: Hem ID'ye hem _id'ye hem de Slug'a (URL) bakarak eşleştirme yapar!
      const varMi = eskiSepet.find((i) => {
        const idEslesiyor = String(i.id || i._id) === urunId;
        const slugEslesiyor = (i.slug && urunSlug) ? i.slug === urunSlug : false;
        const varyasyonEslesiyor = (i.varyasyon || "Standart Model") === urunVaryasyon;
        
        return (idEslesiyor || slugEslesiyor) && varyasyonEslesiyor;
      });
      
      let yeni;
      if (varMi) {
        yeni = eskiSepet.map((i) => {
          const idEslesiyor = String(i.id || i._id) === urunId;
          const slugEslesiyor = (i.slug && urunSlug) ? i.slug === urunSlug : false;
          const varyasyonEslesiyor = (i.varyasyon || "Standart Model") === urunVaryasyon;

          if ((idEslesiyor || slugEslesiyor) && varyasyonEslesiyor) {
            return { ...i, ...urun, adet: i.adet + 1 };
          }
          return i;
        });
      } else {
        yeni = [...eskiSepet, { ...urun, id: urunId, varyasyon: urunVaryasyon, adet: 1 }];
      }
      
      localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
      return yeni;
    });
  };

  const sepettenSil = (id: string, varyasyon: string, slug?: string) => {
    const arananId = String(id);
    const arananVaryasyon = varyasyon || "Standart Model";
    
    const yeni = sepet.filter((i) => {
      const idEslesiyor = String(i.id || i._id) === arananId;
      const slugEslesiyor = (i.slug && slug) ? i.slug === slug : false;
      const varyasyonEslesiyor = (i.varyasyon || "Standart Model") === arananVaryasyon;
      
      return !((idEslesiyor || slugEslesiyor) && varyasyonEslesiyor);
    });
    
    setSepet(yeni);
    localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
  };

  const adetGuncelle = (id: string, varyasyon: string, miktar: number, slug?: string) => {
    const arananId = String(id);
    const arananVaryasyon = varyasyon || "Standart Model";

    const yeni = sepet.map((i) => {
      const idEslesiyor = String(i.id || i._id) === arananId;
      const slugEslesiyor = (i.slug && slug) ? i.slug === slug : false;
      const varyasyonEslesiyor = (i.varyasyon || "Standart Model") === arananVaryasyon;

      if ((idEslesiyor || slugEslesiyor) && varyasyonEslesiyor) {
        const yeniAdet = Math.max(1, i.adet + miktar);
        return { ...i, adet: yeniAdet };
      }
      return i;
    });
    setSepet(yeni);
    localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
  };

  const sepetiBosalt = () => {
    setSepet([]);
    localStorage.setItem("bilgin-sepet", "[]");
  };

  return (
    <CartContext.Provider value={{ sepet, sepeteEkle, sepettenSil, adetGuncelle, sepetiBosalt}}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
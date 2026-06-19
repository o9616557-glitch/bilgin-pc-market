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
      // 🚀 BİNGO 1: KİMLİK UYUŞMAZLIĞINI ÇÖZEN AMELİYAT!
      // Nereden eklenirse eklensin (Katalog veya Detay), ID'yi ve Varyasyonu tek tipe çeviriyoruz.
      const urunId = String(urun.id || urun._id);
      const urunVaryasyon = urun.varyasyon || "Standart Model";

      // Sepette ararken de artık standartlaşmış kimliklerle arıyoruz
      const varMi = eskiSepet.find(
        (i) => String(i.id || i._id) === urunId && (i.varyasyon || "Standart Model") === urunVaryasyon
      );
      
      let yeni;
      if (varMi) {
        // Ürün zaten sepette varsa sadece adeti artır ve bilgileri (örn: fiyat) güncelle
        yeni = eskiSepet.map((i) => 
          String(i.id || i._id) === urunId && (i.varyasyon || "Standart Model") === urunVaryasyon 
            ? { ...i, ...urun, id: urunId, varyasyon: urunVaryasyon, adet: i.adet + 1 } 
            : i
        );
      } else {
        // Ürün sepette yoksa yeni bir satır olarak ekle
        yeni = [...eskiSepet, { ...urun, id: urunId, varyasyon: urunVaryasyon, adet: 1 }];
      }
      
      localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
      return yeni;
    });
  };

  // --- YENİ YETENEKLER (Silme ve Güncelleme de Akıllandırıldı) ---
  const sepettenSil = (id: string, varyasyon: string) => {
    const arananId = String(id);
    const arananVaryasyon = varyasyon || "Standart Model";
    
    const yeni = sepet.filter((i) => !(String(i.id || i._id) === arananId && (i.varyasyon || "Standart Model") === arananVaryasyon));
    setSepet(yeni);
    localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
  };

  const adetGuncelle = (id: string, varyasyon: string, miktar: number) => {
    const arananId = String(id);
    const arananVaryasyon = varyasyon || "Standart Model";

    const yeni = sepet.map((i) => {
      if (String(i.id || i._id) === arananId && (i.varyasyon || "Standart Model") === arananVaryasyon) {
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
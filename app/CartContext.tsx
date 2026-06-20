"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sepet, setSepet] = useState<any[]>([]);

  useEffect(() => {
    // 1. ÖNCE LOKAL HAFIZAYI AL (Sitenin ışık hızında açılması için)
    const hafiza = localStorage.getItem("bilgin-sepet");
    if (hafiza) setSepet(JSON.parse(hafiza));

    const buluttanGetir = async () => {
      try {
        const res = await fetch("/api/sepet");
        const data = await res.json();
        
        // 🚀 BİNGO: .length > 0 şartını kaldırdık! Artık telefonda sepet sıfırlansa bile PC bunu anlar.
        if (data.success && data.cart) {
          setSepet(data.cart);
          localStorage.setItem("bilgin-sepet", JSON.stringify(data.cart));
        }
      } catch (error) {
        // Hata olursa sessiz kal, lokal sepet çalışmaya devam eder
      }
    };

    buluttanGetir();

    // 🚀 PREMIUM CANLI SENKRONİZASYON: 
    // Müşteri telefonda işlem yapıp PC sekmesine geri döndüğü (odaklandığı) an sepet anında güncellenir!
    window.addEventListener("focus", buluttanGetir);
    return () => window.removeEventListener("focus", buluttanGetir);
  }, []);
  // 🚀 BULUT YEDEKLEME MOTORU (Lokal sepeti asla bozmaz, sadece arkadan kopyasını yollar)
  const bulutaYedekle = async (guncelSepet: any[]) => {
    try {
      await fetch("/api/sepet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: guncelSepet }),
      });
    } catch (error) {
      // İnternet kopsa bile lokal sepet çalışmaya devam eder, müşteri asla hata görmez
    }
  };

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
      bulutaYedekle(yeni); // 🔥 Eklendikten sonra buluta kopyasını yolla
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
    bulutaYedekle(yeni); // 🔥 Silindikten sonra bulutu güncelle
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
    bulutaYedekle(yeni); // 🔥 Adet değiştikten sonra bulutu güncelle
  };

  const sepetiBosalt = () => {
    setSepet([]);
    localStorage.setItem("bilgin-sepet", "[]");
    bulutaYedekle([]); // 🔥 Sepet boşalınca bulutu da temizle
  };

  return (
    // Ufak bir düzeltme: Sepet sayfasında `sepetiTemizle` kullanmışsın, hata vermesin diye onu da ekledim.
    <CartContext.Provider value={{ sepet, sepeteEkle, sepettenSil, adetGuncelle, sepetiBosalt, sepetiTemizle: sepetiBosalt }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
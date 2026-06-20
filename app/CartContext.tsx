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
        // Ön belleğe takılmaması için sonuna saat damgası ekledik
        const res = await fetch("/api/sepet?t=" + new Date().getTime(), { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });
        const data = await res.json();
        
        if (data.success && data.cart) {
          // EKRAN TİTREMESİN DİYE AKILLI KONTROL
          setSepet((eskiSepet) => {
            const eskiDurum = JSON.stringify(eskiSepet);
            const yeniDurum = JSON.stringify(data.cart);
            
            if (eskiDurum !== yeniDurum) {
              localStorage.setItem("bilgin-sepet", yeniDurum);
              return data.cart;
            }
            return eskiSepet; 
          });
        }
      } catch (error) {
        // Hata olursa sessiz kal
      }
    };

    // İlk açılışta bir kez çalıştır
    buluttanGetir();

    // 🚀 SADECE SEKMEYE GERİ DÖNÜLDÜĞÜNDE GÜNCELLER (SİSTEMİ YORMAZ)
    window.addEventListener("focus", buluttanGetir);

    return () => {
      window.removeEventListener("focus", buluttanGetir);
    };
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

const sepeteEkle = (urun: any, topluIslemMi = false) => {
    setSepet((eskiSepet) => {
      // Gelen ürünün verilerini temizleyip standart hale getiriyoruz
      const urunId = String(urun.id || urun._id);
      const urunVaryasyon = urun.varyasyon || "Standart Model";
      
      // 🚀 AYNI ÜRÜNÜ YAKALAMA RADARI:
      // Eğer gelen ürünün ID'si ve Varyasyonu sepetteki bir ürünle BİREBİR aynıysa yakala!
      const varMi = eskiSepet.find((i) => {
        const idEslesiyor = String(i.id || i._id) === urunId;
        const varyasyonEslesiyor = (i.varyasyon || "Standart Model") === urunVaryasyon;
        return idEslesiyor && varyasyonEslesiyor;
      });
      
      let yeni;
      if (varMi) {
        // 🚀 BİRLEŞTİRME MOTORU: Ürün zaten sepette varmış! 
        // Ayrı satır açma, o ürünü bul ve adedini 1 arttır (veya gelen adet kadar ekle)
        yeni = eskiSepet.map((i) => {
          const idEslesiyor = String(i.id || i._id) === urunId;
          const varyasyonEslesiyor = (i.varyasyon || "Standart Model") === urunVaryasyon;

          if (idEslesiyor && varyasyonEslesiyor) {
            const eklenecekAdet = urun.adet || 1;
            return { ...i, adet: i.adet + eklenecekAdet };
          }
          return i;
        });
      } else {
        // Ürün sepette ilk defa boy gösterecek, sıfırdan ekle
        yeni = [...eskiSepet, { ...urun, id: urunId, varyasyon: urunVaryasyon, adet: urun.adet || 1 }];
      }
      
      // Deftere (lokale) jilet gibi işliyoruz
      localStorage.setItem("bilgin-sepet", JSON.stringify(yeni));
      
      // Toplu işlem değilse (tekil tıklandıysa) buluta kopyasını fırlat
      if (!topluIslemMi) {
        bulutaYedekle(yeni); 
      }
      
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
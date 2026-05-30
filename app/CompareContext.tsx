"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import toast from "react-hot-toast";

type Urun = any;

interface CompareContextType {
  karsilastirilanlar: Urun[];
  karsilastirmayaEkle: (urun: Urun) => void;
  karsilastirmadanCikar: (id: string) => void;
  karsilastirmayiTemizle: () => void;
  popupAcik: boolean;
  setPopupAcik: (durum: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [karsilastirilanlar, setKarsilastirilanlar] = useState<Urun[]>([]);
  const [popupAcik, setPopupAcik] = useState(false);

  const karsilastirmayaEkle = (urun: Urun) => {
    setKarsilastirilanlar((prev) => {
      // 1. ZIRH: Zaten ekliyse şık bir uyarı ver ve ekleme
      if (prev.find((u) => (u._id || u.id) === (urun._id || urun.id))) {
        toast("Bu ürün zaten karşılaştırma listesinde! ⚖️", {
          style: { background: "#121215", color: "#fff", border: "1px solid #334155", borderRadius: "12px", fontSize: "14px", fontWeight: "bold" },
          icon: "👀",
        });
        return prev;
      }
      
      // 2. ZIRH: Maksimum 3 ürün (İlkel alert silindi, VIP Toast eklendi!)
      if (prev.length >= 3) {
        toast.error("En fazla 3 ürün karşılaştırabilirsiniz!", {
          style: { 
            background: "#09090b", 
            color: "#fff", 
            border: "1px solid #ef4444", 
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)"
          },
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        });
        return prev;
      }
      
      // Başarıyla eklenirse (Opsiyonel olarak buraya da yeşil eklendi bildirimi koyabiliriz ama darlamayalım müşteriyi)
      return [...prev, urun];
    });
  };

  const karsilastirmadanCikar = (id: string) => {
    setKarsilastirilanlar((prev) => prev.filter((u) => (u._id || u.id) !== id));
  };

  const karsilastirmayiTemizle = () => {
    setKarsilastirilanlar([]);
    setPopupAcik(false);
  };

  return (
    <CompareContext.Provider value={{ karsilastirilanlar, karsilastirmayaEkle, karsilastirmadanCikar, karsilastirmayiTemizle, popupAcik, setPopupAcik }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare, CompareProvider içinde kullanılmalıdır.");
  return context;
}
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

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
      // Zaten ekliyse ekleme
      if (prev.find((u) => (u._id || u.id) === (urun._id || urun.id))) return prev;
      // Maksimum 3 ürün karşılaştırılabilir (telefonda patlamaması için)
      if (prev.length >= 3) {
        alert("En fazla 3 ürün karşılaştırabilirsiniz.");
        return prev;
      }
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
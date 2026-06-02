"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";

// Depomuzun iskeleti
type UserContextType = {
  kullanici: any;
  favoriler: any[];
  veriYukleniyor: boolean;
  setFavoriler: (veri: any) => void; // Favori ekle/çıkar yaparken anında güncellensin diye
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession(); // Next-Auth'tan giriş bilgisini alıyoruz
  const [favoriler, setFavoriler] = useState<any[]>([]);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);

  useEffect(() => {
    // 1. Durum: Sistem hala müşterinin kim olduğunu anlamaya çalışıyor (Bekle)
    if (status === "loading") return;

    // 2. Durum: Müşteri giriş yapmış! (Hemen verileri çek)
    if (status === "authenticated") {
      setVeriYukleniyor(true);
      // MongoDB'ye gidip favorileri çekiyoruz (Senin kendi api yoluna göre burası değişebilir)
      fetch("/api/favoriler") 
        .then((res) => res.json())
        .then((data) => {
          setFavoriler(data);
          setVeriYukleniyor(false);
        })
        .catch((err) => {
          console.error("Favoriler çekilirken hata:", err);
          setVeriYukleniyor(false);
        });
    } 
    // 3. Durum: Ziyaretçi giriş yapmamış
    else {
      setFavoriler([]);
      setVeriYukleniyor(false);
    }
  }, [status, session]); // Giriş durumu değiştiğinde bu motor tekrar çalışır

  return (
    <UserContext.Provider value={{ kullanici: session?.user, favoriler, veriYukleniyor, setFavoriler }}>
      {children}
    </UserContext.Provider>
  );
}

// Sayfalarda kullanacağımız sihirli kanca
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser sadece UserProvider içinde kullanılabilir");
  }
  return context;
};
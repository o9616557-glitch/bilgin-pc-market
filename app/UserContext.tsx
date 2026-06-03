"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";

type UserContextType = {
  kullanici: any;
  favoriler: any[];
  veriYukleniyor: boolean;
  setFavoriler: (veri: any) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [favoriler, setFavoriler] = useState<any[]>([]);
  const [veriYukleniyor, setVeriYukleniyor] = useState(true);

  useEffect(() => {
    // 🚀 SİHİRLİ DOKUNUŞ: Sayfa açılır açılmaz önce Torpido Gözüne (LocalStorage) bak!
    // Varsa anında ekrana bas, müşteri 1 salise bile beklemesin.
    const torpidoFavoriler = localStorage.getItem("bilgin_favoriler");
    if (torpidoFavoriler) {
      setFavoriler(JSON.parse(torpidoFavoriler));
      setVeriYukleniyor(false); // Veri torpidodan geldi, yükleme ekranını kapat
    }

    if (status === "loading") return;

    if (status === "authenticated") {
      // Arka planda sessizce veritabanına gidip en güncel listeyi alıyoruz
      fetch("/api/favoriler")
        .then((res) => res.json())
        .then((data) => {
          setFavoriler(data); // Ekrandaki listeyi güncel tut
          setVeriYukleniyor(false);
          // Gelen taze veriyi bir sonraki giriş için torpidoya yedekle
          localStorage.setItem("bilgin_favoriler", JSON.stringify(data));
        })
        .catch((err) => {
          console.error("Favoriler çekilirken hata:", err);
          setVeriYukleniyor(false);
        });
    } else {
      // Müşteri çıkış yaparsa torpidoyu da temizle
      setFavoriler([]);
      localStorage.removeItem("bilgin_favoriler");
      setVeriYukleniyor(false);
    }
  }, [status, session]);

  return (
    <UserContext.Provider value={{ kullanici: session?.user, favoriler, veriYukleniyor, setFavoriler }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser sadece UserProvider içinde kullanılabilir");
  }
  return context;
};
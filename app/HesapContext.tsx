"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// RAM'de tutacağımız verilerin şablonu
interface HesapContextType {
  siparisler: any[];
  favoriler: any[];
  adresler: any[];
  sistemler: any[];
  ramYukleniyor: boolean;
  verileriRAMeCek: () => void;
}

const HesapContext = createContext<HesapContextType | undefined>(undefined);

export function HesapProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  // 🚀 İŞTE DDR5 RAM BELLEKLERİMİZ (State'ler)
  const [siparisler, setSiparisler] = useState<any[]>([]);
  const [favoriler, setFavoriler] = useState<any[]>([]);
  const [adresler, setAdresler] = useState<any[]>([]);
  const [sistemler, setSistemler] = useState<any[]>([]);
  const [ramYukleniyor, setRamYukleniyor] = useState(true);

  // 🥷 NİNJA ÇIRAK ARTIK BURADA ÇALIŞIYOR (Sessizce API'den alıp RAM'e yazar)
  const verileriRAMeCek = async () => {
    if (!session?.user?.email) {
      setRamYukleniyor(false);
      return;
    }

    const timestamp = new Date().getTime();
    setRamYukleniyor(true);

    try {
      // 4 koldan paralel olarak verileri çekip anında RAM'e (State'e) yazıyoruz
      Promise.all([
        fetch("/api/siparislerim?t=" + timestamp).then(res => res.json()).then(d => d.success && setSiparisler(d.siparisler || d.data || [])).catch(() => {}),
        fetch("/api/favorilerim?t=" + timestamp).then(res => res.json()).then(d => d.success && setFavoriler(d.favoriler || d.data || [])).catch(() => {}),
        fetch("/api/adreslerim?t=" + timestamp).then(res => res.json()).then(d => d.success && setAdresler(d.adresler || d.data || [])).catch(() => {}),
        fetch("/api/sistemlerim?t=" + timestamp).then(res => res.json()).then(d => d.success && setSistemler(d.systems || [])).catch(() => {})
      ]).finally(() => {
        setRamYukleniyor(false);
      });
    } catch (error) {
      setRamYukleniyor(false);
    }
  };

  // Müşteri siteye girdiği an RAM dolsun
  useEffect(() => {
    verileriRAMeCek();
  }, [session]);

  return (
    <HesapContext.Provider value={{ siparisler, favoriler, adresler, sistemler, ramYukleniyor, verileriRAMeCek }}>
      {children}
    </HesapContext.Provider>
  );
}

// Sayfaların bu RAM'e bağlanmasını sağlayacak kablo
export function useHesap() {
  const context = useContext(HesapContext);
  if (!context) throw new Error("useHesap, HesapProvider içinde kullanılmalıdır!");
  return context;
}
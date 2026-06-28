"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalKalkan() {
  const { data: session, update } = useSession();
  const pathname = usePathname(); // 🚀 Dürbün: Adamın sitede hangi sayfaya gittiğini takip eder

  // 1. GÖREV: Adam sitede herhangi bir yere tıkladığında (sayfa değiştiğinde) anında kontrol et!
  useEffect(() => {
    update(); // Sunucuya "Bilet hala geçerli mi?" diye sessizce sorar
  }, [pathname, update]); 

  // 2. GÖREV: Adam hiçbir yere tıklamayıp ekrana baksa bile her 15 saniyede bir gizlice kontrol et!
  useEffect(() => {
    const radar = setInterval(() => {
      update();
    }, 15000); // 15 saniye (15000 milisaniye)
    
    return () => clearInterval(radar);
  }, [update]);

  // 3. GÖREV: Merkezden "Kovuldu" (KickedOut) damgası gelirse acımadan şutla!
  useEffect(() => {
    if ((session as any)?.error === "KickedOut") {
      signOut({ callbackUrl: "/giris?error=BaskaCihazdanKapatildi" });
    }
  }, [session]);

  return null; 
}
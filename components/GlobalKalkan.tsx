"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function GlobalKalkan() {
  const { data: session } = useSession();

  useEffect(() => {
    // 🚀 TypeScript müfettişini susturmak için '(session as any)' kullanıyoruz.
    // Eğer arka plandaki motor adama "KickedOut" (Kovuldu) damgası vurduysa...
    if ((session as any)?.error === "KickedOut") {
      // Acımadan, anında sistemden şutla ve giriş sayfasına fırlat!
      signOut({ callbackUrl: "/giris?error=BaskaCihazdanKapatildi" });
    }
  }, [session]); // Adam sitede her tık yaptığında veya sekmeye her döndüğünde kontrol eder

  return null; // Görünmezdir, ekranda zerre yer kaplamaz.
}
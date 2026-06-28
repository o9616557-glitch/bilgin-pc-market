"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalKalkan() {
  const { data: session, update } = useSession();
  const pathname = usePathname(); // Sitenin hangi sayfasında olduğumuzu söyler

  // 🚀 BİNGO: Eğer kullanıcı zaten giriş sayfasındaysa bu kalkan tamamen UYUSUN!
  // Giriş sayfasında bu kodun çalışması NextAuth'u kilitler ve sahte onay mesajları çıkartır.
  if (pathname === "/giris") return null;

  // 1. GÖREV: Adam sitede herhangi bir yere tıkladığında (sayfa değiştiğinde) kontrol et
  useEffect(() => {
    if (!session) return; // Giriş yoksa boşuna istek atma
    update();
  }, [pathname, update, session]); 

  // 2. GÖREV: Adam ekrana bakarken her 15 saniyede bir sessizce kontrol et
  useEffect(() => {
    if (!session) return;
    const radar = setInterval(() => {
      update();
    }, 15000);
    
    return () => clearInterval(radar);
  }, [update, session]);

  // 3. GÖREV: Merkezden "Kovuldu" (KickedOut) damgası gelirse şutla
  useEffect(() => {
    if ((session as any)?.error === "KickedOut") {
      signOut({ callbackUrl: "/giris?error=BaskaCihazdanKapatildi" });
    }
  }, [session]);

  return null; 
}
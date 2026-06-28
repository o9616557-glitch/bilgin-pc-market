"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalKalkan() {
  const { data: session, update } = useSession();
  const pathname = usePathname();

  // 🚀 BİNGO: Sayfa adında "giris" veya "login" geçiyorsa kalkan uyusun (sonsuz döngüyü engeller)
  if (pathname && (pathname.includes("/giris") || pathname.includes("/login"))) {
    return null;
  }

  useEffect(() => {
    if (!session) return;
    update();
  }, [pathname, update, session]); 

  useEffect(() => {
    if (!session) return;
    const radar = setInterval(() => {
      update();
    }, 15000);
    
    return () => clearInterval(radar);
  }, [update, session]);

  useEffect(() => {
    if ((session as any)?.error === "KickedOut") {
      // 🚀 RİSKSİZ ATIŞ: Adamı şutla ve doğrudan Anasayfaya (/) fırlat!
      // Böylece 404 Not Found (This page...) hatası alma ihtimalini sıfırladık.
      signOut({ callbackUrl: "/" });
    }
  }, [session]);

  return null; 
}
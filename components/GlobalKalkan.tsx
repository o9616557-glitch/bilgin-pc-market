"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function GlobalKalkan() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const isKicking = useRef(false); // 🚀 Şutlama işlemini sadece 1 kez yapması için kilit

  // 1. GÖREV: Adam sayfa değiştirdiğinde kontrol et
  useEffect(() => {
    // Giriş sayfasındaysak veya oturum yoksa hiçbir şey yapma
    if (pathname && (pathname.includes("/giris") || pathname.includes("/login"))) return;
    if (status === "authenticated") update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Sadece sayfa yolu değiştiğinde tetiklenir

  // 2. GÖREV: Adam fareye dokunmadan dururken her 15 saniyede bir kontrol et
  useEffect(() => {
    if (pathname && (pathname.includes("/giris") || pathname.includes("/login"))) return;
    if (status !== "authenticated") return;

    const radar = setInterval(() => {
      update();
    }, 15000);

    return () => clearInterval(radar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, status]);

  // 3. GÖREV: Merkezden "Kovuldu" (KickedOut) damgası gelirse şutla
  useEffect(() => {
    // Damga varsa ve henüz şutlanmadıysa...
    if ((session as any)?.error === "KickedOut" && !isKicking.current) {
      isKicking.current = true; // Kilidi kapat, böylece sonsuz döngüye girip siteyi çökertmez
      signOut({ callbackUrl: "/" }); // Anasayfaya fırlat
    }
  }, [session]);

  return null; 
}
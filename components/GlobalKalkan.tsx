"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function GlobalKalkan() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const isKicking = useRef(false); // 🚀 Şutlama işlemini sadece 1 kez yapması için kilit

  // 1. GÖREV: Periyodik güvenlik kontrolü (sayfa değişiminde oturum yenileme kaldırıldı — gereksiz loading yapıyordu)
  useEffect(() => {
    if (pathname && (pathname.includes("/giris") || pathname.includes("/login"))) return;
    if (status !== "authenticated") return;

    const radar = setInterval(() => {
      update();
    }, 60000);

    return () => clearInterval(radar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, status]);

  // 2. GÖREV: Merkezden "Kovuldu" (KickedOut) damgası gelirse şutla
  useEffect(() => {
    // Damga varsa ve henüz şutlanmadıysa...
    if ((session as any)?.error === "KickedOut" && !isKicking.current) {
      isKicking.current = true; // Kilidi kapat, böylece sonsuz döngüye girip siteyi çökertmez
      signOut({ callbackUrl: "/" }); // Anasayfaya fırlat
    }
  }, [session]);

  return null; 
}
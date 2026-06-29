"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { temizleIyzicoKalintilari, sifirlaSayfaKilidi } from "@/lib/iyzico-checkout";

/** Ödeme sayfasından çıkınca İyzico overlay ve body kilidini temizler. */
export default function NavigasyonTemizleyici() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.includes("/odeme")) {
      temizleIyzicoKalintilari();
      sifirlaSayfaKilidi();
    }
  }, [pathname]);

  return null;
}

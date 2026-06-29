"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { temizleOdemeSayfasiKalintilari } from "@/lib/iyzico-checkout";

/** İyzico açıkken anasayfa/geri ile çıkıldığında iframe kalıntısını temizler. */
export default function NavigasyonTemizleyici() {
  const pathname = usePathname();
  const oncekiPath = useRef(pathname);

  useEffect(() => {
    const odemedenCikildi =
      oncekiPath.current?.includes("/odeme") && !pathname?.includes("/odeme");

    oncekiPath.current = pathname;

    if (odemedenCikildi) {
      requestAnimationFrame(() => temizleOdemeSayfasiKalintilari());
    }
  }, [pathname]);

  return null;
}

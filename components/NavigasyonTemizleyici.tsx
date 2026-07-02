"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { temizleOdemeSayfasiKalintilari, sifirlaSayfaKilidi } from "@/lib/iyzico-checkout";

/** İyzico açıkken anasayfa/geri ile çıkıldığında iframe kalıntısını temizler. */
export default function NavigasyonTemizleyici() {
  const pathname = usePathname();
  const oncekiPath = useRef(pathname);

  useEffect(() => {
    sifirlaSayfaKilidi();
    document.documentElement.classList.remove("iyzico-tam-ekran");
    document.body.classList.remove("iyzico-tam-ekran");
  }, []);

  useEffect(() => {
    const odemedenCikildi =
      oncekiPath.current?.includes("/odeme") && !pathname?.includes("/odeme");

    oncekiPath.current = pathname;

    sifirlaSayfaKilidi();

    if (odemedenCikildi) {
      requestAnimationFrame(() => temizleOdemeSayfasiKalintilari());
    }
  }, [pathname]);

  return null;
}

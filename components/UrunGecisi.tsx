"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type GecisFazi = "idle" | "cikis" | "giris";

/** Ürün linkine tıklanınca hafif karartma — yalnızca mobil. */
export default function UrunGecisi() {
  const pathname = usePathname();
  const [faz, setFaz] = useState<GecisFazi>("idle");
  const [mobil, setMobil] = useState(false);
  const oncekiPath = useRef(pathname);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const guncelle = () => setMobil(mq.matches);
    guncelle();
    mq.addEventListener("change", guncelle);
    return () => mq.removeEventListener("change", guncelle);
  }, []);

  useEffect(() => {
    if (!mobil) return;

    const urunLinkiMi = (hedef: EventTarget | null) => {
      const el = (hedef as Element | null)?.closest("a[href^='/product/']");
      if (!el) return false;
      const anchor = el as HTMLAnchorElement;
      if (anchor.target === "_blank") return false;
      return true;
    };

    const tikla = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!urunLinkiMi(e.target)) return;
      setFaz("cikis");
    };

    document.addEventListener("click", tikla, true);
    return () => document.removeEventListener("click", tikla, true);
  }, [mobil]);

  useEffect(() => {
    if (!mobil) {
      setFaz("idle");
      return;
    }

    if (oncekiPath.current === pathname) return;

    const urunSayfasi = pathname?.startsWith("/product/");
    oncekiPath.current = pathname;

    if (urunSayfasi) {
      setFaz("giris");
      const zamanlayici = window.setTimeout(() => setFaz("idle"), 340);
      return () => window.clearTimeout(zamanlayici);
    }

    setFaz("idle");
  }, [pathname, mobil]);

  if (!mobil || faz === "idle") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[88] pointer-events-none transition-opacity duration-300 ease-out ${
        faz === "cikis" ? "opacity-100 bg-[#050814]/45" : "opacity-0 bg-[#050814]/0"
      }`}
    />
  );
}

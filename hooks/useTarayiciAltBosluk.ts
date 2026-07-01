"use client";

import { useEffect, useState } from "react";

/** Chrome mobil alt araç çubuğu — fixed bar'ın üstüne binmesin diye boşluk hesaplar. */
export function useTarayiciAltBosluk() {
  const [altBosluk, setAltBosluk] = useState(0);

  useEffect(() => {
    const guncelle = () => {
      const vv = window.visualViewport;
      if (!vv) {
        setAltBosluk(0);
        return;
      }
      const tarayiciPayi = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      setAltBosluk(tarayiciPayi);
    };

    guncelle();
    window.visualViewport?.addEventListener("resize", guncelle);
    window.visualViewport?.addEventListener("scroll", guncelle);
    window.addEventListener("resize", guncelle);
    window.addEventListener("orientationchange", guncelle);

    return () => {
      window.visualViewport?.removeEventListener("resize", guncelle);
      window.visualViewport?.removeEventListener("scroll", guncelle);
      window.removeEventListener("resize", guncelle);
      window.removeEventListener("orientationchange", guncelle);
    };
  }, []);

  return altBosluk;
}

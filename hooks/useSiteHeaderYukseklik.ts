"use client";

import { useEffect, useState } from "react";

/** Üst header'ın gerçek piksel yüksekliği — sticky çubuklar tam hizalanır. */
export function useSiteHeaderYukseklik() {
  const [yukseklik, setYukseklik] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const olc = () => {
      const h = Math.round(header.getBoundingClientRect().height);
      if (h > 0) setYukseklik(h);
    };

    olc();
    const gozlemci = new ResizeObserver(olc);
    gozlemci.observe(header);
    window.addEventListener("resize", olc);

    return () => {
      gozlemci.disconnect();
      window.removeEventListener("resize", olc);
    };
  }, []);

  return yukseklik;
}

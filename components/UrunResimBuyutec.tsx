"use client";

import { useCallback, useState } from "react";

const BUYUTEC_ORANI = 2.5;
const PANEL_GENISLIK_CARPANI = 1;
const PANEL_YUKSEKLIK_CARPANI = 1.38;

export type BuyutecLens = {
  mouseX: number;
  mouseY: number;
  imgX: number;
  imgY: number;
  imgW: number;
  imgH: number;
  containerW: number;
  containerH: number;
};

function lensKonumu(lens: BuyutecLens) {
  const lensW = lens.imgW / BUYUTEC_ORANI;
  const lensH = lens.imgH / BUYUTEC_ORANI;
  const relX = lens.mouseX - lens.imgX;
  const relY = lens.mouseY - lens.imgY;
  let left = lens.imgX + relX - lensW / 2;
  let top = lens.imgY + relY - lensH / 2;
  left = Math.max(lens.imgX, Math.min(left, lens.imgX + lens.imgW - lensW));
  top = Math.max(lens.imgY, Math.min(top, lens.imgY + lens.imgH - lensH));
  return { left, top, lensW, lensH, relLensX: left - lens.imgX, relLensY: top - lens.imgY };
}

export function useUrunResimBuyutec(aktif: boolean) {
  const [hovering, setHovering] = useState(false);
  const [lens, setLens] = useState<BuyutecLens | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!aktif) return;
      const container = e.currentTarget;
      const img = container.querySelector("[data-zoom-img]") as HTMLImageElement | null;
      if (!img) return;

      const cRect = container.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      const offsetX = iRect.left - cRect.left;
      const offsetY = iRect.top - cRect.top;
      const imgW = iRect.width;
      const imgH = iRect.height;

      const relX = e.clientX - iRect.left;
      const relY = e.clientY - iRect.top;

      if (relX < 0 || relY < 0 || relX > imgW || relY > imgH) {
        setHovering(false);
        setLens(null);
        return;
      }

      setHovering(true);
      setLens({
        mouseX: e.clientX - cRect.left,
        mouseY: e.clientY - cRect.top,
        imgX: offsetX,
        imgY: offsetY,
        imgW,
        imgH,
        containerW: cRect.width,
        containerH: cRect.height,
      });
    },
    [aktif]
  );

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    setLens(null);
  }, []);

  return { hovering, lens, handleMouseMove, handleMouseLeave };
}

export function UrunResimLens({ lens }: { lens: BuyutecLens }) {
  const { left, top, lensW, lensH } = lensKonumu(lens);

  return (
    <div
      className="absolute pointer-events-none z-20 hidden md:block border border-[#00d2ff]/90 bg-[#00d2ff]/[0.06] rounded-md shadow-[inset_0_0_0_1px_rgba(0,210,255,0.25)] backdrop-blur-[1px]"
      style={{ left, top, width: lensW, height: lensH }}
      aria-hidden
    />
  );
}

export function UrunResimBuyutecPanel({
  lens,
  resimSrc,
  visible,
}: {
  lens: BuyutecLens;
  resimSrc: string;
  visible: boolean;
}) {
  if (!visible) return null;

  const { relLensX, relLensY } = lensKonumu(lens);
  const panelW = lens.containerW * PANEL_GENISLIK_CARPANI;
  const panelH = lens.containerH * PANEL_YUKSEKLIK_CARPANI;
  const bgScaleX = BUYUTEC_ORANI * PANEL_GENISLIK_CARPANI;
  const bgScaleY = BUYUTEC_ORANI * PANEL_YUKSEKLIK_CARPANI;

  return (
    <div
      className="hidden md:block absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-[200] rounded-2xl border border-white/10 bg-[#070707] overflow-hidden pointer-events-none shadow-[0_30px_70px_rgba(0,0,0,0.9)] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-150"
      style={{
        width: panelW,
        height: panelH,
        backgroundImage: `url(${resimSrc})`,
        backgroundSize: `${lens.imgW * bgScaleX}px ${lens.imgH * bgScaleY}px`,
        backgroundPosition: `${lens.imgX * PANEL_GENISLIK_CARPANI - relLensX * bgScaleX}px ${lens.imgY * PANEL_YUKSEKLIK_CARPANI - relLensY * bgScaleY}px`,
        backgroundRepeat: "no-repeat",
      }}
      aria-hidden
    />
  );
}

"use client";

import { useRef, useState } from "react";

export default function UrunGorselGalerisi({ resimler }: { resimler: string[] }) {
  const gecerliResimler = resimler && resimler.length > 0 ? resimler : [];
  const [aktifResim, setAktifResim] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const dragXRef = useRef(0);

  if (gecerliResimler.length === 0) {
    return (
      <div style={{ width: "100%", height: "450px", backgroundColor: "#121214", borderRadius: "20px", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#52525b" }}>[ GÖRSEL_BEKLENİYOR ]</div>
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    dragXRef.current = 0;
    setDragX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) < Math.abs(dy) && Math.abs(dx) < 10) return;
    dragXRef.current = dx;
    setDragX(dx);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const width = galleryRef.current?.offsetWidth || 1;
    const threshold = width * 0.18;
    const currentDrag = dragXRef.current;
    if (currentDrag < -threshold) setAktifResim((i) => (i + 1) % gecerliResimler.length);
    else if (currentDrag > threshold) setAktifResim((i) => (i - 1 + gecerliResimler.length) % gecerliResimler.length);
    dragXRef.current = 0;
    setDragX(0);
  };

  const trackStyle = {
    transform: `translateX(calc(-${aktifResim * 100}% + ${dragX}px))`,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      <div
        ref={galleryRef}
        onTouchStart={gecerliResimler.length > 1 ? handleTouchStart : undefined}
        onTouchMove={gecerliResimler.length > 1 ? handleTouchMove : undefined}
        onTouchEnd={gecerliResimler.length > 1 ? handleTouchEnd : undefined}
        style={{
          width: "100%",
          height: "420px",
          backgroundColor: "#121214",
          borderRadius: "20px",
          border: "1px solid #27272a",
          position: "relative",
          overflow: "hidden",
          touchAction: "pan-y",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            backgroundColor: "#ef4444",
            color: "white",
            padding: "6px 14px",
            borderRadius: "30px",
            fontWeight: "800",
            fontSize: "0.85rem",
            boxShadow: "0 0 15px rgba(239,68,68,0.4)",
            zIndex: 2,
          }}
        >
          İNDİRİM
        </div>

        {gecerliResimler.length === 1 ? (
          <div style={{ width: "100%", height: "100%", padding: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={gecerliResimler[0]} alt="Ürün Görseli" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              transition: isDragging ? "none" : "transform 0.3s ease-out",
              transform: trackStyle.transform,
            }}
          >
            {gecerliResimler.map((resim, index) => (
              <div
                key={index}
                style={{
                  minWidth: "100%",
                  width: "100%",
                  height: "100%",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <img src={resim} alt={`Görsel ${index + 1}`} draggable={false} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {gecerliResimler.length > 1 && (
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
          {gecerliResimler.map((resim, index) => (
            <div
              key={index}
              onClick={() => setAktifResim(index)}
              style={{
                width: "80px",
                height: "80px",
                flexShrink: 0,
                backgroundColor: "#121214",
                borderRadius: "14px",
                border: aktifResim === index ? "2px solid #3b82f6" : "1px solid #27272a",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: aktifResim === index ? 1 : 0.5,
                transition: "all 0.2s ease",
                boxShadow: aktifResim === index ? "0 0 10px rgba(0, 229, 255, 0.2)" : "none",
              }}
            >
              <img src={resim} alt={`Görsel ${index + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

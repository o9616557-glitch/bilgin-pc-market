"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function UrunGorselGalerisi({ resimler }: { resimler: string[] }) {
  const gecerliResimler = resimler && resimler.length > 0 ? resimler : [];
  const cokluResim = gecerliResimler.length > 1;
  const loopResimler = cokluResim
    ? [gecerliResimler[gecerliResimler.length - 1], ...gecerliResimler, gecerliResimler[0]]
    : gecerliResimler;

  const [aktifResim, setAktifResim] = useState(0);
  const [trackIndex, setTrackIndex] = useState(1);
  const [galleryTransition, setGalleryTransition] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxAcik, setLightboxAcik] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const dragXRef = useRef(0);

  useEffect(() => {
    setTrackIndex(1);
    setAktifResim(0);
    setDragX(0);
    dragXRef.current = 0;
  }, [gecerliResimler.length]);

  useEffect(() => {
    if (!cokluResim) return;
    if (trackIndex === 0) {
      setGalleryTransition(false);
      setTrackIndex(gecerliResimler.length);
    } else if (trackIndex === gecerliResimler.length + 1) {
      setGalleryTransition(false);
      setTrackIndex(1);
    } else {
      setAktifResim(trackIndex - 1);
    }
  }, [trackIndex, cokluResim, gecerliResimler.length]);

  useEffect(() => {
    if (!galleryTransition) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setGalleryTransition(true));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [galleryTransition]);

  useEffect(() => {
    if (lightboxAcik) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxAcik]);

  if (gecerliResimler.length === 0) {
    return (
      <div style={{ width: "100%", height: "450px", backgroundColor: "#121214", borderRadius: "20px", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#52525b" }}>[ GÖRSEL_BEKLENİYOR ]</div>
      </div>
    );
  }

  const trackStyle = {
    transform: `translateX(calc(-${trackIndex * 100}% + ${dragX}px))`,
  };

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

  const handleTouchEnd = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    lightboxTap = false
  ) => {
    if (!isDragging) return;
    setIsDragging(false);
    const width = containerRef.current?.offsetWidth || 1;
    const threshold = width * 0.18;
    const currentDrag = dragXRef.current;

    if (Math.abs(currentDrag) < 12) {
      if (lightboxTap) setLightboxAcik(true);
    } else if (currentDrag < -threshold) {
      if (cokluResim) setTrackIndex((i) => i + 1);
    } else if (currentDrag > threshold) {
      if (cokluResim) setTrackIndex((i) => i - 1);
    }

    dragXRef.current = 0;
    setDragX(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      <div
        ref={galleryRef}
        onTouchStart={handleTouchStart}
        onTouchMove={cokluResim ? handleTouchMove : undefined}
        onTouchEnd={
          cokluResim
            ? () => handleTouchEnd(galleryRef, true)
            : () => setLightboxAcik(true)
        }
        onClick={() => setLightboxAcik(true)}
        style={{
          width: "100%",
          height: "420px",
          backgroundColor: "#121214",
          borderRadius: "20px",
          border: "1px solid #27272a",
          position: "relative",
          overflow: "hidden",
          touchAction: "manipulation",
          cursor: "zoom-in",
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
              transition: isDragging || !galleryTransition ? "none" : "transform 0.3s ease-out",
              transform: trackStyle.transform,
            }}
          >
            {loopResimler.map((resim, index) => (
              <div
                key={`${resim}-${index}`}
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

      {cokluResim && (
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
          {gecerliResimler.map((resim, index) => (
            <div
              key={index}
              onClick={() => setTrackIndex(index + 1)}
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

      {lightboxAcik && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={cokluResim ? handleTouchMove : undefined}
          onTouchEnd={cokluResim ? () => handleTouchEnd(lightboxRef, false) : undefined}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxAcik(false)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "48px",
              height: "48px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={24} />
          </button>

          {cokluResim && (
            <>
              <button
                type="button"
                onClick={() => setTrackIndex((i) => i - 1)}
                style={{
                  position: "absolute",
                  left: "16px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={() => setTrackIndex((i) => i + 1)}
                style={{
                  position: "absolute",
                  right: "16px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div ref={lightboxRef} style={{ width: "100%", maxWidth: "90vw", maxHeight: "85vh", overflow: "hidden" }}>
            {gecerliResimler.length === 1 ? (
              <img src={gecerliResimler[0]} alt="" style={{ width: "100%", maxHeight: "85vh", objectFit: "contain" }} />
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                  transition: isDragging || !galleryTransition ? "none" : "transform 0.3s ease-out",
                  transform: trackStyle.transform,
                }}
              >
                {loopResimler.map((resim, index) => (
                  <div key={`lb-${resim}-${index}`} style={{ minWidth: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img src={resim} alt="" draggable={false} style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

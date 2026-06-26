"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation"; 

export default function HesapHafizaCipi() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // 🚀 BİNGO: Fırlatıcı sadece 1 KERE çalışsın diye "Hafıza Kilidi" koyduk!
  const firlatmaYapildi = useRef(false);

  // 🚀 1. MOTOR: F5 YAKALAYICI VE FIRLATICI
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Eğer adamı zaten 1 kere fırlattıysak, kilidi gördüğümüz an dururuz, bir daha karışmayız!
      if (firlatmaYapildi.current) return;

      const navEntries = performance.getEntriesByType("navigation");
      
      if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === "reload") {
        const belaliSayfalar = [
          "/favorilerim", 
          "/adreslerim", 
          "/siparislerim", 
          "/sistemlerim", 
          "/destek-taleplerim",
          "/siparis-takip"
        ];

        if (pathname && belaliSayfalar.includes(pathname)) {
          // 💥 Ensesinden tut, fırlat ve KİLİDİ KAPAT!
          firlatmaYapildi.current = true; 
          router.replace("/hesabim");
        }
      }
    }
  }, [pathname, router]);

  // 🚀 2. MOTOR: ARKA PLAN VERİ TOPLAYICI
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const ustaHafizayiDoldur = async () => {
      try {
        const zamanDamgasi = new Date().getTime();

        const adresRes = await fetch("/api/addresses?t=" + zamanDamgasi, { cache: "no-store" });
        let adresSayisi = 0;
        if (adresRes.ok) {
          const adresData = await adresRes.json();
          adresSayisi = adresData.addresses?.length || 0;
        }

        const favoriRes = await fetch("/api/favorites?t=" + zamanDamgasi, { cache: "no-store" });
        let favoriSayisi = 0;
        if (favoriRes.ok) {
          const favoriData = await favoriRes.json();
          favoriSayisi = favoriData.favorites?.length || 0;
        }

        const destekRes = await fetch("/api/destek?t=" + zamanDamgasi, { cache: "no-store" });
        let acikTalepSayisi = 0;
        let acilMesaj = false;
        if (destekRes.ok) {
          const destekData = await destekRes.json();
          if (destekData.talepler) {
            const aciklar = destekData.talepler.filter((t: any) => t.durum !== "Çözüldü");
            acikTalepSayisi = aciklar.length;
            acilMesaj = aciklar.some((t: any) => t.durum === "Yanıt Bekleniyor");
          }
        }

        const eskiHafiza = JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}");
        sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({
          ...eskiHafiza,
          adresSayisi,
          favoriSayisi
        }));

        sessionStorage.setItem("bilgin_destek_ozet", JSON.stringify({
          sayi: acikTalepSayisi,
          acil: acilMesaj
        }));

      } catch (error) {
        console.error("Akıllı Çip verileri toplarken hata aldı:", error);
      }
    };

    ustaHafizayiDoldur();
  }, [session, status]);

  return null;
}
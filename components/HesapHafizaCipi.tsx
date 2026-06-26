"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation"; // 🚀 Fırlatma motoru için eklendi

export default function HesapHafizaCipi() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // 🚀 1. MOTOR: F5 YAKALAYICI VE FIRLATICI (Senin Saksıdan Çıkan Harika Fikir!)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Tarayıcının hafızasına bakıyoruz: "Bu adam buraya tıklayarak mı geldi, yoksa F5 mi attı?"
      const navEntries = performance.getEntriesByType("navigation");
      
      if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === "reload") {
        // Eğer F5 atıldıysa, Bermuda Şeytan Üçgeni'nde mi (belalı sayfalarda mı) diye kontrol et
        const belaliSayfalar = [
          "/favorilerim", 
          "/adreslerim", 
          "/siparislerim", 
          "/sistemlerim", 
          "/destek-taleplerim",
          "/siparis-takip"
        ];

        // Eğer kullanıcı bu sayfalardan birindeyken F5 attıysa...
        if (pathname && belaliSayfalar.includes(pathname)) {
          // 💥 Ensesinden tut ve saniyesinde Hesabım'a fırlat! (replace kullanıyoruz ki geri tuşu bozulmasın)
          router.replace("/hesabim");
        }
      }
    }
  }, [pathname, router]);

  // 🚀 2. MOTOR: ARKA PLAN VERİ TOPLAYICI (Eski yazdığımız radar)
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
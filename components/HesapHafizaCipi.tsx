"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HesapHafizaCipi() {
  const { data: session, status } = useSession();

  // 🚀 TEK MOTOR: ARKA PLAN VERİ TOPLAYICI (Sessiz Çırak)
  // Müşteri siteye girdiğinde veya F5 attığında arka planda sessizce verileri cebe atar.
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const ustaHafizayiDoldur = async () => {
      try {
        const zamanDamgasi = new Date().getTime();

        // Adresleri çek
        const adresRes = await fetch("/api/addresses?t=" + zamanDamgasi, { cache: "no-store" });
        let adresSayisi = 0;
        if (adresRes.ok) {
          const adresData = await adresRes.json();
          adresSayisi = adresData.addresses?.length || 0;
        }

        // Favorileri çek
        const favoriRes = await fetch("/api/favorites?t=" + zamanDamgasi, { cache: "no-store" });
        let favoriSayisi = 0;
        if (favoriRes.ok) {
          const favoriData = await favoriRes.json();
          favoriSayisi = favoriData.favorites?.length || 0;
        }

        // Destek mesajlarını çek
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

        // Verileri SessionStorage'a mühürle
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
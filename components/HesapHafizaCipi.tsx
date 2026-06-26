"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HesapHafizaCipi() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // 🧠 KURAL 1: Giriş yapmamış misafirlerde çip ASLA çalışmaz, sunucuya yük bindirmez!
    if (status !== "authenticated" || !session?.user?.email) return;

    const ustaHafizayiDoldur = async () => {
      try {
        const zamanDamgasi = new Date().getTime();

        // 🚀 ADRESLERİ ÇEK (Sadece F5 atıldığında 1 kere çalışır)
        const adresRes = await fetch("/api/addresses?t=" + zamanDamgasi, { cache: "no-store" });
        let adresSayisi = 0;
        if (adresRes.ok) {
          const adresData = await adresRes.ok ? await adresRes.json() : {};
          adresSayisi = adresData.addresses?.length || 0;
        }

        // 🚀 FAVORİLERİ ÇEK
        const favoriRes = await fetch("/api/favorites?t=" + zamanDamgasi, { cache: "no-store" });
        let favoriSayisi = 0;
        if (favoriRes.ok) {
          const favoriData = await favoriRes.json();
          favoriSayisi = favoriData.favorites?.length || 0;
        }

        // 🚀 DESTEK MESAJLARINI ÇEK
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

        // 💥 TOKATLAMA ANI: Verileri senin "Hesabım" sayfasının anladığı formatta sessionStorage'a mühürlüyoruz!
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
        console.error("Akıllı Çip arka planda verileri cebe atarken bocaladı:", error);
      }
    };

    ustaHafizayiDoldur();
  }, [session, status]);

  return null; // Bu çip ekranda görünmez, bir hayalet gibi arkada işini yapar!
}
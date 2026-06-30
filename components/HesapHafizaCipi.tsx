"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { ertele } from "@/lib/performans";

export default function HesapHafizaCipi() {
  const { data: session, status } = useSession();
  const yuklendiRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) {
      if (status === "unauthenticated") yuklendiRef.current = false;
      return;
    }
    if (yuklendiRef.current) return;
    yuklendiRef.current = true;

    const ustaHafizayiDoldur = async () => {
      try {
        const [adresRes, favoriRes, destekRes] = await Promise.all([
          fetch("/api/addresses", { cache: "no-store" }),
          fetch("/api/favorites", { cache: "no-store" }),
          fetch("/api/destek", { cache: "no-store" }),
        ]);

        let adresSayisi = 0;
        let favoriSayisi = 0;
        let acikTalepSayisi = 0;
        let acilMesaj = false;

        if (adresRes.ok) {
          const adresData = await adresRes.json();
          adresSayisi = adresData.addresses?.length || 0;
        }
        if (favoriRes.ok) {
          const favoriData = await favoriRes.json();
          favoriSayisi = favoriData.favorites?.length || 0;
        }
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
          favoriSayisi,
        }));

        sessionStorage.setItem("bilgin_destek_ozet", JSON.stringify({
          sayi: acikTalepSayisi,
          acil: acilMesaj,
        }));

        window.dispatchEvent(new CustomEvent("bilgin-hesap-guncellendi"));
      } catch (error) {
        console.error("Hesap hafızası güncellenemedi:", error);
        yuklendiRef.current = false;
      }
    };

    ertele(ustaHafizayiDoldur, 2500);
  }, [session?.user?.email, status]);

  return null;
}

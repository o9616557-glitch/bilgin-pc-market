"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { oturumHafizasiniTemizle } from "@/lib/oturum-hafiza";

type DestekTalep = {
  musteriGizledi?: boolean;
  durum?: string;
  mesajlar?: { gonderen?: string }[];
};

function sonMesajAdminMi(talep: DestekTalep) {
  const msgs = talep.mesajlar || [];
  const son = msgs[msgs.length - 1];
  return son?.gonderen?.toLowerCase() === "admin";
}

function destekOzetiHesapla(talepler: DestekTalep[]) {
  const aciklar = talepler.filter((t) => t.durum !== "Çözüldü" && !t.musteriGizledi);
  const okunmamis = aciklar.filter(sonMesajAdminMi).length;
  const acil = okunmamis > 0 || aciklar.some((t) => t.durum === "Yanıt Bekleniyor");

  return {
    sayi: aciklar.length,
    acil,
    okunmamis,
  };
}

export default function HesapHafizaCipi() {
  const { data: session, status } = useSession();
  const yuklendiRef = useRef(false);
  const sonEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      if (sonEmailRef.current) oturumHafizasiniTemizle();
      yuklendiRef.current = false;
      sonEmailRef.current = null;
      return;
    }

    if (status !== "authenticated" || !session?.user?.email) return;

    if (sonEmailRef.current !== session.user.email) {
      yuklendiRef.current = false;
      sonEmailRef.current = session.user.email;
    }

    if (yuklendiRef.current) return;
    yuklendiRef.current = true;

    const ustaHafizayiDoldur = async () => {
      try {
        const [adresRes, favoriRes, destekRes, sistemRes] = await Promise.all([
          fetch("/api/addresses", { cache: "no-store" }),
          fetch("/api/favorites", { cache: "no-store" }),
          fetch("/api/destek", { cache: "no-store" }),
          fetch("/api/sistemlerim", { cache: "no-store" }),
        ]);

        let adresSayisi = 0;
        let favoriSayisi = 0;
        let destekOzet = { sayi: 0, acil: false, okunmamis: 0 };

        if (adresRes.ok) {
          const adresData = await adresRes.json();
          const adresler = adresData.addresses || [];
          adresSayisi = adresler.length;
          sessionStorage.setItem("bilgin-adresler", JSON.stringify(adresler));
          sessionStorage.setItem("bilgin_adresler_cache", JSON.stringify(adresler));
        }
        if (favoriRes.ok) {
          const favoriData = await favoriRes.json();
          const favoriler = favoriData.favorites || [];
          favoriSayisi = favoriler.length;
          sessionStorage.setItem("bilgin-favoriler", JSON.stringify(favoriler));
        }
        if (destekRes.ok) {
          const destekData = await destekRes.json();
          if (destekData.talepler) {
            destekOzet = destekOzetiHesapla(destekData.talepler);
          }
        }
        if (sistemRes.ok) {
          const sistemData = await sistemRes.json();
          if (sistemData.success && sistemData.systems) {
            localStorage.setItem("bilgin_kayitli_sistemler", JSON.stringify(sistemData.systems));
          }
        }

        const eskiHafiza = JSON.parse(sessionStorage.getItem("bilgin_hesabim_data") || "{}");
        sessionStorage.setItem("bilgin_hesabim_data", JSON.stringify({
          ...eskiHafiza,
          adresSayisi,
          favoriSayisi,
        }));

        sessionStorage.setItem("bilgin_destek_ozet", JSON.stringify(destekOzet));

        window.dispatchEvent(new CustomEvent("bilgin-hesap-guncellendi"));
      } catch (error) {
        console.error("Hesap hafızası güncellenemedi:", error);
        yuklendiRef.current = false;
      }
    };

    void ustaHafizayiDoldur();
  }, [session?.user?.email, status]);

  return null;
}

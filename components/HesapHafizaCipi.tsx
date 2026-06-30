"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  uyeOnbellektenGoster,
  uyeOnbellegineYaz,
  type UyeBaslangicVerisi,
} from "@/lib/uye-onbellek";
import { oturumHafizasiniTemizle } from "@/lib/oturum-hafiza";

export default function HesapHafizaCipi() {
  const { data: session, status } = useSession();
  const yukleniyorRef = useRef(false);
  const sonEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      if (sonEmailRef.current) oturumHafizasiniTemizle();
      yukleniyorRef.current = false;
      sonEmailRef.current = null;
      return;
    }

    if (status !== "authenticated" || !session?.user?.email) return;

    const email = session.user.email;
    const hesapDegisti = sonEmailRef.current !== email;
    sonEmailRef.current = email;

    if (hesapDegisti) {
      yukleniyorRef.current = false;
    }

    uyeOnbellektenGoster();

    if (yukleniyorRef.current) return;
    yukleniyorRef.current = true;

    const uyeVerisiniYukle = async () => {
      try {
        const res = await fetch("/api/uye-baslangic", { cache: "no-store" });
        if (!res.ok) {
          yukleniyorRef.current = false;
          return;
        }

        const veri = (await res.json()) as UyeBaslangicVerisi;
        uyeOnbellegineYaz(veri);
      } catch (error) {
        console.error("Üye verisi yüklenemedi:", error);
        yukleniyorRef.current = false;
      }
    };

    void uyeVerisiniYukle();
  }, [session?.user?.email, status]);

  return null;
}

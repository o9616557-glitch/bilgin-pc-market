"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { User, Star, Server, Truck, Search, Headset } from "lucide-react";

/* ─────────────────── KISAYOL MENÜ TANIMLARI ─────────────────── */
export const KISAYOL_ITEMS = [
  { id: "profil",    label: "Profil",    href: "/hesabim",           icon: User },
  { id: "favori",    label: "Favoriler", href: "/favorilerim",       icon: Star },
  { id: "sistemler", label: "Sistemler", href: "/sistemlerim",       icon: Server },
  { id: "kargolar",  label: "Kargolar",  href: "/kargolarim",        icon: Truck },
  { id: "sorgula",   label: "Sorgula",   href: "/siparis-takip",     icon: Search },
  { id: "destek",    label: "Destek",    href: "/destek-taleplerim", icon: Headset },
];

/**
 * Kısayol sayfaları (Profil, Favori, Sistemler, Kargolar, Sorgula, Destek) için
 * ortak yan/üst gezinme paneli. PC'de sol sabit panel, mobilde üstte yatay menü.
 * Mobilde parmakla sağa/sola kaydırınca komşu sayfaya geçer.
 */
export default function KisayolNav({ active }: { active?: string }) {
  const router = useRouter();
  const aktifIndex = KISAYOL_ITEMS.findIndex((i) => i.id === active);
  const bas = useRef<{ x: number; y: number } | null>(null);

  /* Geçişlerde loading olmasın diye hepsini önceden yükle */
  useEffect(() => {
    KISAYOL_ITEMS.forEach((i) => router.prefetch(i.href));
  }, [router]);

  /* Telefon gibi: sağa/sola kaydırınca komşu sayfaya geç */
  useEffect(() => {
    if (aktifIndex === -1) return;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      bas.current = { x: t.clientX, y: t.clientY };
    };
    const onEnd = (e: TouchEvent) => {
      if (!bas.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - bas.current.x;
      const dy = t.clientY - bas.current.y;
      bas.current = null;
      // Belirgin yatay kaydırma şart (dikey scroll'u bozma)
      if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0 && aktifIndex < KISAYOL_ITEMS.length - 1) {
        router.push(KISAYOL_ITEMS[aktifIndex + 1].href);
      } else if (dx > 0 && aktifIndex > 0) {
        router.push(KISAYOL_ITEMS[aktifIndex - 1].href);
      }
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [aktifIndex, router]);

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-2 sm:p-4 shadow-xl overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        <nav className="flex flex-row lg:flex-col gap-1.5 min-w-max lg:min-w-0">
          {KISAYOL_ITEMS.map((item) => {
            const Icon = item.icon;
            const aktif = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm rounded-lg transition-all font-medium ${
                  aktif
                    ? "text-white bg-[#020617] border border-slate-700"
                    : "text-slate-400 hover:text-white hover:bg-[#020617] border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${aktif ? "text-cyan-400" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

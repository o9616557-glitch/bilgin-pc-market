"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { User, Package, Star, Truck, Server, Search, Headset } from "lucide-react";

/* ─────────────────── KISAYOL MENÜ TANIMLARI ─────────────────── */
export const KISAYOL_ITEMS = [
  { id: "profil",     label: "Profil",       href: "/hesabim",           icon: User },
  { id: "siparisler", label: "Siparişlerim", href: "/siparislerim",      icon: Package },
  { id: "favori",     label: "Favoriler",    href: "/favorilerim",       icon: Star },
  { id: "kargolar",   label: "Kargolar",     href: "/kargolarim",        icon: Truck },
  { id: "sistemler",  label: "Sistemler",    href: "/sistemlerim",       icon: Server },
  { id: "sorgula",    label: "Sorgula",      href: "/siparis-takip",     icon: Search },
  { id: "destek",     label: "Destek",       href: "/destek-taleplerim", icon: Headset },
];

/**
 * Kısayol sayfaları için ortak yan/üst gezinme paneli.
 * PC'de sol sabit panel, mobilde üstte yatay menü. Sadece menüye tıklayınca geçiş yapılır.
 */
export default function KisayolNav({ active }: { active?: string }) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  /* Geçişlerde loading olmasın diye hepsini önceden yükle */
  useEffect(() => {
    KISAYOL_ITEMS.forEach((i) => router.prefetch(i.href));
  }, [router]);

  /* Mobilde aktif menü öğesi görünür kalsın */
  useEffect(() => {
    if (!active || !navRef.current) return;
    const el = navRef.current.querySelector(`[data-kisayol="${active}"]`);
    if (el) el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-2 sm:p-4 shadow-xl overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        <nav ref={navRef} className="flex flex-row lg:flex-col gap-1.5 min-w-max lg:min-w-0">
          {KISAYOL_ITEMS.map((item) => {
            const Icon = item.icon;
            const aktif = active === item.id;
            return (
              <Link
                key={item.id}
                data-kisayol={item.id}
                href={item.href}
                prefetch
                scroll={false}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm rounded-lg transition-colors font-medium shrink-0 lg:shrink ${
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

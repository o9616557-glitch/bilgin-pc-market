"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Package, Star, Truck, Server, Search, Headset, LogOut, ChevronRight } from "lucide-react";

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

/* ─────────────────── PROFİL / ÇIKIŞ KUTUSU ─────────────────── */
/* Ölçüler Profil sayfasındaki (AccountShell) kart ile birebir aynı tutulur. */
function ProfilKutusu() {
  const { data: session, status } = useSession();
  const lastRef = useRef<typeof session>(null);
  if (session) lastRef.current = session;
  const stable = session ?? lastRef.current;
  const ilkYukleme = status === "loading" && !lastRef.current;

  return (
    <div className="account-card rounded-2xl p-4 flex items-center gap-3">
      {ilkYukleme ? (
        <>
          <div className="w-10 h-10 rounded-full bg-white/[0.05] animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 w-24 bg-white/[0.05] rounded animate-pulse" />
            <div className="h-2.5 w-32 bg-white/[0.04] rounded animate-pulse" />
          </div>
        </>
      ) : status === "unauthenticated" && !stable ? (
        <>
          <div className="w-10 h-10 rounded-full bg-site-shell border border-white/[0.1] flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <p className="flex-1 text-slate-400 text-sm">Giriş yapılmadı</p>
          <Link href="/giris" className="text-xs font-semibold text-cyan-400 border border-cyan-500/30 rounded-lg px-3 py-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
            Giriş Yap
          </Link>
        </>
      ) : (
        <>
          {stable?.user?.image ? (
            <img src={stable.user.image} alt={stable.user.name || "Profil"} width={40} height={40} style={{ width: 40, height: 40 }} className="rounded-full object-cover shrink-0 ring-2 ring-site-accent/20" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-site-shell border border-white/[0.1] flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{stable?.user?.name || "Kullanıcı"}</p>
            <p className="text-slate-500 text-[11px] truncate">{stable?.user?.email || ""}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Çıkış Yap"
            className="text-slate-600 hover:text-red-400 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Kısayol sayfaları için ortak yan/üst gezinme paneli.
 * PC'de sol sabit panel, mobilde üstte yatay menü. Sadece menüye tıklayınca geçiş yapılır.
 */
export default function KisayolNav({ active }: { active?: string }) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);

  /* Geçişlerde loading olmasın diye hepsini önceden yükle */
  useEffect(() => {
    KISAYOL_ITEMS.forEach((i) => router.prefetch(i.href));
  }, [router]);

  /* Mobilde aktif menü öğesi görünür kalsın — sadece yatay kaydır, sayfa zıplamasın */
  useEffect(() => {
    if (!active || !scrollerRef.current) return;
    const scroller = scrollerRef.current;
    const el = scroller.querySelector(`[data-kisayol="${active}"]`) as HTMLElement | null;
    if (el) {
      scroller.scrollLeft = el.offsetLeft - scroller.clientWidth / 2 + el.clientWidth / 2;
    }
  }, [active]);

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">

      {/* Profil / çıkış kutusu */}
      <ProfilKutusu />

      {/* Menü paneli — içerik panellerinden ayrışsın diye arka planı bir tık daha koyu */}
      <div
        ref={scrollerRef}
        className="bg-[#0b1121]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-2 shadow-lg overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <nav className="flex flex-row lg:flex-col gap-1.5 lg:gap-0.5 min-w-max lg:min-w-0">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium shrink-0 ${
                  aktif
                    ? "text-white bg-white/[0.07] border border-white/[0.12]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${aktif ? "text-site-accent" : ""}`} />
                <span className="truncate flex-1">{item.label}</span>
                {aktif && <ChevronRight className="w-3 h-3 shrink-0 text-site-accent/50" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

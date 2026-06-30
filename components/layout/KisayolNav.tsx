"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Package, Star, Truck, Server, Search, Headset, LogOut } from "lucide-react";

/* ─────────────────── KISAYOL MENÜ TANIMLARI ─────────────────── */
type Renk = {
  ikon: string;
  aktifBg: string;
  aktifBorder: string;
  aktifText: string;
  panel: string;
};

export const KISAYOL_ITEMS: {
  id: string; label: string; href: string; icon: any; renk: Renk;
}[] = [
  { id: "profil",     label: "Profil",       href: "/hesabim",           icon: User,
    renk: { ikon: "text-cyan-400",    aktifBg: "bg-cyan-500/10",    aktifBorder: "border-cyan-500/30",    aktifText: "text-cyan-200",    panel: "border-cyan-500/20" } },
  { id: "siparisler", label: "Siparişlerim", href: "/siparislerim",      icon: Package,
    renk: { ikon: "text-blue-400",    aktifBg: "bg-blue-500/10",    aktifBorder: "border-blue-500/30",    aktifText: "text-blue-200",    panel: "border-blue-500/20" } },
  { id: "favori",     label: "Favoriler",    href: "/favorilerim",       icon: Star,
    renk: { ikon: "text-fuchsia-400", aktifBg: "bg-fuchsia-500/10", aktifBorder: "border-fuchsia-500/30", aktifText: "text-fuchsia-200", panel: "border-fuchsia-500/20" } },
  { id: "kargolar",   label: "Kargolar",     href: "/kargolarim",        icon: Truck,
    renk: { ikon: "text-rose-400",    aktifBg: "bg-rose-500/10",    aktifBorder: "border-rose-500/30",    aktifText: "text-rose-200",    panel: "border-rose-500/20" } },
  { id: "sistemler",  label: "Sistemler",    href: "/sistemlerim",       icon: Server,
    renk: { ikon: "text-emerald-400", aktifBg: "bg-emerald-500/10", aktifBorder: "border-emerald-500/30", aktifText: "text-emerald-200", panel: "border-emerald-500/20" } },
  { id: "sorgula",    label: "Sorgula",      href: "/siparis-takip",     icon: Search,
    renk: { ikon: "text-amber-400",   aktifBg: "bg-amber-500/10",   aktifBorder: "border-amber-500/30",   aktifText: "text-amber-200",   panel: "border-amber-500/20" } },
  { id: "destek",     label: "Destek",       href: "/destek-taleplerim", icon: Headset,
    renk: { ikon: "text-orange-400",  aktifBg: "bg-orange-500/10",  aktifBorder: "border-orange-500/30",  aktifText: "text-orange-200",  panel: "border-orange-500/20" } },
];

/* ─────────────────── PROFİL / ÇIKIŞ KUTUSU ─────────────────── */
function ProfilKutusu() {
  const { data: session, status } = useSession();
  const lastRef = useRef<typeof session>(null);
  if (session) lastRef.current = session;
  const stable = session ?? lastRef.current;
  const ilkYukleme = status === "loading" && !lastRef.current;

  if (ilkYukleme) {
    return (
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/[0.05] animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 w-20 bg-white/[0.05] rounded animate-pulse" />
          <div className="h-2.5 w-28 bg-white/[0.04] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" && !stable) {
    return (
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#020617] border border-slate-800 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-slate-500" />
        </div>
        <p className="flex-1 text-slate-400 text-xs">Giriş yapılmadı</p>
        <Link href="/giris" className="text-xs font-semibold text-cyan-400 border border-cyan-500/30 rounded-lg px-3 py-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
          Giriş Yap
        </Link>
      </div>
    );
  }

  const userImage = stable?.user?.image;
  const userName = stable?.user?.name || "Kullanıcı";
  const userEmail = stable?.user?.email || "";

  return (
    <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-xl p-3 flex items-center gap-3">
      {userImage ? (
        <Image src={userImage} alt={userName} width={36} height={36} className="rounded-full object-cover shrink-0 ring-2 ring-cyan-500/20" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#020617] border border-slate-700 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-slate-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{userName}</p>
        <p className="text-slate-500 text-[10px] truncate">{userEmail}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        title="Çıkış Yap"
        className="text-slate-600 hover:text-red-400 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-red-500/10"
      >
        <LogOut className="w-4 h-4" />
      </button>
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
  const aktifRenk = KISAYOL_ITEMS.find((i) => i.id === active)?.renk;

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

      {/* Menü paneli — aktif sayfanın rengine göre hafif tonlu kenarlık */}
      <div
        ref={scrollerRef}
        className={`bg-[#0f172a]/80 backdrop-blur-xl border rounded-xl p-2 sm:p-4 shadow-xl overflow-x-auto [&::-webkit-scrollbar]:hidden ${aktifRenk?.panel ?? "border-slate-800"}`}
        style={{ scrollbarWidth: "none" }}
      >
        <nav className="flex flex-row lg:flex-col gap-1.5 min-w-max lg:min-w-0">
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
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm rounded-lg transition-colors font-medium shrink-0 lg:shrink border ${
                  aktif
                    ? `${item.renk.aktifBg} ${item.renk.aktifBorder} ${item.renk.aktifText}`
                    : "text-slate-400 hover:text-white hover:bg-[#020617] border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.renk.ikon}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

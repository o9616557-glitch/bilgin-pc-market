"use client";

import Link from "next/link";
import {
  User, ShieldCheck, CreditCard, MessageSquare, Database,
  Mail, Star, Package, Heart, ChevronRight
} from "lucide-react";

const NAV_PRIMARY = [
  { href: "/hesabim",     label: "Profil",          icon: User,          id: "hesabim" },
  { href: "/cuzdan",      label: "Cüzdan",           icon: CreditCard,    id: "cuzdan" },
  { href: "/guvenlik",    label: "Güvenlik",         icon: ShieldCheck,   id: "guvenlik" },
  { href: "/mesajlarim",  label: "Mesajlar",         icon: MessageSquare, id: "mesajlarim" },
  { href: "/veri-talebi", label: "Veri Talebi",      icon: Database,      id: "veri-talebi" },
];

const NAV_SECONDARY = [
  { href: "/eposta-degistir",     label: "E-posta Değiştir",   icon: Mail,    id: "eposta-degistir" },
  { href: "/yorumlarim",          label: "Ürün Yorumları",      icon: Star,    id: "yorumlarim" },
  { href: "/siparis-yorumlarim",  label: "Sipariş Yorumları",   icon: Star,    id: "siparis-yorumlarim" },
  { href: "/siparislerim",        label: "Siparişlerim",        icon: Package, id: "siparislerim" },
  { href: "/favorilerim",         label: "Favorilerim",         icon: Heart,   id: "favorilerim" },
];

type AccountShellProps = {
  children: React.ReactNode;
  active?: string;
  showNav?: boolean;
};

function NavLink({ href, label, icon: Icon, id, active }: {
  href: string; label: string; icon: any; id: string; active?: string;
}) {
  const isActive = active === id;
  return (
    <Link
      href={href}
      prefetch={false}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm transition-all font-medium shrink-0 ${
        isActive
          ? "text-site-accent bg-white/[0.06] border border-site-accent/20"
          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
      {isActive && <ChevronRight className="w-3 h-3 ml-auto shrink-0 text-site-accent/60 hidden lg:block" />}
    </Link>
  );
}

export default function AccountShell({ children, active, showNav = true }: AccountShellProps) {
  return (
    <div className="site-page p-4 sm:p-6 lg:p-8">
      <div className="site-glow-top top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[320px]" />
      <div className="site-content-in max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-6 relative z-10 items-start">

        {showNav && (
          <aside className="w-full lg:w-[240px] xl:w-[260px] shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
            <nav className="account-card p-2">

              {/* Mobil: yatay scroll */}
              <div className="flex lg:hidden gap-1 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                {[...NAV_PRIMARY, ...NAV_SECONDARY].map((item) => (
                  <NavLink key={item.id} {...item} active={active} />
                ))}
              </div>

              {/* Desktop: dikey, 5+5 gruplu */}
              <div className="hidden lg:flex flex-col gap-0.5">
                {NAV_PRIMARY.map((item) => (
                  <NavLink key={item.id} {...item} active={active} />
                ))}

                <div className="my-2 border-t border-white/[0.06]" />

                {NAV_SECONDARY.map((item) => (
                  <NavLink key={item.id} {...item} active={active} />
                ))}
              </div>

            </nav>
          </aside>
        )}

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

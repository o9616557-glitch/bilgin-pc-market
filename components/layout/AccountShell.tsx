"use client";

import Link from "next/link";
import { User, ShieldCheck, CreditCard } from "lucide-react";

const NAV = [
  { href: "/hesabim", label: "Hesabım", icon: User, id: "hesabim" },
  { href: "/cuzdan", label: "Cüzdan", icon: CreditCard, id: "cuzdan" },
  { href: "/guvenlik", label: "Güvenlik", icon: ShieldCheck, id: "guvenlik" },
];

type AccountShellProps = {
  children: React.ReactNode;
  active?: string;
  showNav?: boolean;
};

export default function AccountShell({ children, active, showNav = true }: AccountShellProps) {
  return (
    <div className="site-page p-4 sm:p-6 lg:p-8">
      <div className="site-glow-top top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[320px]" />
      <div className="site-content-in max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-10">
        {showNav && (
          <aside className="lg:w-[280px] shrink-0">
            <nav className="account-card p-2 sm:p-3 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
              <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
                {NAV.map(({ href, label, icon: Icon, id }) => (
                  <Link
                    key={id}
                    href={href}
                    prefetch={false}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm rounded-lg transition-all font-medium ${
                      active === id
                        ? "text-site-accent bg-white/[0.06] border border-site-accent/20"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
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

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_MENU_GRUPLARI, navItemBul } from "@/lib/hesap/nav-items";

export default function HesapMenuPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
    if (window.matchMedia("(min-width: 1024px)").matches) {
      router.replace("/hesabim");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-[#050814] shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors active:scale-95"
          aria-label="Geri"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">Hesap</h1>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        {NAV_MENU_GRUPLARI.map((grup) => {
          const ogeler = grup.ids.map(navItemBul).filter(Boolean);
          if (ogeler.length === 0) return null;

          return (
            <section key={grup.baslik}>
              <h2 className="text-[13px] font-bold text-slate-300 px-0.5 mb-2">{grup.baslik}</h2>
              <div className="rounded-xl border border-white/[0.1] bg-site-card/90 overflow-hidden shadow-sm">
                {ogeler.map((item, index) => (
                  <Link
                    key={item!.id}
                    href={item!.href}
                    prefetch
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 text-[15px] font-medium text-slate-200 hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors ${
                      index < ogeler.length - 1 ? "border-b border-white/[0.06]" : ""
                    }`}
                  >
                    <span className="flex-1 truncate">{item!.label}</span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </nav>
    </>
  );
}

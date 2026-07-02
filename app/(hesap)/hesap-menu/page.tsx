"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/hesap/nav-items";

export default function HesapMenuPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(min-width: 1024px)").matches) {
      router.replace("/hesabim");
    }
  }, [router]);

  if (!mounted) {
    return <div className="lg:hidden min-h-[calc(100dvh-8rem)] bg-[#050814]" />;
  }

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 top-[7.25rem] z-[90] bg-[#050814] flex flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-3 border-b border-white/[0.06] bg-[#050814]/95 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors active:scale-95"
          aria-label="Geri"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-white tracking-tight">Hesap Menüsü</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            prefetch
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-all text-slate-300 hover:text-white hover:bg-white/[0.05] active:bg-white/[0.08] border border-transparent"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] shrink-0">
              <item.icon className="w-[18px] h-[18px] text-site-accent" />
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            <ChevronRight className="w-4 h-4 shrink-0 text-slate-600" />
          </Link>
        ))}
      </nav>
    </div>
  );
}

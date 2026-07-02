"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
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
    return <div className="lg:hidden min-h-[200px]" />;
  }

  return (
    <div className="lg:hidden flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          prefetch
          className="relative z-10 flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-colors text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent"
        >
          <item.icon className="w-5 h-5 shrink-0 text-slate-400" />
          <span className="flex-1 truncate">{item.label}</span>
          <ChevronRight className="w-4 h-4 shrink-0 text-slate-600" />
        </Link>
      ))}
    </div>
  );
}

"use client";

import AccountShell from "@/components/layout/AccountShell";
import { Star, Package } from "lucide-react";
import Link from "next/link";

export default function SiparisYorumlarimPage() {
  return (
    <AccountShell active="siparis-yorumlarim">
      <div className="flex flex-col gap-5">
        <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-site-accent/80" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">Sipariş Yorumları</h1>
              <p className="text-slate-400 text-xs sm:text-sm">Siparişlerinize ait hizmet değerlendirmeleri.</p>
            </div>
          </div>
        </div>

        <div className="account-card rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-14 h-14 bg-site-shell border border-white/[0.06] rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-white mb-1">Henüz sipariş yorumu yok</p>
            <p className="text-xs text-slate-500 mb-4">Teslim edilen siparişler için hizmet deneyiminizi paylaşabilirsiniz.</p>
            <Link
              href="/siparislerim"
              className="inline-flex items-center gap-2 text-xs font-semibold text-site-accent hover:underline underline-offset-2"
            >
              <Package className="w-3.5 h-3.5" /> Siparişlerime Git
            </Link>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

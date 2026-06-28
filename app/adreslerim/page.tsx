"use client";

import AccountShell from "@/components/layout/AccountShell";
import { MapPin, Plus } from "lucide-react";

export default function AdreslerimPage() {
  return (
    <AccountShell active="adreslerim">
      <div className="flex flex-col gap-5">
        <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-cyan-400/80" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">Adreslerim</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Teslimat ve fatura adreslerinizi yönetin</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-site-accent border border-site-accent/30 rounded-xl px-3 py-2 hover:bg-site-accent/10 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Adres Ekle
            </button>
          </div>
        </div>

        <div className="account-card rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-site-shell border border-white/[0.06] flex items-center justify-center">
            <MapPin className="w-7 h-7 text-slate-600" />
          </div>
          <div>
            <p className="text-slate-400 font-medium">Kayıtlı adres bulunamadı</p>
            <p className="text-slate-600 text-sm mt-1">Yukarıdan yeni bir adres ekleyebilirsiniz.</p>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

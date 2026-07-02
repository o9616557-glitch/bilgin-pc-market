"use client";

import Link from "next/link";
import { ShieldCheck, Bell } from "lucide-react";

export interface HesabimHizliErisimProps {
  guvenlikOzeti: { ikiAdim: boolean; cihazSayisi: number } | null;
  kargoSayisi: number;
}

export default function HesabimHizliErisim({ guvenlikOzeti, kargoSayisi }: HesabimHizliErisimProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/guvenlik"
        prefetch
        className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 shadow-xl transition-all group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">Güvenlik Merkezi</p>
            <p className="text-xs text-slate-500 truncate">
              {guvenlikOzeti
                ? `${guvenlikOzeti.ikiAdim ? "2FA aktif" : "2FA kapalı"} • ${guvenlikOzeti.cihazSayisi} aktif cihaz`
                : "Yükleniyor..."}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest shrink-0 group-hover:text-cyan-300">
          Yönet →
        </span>
      </Link>

      <Link
        href="/bildirimler"
        prefetch
        className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 shadow-xl transition-all group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">Bildirimler</p>
            <p className="text-xs text-slate-500 truncate">
              {kargoSayisi > 0
                ? `${kargoSayisi} kargo güncellemesi`
                : "Sipariş ve kargo bildirimleri"}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest shrink-0 group-hover:text-cyan-300">
          Görüntüle →
        </span>
      </Link>
    </div>
  );
}

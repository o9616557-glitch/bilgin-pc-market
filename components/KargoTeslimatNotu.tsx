"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

const KARGO_SINIR_SAAT = 16;

function kargoDurumu() {
  const saat = Number(
    new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );
  const bugun = saat < KARGO_SINIR_SAAT;
  return {
    bugun,
    baslik: bugun ? "Bugün kargoda" : "Yarın kargoda",
    aciklama: bugun
      ? "16:00'a kadar verilen siparişler bugün yola çıkar"
      : "Siparişiniz yarın kargoya teslim edilir",
  };
}

export default function KargoTeslimatNotu({ compact = false }: { compact?: boolean }) {
  const [kargo, setKargo] = useState(kargoDurumu);

  useEffect(() => {
    const guncelle = () => setKargo(kargoDurumu());
    const id = setInterval(guncelle, 30_000);
    return () => clearInterval(id);
  }, []);

  const renk = kargo.bugun
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
    : "text-amber-400 bg-amber-500/10 border-amber-500/25";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold tracking-wide leading-tight ${renk}`}
      >
        <Truck className="w-3 h-3 shrink-0" strokeWidth={2.5} />
        {kargo.baslik}
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-2.5 mt-4 px-3.5 py-2.5 rounded-xl border ${renk}`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          kargo.bugun ? "bg-emerald-500/15" : "bg-amber-500/15"
        }`}
      >
        <Truck className="w-3.5 h-3.5" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-bold leading-tight">{kargo.baslik}</p>
        <p className="text-[10px] sm:text-[11px] opacity-70 mt-0.5 leading-snug">{kargo.aciklama}</p>
      </div>
    </div>
  );
}

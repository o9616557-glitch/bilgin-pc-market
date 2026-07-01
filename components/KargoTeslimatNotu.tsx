"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

const HAFTA_ICI_SINIR = 16;
const CUMARTESI_SINIR = 13;

type KargoTip = "bugun" | "yarin" | "pazartesi";

type KargoBilgi = {
  tip: KargoTip;
  baslik: string;
  aciklama: string;
};

function istanbulSaatVeGun() {
  const parcalar = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Istanbul",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  return {
    gun: parcalar.find((p) => p.type === "weekday")?.value ?? "Mon",
    saat: Number(parcalar.find((p) => p.type === "hour")?.value ?? 0),
  };
}

function kargoDurumu(): KargoBilgi {
  const { gun, saat } = istanbulSaatVeGun();

  if (gun === "Sun" || (gun === "Sat" && saat >= CUMARTESI_SINIR)) {
    return {
      tip: "pazartesi",
      baslik: "Pazartesi kargoda",
      aciklama: "Siparişiniz pazartesi sabahı kargoya verilir",
    };
  }

  if (gun === "Sat" && saat < CUMARTESI_SINIR) {
    return {
      tip: "bugun",
      baslik: "Bugün kargoda",
      aciklama: "13:00'a kadar verilen siparişler bugün yola çıkar",
    };
  }

  if (saat < HAFTA_ICI_SINIR) {
    return {
      tip: "bugun",
      baslik: "Bugün kargoda",
      aciklama: "16:00'a kadar verilen siparişler bugün yola çıkar",
    };
  }

  return {
    tip: "yarin",
    baslik: "Yarın kargoda",
    aciklama: "Siparişiniz yarın kargoya teslim edilir",
  };
}

const RENKLER: Record<KargoTip, string> = {
  bugun: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  yarin: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  pazartesi: "text-sky-400 bg-sky-500/10 border-sky-500/25",
};

const IKON_ARKA: Record<KargoTip, string> = {
  bugun: "bg-emerald-500/15",
  yarin: "bg-amber-500/15",
  pazartesi: "bg-sky-500/15",
};

export default function KargoTeslimatNotu({ compact = false }: { compact?: boolean }) {
  const [kargo, setKargo] = useState(kargoDurumu);

  useEffect(() => {
    const guncelle = () => setKargo(kargoDurumu());
    const id = setInterval(guncelle, 30_000);
    return () => clearInterval(id);
  }, []);

  const renk = RENKLER[kargo.tip];

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
    <div className={`flex items-center gap-2.5 mt-4 px-3.5 py-2.5 rounded-xl border ${renk}`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${IKON_ARKA[kargo.tip]}`}>
        <Truck className="w-3.5 h-3.5" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-bold leading-tight">{kargo.baslik}</p>
        <p className="text-[10px] sm:text-[11px] opacity-70 mt-0.5 leading-snug">{kargo.aciklama}</p>
      </div>
    </div>
  );
}

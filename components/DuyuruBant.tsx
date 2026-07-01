"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Info, AlertTriangle, Megaphone, X } from "lucide-react";

type Duyuru = { metin: string; tip: string };

const GIZLI_SAYFALAR = ["/admin", "/giris", "/kayit", "/odeme", "/sepet"];

export default function DuyuruBant() {
  const pathname = usePathname();
  const [duyuru, setDuyuru] = useState<Duyuru | null>(null);
  const [kapali, setKapali] = useState(false);

  useEffect(() => {
    setKapali(false);
  }, [pathname, duyuru?.metin]);

  useEffect(() => {
    if (GIZLI_SAYFALAR.some((p) => pathname.startsWith(p))) return;

    fetch(`/api/duyuru?v=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.duyuru) setDuyuru(d.duyuru);
        else setDuyuru(null);
      })
      .catch(() => setDuyuru(null));
  }, [pathname]);

  if (!duyuru || kapali || GIZLI_SAYFALAR.some((p) => pathname.startsWith(p))) return null;

  const tip = duyuru.tip || "bilgi";
  const stil =
    tip === "uyari"
      ? "bg-amber-950/90 border-amber-500/30 text-amber-100"
      : tip === "kampanya"
        ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-100"
        : "bg-blue-950/90 border-blue-500/30 text-blue-100";

  const Ikon = tip === "uyari" ? AlertTriangle : tip === "kampanya" ? Megaphone : Info;

  return (
    <div className={`relative z-[90] border-b ${stil}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 text-sm">
        <Ikon className="w-4 h-4 shrink-0 opacity-80" />
        <p className="flex-1 leading-snug font-medium">{duyuru.metin}</p>
        <button
          type="button"
          onClick={() => setKapali(true)}
          className="p-1 rounded hover:bg-white/10 transition-colors shrink-0 opacity-70 hover:opacity-100"
          aria-label="Duyuruyu kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

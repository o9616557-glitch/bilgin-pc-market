"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { MoreVertical, Check } from "lucide-react";
import { type KayitliKart } from "@/lib/cuzdan";

const MARKA_ETIKET: Record<string, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  troy: "TROY",
  amex: "AMEX",
  diger: "KART",
};

export const KART_YIGIN_PEEK = 44;
export const KART_YIGIN_PEEK_ODEME = 36;

export type KartBoyut = "normal" | "odeme";

const KART_TEMA: Record<string, { gradient: string; sheen: string; border: string }> = {
  visa: {
    gradient: "from-[#0d1b5e] via-[#1a3a8a] to-[#0f2d6e]",
    sheen: "from-blue-400/20 via-transparent to-indigo-600/10",
    border: "border-white/10",
  },
  mastercard: {
    gradient: "from-[#1c1c28] via-[#2a2a3d] to-[#14141f]",
    sheen: "from-orange-400/15 via-transparent to-red-500/10",
    border: "border-white/10",
  },
  troy: {
    gradient: "from-[#0a3d3d] via-[#0d5c5c] to-[#084848]",
    sheen: "from-teal-300/20 via-transparent to-cyan-500/10",
    border: "border-white/10",
  },
  amex: {
    gradient: "from-[#0a4d6e] via-[#0d6e8a] to-[#085a70]",
    sheen: "from-sky-300/20 via-transparent to-blue-400/10",
    border: "border-white/10",
  },
  diger: {
    gradient: "from-[#1e293b] via-[#334155] to-[#1e293b]",
    sheen: "from-slate-300/10 via-transparent to-slate-400/10",
    border: "border-white/10",
  },
};

function KartCipi({ kucuk }: { kucuk?: boolean }) {
  return (
    <div className={`${kucuk ? "w-8 h-6 md:w-9 md:h-7" : "w-10 h-7 sm:w-11 sm:h-8"} rounded-[5px] bg-gradient-to-br from-[#e8d48a] via-[#c9a84c] to-[#9a7229] border border-[#f5ebc8]/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_6px_rgba(0,0,0,0.35)] relative overflow-hidden shrink-0`}>
      <div className="absolute inset-[3px] rounded-[3px] border border-black/12" />
      <div className="absolute top-[38%] left-1.5 right-1.5 h-px bg-black/18" />
      <div className="absolute top-[52%] left-2 right-2 h-px bg-black/12" />
      <div className="absolute top-[66%] left-2 right-2 h-px bg-black/12" />
    </div>
  );
}

function TemassizIkon({ kucuk }: { kucuk?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`${kucuk ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5 sm:w-6 sm:h-6"} text-white/50 shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 12a4 4 0 0 1 8 0" strokeLinecap="round" />
      <path d="M5 12a7 7 0 0 1 14 0" strokeLinecap="round" opacity="0.7" />
      <path d="M2 12a10 10 0 0 1 20 0" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function MarkaLogosu({ brand, kucuk }: { brand: string; kucuk?: boolean }) {
  if (brand === "mastercard") {
    const boyut = kucuk ? "w-6 h-6" : "w-9 h-9";
    return (
      <div className={`flex items-center ${kucuk ? "-space-x-2.5" : "-space-x-3.5"} shrink-0`} aria-hidden>
        <div className={`${boyut} rounded-full bg-[#eb001b] opacity-95 shadow-lg`} />
        <div className={`${boyut} rounded-full bg-[#f79e1b] opacity-95 shadow-lg`} />
      </div>
    );
  }
  if (brand === "visa") {
    return (
      <span className={`${kucuk ? "text-sm" : "text-xl sm:text-2xl"} font-black italic tracking-tight text-white/95 drop-shadow-sm shrink-0`}>
        VISA
      </span>
    );
  }
  if (brand === "troy") {
    return (
      <span className="text-[10px] font-black tracking-[0.15em] text-white/90 bg-white/10 px-1.5 py-0.5 rounded shrink-0">
        TROY
      </span>
    );
  }
  if (brand === "amex") {
    return (
      <span className="text-[8px] font-black tracking-wider text-white/90 leading-tight text-right shrink-0">
        AMEX
      </span>
    );
  }
  return (
    <span className="text-[9px] font-bold tracking-widest text-white/70 shrink-0">
      {MARKA_ETIKET[brand] || "KART"}
    </span>
  );
}

export function KartGorseli({ kart, secili, onOnde, mod = "cuzdan", boyut = "normal", onSil, onVarsayilan, onOneGetir, onSec }: {
  kart: KayitliKart;
  secili?: boolean;
  onOnde?: boolean;
  mod?: "cuzdan" | "secim";
  boyut?: KartBoyut;
  onSil?: () => void;
  onVarsayilan?: () => void;
  onOneGetir?: () => void;
  onSec?: () => void;
}) {
  const [menuAcik, setMenuAcik] = useState(false);
  const tema = KART_TEMA[kart.brand] || KART_TEMA.diger;
  const menuGoster = mod === "cuzdan" && onOnde !== false;
  const tiklanabilir = onOnde === false || (mod === "secim" && onOnde);
  const odemeKibar = boyut === "odeme";

  const tikla = () => {
    if (onOnde === false) onOneGetir?.();
    else if (mod === "secim") onSec?.();
  };

  return (
    <div
      role={tiklanabilir ? "button" : undefined}
      tabIndex={tiklanabilir ? 0 : undefined}
      onClick={tiklanabilir ? tikla : undefined}
      onKeyDown={tiklanabilir ? (e) => { if (e.key === "Enter" || e.key === " ") tikla(); } : undefined}
      className={`relative w-full aspect-[1.586/1] rounded-[14px] flex flex-col overflow-hidden transition-all duration-300 select-none ${
        odemeKibar ? "p-3.5 md:p-3 md:rounded-[12px]" : "p-3.5 sm:p-5"
      } ${
        tiklanabilir ? "cursor-pointer" : ""
      } ${
        secili
          ? mod === "secim"
            ? "ring-2 ring-[#00d2ff]/60 ring-offset-2 ring-offset-[#0f172a]"
            : "ring-2 ring-cyan-400/40 ring-offset-2 ring-offset-[#0f172a]"
          : ""
      } ${
        odemeKibar
          ? "shadow-[0_12px_40px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.3)] md:shadow-[0_6px_20px_rgba(0,0,0,0.32),0_1px_4px_rgba(0,0,0,0.18)]"
          : "shadow-[0_12px_40px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.3)]"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tema.gradient}`} />
      <div className={`absolute inset-0 bg-gradient-to-tr ${tema.sheen}`} />
      <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_3px)]" />
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/[0.06] blur-3xl rounded-full" />
      <div className={`absolute inset-0 rounded-[14px] border ${tema.border}`} />

      <div className="relative z-10 flex flex-col h-full min-h-0">
        <div className="flex justify-between items-start gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <KartCipi kucuk={odemeKibar} />
            <TemassizIkon kucuk={odemeKibar} />
          </div>
          <div className="flex items-start gap-1.5 sm:gap-2 shrink-0">
            <MarkaLogosu brand={kart.brand} kucuk />
            <div className="flex flex-col items-end gap-1">
              {kart.isDefault && onOnde !== false && mod === "cuzdan" && (
                <span className="text-[7px] font-black tracking-widest text-white/90 bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/20">
                  VARSAYILAN
                </span>
              )}
              {kart.iyzicoHazir === false && (
                <span className="text-[7px] font-black tracking-widest text-amber-200 bg-amber-500/25 px-1.5 py-0.5 rounded border border-amber-400/30">
                  YENİDEN EKLE
                </span>
              )}
            </div>
            {menuGoster && onSil && onVarsayilan && (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMenuAcik(!menuAcik); }}
                  title="Kart işlemleri"
                  aria-label="Kart işlemleri — varsayılan yap veya sil"
                  className="w-7 h-7 rounded-lg bg-black/30 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/45 transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
                {menuAcik && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setMenuAcik(false)} />
                    <div className="absolute right-0 top-8 z-30 min-w-[160px] bg-[#0f172a] border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                      {!kart.isDefault && (
                        <button
                          type="button"
                          onClick={() => { onVarsayilan(); setMenuAcik(false); }}
                          className="w-full px-3 py-2.5 text-left text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                        >
                          Varsayılan Yap
                        </button>
                      )}
                      {kart.isDefault && (
                        <p className="px-3 py-2 text-[10px] text-slate-500 border-b border-slate-800">Bu kart varsayılan</p>
                      )}
                      <button
                        type="button"
                        onClick={() => { onSil(); setMenuAcik(false); }}
                        className="w-full px-3 py-2.5 text-left text-[11px] font-bold text-red-400 hover:bg-red-950/30 transition-colors"
                      >
                        Kartı Sil
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {mod === "secim" && secili && onOnde !== false && (
              <div className="w-6 h-6 md:w-5 md:h-5 rounded-full bg-[#00d2ff] flex items-center justify-center shrink-0 shadow-lg">
                <Check className="w-3.5 h-3.5 md:w-3 md:h-3 text-black" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center min-h-0 py-1 sm:py-2 md:py-1">
          <p
            className={`font-mono font-medium text-white/90 whitespace-nowrap w-full leading-none ${
              odemeKibar
                ? "text-[13px] md:text-[11px] tracking-[0.12em] md:tracking-[0.14em]"
                : "text-[13px] sm:text-base tracking-[0.12em] sm:tracking-[0.16em]"
            }`}
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
          >
            <span className="opacity-80">••••</span>
            <span className="inline-block w-[0.35em]" />
            <span className="opacity-80">••••</span>
            <span className="inline-block w-[0.35em]" />
            <span className="opacity-80">••••</span>
            <span className="inline-block w-[0.35em]" />
            <span>{kart.last4}</span>
          </p>
        </div>

        <div className="flex justify-between items-end gap-2 shrink-0">
          <div className="min-w-0 flex-1">
            <span className="text-[7px] uppercase tracking-[0.2em] text-white/45 block mb-0.5">Kart Sahibi</span>
            <span className="text-[10px] sm:text-[11px] md:text-[10px] font-bold tracking-wide text-white/85 truncate block uppercase">
              {kart.holderName}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[7px] uppercase tracking-[0.2em] text-white/45 block mb-0.5">SKT</span>
            <span className="text-[10px] sm:text-[11px] font-bold text-white/85 font-mono">{kart.expiryMonth}/{kart.expiryYear}</span>
          </div>
        </div>
      </div>

      {onOnde === false && (
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      )}
    </div>
  );
}

export function KartYigini({ kartlar, mod = "cuzdan", boyut = "normal", seciliId, onSec, onSil, onVarsayilan }: {
  kartlar: KayitliKart[];
  mod?: "cuzdan" | "secim";
  boyut?: KartBoyut;
  seciliId?: string | null;
  onSec?: (id: string) => void;
  onSil?: (id: string) => void;
  onVarsayilan?: (id: string) => void;
}) {
  const [onOndeId, setOnOndeId] = useState<string | null>(null);
  const oncekiKartSayisi = useRef(0);

  const siralıKartlar = useMemo(() => {
    const list = [...kartlar].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (mod === "secim" && seciliId) {
      const idx = list.findIndex((k) => k._id === seciliId);
      if (idx > 0) {
        const [secilen] = list.splice(idx, 1);
        list.unshift(secilen);
        return list;
      }
    }
    if (onOndeId) {
      const idx = list.findIndex((k) => k._id === onOndeId);
      if (idx > 0) {
        const [secilen] = list.splice(idx, 1);
        list.unshift(secilen);
      }
    }
    return list;
  }, [kartlar, onOndeId, mod, seciliId]);

  useEffect(() => {
    if (kartlar.length === 0) {
      setOnOndeId(null);
      oncekiKartSayisi.current = 0;
      return;
    }
    const enYeni = [...kartlar].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    const yeniKartEklendi = kartlar.length > oncekiKartSayisi.current;
    if (mod === "secim" && seciliId && kartlar.some((k) => k._id === seciliId)) {
      setOnOndeId(seciliId);
    } else if (yeniKartEklendi || !onOndeId || !kartlar.some((k) => k._id === onOndeId)) {
      setOnOndeId(enYeni._id);
    }
    oncekiKartSayisi.current = kartlar.length;
  }, [kartlar, onOndeId, mod, seciliId]);

  if (kartlar.length === 0) return null;

  const oneGetir = (id: string) => {
    setOnOndeId(id);
    onSec?.(id);
  };

  const peek = boyut === "odeme" ? KART_YIGIN_PEEK_ODEME : KART_YIGIN_PEEK;
  const kapsayiciClass = boyut === "odeme"
    ? "mx-auto w-full max-w-sm md:max-w-[268px]"
    : "mx-auto w-full max-w-sm";

  return (
    <div className={kapsayiciClass}>
      <div className="relative w-full">
        <div
          className="w-full aspect-[1.586/1] pointer-events-none"
          style={{ marginBottom: kartlar.length > 1 ? (kartlar.length - 1) * peek : 0 }}
          aria-hidden
        />
        {siralıKartlar.map((kart, i) => {
          const onOnde = i === 0;
          const secili = mod === "secim" ? seciliId === kart._id : kart.isDefault && onOnde;
          return (
            <div
              key={kart._id}
              className="absolute left-0 right-0 top-0 transition-all duration-300 ease-out"
              style={{
                transform: `translateY(${i * peek}px)`,
                zIndex: siralıKartlar.length - i,
              }}
            >
              <KartGorseli
                kart={kart}
                secili={secili}
                onOnde={onOnde}
                mod={mod}
                boyut={boyut}
                onSil={onSil ? () => onSil(kart._id) : undefined}
                onVarsayilan={onVarsayilan ? () => onVarsayilan(kart._id) : undefined}
                onOneGetir={() => oneGetir(kart._id)}
                onSec={onSec ? () => onSec(kart._id) : undefined}
              />
            </div>
          );
        })}
      </div>
      {kartlar.length > 1 && (
        <p className="text-[10px] text-slate-600 text-center mt-3">
          {mod === "secim"
            ? "Alttaki kart şeridine tıklayarak seçebilirsiniz"
            : "Alttaki kart şeridine tıklayarak öne getirebilirsiniz"}
        </p>
      )}
    </div>
  );
}

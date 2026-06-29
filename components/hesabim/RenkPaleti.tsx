"use client";

import { RENK_SECENEKLERI } from "@/lib/hesabim/constants";

type RenkObj = { text: string; bg: string; badge: string; hex: string };

export default function RenkPaleti({
  disabledCondition,
  text,
  onSelect,
}: {
  disabledCondition: boolean;
  text: string;
  onSelect: (renk: RenkObj) => void;
}) {
  return (
    <div className="w-full mt-4 pt-4 border-t border-cyan-500/20 animate-in fade-in slide-in-from-top-4 z-20">
      <div className="text-center mb-4">
        <span className="text-[10px] sm:text-xs font-medium text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
          {text}
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 max-h-[140px] overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {RENK_SECENEKLERI.map((renkObj, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(renkObj)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center shadow-lg border-2 ${renkObj.bg} ${disabledCondition ? "opacity-20 grayscale cursor-not-allowed" : "opacity-100"}`}
            disabled={disabledCondition}
          />
        ))}
      </div>
    </div>
  );
}

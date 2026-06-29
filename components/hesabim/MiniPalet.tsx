"use client";

import { Palette } from "lucide-react";

export default function MiniPalet({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 border border-slate-700 shadow-sm" />
      <div
        className={`absolute inset-0 rounded-full flex items-center justify-center z-20 transition-colors ${isActive ? "bg-emerald-950 border border-emerald-500/50" : "bg-[#020617] border border-cyan-900/50"}`}
      >
        <Palette className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-emerald-400" : "text-cyan-400 group-hover:text-white"}`} />
      </div>
    </div>
  );
}

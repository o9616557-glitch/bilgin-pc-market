"use client";

import React, { useState } from "react";

export default function ProductFps({ product }: { product: any }) {
  const [selectedCpu, setSelectedCpu] = useState("mid");
  const [selectedRes, setSelectedRes] = useState<"1080p" | "1440p">("1080p");

  const cpuMultipliers: Record<string, number> = { entry: 0.85, mid: 0.93, high: 1.00, extreme: 1.10 };
  const gamesConfig = [
    { id: "pubg", label: "PUBG: BATTLEGROUNDS", maxFps: 400, default1080p: 210, default1440p: 140, color: "from-amber-500 to-orange-600" },
    { id: "valorant", label: "VALORANT", maxFps: 600, default1080p: 450, default1440p: 320, color: "from-rose-500 to-red-600" },
    { id: "cs2", label: "Counter-Strike 2 (CS2)", maxFps: 550, default1080p: 380, default1440p: 260, color: "from-sky-500 to-blue-600" },
    { id: "cyberpunk", label: "Cyberpunk 2077", maxFps: 220, default1080p: 95, default1440p: 65, color: "from-yellow-400 to-amber-500" },
    { id: "rdr2", label: "Red Dead Redemption 2", maxFps: 240, default1080p: 110, default1440p: 80, color: "from-red-600 to-red-800" }
  ];

  return (
    <div className="px-4 pb-5 border-t border-white/5 pt-4 space-y-4">
      <div className="flex items-center gap-2 bg-[#050814] p-1 border border-white/5 rounded-lg w-max text-xs">
        <button type="button" onClick={() => setSelectedRes("1080p")} className={`px-4 py-1.5 rounded font-bold uppercase transition-all ${selectedRes === '1080p' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>Full HD (1080p)</button>
        <button type="button" onClick={() => setSelectedRes("1440p")} className={`px-4 py-1.5 rounded font-bold uppercase transition-all ${selectedRes === '1440p' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>2K Ultra (1440p)</button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-[11px] text-center font-bold">
        {[
          { id: "entry", label: "Giriş Seviye İşlemci" },
          { id: "mid", label: "Orta Seviye İşlemci" },
          { id: "high", label: "Üst Seviye İşlemci" },
          { id: "extreme", label: "Ekstrem İşlemci" }
        ].map((cpu) => (
          <button key={cpu.id} type="button" onClick={() => setSelectedCpu(cpu.id)} className={`p-2 rounded border transition-all ${selectedCpu === cpu.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-[#050814]/40 border-white/5 text-slate-400'}`}>{cpu.label}</button>
        ))}
      </div>

      <div className="space-y-3.5 pt-2">
        {gamesConfig.map((game, idx) => {
          const acfKey = `${game.id}_${selectedRes}_fps`;
          const baseFps = Number(product.meta_data?.find((m: any) => m.key === acfKey)?.value || product.acf?.[acfKey]) || (selectedRes === "1080p" ? game.default1080p : game.default1440p);
          const fps = Math.round(baseFps * (cpuMultipliers[selectedCpu] || 1.0));
          const pct = Math.min((fps / game.maxFps) * 100, 100);

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300 uppercase tracking-wide">{game.label}</span>
                <span className="text-amber-400 font-black">{fps} FPS</span>
              </div>
              <div className="w-full bg-[#050814] h-2 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full bg-gradient-to-r ${game.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

export default function FpsMotoru({ acf }: { acf: any }) {
  const [cozunurluk, setCozunurluk] = useState<"1080p" | "1440p">("1080p");
  const [islemciCarpani, setIslemciCarpani] = useState<number>(1);

  // Sayılar değiştiğinde barın "oynaması" için küçük bir tetikleyici
  const games = [
    { label: "PUBG: BATTLEGROUNDS", slugBase: "pubg" },
    { label: "Valorant", slugBase: "valorant" },
    { label: "Counter-Strike 2", slugBase: "cs2" },
    { label: "Cyberpunk 2077", slugBase: "cyberpunk" },
    { label: "Red Dead Redemption 2", slugBase: "rdr2" }
  ];

  return (
    <div className="bg-[#161b2c] rounded-[30px] p-8 border border-green-500/20 shadow-lg mt-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-xl font-black italic text-green-500 flex items-center gap-2">
            <span className="bg-green-500 text-black px-2 rounded not-italic">⚡</span> 
            OYUN PERFORMANS MOTORU
          </h3>
          <p className="text-[10px] text-slate-500 mt-2 tracking-[0.3em] uppercase">Donanım Gücüne Göre Dinamik FPS Analizi</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* İŞLEMCİ SEÇİCİ - RYZEN 7 EKLENDİ */}
          <div className="flex flex-col gap-1 w-full sm:w-64">
            <span className="text-[9px] text-slate-500 font-bold ml-1 uppercase">Sistem İşlemcisi (CPU)</span>
            <select 
              className="bg-[#0b0f1a] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-green-500 cursor-pointer appearance-none shadow-inner"
              onChange={(e) => setIslemciCarpani(parseFloat(e.target.value))}
            >
              <option value="1.00">En Üst Seviye (Ryzen 9 / Core i9)</option>
              <option value="0.92">Üst Seviye (Ryzen 7 / Core i7)</option> {/* RYZEN 7 BURADA! */}
              <option value="0.85">Orta Seviye (Ryzen 5 / Core i5)</option>
              <option value="0.70">Giriş Seviye (Ryzen 3 / Core i3)</option>
            </select>
          </div>

          {/* ÇÖZÜNÜRLÜK BUTONLARI */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-500 font-bold ml-1 uppercase">Çözünürlük</span>
            <div className="flex bg-[#0b0f1a] rounded-xl border border-slate-700 p-1">
              <button 
                onClick={() => setCozunurluk("1080p")}
                className={`px-6 py-2 rounded-lg text-xs font-black transition-all duration-300 ${cozunurluk === "1080p" ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "text-slate-500 hover:text-white"}`}
              >
                1080P
              </button>
              <button 
                onClick={() => setCozunurluk("1440p")}
                className={`px-6 py-2 rounded-lg text-xs font-black transition-all duration-300 ${cozunurluk === "1440p" ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "text-slate-500 hover:text-white"}`}
              >
                1440P
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-7">
        {games.map((game) => {
          const targetSlug = `${game.slugBase}_${cozunurluk}_fps`;
          const rawValue = acf[targetSlug];
          
          // Sayı olup olmadığını daha sıkı kontrol ediyoruz
          if (!rawValue) return null;
          
          const baseFps = parseInt(rawValue.toString().replace(/[^0-9]/g, ''));
          const finalFps = Math.round(baseFps * islemciCarpani);

          return (
            <div key={game.label} className="group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-black text-slate-400 tracking-wider group-hover:text-white transition-colors uppercase italic">{game.label}</span>
                <div className="text-right">
                  <span className="text-white font-black text-xl leading-none">{finalFps}</span>
                  <span className="text-[10px] text-slate-600 font-bold ml-1 uppercase">FPS</span>
                </div>
              </div>
              <div className="h-3 w-full bg-[#0b0f1a] rounded-full border border-slate-800 p-[2px] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-600 via-green-400 to-emerald-300 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-700 ease-out" 
                  style={{ width: `${Math.min((finalFps / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";

type PastaDilim = { yuzde: number; offset: number };
type PastaVeri = {
  kendinTopla: PastaDilim;
  bilesen: PastaDilim;
  cevre: PastaDilim;
  sistem: PastaDilim;
  aksesuar: PastaDilim;
  maxYuzde: number;
  ayAdi?: string;
};

const PASTA_RENKLERI: Record<string, { hex: string }> = {
  kendinTopla: { hex: "#f59e0b" },
  bilesen: { hex: "#06b6d4" },
  cevre: { hex: "#fb7185" },
  sistem: { hex: "#c084fc" },
  aksesuar: { hex: "#34d399" },
};

const CUBUK_RENK = { hex: "#06b6d4" };

export interface HesabimAnalyticsProps {
  sonSiparislerListesi: any[];
  getSiparisRenk: (durum: string) => { badge: string };
  kilitliIslem: (e: React.MouseEvent) => void;
  pastaVerisi: PastaVeri;
  aylikPastaVerisi: PastaVeri;
  seciliYil: number;
  setSeciliYil: (fn: (y: number) => number) => void;
  suAnkiTarih: Date;
  grafikVerisi: any[];
  tiklananAy: number | null;
  setTiklananAy: (i: number) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
}

export default function HesabimAnalytics({
  sonSiparislerListesi,
  getSiparisRenk,
  kilitliIslem,
  pastaVerisi,
  aylikPastaVerisi,
  seciliYil,
  setSeciliYil,
  suAnkiTarih,
  grafikVerisi,
  tiklananAy,
  setTiklananAy,
  hoveredIndex,
  setHoveredIndex,
}: HesabimAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start w-full">
      <div className="xl:col-span-1 flex flex-col h-full">
        <div className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col h-[350px] sm:h-[450px] xl:h-[550px]">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full" />

          <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-slate-800/80 pb-3 relative z-10 shrink-0">
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">Siparişler</h3>
            <Link
              href="/siparislerim"
              onClick={kilitliIslem}
              prefetch
              className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:underline tracking-widest uppercase"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-3 relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {sonSiparislerListesi.length > 0 ? (
              sonSiparislerListesi.map((item: any, idx: number) => {
                const tarih = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("tr-TR")
                  : item.tarih
                    ? new Date(item.tarih).toLocaleDateString("tr-TR")
                    : "";
                const urunAdi =
                  item.items?.[0]?.isim ||
                  item.items?.[0]?.name ||
                  item.sepet?.[0]?.isim ||
                  item.siparisKodu ||
                  "Sipariş";
                const toplamFiyat = item.totalPrice || item.toplamTutar || "0";
                const durum = item.status || item.durum || "Hazırlanıyor";
                const renkAyar = getSiparisRenk(durum);

                return (
                  <div
                    key={item._id || idx}
                    className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row sm:items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors rounded-xl px-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs sm:text-sm truncate mb-0.5" title={urunAdi}>
                        {urunAdi}
                      </p>
                      <p className="text-slate-500 text-[9px] sm:text-[10px]">{tarih}</p>
                    </div>
                    <div className="flex flex-row sm:flex-col xl:flex-row 2xl:flex-col items-center sm:items-end justify-between gap-1 sm:gap-2 shrink-0">
                      <p className="text-white font-black text-xs sm:text-sm">
                        {Number(toplamFiyat).toLocaleString("tr-TR")} ₺
                      </p>
                      <span className={`inline-flex items-center justify-center px-2 h-5 sm:h-6 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-widest shrink-0 ${renkAyar.badge}`}>
                        {durum}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Package className="w-10 h-10 text-slate-500 mb-2" />
                <span className="text-xs text-slate-400">Henüz siparişiniz yok.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-2 flex flex-col gap-6 w-full">
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide mb-4 border-b border-slate-800/80 pb-3">
            Harcama Dağılımı
          </h3>

          <div className="flex flex-row items-start justify-between gap-1 sm:gap-6 w-full">
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-1/2 pr-1 sm:pr-6 border-r border-slate-800/80">
              <span className="bg-slate-800 text-slate-400 text-[8px] sm:text-[10px] font-black px-1.5 py-1 rounded uppercase tracking-widest">
                Tüm Zamanlar
              </span>
              <div className="relative w-16 h-16 sm:w-32 sm:h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 42 42">
                  {pastaVerisi.maxYuzde === 0 ? (
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#334155" strokeWidth="4.5" strokeDasharray="100 0" />
                  ) : (
                    <>
                      {(["kendinTopla", "bilesen", "cevre", "sistem", "aksesuar"] as const).map((key) => (
                        <circle
                          key={key}
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke={PASTA_RENKLERI[key].hex}
                          strokeWidth="4.5"
                          strokeDasharray={`${pastaVerisi[key].yuzde} ${100 - pastaVerisi[key].yuzde}`}
                          strokeDashoffset={-pastaVerisi[key].offset}
                        />
                      ))}
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xl font-black text-white">{pastaVerisi.maxYuzde}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                {[
                  { id: "kendinTopla", isim: "Kendin Topla", veri: pastaVerisi.kendinTopla.yuzde },
                  { id: "bilesen", isim: "Bileşenler", veri: pastaVerisi.bilesen.yuzde },
                  { id: "cevre", isim: "Çevre & Oyuncu", veri: pastaVerisi.cevre.yuzde },
                  { id: "sistem", isim: "Sistem & Laptop", veri: pastaVerisi.sistem.yuzde },
                  { id: "aksesuar", isim: "Ağ & Aksesuar", veri: pastaVerisi.aksesuar.yuzde },
                ].map((dilim) => (
                  <div key={dilim.id} className="flex items-center justify-between w-full p-0.5 sm:p-1">
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0" style={{ backgroundColor: PASTA_RENKLERI[dilim.id].hex }} />
                      <span className="text-[7px] sm:text-[11px] text-slate-300 font-bold truncate">{dilim.isim}</span>
                    </div>
                    <span className="text-[7px] sm:text-[11px] font-black shrink-0" style={{ color: PASTA_RENKLERI[dilim.id].hex }}>
                      {dilim.veri}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4 w-1/2 pl-1 sm:pl-0">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-1 rounded uppercase tracking-widest">
                {aylikPastaVerisi.ayAdi ? `${aylikPastaVerisi.ayAdi}` : "Aylık"}
              </span>
              <div className="relative w-16 h-16 sm:w-32 sm:h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 42 42">
                  {aylikPastaVerisi.maxYuzde === 0 ? (
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#334155" strokeWidth="4.5" strokeDasharray="100 0" />
                  ) : (
                    <>
                      {(["kendinTopla", "bilesen", "cevre", "sistem", "aksesuar"] as const).map((key) => (
                        <circle
                          key={key}
                          cx="21"
                          cy="21"
                          r="15.915"
                          fill="transparent"
                          stroke={PASTA_RENKLERI[key].hex}
                          strokeWidth="4.5"
                          strokeDasharray={`${aylikPastaVerisi[key].yuzde} ${100 - aylikPastaVerisi[key].yuzde}`}
                          strokeDashoffset={-aylikPastaVerisi[key].offset}
                        />
                      ))}
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xl font-black text-white">{aylikPastaVerisi.maxYuzde}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                {[
                  { id: "kendinTopla", isim: "Kendin Topla", veri: aylikPastaVerisi.kendinTopla.yuzde },
                  { id: "bilesen", isim: "Bileşenler", veri: aylikPastaVerisi.bilesen.yuzde },
                  { id: "cevre", isim: "Çevre & Oyuncu", veri: aylikPastaVerisi.cevre.yuzde },
                  { id: "sistem", isim: "Sistem & Laptop", veri: aylikPastaVerisi.sistem.yuzde },
                  { id: "aksesuar", isim: "Ağ & Aksesuar", veri: aylikPastaVerisi.aksesuar.yuzde },
                ].map((dilim) => (
                  <div key={dilim.id} className="flex items-center justify-between w-full p-0.5 sm:p-1">
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0" style={{ backgroundColor: PASTA_RENKLERI[dilim.id].hex }} />
                      <span className="text-[7px] sm:text-[11px] text-slate-300 font-bold truncate">{dilim.isim}</span>
                    </div>
                    <span className="text-[7px] sm:text-[11px] font-black shrink-0" style={{ color: PASTA_RENKLERI[dilim.id].hex }}>
                      {dilim.veri}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col w-full">
          <div className="flex flex-row items-center justify-between gap-2 mb-2 border-b border-slate-800/80 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
              Aylık Harcama Grafiği
            </h3>
            <div className="flex items-center gap-1.5 bg-slate-800/30 border border-slate-700/50 rounded-lg px-1.5 py-1">
              <button type="button" onClick={() => setSeciliYil((y) => y - 1)} className="p-1 text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] sm:text-xs font-black text-slate-200 w-8 text-center">{seciliYil}</span>
              <button
                type="button"
                onClick={() => setSeciliYil((y) => y + 1)}
                className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                disabled={seciliYil >= suAnkiTarih.getFullYear()}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl flex items-end justify-between pt-10 pb-4 px-1 sm:px-4 h-[220px] relative mt-2">
            {grafikVerisi.map((item: any, i: number) => {
              const isSecili = tiklananAy === i;
              const isHovered = hoveredIndex === i;
              const isTooltipGozukecek = isHovered || isSecili;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full relative px-0.5 sm:px-2 outline-none select-none"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setTiklananAy(i)}
                >
                  {isTooltipGozukecek && (
                    <div
                      className="absolute bottom-[105%] bg-[#090f1e] border font-black text-[10px] sm:text-xs px-2 py-1 rounded-md whitespace-nowrap z-50"
                      style={{ borderColor: CUBUK_RENK.hex, color: CUBUK_RENK.hex }}
                    >
                      {item.tutar.toLocaleString("tr-TR")} ₺
                    </div>
                  )}
                  <div className="w-full flex items-end justify-center h-[140px]">
                    <div
                      className="w-full max-w-[36px] rounded-t-sm transition-all duration-500 ease-out cursor-pointer"
                      style={{
                        height: `${item.yuzde}%`,
                        backgroundColor: isSecili ? CUBUK_RENK.hex : "#334155",
                      }}
                    />
                  </div>
                  <span
                    className="text-[9px] sm:text-[10px] font-black mt-2 uppercase tracking-wider"
                    style={{ color: isSecili ? CUBUK_RENK.hex : "#64748b" }}
                  >
                    {item.etiket}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

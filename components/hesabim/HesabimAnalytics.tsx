"use client";

import Link from "next/link";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import MiniPalet from "@/components/hesabim/MiniPalet";
import RenkPaleti from "@/components/hesabim/RenkPaleti";

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

export interface HesabimAnalyticsProps {
  aktifPalet: "menu" | "siparis" | "pasta" | "cubuk" | null;
  togglePalet: (hedef: "menu" | "siparis" | "pasta" | "cubuk") => void;
  sonSiparislerListesi: any[];
  seciliSiparisDurumu: string | null;
  setSeciliSiparisDurumu: (durum: string) => void;
  getSiparisRenk: (durum: string) => { badge: string };
  kilitliIslem: (e: React.MouseEvent) => void;
  pastaVerisi: PastaVeri;
  pastaRenkleri: Record<string, { hex: string }>;
  seciliPastaDilimi: string | null;
  setSeciliPastaDilimi: (id: string) => void;
  aylikPastaVerisi: PastaVeri;
  seciliYil: number;
  setSeciliYil: (fn: (y: number) => number) => void;
  suAnkiTarih: Date;
  grafikVerisi: any[];
  tiklananAy: number | null;
  setTiklananAy: (i: number) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
  cubukRenk: { hex: string };
  renkUygula: (renk: { hex: string; text: string }) => void;
}

export default function HesabimAnalytics({
  aktifPalet,
  togglePalet,
  sonSiparislerListesi,
  seciliSiparisDurumu,
  setSeciliSiparisDurumu,
  getSiparisRenk,
  kilitliIslem,
  pastaVerisi,
  pastaRenkleri,
  seciliPastaDilimi,
  setSeciliPastaDilimi,
  aylikPastaVerisi,
  seciliYil,
  setSeciliYil,
  suAnkiTarih,
  grafikVerisi,
  tiklananAy,
  setTiklananAy,
  hoveredIndex,
  setHoveredIndex,
  cubukRenk,
  renkUygula,
}: HesabimAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start w-full">
      <div className="xl:col-span-1 flex flex-col h-full">
        <div
          className={`bg-[#0f172a] border rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300 flex flex-col h-[350px] sm:h-[450px] xl:h-[550px] ${aktifPalet === "siparis" ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-slate-800 hover:border-cyan-500/30"}`}
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full" />

          <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-slate-800/80 pb-3 relative z-10 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide leading-tight">Siparişler</h3>
              <MiniPalet isActive={aktifPalet === "siparis"} onClick={() => togglePalet("siparis")} />
            </div>
            {aktifPalet !== "siparis" && (
              <Link
                href="/siparislerim"
                onClick={kilitliIslem}
                prefetch={true}
                className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:underline tracking-widest uppercase"
              >
                TÜMÜNÜ GÖR
              </Link>
            )}
          </div>

          {aktifPalet === "siparis" && (
            <RenkPaleti
              disabledCondition={!seciliSiparisDurumu}
              text="🎨 Sipariş durumuna tıklayıp renk seçin"
              onSelect={renkUygula}
            />
          )}

          <div className="space-y-3 relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                const isEditing = aktifPalet === "siparis";
                const isThisSelected = seciliSiparisDurumu === durum;

                return (
                  <div
                    key={item._id || idx}
                    className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row sm:items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors rounded-xl px-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs sm:text-sm truncate mb-0.5 sm:mb-1" title={urunAdi}>
                        {urunAdi}
                      </p>
                      <p className="text-slate-500 text-[9px] sm:text-[10px] font-medium">{tarih}</p>
                    </div>

                    <div className="flex flex-row sm:flex-col xl:flex-row 2xl:flex-col items-center sm:items-end justify-between gap-1 sm:gap-2 shrink-0">
                      <p className="text-white font-black text-xs sm:text-sm">
                        {Number(toplamFiyat).toLocaleString("tr-TR")} ₺
                      </p>
                      <span
                        onClick={() => (isEditing ? setSeciliSiparisDurumu(durum) : null)}
                        className={`inline-flex items-center justify-center px-2 h-5 sm:h-6 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-widest shrink-0 transition-all ${renkAyar.badge} ${isEditing ? "cursor-pointer hover:scale-105" : ""} ${isThisSelected ? "ring-2 ring-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border border-transparent"}`}
                      >
                        {durum}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Package className="w-10 h-10 text-slate-500 mb-2" />
                <span className="text-xs text-slate-400 font-medium">Henüz siparişiniz yok.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-2 flex flex-col gap-6 w-full">
        <div
          className={`bg-[#0f172a] border rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col transition-all duration-300 ${aktifPalet === "pasta" ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-slate-800"}`}
        >
          <div className="flex flex-row items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-3">
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide leading-tight">
                  Harcama Dağılımı
                </h3>
                <MiniPalet isActive={aktifPalet === "pasta"} onClick={() => togglePalet("pasta")} />
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 hidden sm:block">Satın alınan kategoriler</p>
            </div>
          </div>

          {aktifPalet === "pasta" && (
            <RenkPaleti
              disabledCondition={!seciliPastaDilimi}
              text="🎨 Aşağıdan bir grafiğe tıklayıp renk seçin"
              onSelect={renkUygula}
            />
          )}

          <div className="flex flex-row items-start justify-between gap-1 sm:gap-6 mt-2 w-full">
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-1/2 pr-1 sm:pr-6 border-r border-slate-800/80">
              <span className="bg-slate-800 text-slate-400 text-[8px] sm:text-[10px] font-black px-1.5 py-1 rounded uppercase tracking-widest whitespace-nowrap text-center">
                TÜM ZAMANLAR
              </span>

              <div className="relative w-16 h-16 sm:w-32 sm:h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 42 42">
                  {pastaVerisi.maxYuzde === 0 ? (
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#334155" strokeWidth="4.5" strokeDasharray="100 0" />
                  ) : (
                    <>
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.kendinTopla.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${pastaVerisi.kendinTopla.yuzde} ${100 - pastaVerisi.kendinTopla.yuzde}`}
                        strokeDashoffset={-pastaVerisi.kendinTopla.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.bilesen.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${pastaVerisi.bilesen.yuzde} ${100 - pastaVerisi.bilesen.yuzde}`}
                        strokeDashoffset={-pastaVerisi.bilesen.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.cevre.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${pastaVerisi.cevre.yuzde} ${100 - pastaVerisi.cevre.yuzde}`}
                        strokeDashoffset={-pastaVerisi.cevre.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.sistem.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${pastaVerisi.sistem.yuzde} ${100 - pastaVerisi.sistem.yuzde}`}
                        strokeDashoffset={-pastaVerisi.sistem.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.aksesuar.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${pastaVerisi.aksesuar.yuzde} ${100 - pastaVerisi.aksesuar.yuzde}`}
                        strokeDashoffset={-pastaVerisi.aksesuar.offset}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-0.5 sm:mt-1">
                  <span className="text-[10px] sm:text-xl font-black text-white">{pastaVerisi.maxYuzde}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0 w-full">
                {[
                  { id: "kendinTopla", isim: "Kendin Topla", veri: pastaVerisi.kendinTopla.yuzde },
                  { id: "bilesen", isim: "Bileşenler", veri: pastaVerisi.bilesen.yuzde },
                  { id: "cevre", isim: "Çevre & Oyuncu", veri: pastaVerisi.cevre.yuzde },
                  { id: "sistem", isim: "Sistem & Laptop", veri: pastaVerisi.sistem.yuzde },
                  { id: "aksesuar", isim: "Ağ & Aksesuar", veri: pastaVerisi.aksesuar.yuzde },
                ].map((dilim) => (
                  <div
                    key={dilim.id}
                    onClick={() => (aktifPalet === "pasta" ? setSeciliPastaDilimi(dilim.id) : null)}
                    className={`flex items-center justify-between w-full p-0.5 sm:p-1 rounded-lg transition-all ${aktifPalet === "pasta" ? "cursor-pointer hover:bg-white/5" : ""} ${seciliPastaDilimi === dilim.id ? "ring-1 ring-white/50 bg-white/5 scale-105" : ""}`}
                  >
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: pastaRenkleri[dilim.id].hex,
                          boxShadow: `0 0 8px ${pastaRenkleri[dilim.id].hex}`,
                        }}
                      />
                      <span className="text-[7px] sm:text-[11px] text-slate-300 font-bold truncate pr-1">{dilim.isim}</span>
                    </div>
                    <span
                      className="text-[7px] sm:text-[11px] font-black shrink-0 pl-0.5"
                      style={{ color: pastaRenkleri[dilim.id].hex }}
                    >
                      {dilim.veri}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4 w-1/2 pl-1 sm:pl-0">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-1 rounded uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.4)] whitespace-nowrap text-center">
                {aylikPastaVerisi.ayAdi ? `${aylikPastaVerisi.ayAdi} ÖZETİ` : "AYLIK ÖZET"}
              </span>

              <div className="relative w-16 h-16 sm:w-32 sm:h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 42 42">
                  {aylikPastaVerisi.maxYuzde === 0 ? (
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#334155" strokeWidth="4.5" strokeDasharray="100 0" />
                  ) : (
                    <>
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.kendinTopla.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${aylikPastaVerisi.kendinTopla.yuzde} ${100 - aylikPastaVerisi.kendinTopla.yuzde}`}
                        strokeDashoffset={-aylikPastaVerisi.kendinTopla.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.bilesen.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${aylikPastaVerisi.bilesen.yuzde} ${100 - aylikPastaVerisi.bilesen.yuzde}`}
                        strokeDashoffset={-aylikPastaVerisi.bilesen.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.cevre.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${aylikPastaVerisi.cevre.yuzde} ${100 - aylikPastaVerisi.cevre.yuzde}`}
                        strokeDashoffset={-aylikPastaVerisi.cevre.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.sistem.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${aylikPastaVerisi.sistem.yuzde} ${100 - aylikPastaVerisi.sistem.yuzde}`}
                        strokeDashoffset={-aylikPastaVerisi.sistem.offset}
                      />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={pastaRenkleri.aksesuar.hex}
                        strokeWidth="4.5"
                        strokeDasharray={`${aylikPastaVerisi.aksesuar.yuzde} ${100 - aylikPastaVerisi.aksesuar.yuzde}`}
                        strokeDashoffset={-aylikPastaVerisi.aksesuar.offset}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-0.5 sm:mt-1">
                  <span className="text-[10px] sm:text-xl font-black text-white">{aylikPastaVerisi.maxYuzde}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0 w-full">
                {[
                  { id: "kendinTopla", isim: "Kendin Topla", veri: aylikPastaVerisi.kendinTopla.yuzde },
                  { id: "bilesen", isim: "Bileşenler", veri: aylikPastaVerisi.bilesen.yuzde },
                  { id: "cevre", isim: "Çevre & Oyuncu", veri: aylikPastaVerisi.cevre.yuzde },
                  { id: "sistem", isim: "Sistem & Laptop", veri: aylikPastaVerisi.sistem.yuzde },
                  { id: "aksesuar", isim: "Ağ & Aksesuar", veri: aylikPastaVerisi.aksesuar.yuzde },
                ].map((dilim) => (
                  <div
                    key={dilim.id}
                    onClick={() => (aktifPalet === "pasta" ? setSeciliPastaDilimi(dilim.id) : null)}
                    className={`flex items-center justify-between w-full p-0.5 sm:p-1 rounded-lg transition-all ${aktifPalet === "pasta" ? "cursor-pointer hover:bg-white/5" : ""} ${seciliPastaDilimi === dilim.id ? "ring-1 ring-white/50 bg-white/5 scale-105" : ""}`}
                  >
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: pastaRenkleri[dilim.id].hex,
                          boxShadow: `0 0 8px ${pastaRenkleri[dilim.id].hex}`,
                        }}
                      />
                      <span className="text-[7px] sm:text-[11px] text-slate-300 font-bold truncate pr-1">{dilim.isim}</span>
                    </div>
                    <span
                      className="text-[7px] sm:text-[11px] font-black shrink-0 pl-0.5"
                      style={{ color: pastaRenkleri[dilim.id].hex }}
                    >
                      {dilim.veri}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bg-[#0f172a] border rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col w-full transition-all duration-300 ${aktifPalet === "cubuk" ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-slate-800"}`}
        >
          <div className="flex flex-row items-center justify-between gap-2 mb-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide leading-tight">
                Aylık Harcama Grafiği
              </h3>
              <MiniPalet isActive={aktifPalet === "cubuk"} onClick={() => togglePalet("cubuk")} />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/30 border border-slate-700/50 rounded-lg px-1.5 py-1">
              <button onClick={() => setSeciliYil((y) => y - 1)} className="p-1 text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] sm:text-xs font-black text-slate-200 w-8 text-center">{seciliYil}</span>
              <button
                onClick={() => setSeciliYil((y) => y + 1)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                disabled={seciliYil >= suAnkiTarih.getFullYear()}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {aktifPalet === "cubuk" && (
            <RenkPaleti
              disabledCondition={false}
              text="🎨 Grafiğin rengini değiştirmek için paletten seçin"
              onSelect={renkUygula}
            />
          )}

          <div className="bg-white/[0.02] border border-white/5 rounded-xl flex items-end justify-between pt-10 pb-4 px-1 sm:px-4 h-[220px] relative mt-2">
            {grafikVerisi.length > 0
              ? grafikVerisi.map((item: any, i: number) => {
                  const isSecili = tiklananAy === i;
                  const isHovered = hoveredIndex === i;
                  const isTooltipGozukecek = isHovered || isSecili;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full relative group px-0.5 sm:px-2 outline-none select-none [-webkit-tap-highlight-color:transparent]"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => setTiklananAy(i)}
                    >
                      {isTooltipGozukecek && (
                        <div
                          className={`absolute bottom-[105%] bg-[#090f1e] border font-black text-[10px] sm:text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md whitespace-nowrap z-50 ${isSecili ? "" : "animate-in fade-in zoom-in-95 duration-150"}`}
                          style={{
                            borderColor: cubukRenk.hex,
                            color: cubukRenk.hex,
                            boxShadow: `0 0 10px ${cubukRenk.hex}30`,
                          }}
                        >
                          {item.tutar.toLocaleString("tr-TR")} ₺
                        </div>
                      )}

                      <div className="w-full flex items-end justify-center h-[140px]">
                        <div
                          className={`w-full max-w-[36px] rounded-t-sm transition-all duration-500 ease-out cursor-pointer ${isSecili ? "scale-[1.05]" : "hover:opacity-80"}`}
                          style={{
                            height: `${item.yuzde}%`,
                            backgroundColor: isSecili ? cubukRenk.hex : "#334155",
                            boxShadow: isSecili ? `0 0 6px ${cubukRenk.hex}30` : "none",
                          }}
                        />
                      </div>

                      <span
                        className="text-[9px] sm:text-[10px] font-black mt-2 shrink-0 transition-colors uppercase tracking-wider"
                        style={{ color: isSecili ? cubukRenk.hex : "#64748b" }}
                      >
                        {item.etiket}
                      </span>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

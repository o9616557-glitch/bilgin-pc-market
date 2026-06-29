"use client";

import { ShoppingCart, ShoppingBag } from "lucide-react";

const SEPET_ADEDI = 3;

function MockPhone({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[390px] mx-auto">
      <div className="mb-2 px-1">
        <p className="text-white font-bold text-sm">{label}</p>
        <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#050814] overflow-hidden shadow-2xl">
        {/* Sahte header şeridi */}
        <div className="flex items-center justify-between px-3 h-14 border-b border-white/5 bg-[#050814]/95">
          <div className="text-white font-black text-lg tracking-tight">
            BİLGİN <span className="text-[#3b82f6]">PC</span>
          </div>
          <div className="flex items-center gap-1">{children}</div>
        </div>
        <div className="h-24 bg-gradient-to-b from-[#050814] to-[#0a1020] flex items-center justify-center text-slate-600 text-xs">
          Sayfa içeriği
        </div>
      </div>
    </div>
  );
}

function SepetA_Mevcut() {
  return (
    <button type="button" className="relative p-2 text-white" aria-label="Sepet">
      <ShoppingCart className="w-5 h-5" strokeWidth={2} />
      {SEPET_ADEDI > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050814]">
          {SEPET_ADEDI}
        </span>
      )}
    </button>
  );
}

function SepetB_CamMavi() {
  return (
    <button
      type="button"
      className="relative w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/[0.1] hover:border-[#3b82f6]/40 transition-all active:scale-95"
      aria-label="Sepet"
    >
      <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.75} />
      {SEPET_ADEDI > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#3b82f6] text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-[#050814]">
          {SEPET_ADEDI}
        </span>
      )}
    </button>
  );
}

function SepetC_CantaGlow() {
  return (
    <button
      type="button"
      className="relative p-2 text-white group"
      aria-label="Sepet"
    >
      <div className="absolute inset-0 rounded-full bg-[#3b82f6]/0 group-hover:bg-[#3b82f6]/10 transition-colors" />
      <ShoppingBag className="w-5 h-5 relative z-10 group-hover:text-[#3b82f6] transition-colors" strokeWidth={1.75} />
      {SEPET_ADEDI > 0 && (
        <span className="absolute top-0 right-0 min-w-[17px] h-[17px] px-0.5 bg-white text-[#3b82f6] text-[9px] font-black flex items-center justify-center rounded-full z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
          {SEPET_ADEDI}
        </span>
      )}
    </button>
  );
}

function SepetD_YaziChip() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-white hover:border-[#3b82f6]/35 transition-colors"
      aria-label="Sepet"
    >
      <span className="text-[11px] font-semibold text-slate-300">Sepet</span>
      <div className="relative">
        <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2} />
        {SEPET_ADEDI > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 bg-[#3b82f6] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
            {SEPET_ADEDI}
          </span>
        )}
      </div>
    </button>
  );
}

export default function TestSepetPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white py-8 px-4">
      <div className="max-w-lg mx-auto mb-8 text-center">
        <h1 className="text-xl font-black mb-1">Sepet ikon testi</h1>
        <p className="text-slate-400 text-sm">
          Telefonda nasıl duracağını görmek için aşağıdaki önizlemelere bak. Beğendiğini söyle, header’a onu uygularız.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-[420px] mx-auto">
        <MockPhone label="A — Mevcut" desc="Beyaz ikon + kırmızı sayaç (şu anki)">
          <SepetA_Mevcut />
        </MockPhone>

        <MockPhone label="B — Cam buton + mavi sayaç" desc="Yuvarlak cam kutu, site mavisi badge — önerilen">
          <SepetB_CamMavi />
        </MockPhone>

        <MockPhone label="C — Çanta + glow badge" desc="Shopping bag, beyaz/mavi chip, hover glow">
          <SepetC_CantaGlow />
        </MockPhone>

        <MockPhone label="D — Sepet yazısı + ikon" desc="Chip buton, yazı + ikon birlikte">
          <SepetD_YaziChip />
        </MockPhone>
      </div>

      <p className="text-center text-slate-600 text-xs mt-10 max-w-sm mx-auto">
        URL: <span className="text-slate-400">/test-sepet</span> — test bittikten sonra bu sayfayı silebiliriz.
      </p>
    </div>
  );
}

"use client";

import { ShoppingCart, ShoppingBag, Package } from "lucide-react";

const ADET = 3;

function MockMobilHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[390px] mx-auto rounded-2xl border border-white/10 bg-[#050814] overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-3 h-[52px] border-b border-white/5">
        <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
          {children}
        </div>
      </div>
      <div className="h-20 bg-[#050814] flex items-center justify-center text-slate-700 text-[10px]">
        içerik
      </div>
    </div>
  );
}

function Kart({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-white font-bold text-sm">{label}</p>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
      <MockMobilHeader>{children}</MockMobilHeader>
    </div>
  );
}

/* 1 — Mevcut */
function V1() {
  return (
    <button type="button" className="relative p-2 text-white" aria-label="Sepet">
      <ShoppingCart className="w-5 h-5" strokeWidth={2} />
      <span className="absolute -top-1.5 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-[#050814] flex items-center justify-center">
        {ADET}
      </span>
    </button>
  );
}

/* 2 — İnce outline, mavi nokta badge */
function V2() {
  return (
    <button type="button" className="relative p-2.5 text-white" aria-label="Sepet">
      <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={1.5} />
      <span className="absolute top-1 right-1 w-2 h-2 bg-[#3b82f6] rounded-full ring-2 ring-[#050814]" />
      <span className="absolute -top-0.5 -right-1 min-w-[15px] h-[15px] bg-[#3b82f6] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
        {ADET}
      </span>
    </button>
  );
}

/* 3 — Yuvarlak cam kutu, ikon ortada */
function V3() {
  return (
    <button
      type="button"
      className="relative w-10 h-10 rounded-full bg-white/[0.07] border border-white/[0.14] flex items-center justify-center text-white active:scale-95 transition-transform"
      aria-label="Sepet"
    >
      <ShoppingCart className="w-[19px] h-[19px]" strokeWidth={1.75} />
      <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-[#3b82f6] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#050814]">
        {ADET}
      </span>
    </button>
  );
}

/* 4 — Çanta ikonu, beyaz chip badge */
function V4() {
  return (
    <button type="button" className="relative p-2 text-white" aria-label="Sepet">
      <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.6} />
      <span className="absolute -top-0.5 right-0 min-w-[16px] h-4 px-1 bg-white text-[#2563eb] text-[9px] font-black rounded-md flex items-center justify-center shadow-sm">
        {ADET}
      </span>
    </button>
  );
}

/* 5 — Sadece sayı pill, ikon yok */
function V5() {
  return (
    <button
      type="button"
      className="min-w-[36px] h-9 px-2 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/35 flex items-center justify-center gap-1 text-white"
      aria-label="Sepet"
    >
      <ShoppingCart className="w-4 h-4 text-[#3b82f6]" strokeWidth={2} />
      <span className="text-xs font-bold text-[#3b82f6]">{ADET}</span>
    </button>
  );
}

/* 6 — Kutu ikon (paket), cyan accent */
function V6() {
  return (
    <button type="button" className="relative p-2 text-slate-200" aria-label="Sepet">
      <Package className="w-[22px] h-[22px]" strokeWidth={1.6} />
      <span className="absolute top-0.5 right-0 min-w-[16px] h-4 px-0.5 bg-cyan-400 text-[#050814] text-[9px] font-black rounded-full flex items-center justify-center">
        {ADET}
      </span>
    </button>
  );
}

export default function TestSepetPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white py-6 px-4 pb-16">
      <div className="text-center mb-8 max-w-md mx-auto">
        <h1 className="text-lg font-black mb-1">Sepet — mobil, yazı yok</h1>
        <p className="text-slate-400 text-xs leading-relaxed">
          Sadece ikon + sayaç. Telefonda nasıl durduğuna bak, hangisini beğenirsen söyle.
        </p>
      </div>

      <div className="flex flex-col gap-7 max-w-[400px] mx-auto">
        <Kart label="1 — Mevcut" desc="Klasik sepet + kırmızı badge">
          <V1 />
        </Kart>
        <Kart label="2 — İnce ikon + mavi badge" desc="Daha büyük ikon, ince çizgi">
          <V2 />
        </Kart>
        <Kart label="3 — Cam yuvarlak buton" desc="İkon yuvarlak kutu içinde — önerilen">
          <V3 />
        </Kart>
        <Kart label="4 — Çanta + beyaz chip" desc="Shopping bag, beyaz sayı kutusu">
          <V4 />
        </Kart>
        <Kart label="5 — Mini pill" desc="İkon küçük + mavi sayı yan yana">
          <V5 />
        </Kart>
        <Kart label="6 — Paket ikonu" desc="Kutu/Package, cyan badge">
          <V6 />
        </Kart>
      </div>

      <p className="text-center text-slate-600 text-[10px] mt-10">/test-sepet</p>
    </div>
  );
}

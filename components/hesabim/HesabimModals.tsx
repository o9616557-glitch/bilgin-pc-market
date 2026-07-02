"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ShieldCheck, LogIn } from "lucide-react";

export interface HesabimModalsProps {
  girisSartModal: boolean;
  setGirisSartModal: (v: boolean) => void;
}

export default function HesabimModals({ girisSartModal, setGirisSartModal }: HesabimModalsProps) {
  const [portalHazir, setPortalHazir] = useState(false);

  useEffect(() => {
    setPortalHazir(true);
  }, []);

  if (!girisSartModal || !portalHazir) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={() => setGirisSartModal(false)}
    >
      <div
        className="bg-[#0f172a] border border-slate-800 rounded-2xl p-7 max-w-sm w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 bg-[#020617] rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
          <ShieldCheck className="w-7 h-7 text-cyan-400" />
        </div>
        <h3 className="text-lg font-black text-white mb-2 tracking-tight">Erişim Kısıtlı</h3>
        <p className="text-slate-400 text-sm mb-5 leading-relaxed">Bu işlem için giriş yapmanız gerekiyor.</p>
        <div className="flex flex-col gap-2.5">
          <Link
            href="/giris"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Giriş Yap
          </Link>
          <button
            onClick={() => setGirisSartModal(false)}
            className="w-full py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-slate-700 text-slate-400 font-bold text-xs uppercase tracking-widest transition-all"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

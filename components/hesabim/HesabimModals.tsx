"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Truck,
  Palette,
  ChevronRight,
  X,
  Copy,
  CheckCircle2,
  LogIn,
} from "lucide-react";

export interface HesabimModalsProps {
  showOnboarding: boolean;
  portalHazir: boolean;
  closeOnboarding: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: (v: boolean) => void;
  isKargoModalOpen: boolean;
  setIsKargoModalOpen: (v: boolean) => void;
  kargoSiparisleri: any[];
  kopyalananKod: string | null;
  handleTakipEt: (takipNumarasi: string) => void;
  girisSartModal: boolean;
  setGirisSartModal: (v: boolean) => void;
}

export default function HesabimModals({
  showOnboarding,
  portalHazir,
  closeOnboarding,
  dontShowAgain,
  setDontShowAgain,
  isKargoModalOpen,
  setIsKargoModalOpen,
  kargoSiparisleri,
  kopyalananKod,
  handleTakipEt,
  girisSartModal,
  setGirisSartModal,
}: HesabimModalsProps) {
  return (
    <>
      {showOnboarding &&
        portalHazir &&
        createPortal(
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-[#050814]/95 backdrop-blur-xl p-4 sm:p-6">
            <div className="w-full max-w-md sm:max-w-lg max-h-[min(88dvh,640px)] overflow-y-auto bg-[#0f172a]/95 border border-cyan-500/20 rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.12)] relative -translate-y-0 md:-translate-y-6">
              <div className="p-5 sm:p-7 flex flex-col">
                <div className="text-center mb-5 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-[spin_6s_linear_infinite] border-t-cyan-400" />
                    <div className="absolute inset-1.5 rounded-full bg-[#050814] border border-slate-700 flex items-center justify-center">
                      <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
                    Kişisel panelinize hoş geldiniz
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                    Hesabım sayfasını kendi zevkinize göre özelleştirebilirsiniz. Başlamadan önce iki kısa not:
                  </p>
                </div>

                <div className="space-y-3 mb-5 sm:mb-6">
                  <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-9 h-9 rounded-full bg-[#050814] border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">Menüleri boyayın ve taşıyın</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Profil yuvarlağınıza tıklayarak kutuların yerini değiştirebilir ve renklendirebilirsiniz.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-9 h-9 rounded-full bg-[#050814] border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Palette className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">Grafikleri özelleştirin</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Başlıkların yanındaki ikonlara tıklayarak sipariş ve grafik renklerini değiştirebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                  <label
                    className="flex items-center gap-2.5 cursor-pointer group select-none justify-center sm:justify-start"
                    onClick={() => setDontShowAgain(!dontShowAgain)}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${dontShowAgain ? "bg-emerald-500 border-emerald-400" : "bg-[#050814] border-slate-600"}`}
                    >
                      {dontShowAgain && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                      Bir daha gösterme
                    </span>
                  </label>

                  <button
                    onClick={closeOnboarding}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    Hadi başlayalım <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {isKargoModalOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsKargoModalOpen(false)}
        >
          <div
            className="bg-[#09090b] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-400" /> AKTİF KARGOLARINIZ
              </h3>
              <button
                onClick={() => setIsKargoModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white bg-[#121215] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {kargoSiparisleri.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-medium text-sm">
                  Şu an yolda olan aktif kargonuz bulunmuyor.
                </div>
              ) : (
                kargoSiparisleri.map((siparis: any, idx: number) => {
                  const siparisKodu = siparis.siparisKodu || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
                  const tarih = siparis.createdAt
                    ? new Date(siparis.createdAt).toLocaleDateString("tr-TR")
                    : siparis.tarih
                      ? new Date(siparis.tarih).toLocaleDateString("tr-TR")
                      : "";
                  const firma = siparis.kargoFirmasi || "Belirtilmemiş";
                  const takipNo = siparis.takipNo || "Takip No Girilmemiş";

                  return (
                    <div
                      key={siparis._id || idx}
                      className="bg-[#121215] border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-4 group/item hover:border-slate-700 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-sm tracking-wide">{siparisKodu}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black uppercase tracking-widest">
                            YOLDA
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{tarih}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Firma</p>
                          <p className="text-xs font-bold text-white mt-0.5 truncate" title={firma}>{firma}</p>
                        </div>
                        <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Takip No</p>
                          <p className="text-xs font-bold text-cyan-400 mt-0.5 truncate" title={takipNo}>{takipNo}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTakipEt(takipNo)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-black px-4 py-3 rounded-xl transition-all text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.2)] w-full"
                      >
                        {kopyalananKod === takipNo ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> KOPYALANDI!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> {takipNo} KOPYALA
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {girisSartModal &&
        portalHazir &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setGirisSartModal(false)}
          >
            <div
              className="bg-[#0f172a] border border-slate-800 rounded-2xl p-7 max-w-sm w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative -translate-y-4 sm:-translate-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-[#020617] rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                <ShieldCheck className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 tracking-tight">Erişim Kısıtlı</h3>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Bu işlem için giriş yapmanız gerekiyor. İsterseniz paneli gezmeye devam edebilirsiniz.
              </p>
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
        )}
    </>
  );
}

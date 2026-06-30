"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Palette,
  ChevronRight,
  ChevronLeft,
  X,
  Copy,
  CheckCircle2,
  LogIn,
  Camera,
  GripVertical,
  ImagePlus,
  Bell,
  PieChart,
  BarChart3,
  Sparkles,
  Star,
  Server,
  Headset,
  Search,
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

const REHBER_ADIMLARI = [
  {
    baslik: "Profiliniz, sizin alanınız",
    ozet: "Fotoğrafınızı ekleyin; üye girişiyle tüm ayarlarınız kalıcı olsun.",
    kartlar: [
      {
        ikon: Camera,
        renk: "cyan",
        baslik: "Profil fotoğrafı",
        metin: "Profil kartındaki kamera simgesine tıklayarak fotoğrafınızı yükleyebilir veya güncelleyebilirsiniz.",
      },
      {
        ikon: LogIn,
        renk: "blue",
        baslik: "Google ile kalıcı giriş",
        metin: "Üye olarak Google ile giriş yaptığınızda menü düzeni, renkler ve görseller hesabınıza kaydedilir; her girişte aynı panel sizi karşılar.",
      },
    ],
  },
  {
    baslik: "Menü kutularınız",
    ozet: "Alt kısımdaki kısayol kutularını dilediğiniz gibi düzenleyin.",
    kartlar: [
      {
        ikon: Palette,
        renk: "emerald",
        baslik: "Düzenleme modu",
        metin: "Profil dairesine tıklayın. Kutuları sürükleyerek sırasını değiştirin; kutuya tıklayarak özel resim ekleyin.",
      },
      {
        ikon: GripVertical,
        renk: "violet",
        baslik: "Favoriler, Sistemler, Destek…",
        metin: "Favoriler, Sistemler, Destek, Kargolar ve Sorgula kutularının yerini ve görselini kendinize göre ayarlayabilirsiniz.",
      },
    ],
  },
  {
    baslik: "Bildirim pinleri",
    ozet: "Destek ve kargo kutularındaki küçük noktaların rengini seçin.",
    kartlar: [
      {
        ikon: Bell,
        renk: "rose",
        baslik: "Pin rengi",
        metin: "Düzenleme modundayken renk paletinden bildirim noktası rengini seçin. Yeni mesaj veya kargo olduğunda bu renkle görünür.",
      },
      {
        ikon: ImagePlus,
        renk: "amber",
        baslik: "Kapak görseli",
        metin: "Profil kartının sağındaki geniş alana tıklayarak kapak görseli de ekleyebilirsiniz.",
      },
    ],
  },
  {
    baslik: "Grafik renkleri",
    ozet: "Sayfanın altındaki harcama grafiklerini kendi tarzınıza uyarlayın.",
    kartlar: [
      {
        ikon: PieChart,
        renk: "purple",
        baslik: "Harcama dağılımı",
        metin: "Pasta grafiğinin başlığındaki palet simgesine tıklayın; dilimlere tıklayarak her kategori için ayrı renk belirleyin.",
      },
      {
        ikon: BarChart3,
        renk: "cyan",
        baslik: "Aylık harcama",
        metin: "Aylık harcama grafiğinin yanındaki palet ile çubuk rengini değiştirin. Sipariş durumu renkleri de aynı şekilde özelleştirilebilir.",
      },
    ],
  },
] as const;

const IKON_RENK: Record<string, string> = {
  cyan: "border-cyan-500/25 text-cyan-400",
  blue: "border-blue-500/25 text-blue-400",
  emerald: "border-emerald-500/25 text-emerald-400",
  violet: "border-violet-500/25 text-violet-400",
  rose: "border-rose-500/25 text-rose-400",
  amber: "border-amber-500/25 text-amber-400",
  purple: "border-purple-500/25 text-purple-400",
};

function HesabimOnboarding({
  dontShowAgain,
  setDontShowAgain,
  onClose,
}: {
  dontShowAgain: boolean;
  setDontShowAgain: (v: boolean) => void;
  onClose: () => void;
}) {
  const [adim, setAdim] = useState(0);
  const sonAdim = REHBER_ADIMLARI.length - 1;
  const mevcut = REHBER_ADIMLARI[adim];

  useEffect(() => {
    setAdim(0);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-[#050814]/96 backdrop-blur-xl p-4 sm:p-6">
      <div className="w-full max-w-lg sm:max-w-xl max-h-[min(90dvh,680px)] flex flex-col bg-[#0b1121]/98 border border-cyan-500/15 rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.14)] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent shrink-0" />

        <div className="p-5 sm:p-7 flex flex-col flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
          <div className="text-center mb-5 sm:mb-6 shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-400/25 animate-[spin_8s_linear_infinite] border-t-cyan-400" />
              <div className="absolute inset-1.5 rounded-full bg-[#050814] border border-slate-700/80 flex items-center justify-center">
                {adim === 0 ? (
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                ) : adim === 1 ? (
                  <GripVertical className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                ) : adim === 2 ? (
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                ) : (
                  <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                )}
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/80 mb-2">
              Adım {adim + 1} / {REHBER_ADIMLARI.length}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-1.5">
              {mevcut.baslik}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {mevcut.ozet}
            </p>
          </div>

          <div className="flex justify-center gap-1.5 mb-5 shrink-0">
            {REHBER_ADIMLARI.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Adım ${i + 1}`}
                onClick={() => setAdim(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === adim ? "w-8 bg-cyan-400" : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

          <div className="space-y-3 flex-1">
            {mevcut.kartlar.map((kart) => {
              const Ikon = kart.ikon;
              const renkSinifi = IKON_RENK[kart.renk] || IKON_RENK.cyan;
              return (
                <div
                  key={kart.baslik}
                  className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-[#050814] border flex items-center justify-center shrink-0 ${renkSinifi}`}
                  >
                    <Ikon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-1">{kart.baslik}</h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed">{kart.metin}</p>
                  </div>
                </div>
              );
            })}

            {adim === 1 && (
              <div className="flex flex-wrap justify-center gap-2 pt-1 px-1">
                {[
                  { ikon: Star, label: "Favoriler" },
                  { ikon: Server, label: "Sistemler" },
                  { ikon: Headset, label: "Destek" },
                  { ikon: Truck, label: "Kargolar" },
                  { ikon: Search, label: "Sorgula" },
                ].map(({ ikon: Ikon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-slate-400"
                  >
                    <Ikon className="w-3 h-3 text-slate-500" />
                    {label}
                  </span>
                ))}
              </div>
            )}

            {adim === 0 && (
              <Link
                href="/giris"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 text-xs font-medium transition-colors"
              >
                <LogIn className="w-4 h-4 text-blue-400" />
                Google ile giriş sayfasına git
              </Link>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 pt-4 border-t border-slate-800/80 bg-[#0a0f1a]/80 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <label
              className="flex items-center gap-2.5 cursor-pointer group select-none justify-center sm:justify-start order-2 sm:order-1"
              onClick={() => setDontShowAgain(!dontShowAgain)}
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  dontShowAgain ? "bg-emerald-500 border-emerald-400" : "bg-[#050814] border-slate-600"
                }`}
              >
                {dontShowAgain && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                Bir daha gösterme
              </span>
            </label>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              {adim > 0 && (
                <button
                  type="button"
                  onClick={() => setAdim((a) => a - 1)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Geri
                </button>
              )}
              {adim < sonAdim ? (
                <button
                  type="button"
                  onClick={() => setAdim((a) => a + 1)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  İleri
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  Hadi başlayalım
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
          <HesabimOnboarding
            dontShowAgain={dontShowAgain}
            setDontShowAgain={setDontShowAgain}
            onClose={closeOnboarding}
          />,
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
        )}
    </>
  );
}

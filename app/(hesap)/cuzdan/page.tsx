"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ShieldCheck, CreditCard, Plus, Receipt, Trash2,
  CheckCircle2, XCircle, Clock, Loader2, LogIn, UserPlus,
  Wallet, Gift, Star, ChevronRight, ChevronDown, Info
} from "lucide-react";
import toast from "react-hot-toast";
import { paraFormatla, kartNumarasiFormatla, type KayitliKart, type CuzdanIslem } from "@/lib/cuzdan";
import { KartYigini } from "@/components/KayitliKartGorseli";

function IslemSatiri({ islem }: { islem: CuzdanIslem }) {
  const ikon =
    islem.status === "basarisiz" ? (
      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/15 shrink-0">
        <XCircle className="w-4 h-4 text-red-400" />
      </div>
    ) : islem.status === "beklemede" ? (
      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/15 shrink-0">
        <Clock className="w-4 h-4 text-amber-400" />
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15 shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      </div>
    );

  const tarih = new Date(islem.date).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-[#020617] border border-slate-800/60 hover:border-slate-700/80 rounded-xl transition-all">
      <div className="flex items-center gap-3 min-w-0">
        {ikon}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold text-slate-200 truncate">{islem.title}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">
            {tarih}
            {islem.orderCode ? ` • ${islem.orderCode}` : ""}
            {islem.paymentMethod ? ` • ${islem.paymentMethod}` : ""}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className={`text-xs sm:text-sm font-black ${islem.status === "basarisiz" ? "text-slate-500 line-through" : "text-slate-200"}`}>
          {paraFormatla(islem.amount)}
        </p>
        <p className={`text-[9px] font-bold uppercase tracking-widest ${
          islem.status === "basarisiz" ? "text-red-400" :
          islem.status === "beklemede" ? "text-amber-400" : "text-emerald-400"
        }`}>
          {islem.statusLabel}
        </p>
      </div>
    </div>
  );
}

const CUZDAN_CACHE_KEY = "bilgin_cuzdan";

function cuzdanCacheOku() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CUZDAN_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cuzdanCacheYaz(data: {
  storeCredit: number;
  loyaltyPoints: number;
  savedCards: KayitliKart[];
  transactions: CuzdanIslem[];
}) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CUZDAN_CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export default function CuzdanPage() {
  const { status } = useSession();
  const [storeCredit, setStoreCredit] = useState(() => cuzdanCacheOku()?.storeCredit ?? 0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => cuzdanCacheOku()?.loyaltyPoints ?? 0);
  const [savedCards, setSavedCards] = useState<KayitliKart[]>(() => cuzdanCacheOku()?.savedCards ?? []);
  const [transactions, setTransactions] = useState<CuzdanIslem[]>(() => cuzdanCacheOku()?.transactions ?? []);

  const [kartModal, setKartModal] = useState(false);
  const [kartYukleniyor, setKartYukleniyor] = useState(false);
  const [silinecekKart, setSilinecekKart] = useState<string | null>(null);
  const [bakiyeBilgiAcik, setBakiyeBilgiAcik] = useState(false);
  const [form, setForm] = useState({
    cardNumber: "", holderName: "", expiryMonth: "", expiryYear: "",
  });

  const veriCek = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const res = await fetch("/api/cuzdan?t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("Veri alınamadı");
      const data = await res.json();
      const yeniVeri = {
        storeCredit: data.storeCredit ?? 0,
        loyaltyPoints: data.loyaltyPoints ?? 0,
        savedCards: data.savedCards ?? [],
        transactions: data.transactions ?? [],
      };
      setStoreCredit(yeniVeri.storeCredit);
      setLoyaltyPoints(yeniVeri.loyaltyPoints);
      setSavedCards(yeniVeri.savedCards);
      setTransactions(yeniVeri.transactions);
      cuzdanCacheYaz(yeniVeri);
    } catch {
      toast.error("Cüzdan bilgileri yüklenemedi.");
    }
  }, [status]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") veriCek();
  }, [status, veriCek]);

  const kartEkle = async () => {
    setKartYukleniyor(true);
    try {
      const res = await fetch("/api/cuzdan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addCard", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata || "Kart eklenemedi");
      setSavedCards(data.savedCards ?? []);
      setForm({ cardNumber: "", holderName: "", expiryMonth: "", expiryYear: "" });
      setKartModal(false);
      cuzdanCacheYaz({
        storeCredit: data.storeCredit ?? storeCredit,
        loyaltyPoints: data.loyaltyPoints ?? loyaltyPoints,
        savedCards: data.savedCards ?? [],
        transactions: data.transactions ?? transactions,
      });
      toast.success(data.mesaj || "Kart kaydedildi.");
      if (data.uyari) toast(data.uyari, { icon: "⚠️", duration: 8000 });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setKartYukleniyor(false);
    }
  };

  const kartSil = async (cardId: string) => {
    try {
      const res = await fetch("/api/cuzdan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteCard", cardId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata || "Silinemedi");
      setSavedCards(data.savedCards ?? []);
      setSilinecekKart(null);
      cuzdanCacheYaz({
        storeCredit,
        loyaltyPoints,
        savedCards: data.savedCards ?? [],
        transactions,
      });
      toast.success("Kart silindi.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const varsayilanYap = async (cardId: string) => {
    try {
      const res = await fetch("/api/cuzdan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setDefault", cardId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata);
      setSavedCards(data.savedCards ?? []);
      toast.success("Varsayılan kart güncellendi.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
        <div className="flex flex-col min-w-0 gap-5 w-full">

          <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-site-accent/80" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">Dijital Cüzdanım</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Bakiye, kartlar ve ödeme geçmişi.</p>
              </div>
            </div>
          </div>

          {status === "unauthenticated" ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
              <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-lg font-black text-white mb-2">Cüzdanınızı görüntülemek için giriş yapın</h2>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Kayıtlı kartlarınız ve bakiye bilgileriniz hesabınıza bağlıdır.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/giris" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all">
                  <LogIn className="w-4 h-4" /> Giriş Yap
                </Link>
                <Link href="/kayit" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700">
                  <UserPlus className="w-4 h-4" /> Kayıt Ol
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Bakiye özeti */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mağaza Kredisi</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-white">{paraFormatla(storeCredit)}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Onaylı iade, iptal ve kampanya bakiyeleri</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ödül Puanları</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-white">{loyaltyPoints.toLocaleString("tr-TR")} <span className="text-sm font-bold text-slate-500">puan</span></p>
                  <p className="text-[10px] text-slate-500 mt-1">Her alışverişinizde birikir</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kayıtlı Kart</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-white">{savedCards.length}<span className="text-sm font-bold text-slate-500"> / 5</span></p>
                  <p className="text-[10px] text-slate-500 mt-1">Hızlı ödeme için kayıtlı</p>
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setBakiyeBilgiAcik((v) => !v)}
                  className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-slate-800/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Info className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-400">Kredi ve puanlar nasıl çalışır?</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${bakiyeBilgiAcik ? "rotate-180" : ""}`} />
                </button>
                {bakiyeBilgiAcik && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-slate-800/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div className="rounded-xl border border-slate-800/80 bg-[#020617]/60 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-3.5 h-3.5 text-cyan-400/80" />
                          <p className="text-xs font-bold text-slate-300">Mağaza Kredisi</p>
                        </div>
                        <ul className="text-[11px] sm:text-xs text-slate-500 space-y-1.5 leading-relaxed list-disc list-inside">
                          <li>
                            <strong className="text-slate-400 font-semibold">İade:</strong> Ürün iadeniz onaylandığında ve tutar size mağaza kredisi olarak tanımlandığında cüzdanınıza TL yüklenir. Kartınıza yapılan banka iadesi ayrı bir süreçtir.
                          </li>
                          <li>
                            <strong className="text-slate-400 font-semibold">İptal:</strong> Sipariş iptallerinde ödeme krediye aktarıldığında bakiyeniz burada görünür.
                          </li>
                          <li>
                            <strong className="text-slate-400 font-semibold">Kampanya:</strong> Üyelere özel hediye, promosyon veya telafi bakiyeleri bu alana eklenir.
                          </li>
                          <li>Ödeme adımında sepet tutarından düşebilirsiniz; nakit çekilemez, yalnızca mağazamızda kullanılır.</li>
                        </ul>
                      </div>
                      <div className="rounded-xl border border-slate-800/80 bg-[#020617]/60 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-3.5 h-3.5 text-amber-400/80" />
                          <p className="text-xs font-bold text-slate-300">Ödül Puanları</p>
                        </div>
                        <ul className="text-[11px] sm:text-xs text-slate-500 space-y-1.5 leading-relaxed list-disc list-inside">
                          <li>Tamamlanan her siparişinizde puan kazanırsınız.</li>
                          <li>Ödeme sayfasında puanlarınızı indirim olarak kullanabilirsiniz.</li>
                          <li>Biriken puanlarınız bu sayfada görüntülenir; süresi dolmadan kullanmanızı öneririz.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">

                {/* Kartlar */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between gap-3 mb-1 pb-3 sm:pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                      <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider truncate">Kayıtlı Kartlarım</h2>
                    </div>
                    {savedCards.length < 5 && (
                      <button
                        type="button"
                        onClick={() => setKartModal(true)}
                        title="Yeni kart ekle"
                        aria-label="Yeni kart ekle"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/40 hover:bg-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                  {savedCards.length > 0 && (
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mb-4 leading-relaxed">
                      Varsayılan kartı değiştirmek için öne getirdiğiniz kartın sağ üstündeki{" "}
                      <span className="text-slate-400 font-bold">⋮</span> menüsünden &quot;Varsayılan Yap&quot;ı seçin.
                    </p>
                  )}

                  {savedCards.some((k) => !k.iyzicoHazir) && (
                    <div className="mb-4 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] text-[11px] sm:text-xs text-emerald-200/90 leading-relaxed">
                      <strong className="text-emerald-300">Kart Saklama aktif.</strong>{" "}
                      &quot;YENİDEN EKLE&quot; etiketli kartları silip tekrar kaydedin; böylece İyzico&apos;ya bağlanır ve ödeme sayfasında kullanılabilir.
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    {savedCards.length === 0 ? (
                      <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-2xl">
                        <CreditCard className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 mb-1">Henüz kayıtlı kartınız yok</p>
                        <p className="text-[10px] text-slate-600 mb-4">Ödeme sırasında hızlı seçim için kart ekleyebilirsiniz.</p>
                        <button
                          type="button"
                          onClick={() => setKartModal(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> İlk Kartınızı Ekleyin
                        </button>
                      </div>
                    ) : (
                      <KartYigini
                        kartlar={savedCards}
                        onSil={(id) => setSilinecekKart(id)}
                        onVarsayilan={varsayilanYap}
                      />
                    )}
                  </div>
                </div>

                {/* İşlemler */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Son İşlemler</h2>
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    {transactions.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-sm">Henüz işlem kaydı yok.</div>
                    ) : (
                      transactions.slice(0, 8).map((islem) => (
                        <IslemSatiri key={islem._id} islem={islem} />
                      ))
                    )}

                    {transactions.length > 0 && (
                      <Link
                        href="/siparislerim"
                        className="mt-auto pt-4 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-widest"
                      >
                        Tüm Sipariş Geçmişi <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-300 mb-0.5">Güvenli Kart Saklama</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                    Tam kart numaranız ve CVV kodunuz sunucularımızda saklanmaz. Kartlarınız İyzico güvenli kart saklama altyapısına kaydedilir; ödeme sırasında hızlı kullanım için yalnızca son 4 hane ve kart bilgileri görüntülenir.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

      {/* Kart ekle modal */}
      {kartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-1">Yeni Kart Ekle</h3>
            <p className="text-xs text-slate-500 mb-5">Kart bilgileriniz güvenli şekilde maskelenerek kaydedilir.</p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Kart Numarası</label>
                <input
                  value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: kartNumarasiFormatla(e.target.value) })}
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength={19}
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Kart Sahibi</label>
                <input
                  value={form.holderName}
                  onChange={(e) => setForm({ ...form, holderName: e.target.value })}
                  placeholder="AD SOYAD"
                  className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-slate-600 uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Son Kullanma Ayı</label>
                  <input
                    value={form.expiryMonth}
                    onChange={(e) => setForm({ ...form, expiryMonth: e.target.value.replace(/\D/g, "").slice(0, 2) })}
                    placeholder="AA"
                    maxLength={2}
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-slate-600 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Son Kullanma Yılı</label>
                  <input
                    value={form.expiryYear}
                    onChange={(e) => setForm({ ...form, expiryYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    placeholder="YYYY"
                    maxLength={4}
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-slate-600 text-center font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setKartModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider hover:bg-slate-800/50 transition-all"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={kartEkle}
                disabled={kartYukleniyor}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {kartYukleniyor ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kart sil onay */}
      {silinecekKart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-black text-white mb-2">Kartı Sil</h3>
            <p className="text-sm text-slate-400 mb-6">Bu kart cüzdanınızdan kalıcı olarak kaldırılacak.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setSilinecekKart(null)} className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 font-bold text-xs uppercase">Vazgeç</button>
              <button type="button" onClick={() => kartSil(silinecekKart)} className="flex-1 py-3 rounded-xl bg-red-950/60 border border-red-900/50 text-red-400 font-bold text-xs uppercase hover:bg-red-900/40 transition-all">Sil</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

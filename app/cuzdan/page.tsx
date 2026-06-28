"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User, ShieldCheck, CreditCard, Plus, Receipt, Trash2,
  CheckCircle2, XCircle, Clock, Loader2, LogIn, UserPlus,
  Wallet, Gift, Star, MoreVertical, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import { paraFormatla, type KayitliKart, type CuzdanIslem } from "@/lib/cuzdan";

const MARKA_ETIKET: Record<string, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  troy: "TROY",
  amex: "AMEX",
  diger: "KART",
};

function KartGorseli({ kart, secili, onSil, onVarsayilan }: {
  kart: KayitliKart;
  secili?: boolean;
  onSil: () => void;
  onVarsayilan: () => void;
}) {
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <div className={`relative w-full aspect-[1.65/1] max-w-sm rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 ${secili ? "ring-1 ring-cyan-500/30" : ""}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a0f1a] to-slate-900" />
      <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/[0.04] blur-[40px] rounded-full" />
      <div className="absolute inset-0 border border-slate-800 rounded-2xl" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-2">
          {kart.isDefault && (
            <span className="text-[8px] font-black tracking-widest text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/15">
              VARSAYILAN
            </span>
          )}
          <span className="text-[9px] font-bold tracking-widest text-slate-500">
            {MARKA_ETIKET[kart.brand] || "KART"}
          </span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuAcik(!menuAcik)}
            className="w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          {menuAcik && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuAcik(false)} />
              <div className="absolute right-0 top-8 z-30 min-w-[140px] bg-[#0f172a] border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                {!kart.isDefault && (
                  <button
                    type="button"
                    onClick={() => { onVarsayilan(); setMenuAcik(false); }}
                    className="w-full px-3 py-2.5 text-left text-[11px] font-bold text-slate-300 hover:bg-slate-800/60 transition-colors"
                  >
                    Varsayılan Yap
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { onSil(); setMenuAcik(false); }}
                  className="w-full px-3 py-2.5 text-left text-[11px] font-bold text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  Kartı Sil
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="text-base sm:text-lg font-mono font-medium tracking-[0.18em] text-slate-300 mb-3">
          •••• •••• •••• {kart.last4}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[8px] uppercase tracking-widest text-slate-600 block mb-0.5">Kart Sahibi</span>
            <span className="text-[11px] font-bold tracking-wide text-slate-400 truncate max-w-[160px] block">
              {kart.holderName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] uppercase tracking-widest text-slate-600 block mb-0.5">SKT</span>
            <span className="text-[11px] font-bold text-slate-400">{kart.expiryMonth}/{kart.expiryYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function CuzdanPage() {
  const { status } = useSession();
  const [yukleniyor, setYukleniyor] = useState(true);
  const [storeCredit, setStoreCredit] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [savedCards, setSavedCards] = useState<KayitliKart[]>([]);
  const [transactions, setTransactions] = useState<CuzdanIslem[]>([]);

  const [kartModal, setKartModal] = useState(false);
  const [kartYukleniyor, setKartYukleniyor] = useState(false);
  const [silinecekKart, setSilinecekKart] = useState<string | null>(null);
  const [form, setForm] = useState({
    cardNumber: "", holderName: "", expiryMonth: "", expiryYear: "", cvv: "",
  });

  const veriCek = useCallback(async () => {
    if (status !== "authenticated") {
      setYukleniyor(false);
      return;
    }
    try {
      const res = await fetch("/api/cuzdan?t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("Veri alınamadı");
      const data = await res.json();
      setStoreCredit(data.storeCredit ?? 0);
      setLoyaltyPoints(data.loyaltyPoints ?? 0);
      setSavedCards(data.savedCards ?? []);
      setTransactions(data.transactions ?? []);
    } catch {
      toast.error("Cüzdan bilgileri yüklenemedi.");
    } finally {
      setYukleniyor(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setYukleniyor(false);
      return;
    }
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
      setForm({ cardNumber: "", holderName: "", expiryMonth: "", expiryYear: "", cvv: "" });
      setKartModal(false);
      toast.success(data.mesaj || "Kart kaydedildi.");
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
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip font-medium">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-600 blur-[250px] opacity-[0.04] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">

        <div className="w-full lg:w-[280px] shrink-0 static lg:sticky lg:top-28 z-10">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Profil
              </Link>
              <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner text-sm sm:text-base">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> Dijital Cüzdanım
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/[0.04] blur-[50px] pointer-events-none rounded-full" />
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-slate-800 rounded-full flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400/80" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Dijital Cüzdanım</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Bakiyeniz, kayıtlı kartlarınız ve ödeme geçmişiniz tek ekranda.</p>
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
          ) : yukleniyor ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
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
                  <p className="text-[10px] text-slate-500 mt-1">İade ve promosyon bakiyeleri</p>
                </div>
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sadakat Puanı</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-white">{loyaltyPoints.toLocaleString("tr-TR")} <span className="text-sm font-bold text-slate-500">puan</span></p>
                  <p className="text-[10px] text-slate-500 mt-1">Alışverişlerinizden kazanılır</p>
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

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">

                {/* Kartlar */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Kayıtlı Kartlarım</h2>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {savedCards.length === 0 ? (
                      <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-2xl">
                        <CreditCard className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 mb-1">Henüz kayıtlı kartınız yok</p>
                        <p className="text-[10px] text-slate-600">Ödeme sırasında hızlı seçim için kart ekleyebilirsiniz.</p>
                      </div>
                    ) : (
                      savedCards.map((kart) => (
                        <KartGorseli
                          key={kart._id}
                          kart={kart}
                          secili={kart.isDefault}
                          onSil={() => setSilinecekKart(kart._id)}
                          onVarsayilan={() => varsayilanYap(kart._id)}
                        />
                      ))
                    )}

                    {savedCards.length < 5 && (
                      <button
                        type="button"
                        onClick={() => setKartModal(true)}
                        className="w-full max-w-sm p-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/20 hover:bg-slate-800/30 hover:border-slate-700 transition-all group flex flex-col items-center justify-center gap-2 h-[100px]"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#020617] border border-slate-800 group-hover:border-slate-600 flex items-center justify-center transition-colors">
                          <Plus className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-400 uppercase tracking-wider">Yeni Kart Ekle</span>
                      </button>
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
                    Tam kart numaranız ve CVV kodunuz sunucularımızda saklanmaz. Yalnızca son 4 hane ve kart bilgileri hızlı ödeme kolaylığı için tutulur. Ödeme işlemleri iyzico altyapısı üzerinden şifrelenir.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
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
                  onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                  placeholder="0000 0000 0000 0000"
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Ay</label>
                  <input
                    value={form.expiryMonth}
                    onChange={(e) => setForm({ ...form, expiryMonth: e.target.value.replace(/\D/g, "").slice(0, 2) })}
                    placeholder="MM"
                    maxLength={2}
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-slate-600 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Yıl</label>
                  <input
                    value={form.expiryYear}
                    onChange={(e) => setForm({ ...form, expiryYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    placeholder="YY"
                    maxLength={4}
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-slate-600 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">CVV</label>
                  <input
                    type="password"
                    value={form.cvv}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    placeholder="•••"
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

    </div>
  );
}

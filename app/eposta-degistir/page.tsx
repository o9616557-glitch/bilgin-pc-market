"use client";

import { useState, useEffect } from "react";
import AccountShell from "@/components/layout/AccountShell";
import { Mail, Eye, EyeOff, CheckCircle2, XCircle, Loader2, Link2, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function EpostaDegistirPage() {
  const { data: session } = useSession();
  const [yeniEposta, setYeniEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [bagliHesaplar, setBagliHesaplar] = useState<{ eposta: string; saglayici: string; aktif: boolean }[]>([]);

  useEffect(() => {
    if (!session?.user?.email) return;
    const hesaplar: { eposta: string; saglayici: string; aktif: boolean }[] = [];
    const mevcutEposta = session.user.email;
    const isGoogleImage = session.user.image?.includes("googleusercontent") || session.user.image?.includes("google");
    hesaplar.push({ eposta: mevcutEposta, saglayici: "Mevcut", aktif: true });
    if (isGoogleImage && (session.user as any).googleEmail && (session.user as any).googleEmail !== mevcutEposta) {
      hesaplar.push({ eposta: (session.user as any).googleEmail, saglayici: "Google", aktif: false });
    }
    setBagliHesaplar(hesaplar);
  }, [session]);
  const [gosterSifre, setGosterSifre] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState<{ tip: "basari" | "hata"; mesaj: string } | null>(null);

  const handleGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yeniEposta || !sifre) {
      setSonuc({ tip: "hata", mesaj: "Tüm alanları doldurun." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(yeniEposta)) {
      setSonuc({ tip: "hata", mesaj: "Geçerli bir e-posta adresi girin." });
      return;
    }

    setYukleniyor(true);
    setSonuc(null);
    try {
      const res = await fetch("/api/user/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yeniEposta, sifre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "İşlem başarısız.");
      setSonuc({ tip: "basari", mesaj: "E-posta adresiniz güncellendi. Yeni adresinizle giriş yapabilirsiniz." });
      setYeniEposta("");
      setSifre("");
      toast.success("E-posta adresi güncellendi.");
    } catch (err: any) {
      setSonuc({ tip: "hata", mesaj: err.message });
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <AccountShell active="eposta-degistir">
      <div className="flex flex-col gap-5">
        <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-site-accent/80" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">E-posta Değiştir</h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Mevcut adres: <span className="text-slate-300">{session?.user?.email || "—"}</span>
              </p>
            </div>
          </div>
        </div>

        {bagliHesaplar.length > 1 && (
          <div className="account-card rounded-2xl p-5 sm:p-6 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-4 h-4 text-site-accent/70" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bağlı E-posta Hesapları</span>
            </div>
            <div className="flex flex-col gap-2">
              {bagliHesaplar.map((h) => (
                <button
                  key={h.eposta}
                  type="button"
                  onClick={() => !h.aktif && setYeniEposta(h.eposta)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                    h.aktif
                      ? "bg-site-accent/10 border-site-accent/30 text-white cursor-default"
                      : "bg-site-shell border-white/[0.08] text-slate-300 hover:border-site-accent/40 hover:bg-site-accent/5 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">{h.eposta}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      h.aktif
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-white/[0.04] border-white/10 text-slate-500"
                    }`}>
                      {h.aktif ? "Aktif" : h.saglayici}
                    </span>
                    {!h.aktif && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 mt-3">Geçiş yapmak istediğiniz hesaba tıklayın, aşağıdaki forma otomatik aktarılacaktır.</p>
          </div>
        )}

        <div className="account-card rounded-2xl p-5 sm:p-6 max-w-md">
          <form onSubmit={handleGonder} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Yeni E-posta Adresi</label>
              <input
                type="email"
                value={yeniEposta}
                onChange={(e) => setYeniEposta(e.target.value)}
                placeholder="yeni@eposta.com"
                className="w-full bg-site-shell border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-site-accent/50 placeholder:text-slate-600 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Mevcut Şifreniz</label>
              <div className="relative">
                <input
                  type={gosterSifre ? "text" : "password"}
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-site-shell border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white focus:outline-none focus:border-site-accent/50 placeholder:text-slate-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setGosterSifre(!gosterSifre)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {gosterSifre ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {sonuc && (
              <div className={`flex items-center gap-2 text-xs p-3 rounded-xl border ${
                sonuc.tip === "basari"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
                {sonuc.tip === "basari" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                {sonuc.mesaj}
              </div>
            )}

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-site-accent-strong to-blue-600 hover:opacity-90 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {yukleniyor ? <><Loader2 className="w-4 h-4 animate-spin" /> Güncelleniyor...</> : "E-postayı Güncelle"}
            </button>
          </form>
        </div>
      </div>
    </AccountShell>
  );
}

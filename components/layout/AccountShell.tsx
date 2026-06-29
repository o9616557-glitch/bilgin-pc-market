"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  User, ShieldCheck, CreditCard, MessageSquare, Database,
  Mail, Star, MapPin, ChevronRight,
  LogIn, UserPlus, LogOut,
  Eye, EyeOff, Loader2, X, SwitchCamera
} from "lucide-react";

/* ─────────────────── NAV TANIMLARI ─────────────────── */
const NAV_ITEMS = [
  { href: "/hesabim",            label: "Profil",             icon: User,          id: "hesabim" },
  { href: "/cuzdan",             label: "Cüzdan",              icon: CreditCard,    id: "cuzdan" },
  { href: "/guvenlik",           label: "Güvenlik",            icon: ShieldCheck,   id: "guvenlik" },
  { href: "/mesajlarim",         label: "Mesajlar",            icon: MessageSquare, id: "mesajlarim" },
  { href: "/veri-talebi",        label: "Veri Talebi",         icon: Database,      id: "veri-talebi" },
  { href: "/eposta-degistir",    label: "E-posta Değiştir",    icon: Mail,          id: "eposta-degistir" },
  { href: "/yorumlarim",         label: "Ürün Yorumları",      icon: Star,          id: "yorumlarim" },
  { href: "/siparis-yorumlarim", label: "Sipariş Yorumları",   icon: Star,          id: "siparis-yorumlarim" },
  { href: "/adreslerim",         label: "Adreslerim",          icon: MapPin,        id: "adreslerim" },
];


/* ─────────────────── TİPLER ─────────────────── */
type SavedAccount = { email: string; name: string; image?: string };
type AccountShellProps = { children: React.ReactNode; active?: string };

/* ─────────────────── NAV LINK ─────────────────── */
function NavLink({ href, label, icon: Icon, id, active }: {
  href: string; label: string; icon: any; id: string; active?: string;
}) {
  const isActive = active === id;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium shrink-0 ${
        isActive
          ? "text-white bg-white/[0.07] border border-white/[0.12]"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-site-accent" : ""}`} />
      <span className="truncate flex-1">{label}</span>
      {isActive && <ChevronRight className="w-3 h-3 shrink-0 text-site-accent/50" />}
    </Link>
  );
}

/* ─────────────────── HESAP GEÇİŞ MODALİ ─────────────────── */
function AccountSwitchModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [sifre, setSifre] = useState("");
  const [goster, setGoster] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const handleGiris = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sifre) { setHata("Şifrenizi girin."); return; }
    setYukleniyor(true);
    setHata("");
    const res = await signIn("credentials", { email, password: sifre, redirect: false });
    setYukleniyor(false);
    if (res?.ok) { onClose(); window.location.reload(); }
    else { setHata("Şifre hatalı veya hesap bulunamadı."); }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#0b1121] border border-white/[0.08] rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white font-semibold text-sm">Hesaba Geçiş Yap</p>
            <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[200px]">{email}</p>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleGiris} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type={goster ? "text" : "password"}
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="Şifreniz"
              autoFocus
              className="w-full bg-site-shell border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white focus:outline-none focus:border-site-accent/50 placeholder:text-slate-600 transition-all"
            />
            <button type="button" onClick={() => setGoster(!goster)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {goster ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {hata && <p className="text-red-400 text-xs">{hata}</p>}
          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-site-accent-strong to-blue-600 hover:opacity-90 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {yukleniyor ? <><Loader2 className="w-4 h-4 animate-spin" />Geçiş yapılıyor...</> : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────── MOBİL PROFİL KARTI ─────────────────── */
function MobilProfilKarti() {
  const { data: session, status } = useSession();
  const lastRef = useRef<typeof session>(null);
  if (session) lastRef.current = session;
  const stable = session ?? lastRef.current;
  const isFirst = status === "loading" && !lastRef.current;

  if (isFirst) {
    return (
      <div className="account-card rounded-2xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/[0.05] animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 w-20 bg-white/[0.05] rounded animate-pulse" />
          <div className="h-2.5 w-28 bg-white/[0.04] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" && !stable) {
    return (
      <div className="account-card rounded-2xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-site-shell border border-white/[0.08] flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-slate-500" />
        </div>
        <p className="flex-1 text-slate-400 text-xs">Giriş yapılmadı</p>
        <Link href="/giris" className="text-xs font-semibold text-site-accent border border-site-accent/30 rounded-xl px-3 py-1.5 hover:bg-site-accent/10 transition-colors shrink-0">
          Giriş Yap
        </Link>
      </div>
    );
  }

  const userImage = stable?.user?.image;
  const userName  = stable?.user?.name  || "Kullanıcı";
  const userEmail = stable?.user?.email || "";

  return (
    <div className="account-card rounded-2xl p-3 flex items-center gap-3">
      {userImage ? (
        <Image src={userImage} alt={userName} width={36} height={36} className="rounded-full object-cover shrink-0 ring-2 ring-site-accent/20" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-site-shell border border-white/[0.1] flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-slate-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{userName}</p>
        <p className="text-slate-500 text-[10px] truncate">{userEmail}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        title="Çıkış Yap"
        className="text-slate-600 hover:text-red-400 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-red-500/10"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─────────────────── PANEL BİLEŞENİ ─────────────────── */
function AccountPanel({ active }: { active?: string }) {
  const { data: session, status } = useSession();
  // Son bilinen session'ı tut — status "loading" olduğunda eski veriyle render et, göz kırpmayı önle
  const lastSessionRef = useRef<typeof session>(null);
  if (session) lastSessionRef.current = session;
  const stableSession = session ?? lastSessionRef.current;
  const isInitialLoad = status === "loading" && !lastSessionRef.current;

  const [kayitliHesaplar, setKayitliHesaplar] = useState<SavedAccount[]>([]);
  const [gecisHedef, setGecisHedef] = useState<string | null>(null);

  /* Oturum açıkken bu hesabı kayıtlı listene ekle */
  useEffect(() => {
    if (!session?.user?.email) return;
    const raw = localStorage.getItem("bilgin_saved_accounts");
    const liste: SavedAccount[] = raw ? JSON.parse(raw) : [];
    const mevcutEmail = session.user.email;
    const zatenVar = liste.some((h) => h.email === mevcutEmail);
    if (!zatenVar) {
      const guncel = [
        { email: mevcutEmail, name: session.user.name || "", image: session.user.image || "" },
        ...liste,
      ].slice(0, 5);
      localStorage.setItem("bilgin_saved_accounts", JSON.stringify(guncel));
      setKayitliHesaplar(guncel);
    } else {
      setKayitliHesaplar(liste);
    }
  }, [session]);

  const digerHesaplar = kayitliHesaplar.filter((h) => h.email !== session?.user?.email);

  /* ── MİSAFİR PANELİ ── */
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col gap-3">
        <div className="account-card rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="w-16 h-16 rounded-full bg-site-shell border border-white/[0.08] flex items-center justify-center">
              <User className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-white font-semibold text-sm">Hesabınıza Girin</p>
            <p className="text-slate-500 text-xs text-center leading-relaxed">
              Siparişleri, favorileri ve kişisel ayarları yönetmek için giriş yapın.
            </p>
          </div>
          <Link
            href="/giris"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-site-accent-strong to-blue-600 hover:opacity-90 text-white font-semibold text-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            Giriş Yap
          </Link>
          <Link
            href="/uye-ol"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 font-medium text-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Üye Ol
          </Link>
        </div>

        {/* Kayıtlı hesaplar varsa göster */}
        {kayitliHesaplar.length > 0 && (
          <div className="account-card rounded-2xl p-3">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2">Önceki Hesaplar</p>
            {kayitliHesaplar.map((h) => (
              <button
                key={h.email}
                onClick={() => setGecisHedef(h.email)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
              >
                {h.image ? (
                  <Image src={h.image} alt={h.name} width={28} height={28} className="rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-site-shell border border-white/[0.08] flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{h.name || h.email}</p>
                  <p className="text-slate-600 text-[10px] truncate">{h.email}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              </button>
            ))}
          </div>
        )}

        {gecisHedef && (
          <AccountSwitchModal email={gecisHedef} onClose={() => setGecisHedef(null)} />
        )}
      </div>
    );
  }

  /* ── GİRİŞ YAPMIŞ veya YÜKLENİYOR ── */
  // stableSession: geçiş sırasında son bilinen veriyi kullan, göz kırpmayı önle
  const userImage = stableSession?.user?.image;
  const userName  = stableSession?.user?.name  || "";
  const userEmail = stableSession?.user?.email || "";

  return (
    <>
      {gecisHedef && (
        <AccountSwitchModal email={gecisHedef} onClose={() => setGecisHedef(null)} />
      )}

      <div className="flex flex-col gap-2">

        {/* Profil mini-kartı — sadece gerçek ilk yüklemede skeleton göster */}
        <div className="account-card rounded-2xl p-4 flex items-center gap-3">
          {isInitialLoad ? (
            <>
              <div className="w-10 h-10 rounded-full bg-white/[0.05] animate-pulse shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3 w-24 bg-white/[0.05] rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-white/[0.04] rounded animate-pulse" />
              </div>
            </>
          ) : (
            <>
              {userImage ? (
                <Image src={userImage} alt={userName} width={40} height={40} className="rounded-full object-cover shrink-0 ring-2 ring-site-accent/20" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-site-shell border border-white/[0.1] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{userName || "Kullanıcı"}</p>
                <p className="text-slate-500 text-[11px] truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Çıkış Yap"
                className="text-slate-600 hover:text-red-400 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Diğer hesaplar (tek tıkla geçiş) */}
        {digerHesaplar.length > 0 && (
          <div className="account-card rounded-2xl p-3">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
              <SwitchCamera className="w-3 h-3" />
              Kayıtlı Hesaplar
            </p>
            {digerHesaplar.map((h) => (
              <button
                key={h.email}
                onClick={() => setGecisHedef(h.email)}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
              >
                {h.image ? (
                  <Image src={h.image} alt={h.name} width={26} height={26} className="rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-site-shell border border-white/[0.08] flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs truncate">{h.name || h.email}</p>
                  <p className="text-slate-600 text-[10px] truncate">{h.email}</p>
                </div>
                <span className="text-[10px] text-slate-600 border border-white/[0.06] rounded-full px-2 py-0.5 shrink-0">Geçiş</span>
              </button>
            ))}
          </div>
        )}

        {/* Ana navigasyon — her zaman görünür */}
        <div className="account-card rounded-2xl p-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.id} {...item} active={active} />
          ))}
        </div>

      </div>
    </>
  );
}

/* ─────────────────── ANA EXPORT ─────────────────── */
export default function AccountShell({ children, active }: AccountShellProps) {
  return (
    <div className="site-page p-4 sm:p-6 lg:p-8">
      <div className="site-glow-top top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[320px]" />

      {/* Mobil: profil kartı + yatay scroll nav */}
      <div className="lg:hidden mb-4 flex flex-col gap-2">
        <MobilProfilKarti />
        <div className="account-card p-2">
          <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium shrink-0 transition-all ${
                  active === item.id
                    ? "text-white bg-white/[0.07] border border-white/[0.12]"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 shrink-0 ${active === item.id ? "text-site-accent" : ""}`} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: panel sol, içerik sağ */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-6 relative z-10 lg:items-start">

        {/* Sol panel — sabit, animasyon yok */}
        <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          <AccountPanel active={active} />
        </aside>

        {/* İçerik alanı — mobilde tam genişlik, masaüstünde esnek */}
        <div className="site-content-in w-full lg:flex-1 lg:min-w-0">{children}</div>

      </div>
    </div>
  );
}

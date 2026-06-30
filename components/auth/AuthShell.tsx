import React from "react";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";

export const authInputClass =
  "w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/25 focus:bg-black/50 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200";

export const authBtnPrimaryClass =
  "w-full py-3.5 bg-white/10 text-white text-sm font-black uppercase tracking-widest rounded-xl border border-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/25 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] disabled:opacity-50 disabled:cursor-not-allowed";

export const authBtnSecondaryClass =
  "w-full hover:bg-white/[0.06] border border-white/10 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all group backdrop-blur-sm";

export const authTitleClass =
  "text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white";

export const authSubtitleClass = "text-slate-400 text-sm sm:text-base font-medium leading-relaxed";

export function AuthLogo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize = size === "large" ? "text-4xl xl:text-5xl" : "text-3xl";
  const lineWidth = size === "large" ? "w-16" : "w-12";

  return (
    <div className="flex flex-col items-center lg:items-start justify-center shrink-0">
      <div
        className={`flex items-center gap-2 ${textSize} font-black uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
      >
        <span className="text-white">BİLGİN</span>
        <span className="text-white/70">PC</span>
      </div>
      <div className={`h-px ${lineWidth} bg-gradient-to-r from-white/40 via-white/20 to-transparent mt-3`} />
    </div>
  );
}

type AuthShellProps = {
  children: React.ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="fixed inset-0 z-40 w-full overflow-y-auto overscroll-none lg:relative lg:inset-auto lg:z-auto lg:overflow-visible min-h-[100dvh] lg:min-h-screen bg-black text-white">
      {/* Cam parıltı arka plan */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 -left-1/4 h-[55%] w-[55%] rounded-full bg-white/[0.03] blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[50%] w-[50%] rounded-full bg-white/[0.04] blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 h-[30%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_40%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      <div className="relative z-10 min-h-screen min-h-[100dvh] flex items-stretch justify-center p-0 lg:px-12 xl:px-16 lg:py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 xl:gap-10 items-stretch min-h-[100dvh] lg:min-h-0">
          {/* Sol panel — masaüstü / tablet yatay */}
          <div className="hidden lg:flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent backdrop-blur-2xl p-10 xl:p-12 shadow-[0_8px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/[0.06] blur-3xl" />

            <AuthLogo size="large" />

            <div className="space-y-6 my-10">
              <p className="text-lg xl:text-xl text-white/80 font-medium leading-relaxed max-w-sm">
                Güvenli alışveriş, hızlı teslimat ve özel fırsatlar için hesabınıza giriş yapın.
              </p>

              <ul className="space-y-4">
                {[
                  { icon: ShieldCheck, text: "256-bit SSL ile korunan güvenli ödeme" },
                  { icon: Truck, text: "Sipariş takibi ve hızlı kargo" },
                  { icon: Sparkles, text: "Üyelere özel kampanyalar ve fırsatlar" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
                      <Icon className="h-4 w-4 text-white/70" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-slate-600 uppercase tracking-widest">
              © Bilgin PC Market
            </p>
          </div>

          {/* Form paneli — mobil/tablet tam ekran, masaüstü kart */}
          <div className="flex flex-col justify-center w-full min-h-[100dvh] lg:min-h-0">
            <div className="relative overflow-y-auto overflow-x-hidden flex flex-col justify-center flex-1 w-full min-h-[100dvh] lg:min-h-[520px] rounded-none lg:rounded-3xl border-0 lg:border border-white/[0.08] bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-black/40 backdrop-blur-2xl p-6 sm:p-8 md:p-10 lg:p-10 shadow-none lg:shadow-[0_8px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="absolute -top-16 right-8 h-32 w-32 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

              {/* Mobilde logo */}
              <div className="lg:hidden flex justify-center mb-8">
                <AuthLogo />
              </div>

              <div className="relative z-10">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CACHE_KEY = "bilgin_yorumlarim_cache";

export default function YorumlarimPage() {
  const { status } = useSession();
  const [yorumlar, setYorumlar] = useState<any[]>(() => {
    try { const c = sessionStorage.getItem(CACHE_KEY); return c ? JSON.parse(c) : []; } catch { return []; }
  });
  const [yukleniyor, setYukleniyor] = useState(() => {
    try { return !sessionStorage.getItem(CACHE_KEY); } catch { return true; }
  });

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") { setYukleniyor(false); return; }
    try { if (sessionStorage.getItem(CACHE_KEY)) return; } catch {}
    fetch("/api/reviews?mine=1")
      .then((r) => r.json())
      .then((d) => {
        const liste = d.reviews || [];
        setYorumlar(liste);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(liste)); } catch {}
      })
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, [status]);

  return (
    <div className="flex flex-col gap-5">
        <div className="account-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-site-accent/[0.04] blur-[50px] pointer-events-none rounded-full" />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-site-shell border border-white/[0.08] rounded-full flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-amber-400/80" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white mb-0.5">Ürün Yorumlarım</h1>
              <p className="text-slate-400 text-xs sm:text-sm">Ürünlere bıraktığınız tüm değerlendirmeler.</p>
            </div>
          </div>
        </div>

        {yukleniyor ? (
          <div className="account-card rounded-2xl p-10 text-center">
            <div className="w-6 h-6 border-2 border-site-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : yorumlar.length === 0 ? (
          <div className="account-card rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center gap-4">
            <Star className="w-10 h-10 text-slate-700" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Henüz yorum yapmadınız</p>
              <p className="text-xs text-slate-500">Aldığınız ürünleri değerlendirerek diğer alıcılara yardımcı olun.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {yorumlar.map((yorum: any) => (
              <div key={yorum._id} className="account-card rounded-2xl p-4 sm:p-5 flex gap-4">
                <div className="flex shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= yorum.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white font-medium mb-1 truncate">{yorum.productName || "Ürün"}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{yorum.content}</p>
                  <p className="text-[10px] text-slate-600 mt-1.5">
                    {new Date(yorum.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

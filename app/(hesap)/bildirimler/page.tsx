"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Bell, Truck, Package, CheckCircle2, Clock, ChevronRight,
} from "lucide-react";
import { useOrders } from "@/app/OrderContext";

function durumEtiketi(durum: string) {
  const d = durum.toLocaleLowerCase("tr-TR");
  if (d.includes("kargo") || d.includes("yolda")) return { metin: "Kargoda", renk: "text-cyan-400", ikon: Truck };
  if (d.includes("teslim") || d.includes("tamam")) return { metin: "Teslim edildi", renk: "text-emerald-400", ikon: CheckCircle2 };
  if (d.includes("hazır") || d.includes("hazir")) return { metin: "Hazırlanıyor", renk: "text-amber-400", ikon: Clock };
  return { metin: durum || "Sipariş", renk: "text-slate-300", ikon: Package };
}

export default function BildirimlerPage() {
  const { status } = useSession();
  const { orders } = useOrders();

  const bildirimler = orders
    .filter((o) => o.gizlendi !== true)
    .slice(0, 12)
    .map((siparis) => {
      const durum = siparis.durum || siparis.status || "Sipariş alındı";
      const etiket = durumEtiketi(durum);
      const kod = siparis.siparisKodu || siparis.orderNumber || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
      const tarih = siparis.createdAt
        ? new Date(siparis.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })
        : siparis.tarih || "";

      return { id: siparis._id || kod, kod, durum, tarih, etiket, href: "/siparislerim" };
    });

  return (
    <div className="flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[60px] pointer-events-none rounded-full" />
        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className="w-12 h-12 bg-[#020617] border border-amber-500/30 rounded-full flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Bildirimlerim</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Sipariş, kargo ve teslimat güncellemeleriniz
            </p>
          </div>
        </div>
      </div>

      {status === "unauthenticated" ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 text-center">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">Bildirimleri görmek için giriş yapın</p>
          <p className="text-slate-500 text-sm mb-6">Sipariş ve kargo bildirimleri hesabınıza bağlıdır.</p>
          <Link
            href="/giris"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      ) : bildirimler.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 text-center">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-4" />
          <p className="text-white font-bold mb-1">Henüz bildirim yok</p>
          <p className="text-slate-500 text-sm">Sipariş verdiğinizde güncellemeler burada görünür.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bildirimler.map((b) => {
            const Ikon = b.etiket.ikon;
            return (
              <Link
                key={b.id}
                href={b.href}
                className="flex items-center gap-4 p-4 sm:p-5 bg-[#0f172a] border border-slate-800 hover:border-slate-600 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center shrink-0">
                  <Ikon className={`w-5 h-5 ${b.etiket.renk}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${b.etiket.renk}`}>{b.etiket.metin}</p>
                  <p className="text-white text-sm truncate">Sipariş #{b.kod}</p>
                  {b.tarih && <p className="text-slate-500 text-xs mt-0.5">{b.tarih}</p>}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck, PackageX, Calendar, Copy, Check, Package,
} from "lucide-react";
import { useOrders } from "@/app/OrderContext";
import { getOrderShippingCompany, getOrderStatusText, getOrderTrackingNumber } from "@/lib/order-utils";
import type { OrderLike } from "@/lib/order-types";

export default function KargolarimPage() {
  const { orders: localOrders } = useOrders();
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);

  const handleCopy = (kod: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(kod);
    setKopyalanan(kod);
    setTimeout(() => setKopyalanan(null), 2000);
  };

  const kargoSiparisleri = localOrders.filter((o: OrderLike) =>
    getOrderStatusText(o).toLocaleLowerCase("tr-TR").includes("kargo")
  );

  return (
    <div className="flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 z-40 overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] pointer-events-none rounded-full"></div>

        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
            <Truck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Aktif Kargolarım</h1>
            <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
              Yolda olan: <span className="font-black text-cyan-400">{kargoSiparisleri.length}</span> kargo
            </p>
          </div>
        </div>

        <Link
          href="/siparislerim"
          className="w-full xl:w-auto flex items-center justify-center gap-2 bg-[#020617] hover:bg-slate-800 border border-slate-700 rounded-lg px-4 sm:px-6 py-3 transition-colors text-[10px] sm:text-xs text-white font-black uppercase tracking-widest shadow-lg shrink-0 relative z-10"
        >
          <Package className="w-4 h-4" /> TÜM SİPARİŞLERİM
        </Link>
      </div>

      {kargoSiparisleri.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <PackageX className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Aktif Kargo Yok</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto font-medium leading-relaxed">
            Şu an yolda olan aktif kargonuz bulunmuyor. Yeni siparişleriniz kargoya verildiğinde burada görünecek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {kargoSiparisleri.map((siparis: OrderLike, idx: number) => {
            const siparisKodu = siparis.siparisKodu || siparis.orderNumber || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
            const tarih = siparis.createdAt
              ? new Date(siparis.createdAt).toLocaleDateString("tr-TR")
              : siparis.tarih
              ? new Date(siparis.tarih).toLocaleDateString("tr-TR")
              : "";
            const firma = getOrderShippingCompany(siparis) || "Belirtilmemiş";
            const takipNo = getOrderTrackingNumber(siparis) || "Takip No Girilmemiş";
            const durum = getOrderStatusText(siparis);

            return (
              <div
                key={siparis._id || idx}
                className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 hover:border-cyan-500/30 transition-colors shadow-xl"
              >
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">#{siparisKodu}</span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {tarih}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Durum</span>
                    <span className="font-bold text-cyan-400 px-2 py-1 bg-cyan-950/20 rounded-md border border-cyan-500/20">
                      {durum || "Kargoya Verildi"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Kargo Firması</span>
                    <span className="font-bold text-white px-2 py-1 bg-[#020617] rounded-md border border-slate-800">{firma}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Takip Numarası</span>
                    <div className="flex items-center gap-2 px-2 py-1 bg-cyan-950/20 rounded-md border border-cyan-500/20">
                      <span className="font-black text-cyan-400">{takipNo}</span>
                      {takipNo !== "Takip No Girilmemiş" && (
                        <button
                          onClick={(e) => handleCopy(takipNo, e)}
                          className="text-cyan-600 hover:text-cyan-300 transition-colors"
                          title="Takip numarasını kopyala"
                        >
                          {kopyalanan === takipNo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

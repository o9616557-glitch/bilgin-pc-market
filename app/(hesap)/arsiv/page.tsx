"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Package,
  PackageOpen,
  RefreshCw,
  Calendar,
  Headset,
  Wallet,
  CreditCard,
} from "lucide-react";
import { useOrders } from "@/app/OrderContext";
import {
  KART_IADE_BANKA_NOTU,
  siparisArsivKalemleriniTopla,
  urunIadeYontemiMetni,
  type ArsivKalemi,
  type UrunDestekTalepLike,
} from "@/lib/order-utils";

export default function ArsivPage() {
  const { orders: localOrders, refreshOrders } = useOrders();
  const [destekTalepleri, setDestekTalepleri] = useState<UrunDestekTalepLike[]>([]);

  const destekTalepleriniGetir = useCallback(async () => {
    try {
      const res = await fetch(`/api/destek?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setDestekTalepleri(data.talepler || []);
      }
    } catch {
      /* sessiz */
    }
  }, []);

  useEffect(() => {
    refreshOrders();
    void destekTalepleriniGetir();
  }, [refreshOrders, destekTalepleriniGetir]);

  const arsivKalemleri = siparisArsivKalemleriniTopla(localOrders, destekTalepleri);

  return (
    <div className="flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 z-40 overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-500/10 blur-[60px] pointer-events-none rounded-full" />

        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className="w-12 h-12 bg-[#020617] border border-slate-600/40 rounded-full flex items-center justify-center shadow-lg shrink-0">
            <Archive className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Arşiv</h1>
            <p className="text-slate-400 text-xs font-medium tracking-wide">
              İade veya iptal tamamlanan{" "}
              <span className="font-black text-slate-300">{arsivKalemleri.length}</span> ürün
            </p>
          </div>
        </div>

        <Link
          href="/siparislerim"
          className="w-full xl:w-auto flex items-center justify-center gap-2 bg-[#020617] hover:bg-slate-800 border border-slate-700 rounded-lg px-4 sm:px-6 py-3 transition-colors text-[10px] sm:text-xs text-white font-black uppercase tracking-widest shadow-lg shrink-0 relative z-10"
        >
          <Package className="w-4 h-4" /> Siparişlerim
        </Link>
      </div>

      <p className="text-xs text-slate-500 font-medium leading-relaxed px-1">
        Burada yalnızca işlemi bitmiş ürünler listelenir. Devam eden siparişleriniz ve bekleyen iade talepleriniz{" "}
        <Link href="/siparislerim" className="text-cyan-400 hover:underline">
          Siparişlerim
        </Link>{" "}
        sayfasında görünür.
      </p>

      {arsivKalemleri.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-[#020617] border border-slate-700 flex items-center justify-center mx-auto mb-6">
            <Archive className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Arşiv Boş</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto font-medium leading-relaxed">
            Henüz iade veya iptal tamamlanmış ürününüz yok. İşlem bittiğinde ilgili ürünler otomatik olarak buraya taşınır.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {arsivKalemleri.map((kalem, idx) => (
            <ArsivKart key={`${kalem.siparisKodu}-${kalem.item.id || kalem.item._id || idx}`} kalem={kalem} />
          ))}
        </div>
      )}

      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Ürününüzle ilgili yeni bir sorun mu var? Destek ekibimiz size yardımcı olabilir.
        </p>
        <Link
          href="/destek-taleplerim/yeni?konu=teknik"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#020617] hover:bg-slate-800/80 border border-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap shrink-0"
        >
          <Headset className="w-3.5 h-3.5" /> Destek Talebi
        </Link>
      </div>
    </div>
  );
}

function ArsivKart({ kalem }: { kalem: ArsivKalemi }) {
  const { item, siparisKodu, tip, iadeAdet, yontem, islemTarihi } = kalem;
  const urunLinki = `/product/${item?.slug || item?.productId || item?.id || item?._id || ""}`;
  const birimFiyat = Number(item.price || item.fiyat || 0);
  const tutar = birimFiyat * iadeAdet;
  const yontemMetni = urunIadeYontemiMetni(yontem);

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-md flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Link
          href={urunLinki}
          className="w-16 h-16 shrink-0 bg-[#020617] rounded-lg border border-slate-800 hover:border-slate-600 flex items-center justify-center p-2 transition-colors"
        >
          {item.image || item.resim ? (
            <img src={item.image || item.resim} alt="" className="w-full h-full object-contain" />
          ) : (
            <PackageOpen className="w-7 h-7 text-slate-600" />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                tip === "iade"
                  ? "bg-orange-500/5 text-orange-300 border-orange-500/20"
                  : "bg-red-500/5 text-red-400 border-red-500/20"
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              {tip === "iade" ? "İade edildi" : "İptal edildi"}
            </span>
            <span className="text-[9px] font-bold text-slate-500">#{siparisKodu}</span>
          </div>
          <Link href={urunLinki} className="text-xs font-bold text-white hover:text-cyan-400 line-clamp-2 leading-snug">
            {item.title || item.isim || item.name || "Ürün"}
          </Link>
          {islemTarihi && (
            <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              {islemTarihi.toLocaleDateString("tr-TR")}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-[10px]">
        <p className="text-slate-400">
          <span className="text-slate-500 uppercase tracking-wider font-bold">Miktar:</span>{" "}
          {iadeAdet} adet
          {tutar > 0 && (
            <span className="text-slate-300 font-bold ml-2">{tutar.toLocaleString("tr-TR")} TL</span>
          )}
        </p>
        {tip === "iade" && yontemMetni && (
          <p className="text-slate-400 flex items-center gap-1">
            {yontem === "magaza_kredisi" ? (
              <Wallet className="w-3 h-3 text-cyan-400 shrink-0" />
            ) : (
              <CreditCard className="w-3 h-3 text-slate-400 shrink-0" />
            )}
            {yontemMetni}
          </p>
        )}
        {tip === "iade" && yontem === "kart" && (
          <p className="text-[9px] text-slate-600 leading-relaxed">{KART_IADE_BANKA_NOTU}</p>
        )}
      </div>
    </div>
  );
}

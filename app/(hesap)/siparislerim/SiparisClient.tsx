"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Trash2, Copy, Check, RefreshCw, Filter, 
  PackageOpen, Package, Truck, CheckCircle2, Clock, 
  User, ShieldCheck, CreditCard, PackageX, ChevronRight, Calendar,
  ArrowLeft, MessageSquare, ShoppingCart, Star, AlertCircle, Info, ChevronDown,
  MapPin, Search, Monitor, Headphones, Wallet, Headset
} from "lucide-react"; 
import Link from "next/link";
import toast from "react-hot-toast";
import { useOrders } from "@/app/OrderContext"; 
import { useCart } from "@/app/CartContext"; // 🚀 BİNGO: Sepet context'ini buraya çağırdık!
import { getOrderShippingCompany, getOrderStatusText, getOrderTrackingNumber, isHavaleBekleyenSiparis, isOdemeBekleyenSiparis, KART_IADE_BANKA_NOTU, siparisGosterimDurumu, siparisIadeOzeti, siparisIadeSuresiOzeti, siparisIadeYontemi, siparisKalemiIadeAdet, siparisKalemIadeEdildiMi, siparisKalemTamIadeMi, siparisKalemleri, siparisTamamlandiMi, urunBekleyenIslemEtiketi, urunIadeYontemiBul, urunIadeYontemiMetni, urunIptalEdilebilirMi, urunIptalEdildiMi, urunTalepBekliyorTemizle, durumIptalMi, durumMetniNorm, type IadeYontemi, type UrunDestekTalepLike } from "@/lib/order-utils";
import type { OrderItemLike, OrderLike } from "@/lib/order-types";

export default function SiparisClient() {
  const { orders: contextOrders, refreshOrders } = useOrders();
  
  // 🚀 Sepete ekleme fonksiyonunu çektik (Senin context'te ismi sepeteEkle ise addToCart yerine onu yazarsın)
const { sepeteEkle } = useCart();

  const [localOrders, setLocalOrders] = useState<OrderLike[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderLike | null>(null);

  useEffect(() => {
    setLocalOrders(contextOrders);
  }, [contextOrders]);

  useEffect(() => {
    if (!selectedOrder?._id) return;
    const guncel = localOrders.find((o) => o._id === selectedOrder._id);
    if (guncel) setSelectedOrder(guncel);
  }, [localOrders, selectedOrder?._id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedOrder]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  const [kargoPopupAcik, setKargoPopupAcik] = useState<boolean>(false);

  const [zamanFiltresi, setZamanFiltresi] = useState<string>("tumu");
  const [durumFiltresi, setDurumFiltresi] = useState<string>("tumu");

  const [zamanAcik, setZamanAcik] = useState(false);
  const [durumAcik, setDurumAcik] = useState(false);
  const [destekTalepleri, setDestekTalepleri] = useState<UrunDestekTalepLike[]>([]);

  const destekTalepleriniGetir = useCallback(async () => {
    try {
      const res = await fetch(`/api/destek?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        const talepler = data.talepler || [];
        setDestekTalepleri(talepler);
        for (const t of talepler) {
          if (!t.siparisNo || !t.iadeKalemleri?.length) continue;
          for (const k of t.iadeKalemleri) {
            if (k.urunId) urunTalepBekliyorTemizle(t.siparisNo, k.urunId);
          }
        }
      }
    } catch {
      /* sessiz */
    }
  }, []);

  const siparisDetayAc = (order: OrderLike) => {
    const guncel = localOrders.find((o) => o._id === order._id) || order;
    setSelectedOrder(guncel);
    refreshOrders();
    void destekTalepleriniGetir();
  };

  useEffect(() => {
    destekTalepleriniGetir();
  }, [destekTalepleriniGetir]);

  useEffect(() => {
    if (!selectedOrder) return;
    destekTalepleriniGetir();
  }, [selectedOrder, destekTalepleriniGetir]);

  useEffect(() => {
    const yenile = () => {
      if (selectedOrder) destekTalepleriniGetir();
    };
    window.addEventListener("focus", yenile);
    document.addEventListener("visibilitychange", yenile);
    return () => {
      window.removeEventListener("focus", yenile);
      document.removeEventListener("visibilitychange", yenile);
    };
  }, [selectedOrder, destekTalepleriniGetir]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (kargoPopupAcik || orderToDelete) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => { document.body.style.overflow = 'unset'; }; 
  }, [kargoPopupAcik, orderToDelete]);

  const zamanSecenekleri = [
    { id: "tumu", ad: "Tüm Zamanlar" },
    { id: "son30", ad: "Son 30 Gün" },
    { id: "2026", ad: "2026 Yılı" },
    { id: "2025", ad: "2025 Yılı" }
  ];

  const durumSecenekleri = [
    { id: "tumu", ad: "Tüm Siparişler" },
    { id: "devam", ad: "Devam Edenler" },
    { id: "kargo", ad: "Kargodakiler" },
    { id: "teslim", ad: "Teslim Edilenler" },
    { id: "iptal", ad: "İptal/İadeler" }
  ];

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      setLocalOrders(prev => prev.filter((order) => order._id !== orderToDelete));
      const res = await fetch("/api/orders?id=" + orderToDelete, { method: "DELETE" });
      if (!res.ok) setErrorMsg("Sipariş silinirken bir hata oluştu.");
      setOrderToDelete(null);
      refreshOrders(); 
    } catch (error) {
      setErrorMsg("Bağlantı hatası sebebiyle silinemedi.");
      setOrderToDelete(null);
    }
  };

  const handleCopy = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const DurumRozetiGoster = ({ durum }: { durum: string }) => {
    const d = (durum || "").toLocaleLowerCase("tr-TR");
    if (d.includes("iptal") || d.includes("i̇ptal")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> İPTAL EDİLDİ
        </div>
    );
    if (d.includes("kısmen iade") || d.includes("kismen iade")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <RefreshCw className="w-3.5 h-3.5" /> KISMİ İADE
        </div>
    );
    if (d.includes("iade")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <RefreshCw className="w-3.5 h-3.5" /> İADE EDİLDİ
        </div>
    );
    if (d.includes("teslim") || d.includes("tamam") || d.includes("bit") || d.includes("son")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <CheckCircle2 className="w-3.5 h-3.5" /> TESLİM EDİLDİ
        </div>
    );
    if (d.includes("kargo")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.15)]">
           <Truck className="w-3.5 h-3.5 animate-bounce" /> KARGODA
        </div>
    );
    if (d.includes("ödeme bekliyor") || d.includes("odeme bekliyor")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <Clock className="w-3.5 h-3.5" /> ÖDEME BEKLENİYOR
        </div>
    );
    if (d.includes("havale")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <Clock className="w-3.5 h-3.5" /> HAVALE BEKLENİYOR
        </div>
    );
    if (d.includes("hazır") || d.includes("ödendi") || d.includes("odendi")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <Package className="w-3.5 h-3.5" /> HAZIRLANIYOR
        </div>
    );
    return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-500/10 border border-slate-500/20 text-slate-300 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <Clock className="w-3.5 h-3.5" /> ALINDI
        </div>
    );
  };
// 🚀 BİNGO: KUSURSUZ FİLTRELEME MOTORU (Tüm Zamanlar ve Tüm Siparişler Dahil)
  const filtrelenmisSiparisler = localOrders.filter(order => {
    let zamanUygun = true;
    let durumUygun = true;

    if (zamanFiltresi !== "tumu") {
      const orderDateStr = order.createdAt || order.tarih;
      const orderDate = orderDateStr ? new Date(orderDateStr) : new Date();
      const now = new Date();

      if (zamanFiltresi === "son30") {
        const otuzGunOnce = new Date();
        otuzGunOnce.setDate(now.getDate() - 30);
        zamanUygun = orderDate >= otuzGunOnce;
      } else if (zamanFiltresi === "2026") {
        zamanUygun = orderDate.getFullYear() === 2026;
      } else if (zamanFiltresi === "2025") {
        zamanUygun = orderDate.getFullYear() === 2025;
      }
    }

    if (durumFiltresi !== "tumu") {
      const d = getOrderStatusText(order).toLocaleLowerCase("tr-TR");
      if (durumFiltresi === "teslim") {
        durumUygun = d.includes("teslim") || d.includes("tamam") || d.includes("bit");
      } else if (durumFiltresi === "kargo") {
        durumUygun = d.includes("kargo");
      } else if (durumFiltresi === "iptal") {
        durumUygun = d.includes("iptal") || d.includes("i̇ptal") || d.includes("iade");
      } else if (durumFiltresi === "devam") {
        durumUygun = !d.includes("teslim") && !d.includes("tamam") && !d.includes("iptal") && !d.includes("i̇ptal") && !d.includes("iade");
      }
    }

    return zamanUygun && durumUygun;
  });

  const selectedOrderSiparisKodu =
    selectedOrder?.siparisKodu || selectedOrder?.orderNumber || selectedOrder?._id?.slice(-8)?.toUpperCase() || "";
  const selectedOrderIadeOpts = {
    talepler: destekTalepleri,
    siparisKodu: selectedOrderSiparisKodu,
  };
  const selectedOrderDurumMetni = durumMetniNorm(selectedOrder?.durum || selectedOrder?.status);
  const selectedOrderIsTeslimEdildi = selectedOrderDurumMetni.includes("teslim") || selectedOrderDurumMetni.includes("tamam");
  const selectedOrderIsKargoda = selectedOrderDurumMetni.includes("kargo");
  const selectedOrderIsIptal = durumIptalMi(selectedOrderDurumMetni);
  const selectedOrderIadeOzeti = siparisIadeOzeti(selectedOrder);
  const selectedOrderOdemeBekliyor = isOdemeBekleyenSiparis(selectedOrder);
  const selectedOrderHavaleBekliyor = isHavaleBekleyenSiparis(selectedOrder);
  const selectedOrderIadeSuresi = siparisIadeSuresiOzeti(selectedOrder);
  const selectedOrderIadeSuresiGecti = selectedOrderIadeSuresi.gectiMi;
  const selectedOrderAlimTarihi = new Date(selectedOrder?.createdAt || selectedOrder?.tarih || Date.now());
  const siparisKalemiId = (item: OrderItemLike) =>
    String(item.id || item._id || item.productId || "");
  const selectedOrderKalemleri = siparisKalemleri(selectedOrder);

  const urunSatirindaIadeVar = useCallback(
    (item: OrderItemLike) => {
      const satirdan = Number(item.iadeEdilenAdet || 0);
      if (satirdan > 0) return true;
      return siparisKalemIadeEdildiMi(selectedOrder, item, selectedOrderIadeOpts);
    },
    [selectedOrder, selectedOrderIadeOpts, destekTalepleri, selectedOrderSiparisKodu]
  );
  const siparisdeIptalEdilebilirUrunVar = selectedOrderKalemleri.some((item: OrderItemLike) => {
    const urunId = siparisKalemiId(item);
    const urunIsim = String(item.title || item.isim || item.name || "");
    const itemAdet = Number(item.quantity || item.adet || 1);
    const iadeEdilenAdet = siparisKalemiIadeAdet(selectedOrder, item, selectedOrderIadeOpts);
    const urunIade = siparisKalemIadeEdildiMi(selectedOrder, item, selectedOrderIadeOpts);
    if (urunIade) return false;
    const durumMetni = durumMetniNorm(selectedOrder?.durum || selectedOrder?.status);
    const teslimEdildi = durumMetni.includes("teslim") || durumMetni.includes("tamam");
    return urunIptalEdilebilirMi(
      selectedOrder,
      destekTalepleri,
      selectedOrderSiparisKodu,
      urunId,
      urunIsim,
      itemAdet,
      iadeEdilenAdet,
      { odemeBekliyor: selectedOrderOdemeBekliyor, teslimEdildi }
    );
  });
  const selectedOrderTopluIptalGoster =
    selectedOrderKalemleri.length > 1 &&
    siparisdeIptalEdilebilirUrunVar &&
    !selectedOrderIsIptal &&
    !selectedOrderIsTeslimEdildi &&
    !selectedOrderOdemeBekliyor;
  const selectedOrderIadeKalemleri = selectedOrderKalemleri
    .filter((item: OrderItemLike) => siparisKalemiIadeAdet(selectedOrder, item, selectedOrderIadeOpts) > 0)
    .map((item: OrderItemLike) => {
      const urunId = String(item.id || item._id || item.productId || "");
      const isim = item.title || item.isim || item.name || "Ürün";
      const iadeAdet = siparisKalemiIadeAdet(selectedOrder, item, selectedOrderIadeOpts);
      return {
        urunId,
        isim,
        adet: iadeAdet,
        birimFiyat: Number(item.price || item.fiyat || 0),
        yontem: urunIadeYontemiBul(selectedOrder, destekTalepleri, selectedOrderSiparisKodu, urunId, isim),
      };
    });

  const iadeYontemiSatiriGoster = (
    yontem: IadeYontemi | null | undefined,
    opts?: { bankaNotu?: boolean }
  ) => {
    const metin = urunIadeYontemiMetni(yontem);
    if (!metin) return null;
    return (
      <div className="mt-1 space-y-0.5">
        <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 leading-snug normal-case tracking-normal">
          {yontem === "magaza_kredisi" ? (
            <Wallet className="size-3 shrink-0 text-cyan-400" strokeWidth={2.5} />
          ) : (
            <CreditCard className="size-3 shrink-0 text-emerald-400" strokeWidth={2.5} />
          )}
          <span>{metin}</span>
        </p>
        {opts?.bankaNotu && yontem === "kart" && (
          <p className="text-[10px] text-slate-500 font-medium leading-snug normal-case tracking-normal pl-4">
            {KART_IADE_BANKA_NOTU}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col min-w-0 w-full relative gap-5 lg:gap-6">
          
          {selectedOrder ? (
            /* DETAY EKRANI */
            <div className="flex flex-col gap-5 animate-in slide-in-from-right-8 fade-in duration-300">
              
              <div className="w-full">
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-cyan-600/10 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 transition-all rounded-lg font-black text-xs uppercase tracking-widest w-max shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
                </button>
              </div>
<div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col gap-5 z-[60]">
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] rounded-full"></div>
                </div>
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 relative z-[60]">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                      <Package className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Sipariş Detayı</h1>
                      <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
                        Kod: <span className="font-black text-cyan-400">#{selectedOrderSiparisKodu}</span>
                      </p>
                    </div>
                  </div>

                  {selectedOrderTopluIptalGoster && (
                    selectedOrderIsKargoda ? (
                      <Link
                        href={`/destek-taleplerim/yeni?siparisNo=${selectedOrderSiparisKodu}&konu=iptal&kargo=1`}
                        className="w-full xl:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" /> Toplu İptal Et
                      </Link>
                    ) : (
                      <Link
                        href={`/destek-taleplerim/yeni?siparisNo=${selectedOrderSiparisKodu}&konu=iptal`}
                        className="w-full xl:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" /> Toplu İptal Et
                      </Link>
                    )
                  )}

                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                {selectedOrderKalemleri.map((item: OrderItemLike, idx: number) => {
                  const durumMetni = durumMetniNorm(selectedOrder.durum || selectedOrder.status);
                  const siparisTeslimEdildi =
                    siparisTamamlandiMi(selectedOrder.durum || selectedOrder.status) ||
                    selectedOrderIadeSuresi.tamamlandi;
                  const isKargoda = durumMetni.includes("kargo");
                  const isIptal = durumIptalMi(durumMetni);
                  const iadeSuresiGectiMi = selectedOrderIadeSuresiGecti;
                  const iadeBitisTarihi = selectedOrderIadeSuresi.bitisTarihi;
                  const iadeyeKalanGun = selectedOrderIadeSuresi.kalanGun;

                  const urunLinki = `/product/${item?.slug || item?.productId || item?.id || item?._id || ''}`;
                  const urunId = siparisKalemiId(item);
                  const urunIsim = String(item.title || item.isim || item.name || "");
                  const itemAdet = Number(item.quantity || item.adet || item.miktar || 1);
                  const iadeEdilenAdet = Math.max(
                    Number(item.iadeEdilenAdet || 0),
                    siparisKalemiIadeAdet(selectedOrder, item, selectedOrderIadeOpts)
                  );
                  const incelemeMetni = urunBekleyenIslemEtiketi(
                    destekTalepleri,
                    selectedOrderSiparisKodu,
                    urunId,
                    urunIsim,
                    iadeEdilenAdet
                  );
                  const urunIptal = urunIptalEdildiMi(
                    selectedOrder,
                    destekTalepleri,
                    selectedOrderSiparisKodu,
                    urunId,
                    urunIsim,
                    itemAdet,
                    iadeEdilenAdet
                  );
                  const urunIadeVar = urunSatirindaIadeVar(item);
                  const urunTamIade = iadeEdilenAdet > 0 ? iadeEdilenAdet >= itemAdet : siparisKalemTamIadeMi(selectedOrder, item, selectedOrderIadeOpts);
                  const yorumTekrarAlGoster = siparisTeslimEdildi && !urunIptal && !urunIadeVar;
                  const iptalButonuGoster =
                    !urunIadeVar &&
                    !urunIptal &&
                    urunIptalEdilebilirMi(
                    selectedOrder,
                    destekTalepleri,
                    selectedOrderSiparisKodu,
                    urunId,
                    urunIsim,
                    itemAdet,
                    iadeEdilenAdet,
                    {
                      odemeBekliyor: selectedOrderOdemeBekliyor,
                      teslimEdildi: siparisTeslimEdildi,
                    }
                  );
                  const iadeButonuGoster =
                    !urunIadeVar &&
                    !urunIptal &&
                    !urunTamIade &&
                    !isIptal &&
                    siparisTeslimEdildi &&
                    !iadeSuresiGectiMi &&
                    !selectedOrderOdemeBekliyor &&
                    iadeEdilenAdet < itemAdet &&
                    !incelemeMetni;

                  return (
                    <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-md flex flex-col h-full gap-3 sm:gap-4">
                      
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <Link href={urunLinki} className="w-20 h-20 shrink-0 bg-[#020617] rounded-lg border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center p-2 transition-colors">
                          {item.image || item.resim ? (
                            <img src={item.image || item.resim} alt="ürün" className="w-full h-full object-contain drop-shadow-md" />
                          ) : (
                            <PackageOpen className="w-8 h-8 text-slate-600" />
                          )}
                        </Link>
                        
                        <div className="flex-1 flex flex-col h-full min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Link href={urunLinki} className="text-[11px] sm:text-xs font-bold text-white hover:text-cyan-400 transition-colors leading-snug block break-words">
                              {item.title || item.isim}
                            </Link>
                            {urunIadeVar && urunTamIade && (
                              <span className="px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[9px] font-black uppercase tracking-widest">
                                İade Edildi
                              </span>
                            )}
                            {urunIadeVar && !urunTamIade && (
                              <span className="px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest">
                                Kısmi İade
                              </span>
                            )}
                            {urunIptal && (
                              <span className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest">
                                İptal Edildi
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-auto">
                            <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">Miktar: {item.quantity || item.adet} Adet</p>
                            <p className="text-slate-500 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 shrink-0" /> Alım Tarihi: {selectedOrderAlimTarihi.toLocaleDateString("tr-TR")}
                            </p>
                            {urunIadeVar && iadeEdilenAdet > 0 && (
                              <>
                                <p className="text-rose-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">
                                  İade Edildi: {iadeEdilenAdet} Adet
                                </p>
                                {iadeYontemiSatiriGoster(
                                  urunIadeYontemiBul(
                                    selectedOrder,
                                    destekTalepleri,
                                    selectedOrderSiparisKodu,
                                    urunId,
                                    item.title || item.isim || item.name
                                  )
                                )}
                              </>
                            )}
                            <p className="text-sm sm:text-base font-black text-cyan-400 whitespace-nowrap">
                              {Number((item.price || item.fiyat || 0) * (item.quantity || item.adet || 1)).toLocaleString("tr-TR")} TL
                            </p>
                          </div>
                        </div>
                      </div>

                      {yorumTekrarAlGoster && (
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-1 -mb-1">
                          {iadeSuresiGectiMi ? (
                            <span className="text-slate-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 15 Günlük İade Süresi Doldu</span>
                          ) : iadeBitisTarihi ? (
                            <span className="text-emerald-500 flex items-center gap-1"><Info className="w-3 h-3" /> İade için son {iadeyeKalanGun} gün ({iadeBitisTarihi.toLocaleDateString("tr-TR")})</span>
                          ) : null}
                        </div>
                      )}

                      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/50 mt-auto">
                        {yorumTekrarAlGoster && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Link
                              href={`${urunLinki}#yorumlar`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#020617] hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700 rounded-md transition-all text-[10px] font-semibold whitespace-nowrap"
                            >
                              <Star className="w-3 h-3 shrink-0" /> Yorumla
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!sepeteEkle) return;
                                const urunSlug = item?.slug || item?.productId || item?.id || item?._id || "";
                                sepeteEkle({
                                  id: String(item?.id || item?._id || item?.productId || urunSlug),
                                  isim: item?.title || item?.isim || "Ürün",
                                  fiyat: Number(item?.price || item?.fiyat || 0),
                                  resim: item?.image || item?.resim || "https://via.placeholder.com/400",
                                  varyasyon: "Standart Model",
                                  havaleIndirimi: 5,
                                  slug: urunSlug,
                                });
                                const btn = e.currentTarget;
                                const originalHTML = btn.innerHTML;
                                const originalClasses = btn.className;
                                btn.className = "inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 text-white border border-emerald-400/40 rounded-md text-[10px] font-semibold whitespace-nowrap";
                                btn.innerHTML = '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Eklendi';
                                setTimeout(() => {
                                  btn.className = originalClasses;
                                  btn.innerHTML = originalHTML;
                                }, 1500);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/30 rounded-md transition-all text-[10px] font-semibold whitespace-nowrap"
                            >
                              <ShoppingCart className="w-3 h-3 shrink-0" /> Tekrar Al
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 min-h-[28px]">
                          {urunIadeVar ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/5 text-orange-300 border border-orange-500/20 text-[10px] font-medium">
                              <RefreshCw className="w-3 h-3 shrink-0" />
                              {urunTamIade ? "İade Edildi" : "Kısmi İade"}
                            </span>
                          ) : urunIptal ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/5 text-red-400 border border-red-500/20 text-[10px] font-medium">
                              <RefreshCw className="w-3 h-3 shrink-0" />
                              İptal edildi
                            </span>
                          ) : incelemeMetni ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/5 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                              <Clock className="w-3 h-3 shrink-0" />
                              {incelemeMetni}
                            </span>
                          ) : iadeSuresiGectiMi && siparisTeslimEdildi && !urunIadeVar && !urunIptal ? (
                            <Link
                              href="/destek-taleplerim/yeni?konu=teknik"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:bg-slate-800/50 border border-slate-700 rounded-md transition-all text-[10px] font-semibold whitespace-nowrap"
                            >
                              <Headset className="w-3 h-3 shrink-0" />
                              Destek Talebi Oluştur
                            </Link>
                          ) : (
                            <>
                              {iadeButonuGoster && (
                                <Link
                                  href={`/destek-taleplerim/yeni?siparisNo=${selectedOrder.siparisKodu || selectedOrder.orderNumber}&konu=iade&urunId=${encodeURIComponent(urunId)}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-md transition-all text-[10px] font-semibold whitespace-nowrap"
                                >
                                  <RefreshCw className="w-3 h-3 shrink-0" />
                                  İade Et
                                </Link>
                              )}
                              {iptalButonuGoster && (
                                isKargoda ? (
                                  <Link
                                    href={`/destek-taleplerim/yeni?siparisNo=${selectedOrder.siparisKodu || selectedOrder.orderNumber}&konu=iptal&urunId=${encodeURIComponent(urunId)}&kargo=1`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded-md transition-all text-[10px] font-semibold whitespace-nowrap"
                                  >
                                    <RefreshCw className="w-3 h-3 shrink-0" />
                                    Ürünü İptal Et
                                  </Link>
                                ) : !siparisTeslimEdildi && (
                                  <Link
                                    href={`/destek-taleplerim/yeni?siparisNo=${selectedOrder.siparisKodu || selectedOrder.orderNumber}&konu=iptal&urunId=${encodeURIComponent(urunId)}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-md transition-all text-[10px] font-semibold whitespace-nowrap"
                                  >
                                    <RefreshCw className="w-3 h-3 shrink-0" />
                                    Ürünü İptal Et
                                  </Link>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {selectedOrderOdemeBekliyor && (
                <div className="flex gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-300">
                      {selectedOrderHavaleBekliyor ? "Havale / EFT Bekleniyor" : "Ödeme Bekleniyor"}
                    </p>
                    <p className="text-xs font-medium leading-relaxed text-slate-300">
                      {selectedOrderHavaleBekliyor ? (
                        <>
                          Havale veya EFT ödemeniz henüz tarafımıza ulaşmadı.{" "}
                          <span className="text-cyan-300/90">1 gün (24 saat)</span> içinde ödeme yapılmazsa sipariş otomatik iptal edilir ve işleme alınmaz.
                          Ödeme yaptıysanız onay sürecini bekleyebilirsiniz; onaylandığında siparişiniz hazırlanmaya başlar.
                        </>
                      ) : (
                        <>
                          Kart ödemeniz henüz tamamlanmadı. Ödeme yapılmazsa sipariş işleme alınmaz; tamamlanmayan kart ödemeleri{" "}
                          <span className="text-cyan-300/90">30 dakika</span> sonra otomatik iptal edilir.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Ödeme Özeti
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-slate-300 font-medium text-xs">
                        <span>Ara Toplam</span>
                        <span>{Number(selectedOrder.totalPrice || selectedOrder.toplamTutar).toLocaleString("tr-TR")} TL</span>
                      </div>
                      <div className="flex justify-between text-slate-300 font-medium text-xs">
                        <span>Kargo Ücreti</span>
                        <span className="text-emerald-400 font-bold">Ücretsiz</span>
                      </div>
                      <div className="flex justify-between text-slate-300 font-medium text-xs">
                        <span>Ödeme Yöntemi</span>
                        <span className="capitalize">{selectedOrder.odemeYontemi || selectedOrder.paymentMethod || "Havale / EFT"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-sm font-black text-white uppercase tracking-widest">Genel Toplam</span>
                    <span className="text-lg font-black text-cyan-400">{Number(selectedOrder.totalPrice || selectedOrder.toplamTutar).toLocaleString("tr-TR")} TL</span>
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Sipariş & Kargo Notları
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.siparisNotu && selectedOrder.siparisNotu.trim() !== "" && selectedOrder.siparisNotu !== "Not eklenmemiş" && (
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">SİZİN NOTUNUZ</p>
                        <div className="bg-[#020617] border border-slate-800 p-3 rounded-lg text-xs text-slate-300 font-medium leading-relaxed">
                          {selectedOrder.siparisNotu}
                        </div>
                      </div>
                    )}
                    {selectedOrder.musteriMesaji && (
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">MAĞAZA NOTU</p>
                        <div className="bg-[#020617] border border-slate-800 p-3 rounded-lg text-xs text-slate-300 font-medium leading-relaxed">
                          {selectedOrder.musteriMesaji}
                        </div>
                      </div>
                    )}
                    {getOrderShippingCompany(selectedOrder) && (
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">KARGO FİRMASI</p>
                        <div className="bg-[#020617] border border-slate-800 p-3 rounded-lg text-xs text-white font-semibold">
                          {getOrderShippingCompany(selectedOrder)}
                        </div>
                      </div>
                    )}
                    {getOrderTrackingNumber(selectedOrder) && (
                      <div>
                        <p className="text-[9px] text-cyan-500 font-black uppercase tracking-widest mb-1.5">KARGO TAKİP NUMARASI</p>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg text-xs text-cyan-400 font-bold flex justify-between items-center">
                          {getOrderTrackingNumber(selectedOrder)}
                          <button onClick={(e) => handleCopy(getOrderTrackingNumber(selectedOrder), e)} className="text-cyan-400 hover:text-white transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrderIadeKalemleri.length > 0 && (
                <div className="bg-[#0f172a] border border-rose-900/40 rounded-xl p-5 shadow-lg">
                  <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> İade Edilen Ürünler
                  </h3>
                  <div className="space-y-3">
                    {selectedOrderIadeKalemleri.map((kalem) => (
                      <div key={`${kalem.urunId}-${kalem.adet}`} className="bg-[#020617] border border-slate-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white">{kalem.isim}</p>
                          <p className="text-[10px] uppercase tracking-widest text-rose-400 font-black mt-1">
                            {kalem.adet} adet iade edildi
                          </p>
                          {iadeYontemiSatiriGoster(kalem.yontem, { bankaNotu: true })}
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          {kalem.birimFiyat ? `${Number(kalem.birimFiyat).toLocaleString("tr-TR")} TL / adet` : ""}
                        </div>
                      </div>
                    ))}
                    {Number(selectedOrder.toplamIadeEdilenTutar || 0) > 0 && (
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">Toplam İade</span>
                        <span className="text-rose-400 font-black">
                          {Number(selectedOrder.toplamIadeEdilenTutar || 0).toLocaleString("tr-TR")} TL
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          ) : (
            /* ANA LİSTE EKRANI */
            <div className="flex flex-col gap-5 lg:gap-6 w-full">

{/* 🚀 BİNGO: BURADAKİ z-40 YERİNE z-50 YAZDIK Kİ ÖRTÜNÜN ÜSTÜNE ÇIKSIN! */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative flex flex-col gap-5 z-50">
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[60px] rounded-full"></div>
                </div>
                
                {/* 🚀 BİNGO: BURADAKİ z-10 YERİNE DE z-50 YAZDIK! */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 relative z-50">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                      <Package className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-0.5">Siparişlerim</h1>
                      <p className="text-cyan-400/80 text-xs font-medium tracking-wide">
                        Listelenen: <span className="font-black text-cyan-400">{filtrelenmisSiparisler.length}</span> Sipariş
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 sm:gap-3 w-full xl:w-auto relative z-50">
                    
                    {/* ZAMAN FİLTRESİ */}
                    <div className="relative flex-1 xl:flex-none min-w-0">
                      <button onClick={() => {setZamanAcik(!zamanAcik); setDurumAcik(false)}} className="w-full flex items-center justify-between gap-1 sm:gap-2 bg-[#020617] hover:bg-[#020617]/80 border border-slate-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3 xl:w-48 transition-colors text-[9px] sm:text-xs text-slate-300 font-bold whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-500 shrink-0" />
                          <span className="truncate">{zamanSecenekleri.find(z => z.id === zamanFiltresi)?.ad}</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 shrink-0 text-slate-500 transition-transform ${zamanAcik ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {zamanAcik && (
                        <div className="absolute top-full mt-1.5 left-0 w-full bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl overflow-hidden py-1 z-[100] animate-in fade-in zoom-in-95 duration-100">
                          {zamanSecenekleri.map(secenek => (
                            <button key={secenek.id} onClick={() => {setZamanFiltresi(secenek.id); setZamanAcik(false)}} className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold transition-colors ${zamanFiltresi === secenek.id ? 'bg-cyan-600/10 text-cyan-400' : 'text-slate-300 hover:bg-[#020617] hover:text-white'}`}>
                              {secenek.ad}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* DURUM FİLTRESİ */}
                    <div className="relative flex-1 xl:flex-none min-w-0">
                      <button onClick={() => {setDurumAcik(!durumAcik); setZamanAcik(false)}} className="w-full flex items-center justify-between gap-1 sm:gap-2 bg-[#020617] hover:bg-[#020617]/80 border border-slate-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3 xl:w-52 transition-colors text-[9px] sm:text-xs text-slate-300 font-bold whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                          <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-500 shrink-0" />
                          <span className="truncate">{durumSecenekleri.find(d => d.id === durumFiltresi)?.ad}</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 shrink-0 text-slate-500 transition-transform ${durumAcik ? 'rotate-180' : ''}`} />
                      </button>

                      {durumAcik && (
                        <div className="absolute top-full mt-1.5 left-0 w-full bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl overflow-hidden py-1 z-[100] animate-in fade-in zoom-in-95 duration-100">
                          {durumSecenekleri.map(secenek => (
                            <button key={secenek.id} onClick={() => {setDurumFiltresi(secenek.id); setDurumAcik(false)}} className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold transition-colors ${durumFiltresi === secenek.id ? 'bg-cyan-600/10 text-cyan-400' : 'text-slate-300 hover:bg-[#020617] hover:text-white'}`}>
                              {secenek.ad}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-xs flex justify-between items-center shadow-lg">
                    <span className="font-medium">{errorMsg}</span>
                    <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-300 transition-colors">✕</button>
                </div>
              )}

              {filtrelenmisSiparisler.length === 0 ? (
                <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-16 h-16 rounded-full bg-[#020617] border border-cyan-500/20 flex items-center justify-center mb-4">
                    <PackageX className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h2 className="text-base font-black uppercase tracking-wide mb-2 text-white">Sipariş Bulunamadı</h2>
                  <p className="text-slate-400 text-xs mb-6">Seçtiğiniz filtrelere uygun sipariş geçmişi görünmüyor.</p>
                  <button onClick={() => { setZamanFiltresi("tumu"); setDurumFiltresi("tumu"); }} className="text-cyan-400 hover:text-cyan-300 font-bold text-xs underline underline-offset-4">Filtreleri Temizle</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 relative z-0">
                  {filtrelenmisSiparisler.map((order: OrderLike) => {
                    const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id?.slice(-8).toUpperCase() || "SİPARİŞ";
                    const durumMetni = siparisGosterimDurumu(order);
                    const firstItem = siparisKalemleri(order)[0] || null;
                    const listeIadeYontemi = siparisIadeYontemi(order, destekTalepleri);
                    const listeIadeMetni = urunIadeYontemiMetni(listeIadeYontemi);
                    const listeIadeVar =
                      durumMetni.toLowerCase().includes("iade") ||
                      siparisKalemleri(order).some((i) => Number(i.iadeEdilenAdet || 0) > 0);

                    return (
                      <div key={order._id || currentSiparisKodu} className="flex flex-col gap-4 bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] p-5 rounded-2xl transition-all duration-300">
                        
                        <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt || order.tarih).toLocaleDateString("tr-TR")}
                          </span>
                          <DurumRozetiGoster durum={durumMetni} />
                        </div>

                        <div className="flex items-start gap-4 mt-1">
                          <Link 
                            href={"/product/" + (firstItem?.slug || firstItem?.seoUrl || firstItem?.url || firstItem?.productId || firstItem?.id || firstItem?._id || '')} 
                            className="w-20 h-20 shrink-0 bg-[#020617] border border-slate-800 hover:border-cyan-500/50 rounded-xl flex items-center justify-center p-2 relative overflow-hidden transition-all duration-300 cursor-pointer group z-10 shadow-sm"
                          >
                            {firstItem && (firstItem.image || firstItem.resim) ? (
                              <img src={firstItem.image || firstItem.resim} alt="Ürün" className="w-full h-full object-contain drop-shadow-md z-10 group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <PackageOpen className="w-7 h-7 text-slate-500" />
                            )}
                            {order.items?.length > 1 && (
                              <div className="absolute bottom-0 inset-x-0 bg-[#0f172a]/95 text-cyan-400 text-[10px] font-black py-0.5 text-center z-20 border-t border-slate-800">
                                {order.items.length} Ürün
                              </div>
                            )}
                          </Link>
                          
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">#{currentSiparisKodu}</span>
                              <button onClick={(e) => handleCopy(currentSiparisKodu, e)} className="text-slate-500 hover:text-cyan-400 transition-colors">
                                 {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            
                            <Link 
                              href={"/product/" + (firstItem?.slug || firstItem?.seoUrl || firstItem?.url || firstItem?.productId || firstItem?.id || firstItem?._id || '')}
                              className="text-[12px] text-slate-300 hover:text-cyan-400 transition-colors font-medium line-clamp-2 leading-relaxed cursor-pointer block"
                            >
                              {firstItem?.title || firstItem?.isim || "Ürün"}
                            </Link>
                          </div>
                        </div>

                        {listeIadeVar && listeIadeMetni && (
                          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 leading-none -mt-1">
                            {listeIadeYontemi === "magaza_kredisi" ? (
                              <Wallet className="size-3 shrink-0 text-cyan-400" strokeWidth={2.5} />
                            ) : (
                              <CreditCard className="size-3 shrink-0 text-emerald-400" strokeWidth={2.5} />
                            )}
                            İade: {listeIadeMetni}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/60">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">TOPLAM TUTAR</span>
                            <p className="text-base font-black text-white whitespace-nowrap">
                              {Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} <span className="text-xs text-slate-500">TL</span>
                            </p>
                          </div>
                          <button
                            onClick={() => siparisDetayAc(order)} 
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/20 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shrink-0"
                          >
                            Detay <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
      </div>

      {/* SİLME MODALI */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            <div className="w-16 h-16 rounded-full border border-red-500/20 flex items-center justify-center mb-5 bg-red-500/10 relative z-10">
              <Trash2 className="w-7 h-7 text-red-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10">Siparişi Geçmişten Sil</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed relative z-10">
              Bu siparişi geçmişinizden kalıcı olarak silmek istediğinize emin misiniz?
            </p>
            <div className="flex w-full gap-3 relative z-10">
              <button onClick={() => setOrderToDelete(null)} className="flex-1 bg-[#020617] border border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider">İptal</button>
              <button onClick={confirmDelete} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.2)]">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* MİLİMETRİK KARGOLAR POPUP'I */}
      {kargoPopupAcik && (
        <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 relative z-10 shrink-0">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" /> Aktif Kargolarınız
              </h3>
              <button 
                onClick={() => setKargoPopupAcik(false)} 
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white bg-[#020617] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {(() => {
                const kargoSiparisleri = localOrders.filter(o => (o.durum || o.status || "").toLocaleLowerCase("tr-TR").includes("kargo"));
                
                if (kargoSiparisleri.length === 0) {
                  return (
                    <div className="text-center py-10 flex flex-col items-center justify-center relative z-10">
                      <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#020617]">
                        <PackageX className="w-7 h-7 text-slate-600" />
                      </div>
                      <p className="text-slate-400 font-medium text-sm">Şu an yolda olan aktif kargonuz bulunmuyor.</p>
                    </div>
                  );
                }

                return kargoSiparisleri.map((siparis: OrderLike, idx: number) => {
                  const siparisKodu = siparis.siparisKodu || siparis.orderNumber || siparis._id?.slice(-8).toUpperCase() || "SİPARİŞ";
                  const tarih = siparis.createdAt ? new Date(siparis.createdAt).toLocaleDateString("tr-TR") : siparis.tarih ? new Date(siparis.tarih).toLocaleDateString("tr-TR") : "";
                  const firma = siparis.kargoFirmasi || siparis.shippingCompany || "Belirtilmemiş";
                  const takipNo = siparis.takipNo || siparis.kargoTakipNo || siparis.trackingNumber || "Takip No Girilmemiş";
                  
                  const firstItem = siparis.items && siparis.items.length > 0 ? siparis.items[0] : null;

                  return (
                    <div key={siparis._id || idx} className="bg-[#020617] border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-4 group hover:border-cyan-500/30 transition-colors relative z-10 mb-2">
                      <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                        <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">#{siparisKodu}</span>
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {tarih}</span>
                      </div>

                      {firstItem && (
                        <div className="flex items-center gap-3 bg-[#0f172a] p-2.5 rounded-xl border border-slate-800">
                          <Link 
                            href={"/product/" + (firstItem?.slug || firstItem?.seoUrl || firstItem?.url || firstItem?.productId || firstItem?.id || firstItem?._id || "")}
                            className="w-12 h-12 shrink-0 bg-[#020617] border border-slate-700 hover:border-cyan-500/50 rounded-lg flex items-center justify-center p-1.5 transition-colors"
                          >
                            {firstItem.image || firstItem.resim ? (
                              <img src={firstItem.image || firstItem.resim} alt="Ürün" className="w-full h-full object-contain" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-500" />
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={"/product/" + (firstItem?.slug || firstItem?.seoUrl || firstItem?.url || firstItem?.productId || firstItem?.id || firstItem?._id || "")}
                              className="text-[11px] text-slate-300 hover:text-cyan-400 font-medium line-clamp-2 transition-colors leading-snug block"
                            >
                              {firstItem.title || firstItem.isim || "Ürün Detayı"}
                            </Link>
                            {siparis.items?.length > 1 && (
                              <span className="text-[9px] text-cyan-500 font-bold mt-1 block">+{siparis.items.length - 1} Ürün Daha</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Kargo Firması</span>
                          <span className="font-bold text-white px-2 py-1 bg-[#0f172a] rounded-md border border-slate-800">{firma}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Takip Numarası</span>
                          <div className="flex items-center gap-2 px-2 py-1 bg-cyan-950/20 rounded-md border border-cyan-500/20">
                            <span className="font-black text-cyan-400">{takipNo}</span>
                            {takipNo !== "Takip No Girilmemiş" && (
                              <button onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(takipNo);
                                toast.success("Takip numarası kopyalandı!");
                              }} className="text-cyan-600 hover:text-cyan-300 transition-colors">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, Copy, Check, RefreshCw, Filter, 
  PackageOpen, Package, Truck, CheckCircle2, Clock, 
  User, ShieldCheck, CreditCard, PackageX, ChevronRight, Calendar,
  ArrowLeft, MessageSquare, ShoppingCart, Star, AlertCircle, Info, ChevronDown,
  MapPin, Search, Monitor, Headphones
} from "lucide-react"; 
import Link from "next/link";
import toast from "react-hot-toast";
import { useOrders } from "@/app/OrderContext"; 
import { useCart } from "@/app/CartContext"; // 🚀 BİNGO: Sepet context'ini buraya çağırdık!
import KisayolNav from "@/components/layout/KisayolNav";
import { getOrderShippingCompany, getOrderStatusText, getOrderTrackingNumber } from "@/lib/order-utils";
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
    window.scrollTo(0, 0);
  }, [selectedOrder]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  const [kargoPopupAcik, setKargoPopupAcik] = useState<boolean>(false);
  const [kargoIptalModalAcik, setKargoIptalModalAcik] = useState(false);
  const [iptalEdilecekSiparisKodu, setIptalEdilecekSiparisKodu] = useState("");

  const [zamanFiltresi, setZamanFiltresi] = useState<string>("tumu");
  const [durumFiltresi, setDurumFiltresi] = useState<string>("tumu");

  const [zamanAcik, setZamanAcik] = useState(false);
  const [durumAcik, setDurumAcik] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (kargoPopupAcik || orderToDelete || kargoIptalModalAcik) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => { document.body.style.overflow = 'unset'; }; 
  }, [kargoPopupAcik, orderToDelete, kargoIptalModalAcik]);

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
    if (d.includes("iptal") || d.includes("i̇ptal")) return (
        <div className="w-max inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> İPTAL EDİLDİ
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
  const selectedOrderDurumMetni = (selectedOrder?.durum || selectedOrder?.status || "").toLowerCase();
  const selectedOrderIsTeslimEdildi = selectedOrderDurumMetni.includes("teslim") || selectedOrderDurumMetni.includes("tamam");
  const selectedOrderIsKargoda = selectedOrderDurumMetni.includes("kargo");
  const selectedOrderIsIptal = selectedOrderDurumMetni.includes("iptal");
  const selectedOrderTopluIptalGoster =
    (selectedOrder?.items?.length || 0) > 1 &&
    !selectedOrderIsIptal &&
    !selectedOrderIsTeslimEdildi;

  return (
    <div className="site-page p-4 sm:p-6 lg:p-8 relative overflow-clip">
      <div className="site-glow-top top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[280px]" />

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* SOL MENÜ */}
        <KisayolNav active="siparisler" />

        {/* SAĞ İÇERİK */}
        <div className="flex-1 flex flex-col min-w-0 w-full relative gap-5 lg:gap-6">
          
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
                      <button
                        onClick={() => {
                          setIptalEdilecekSiparisKodu(selectedOrderSiparisKodu);
                          setKargoIptalModalAcik(true);
                        }}
                        className="w-full xl:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" /> Toplu İptal Et
                      </button>
                    ) : (
                      <Link
                        href={`/destek-taleplerim?siparisNo=${selectedOrderSiparisKodu}&konu=iptal`}
                        className="w-full xl:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" /> Toplu İptal Et
                      </Link>
                    )
                  )}

                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                {selectedOrder.items?.map((item: OrderItemLike, idx: number) => {
                  const durumMetni = (selectedOrder.durum || selectedOrder.status || "").toLowerCase();
                  const isTeslimEdildi = durumMetni.includes("teslim") || durumMetni.includes("tamam");
                  const isKargoda = durumMetni.includes("kargo");
                  const isIptal = durumMetni.includes("iptal");
                  
                  const siparisTarihi = new Date(selectedOrder.createdAt || selectedOrder.tarih);
                  const iadeBitisTarihi = new Date(siparisTarihi.getTime() + (17 * 24 * 60 * 60 * 1000));
                  const bugun = new Date();
                  const iadeSuresiGectiMi = bugun > iadeBitisTarihi;
                  const iadeyeKalanGun = Math.ceil((iadeBitisTarihi.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));

                  const urunLinki = `/product/${item?.slug || item?.productId || item?.id || item?._id || ''}`;

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
                          <Link href={urunLinki} className="text-[11px] sm:text-xs font-bold text-white hover:text-cyan-400 transition-colors leading-snug mb-2 block break-words">
                            {item.title || item.isim}
                          </Link>
                          
                          <div className="mt-auto">
                            <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">Miktar: {item.quantity || item.adet} Adet</p>
                            <p className="text-sm sm:text-base font-black text-cyan-400 whitespace-nowrap">
                              {Number((item.price || item.fiyat || 0) * (item.quantity || item.adet || 1)).toLocaleString("tr-TR")} TL
                            </p>
                          </div>
                        </div>
                      </div>

                      {isTeslimEdildi && !isIptal && (
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-1 -mb-1">
                          {iadeSuresiGectiMi ? (
                            <span className="text-slate-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 14 Günlük İade Süresi Doldu</span>
                          ) : (
                            <span className="text-emerald-500 flex items-center gap-1"><Info className="w-3 h-3" /> İade için son {iadeyeKalanGun} gün ({iadeBitisTarihi.toLocaleDateString("tr-TR")})</span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-row items-center w-full gap-1.5 sm:gap-2 pt-3.5 border-t border-slate-800/50 mt-auto">
                        
                        {/* 🚀 BİNGO: YORUMLAR LİNKİ (#yorumlar çapa etiketiyle doğrudan yorum sekmesine uçar) */}
                        {isTeslimEdildi && (
                          <Link href={`${urunLinki}#yorumlar`} className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-8 px-1 sm:px-2 bg-[#020617] hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700 rounded-md transition-all font-black text-[8px] sm:text-[9px] uppercase tracking-widest whitespace-nowrap">
                            <Star className="w-3 h-3 shrink-0" /> Yorumla
                          </Link>
                        )}

               {/* 🚀 BİNGO: TEKRAR AL BUTONU (404 ÇÖZÜMLÜ VE ANİMASYONLU) */}
{isTeslimEdildi && (
<button 
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation(); // 🚀 BİNGO: Dış karta tıklanmış gibi algılanıp 404 sayfasına gitmesini engeller!
    
    if(sepeteEkle) {
      // 🚀 SLUG GARANTİSİ: URL'nin 404 vermemesi için gerçek slug'ı yakalıyoruz
      const urunSlug = item?.slug || item?.productId || item?.id || item?._id || "";

      sepeteEkle({ 
        id: String(item?.id || item?._id || item?.productId || urunSlug), 
        isim: item?.title || item?.isim || "Ürün", 
        fiyat: Number(item?.price || item?.fiyat || 0), 
        resim: item?.image || item?.resim || "https://via.placeholder.com/400", 
        varyasyon: "Standart Model", 
        havaleIndirimi: 5, 
        slug: urunSlug // 🚀 İŞTE HAYAT KURTARAN YER: Sepet artık linki buradan çekecek!
      });
      
      // 🚀 Butonu yakalayıp yeşil EKLENDİ moduna sokuyoruz (Senin şık animasyonun)
      const btn = e.currentTarget;
      const originalHTML = btn.innerHTML;
      const originalClasses = btn.className;
      
      btn.className = "flex-1 flex items-center justify-center gap-1.5 h-8 px-2 bg-emerald-500 text-white border border-emerald-400/40 rounded-md transition-all font-black text-[9px] uppercase tracking-widest whitespace-nowrap scale-95 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
      btn.innerHTML = '<svg class="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> EKLENDİ';
      
      // 1.5 saniye sonra eski haline çeviriyoruz
      setTimeout(() => {
        btn.className = originalClasses;
        btn.innerHTML = originalHTML;
      }, 1500);
    }
  }} 
  className="flex-1 flex items-center justify-center gap-1.5 h-8 px-2 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/30 rounded-md transition-all font-black text-[9px] uppercase tracking-widest whitespace-nowrap"
>
  <ShoppingCart className="w-3 h-3 shrink-0" /> Tekrar Al
</button>
)}

                        {!isIptal && !iadeSuresiGectiMi && (
                          isTeslimEdildi ? (
                            <Link href={`/destek-taleplerim?siparisNo=${selectedOrder.siparisKodu || selectedOrder.orderNumber}&konu=iade`} className="flex-1 flex items-center justify-center gap-1.5 h-8 px-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 rounded-md transition-all font-black text-[9px] uppercase tracking-widest whitespace-nowrap">
                              <RefreshCw className="w-3 h-3 shrink-0" /> İade Et
                            </Link>
                          ) : isKargoda ? (
                            <button onClick={() => { setIptalEdilecekSiparisKodu(selectedOrder.siparisKodu || selectedOrder.orderNumber); setKargoIptalModalAcik(true); }} className="flex-1 flex items-center justify-center gap-1.5 h-8 px-2 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md transition-all font-black text-[9px] uppercase tracking-widest whitespace-nowrap">
                              <RefreshCw className="w-3 h-3 shrink-0" /> İptal Et
                            </button>
                          ) : (
                            <Link href={`/destek-taleplerim?siparisNo=${selectedOrder.siparisKodu || selectedOrder.orderNumber}&konu=iptal`} className="flex-1 flex items-center justify-center gap-1.5 h-8 px-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 rounded-md transition-all font-black text-[9px] uppercase tracking-widest whitespace-nowrap">
                              <RefreshCw className="w-3 h-3 shrink-0" /> İptal Et
                            </Link>
                          )
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

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
                    const durumMetni = getOrderStatusText(order);
                    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

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

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/60">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">TOPLAM TUTAR</span>
                            <p className="text-base font-black text-white whitespace-nowrap">
                              {Number(order.totalPrice || order.toplamTutar).toLocaleString("tr-TR")} <span className="text-xs text-slate-500">TL</span>
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedOrder(order)} 
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

      {/* KARGO İPTAL UYARI MODALI */}
      {kargoIptalModalAcik && (
        <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-[40px] pointer-events-none rounded-full"></div>
            
            <div className="w-16 h-16 rounded-full border border-amber-500/20 bg-amber-500/10 flex items-center justify-center mb-5">
              <Truck className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Ürününüz Şu An Kargoda!</h3>
            
            <p className="text-slate-300 text-xs sm:text-sm mb-6 font-medium leading-relaxed">
              Siparişiniz kargo firmasına teslim edildiği için sistem üzerinden otomatik olarak iptal edilemez. 
              <br /><br />
              <span className="text-amber-400 font-black">Önemli:</span> İptal işleminin tamamlanması için kargo kapınıza geldiğinde <span className="text-white font-bold underline">kargoyu teslim almayıp kapıda reddetmeniz</span> gerekmektedir. Paket bize geri döndüğünde paranız otomatik iade edilir.
            </p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setKargoIptalModalAcik(false)} 
                className="flex-1 bg-[#020617] border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Vazgeç
              </button>
              <Link 
                href={`/destek-taleplerim?siparisNo=${iptalEdilecekSiparisKodu}&konu=iptal`}
                onClick={() => setKargoIptalModalAcik(false)}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black py-3.5 rounded-xl transition-all text-xs uppercase tracking-widest text-center flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                Yine de Talep Aç
              </Link>
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

    </div>
  );
}
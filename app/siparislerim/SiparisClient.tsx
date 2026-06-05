"use client";

import { useEffect, useState, useRef } from "react";
import { Trash2, Copy, Check, RefreshCw, ArrowLeft, MessageSquare, PackageOpen, Package, Truck, CheckCircle2, Clock } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageX } from "lucide-react";

interface Props {
  initialOrders: any[];
}

export default function SiparisClient({ initialOrders }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const ordersRef = useRef<any[]>(initialOrders); // 🚀 Radarın eski durumu hatırlaması için hafıza
  const [refreshing, setRefreshing] = useState(false); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrders.length > 0) {
      setOrders(initialOrders);
      ordersRef.current = initialOrders;
    }
  }, [initialOrders]);

  // 🚀 İŞTE SENİN İSTEDİĞİ SİHİRLİ RADAR (HER 10 SANİYEDE BİR KONTROL EDER) 🚀
  useEffect(() => {
    const radar = setInterval(async () => {
      if (refreshing) return; // Zaten manuel yenileniyorsa karışma

      try {
        const res = await fetch("/api/orders?t=" + new Date().getTime(), { 
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
        });
        const data = await res.json();
        
        if (res.ok && data.orders) {
           // Admin panelindeki güncel durum ile müşterinin ekranındaki durumu karşılaştır
           const eskiDurumlar = JSON.stringify(ordersRef.current.map(o => ({id: o._id, durum: o.durum})));
           const yeniDurumlar = JSON.stringify(data.orders.map((o:any) => ({id: o._id, durum: o.durum})));

           // EĞER ŞEF DURUMU DEĞİŞTİRMİŞSE (FARK VARSA)
           if (eskiDurumlar !== yeniDurumlar) {
              setRefreshing(true); // 1. Araya "Güncelleniyor..." animasyonunu sok
              
              setTimeout(() => {
                 setOrders(data.orders); // 2. İki saniye sonra yeni durumu ekrana bas
                 ordersRef.current = data.orders;
                 setRefreshing(false);
              }, 2000); 
           } else {
              // Değişim yoksa sessizce veriyi eşitle (animasyon yapma)
              setOrders(data.orders);
              ordersRef.current = data.orders;
           }
        }
      } catch (error) {
        // Sessizce hata geç
      }
    }, 10000); // 10 saniyede bir çalışır

    return () => clearInterval(radar); // Sayfadan çıkınca radarı kapat
  }, [refreshing]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/orders?t=" + new Date().getTime(), { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
         setOrders(data.orders || []);
         ordersRef.current = data.orders || [];
      } else {
         setErrorMsg(data.message || "Siparişler güncellenemedi.");
      }
    } catch (error) {
      setErrorMsg("Bağlantı hatası oluştu.");
    }
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      const res = await fetch("/api/orders?id=" + orderToDelete, { method: "DELETE" });
      if (!res.ok) setErrorMsg("Sipariş silinirken bir hata oluştu.");
      setOrderToDelete(null);
      router.refresh();
    } catch (error) {
      setErrorMsg("Bağlantı hatası sebebiyle silinemedi.");
      setOrderToDelete(null);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 🚀 ROZET SİSTEMİ (GÜNCELLENİRKEN OTOMATİK DEVREYE GİRER) 🚀
  const DurumRozetiGoster = ({ durum, isRefreshing }: { durum: string, isRefreshing: boolean }) => {
    
    if (isRefreshing) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] text-xs font-black uppercase tracking-widest shadow-inner">
           <RefreshCw className="w-4 h-4 animate-spin" />
           GÜNCELLENİYOR...
        </div>
      );
    }

    const d = (durum || "").toLocaleLowerCase("tr-TR");
    
    if (d.includes("iptal") || d.includes("i̇ptal")) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest shadow-inner">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
           SİPARİŞ İPTAL EDİLDİ
        </div>
      );
    }
    if (d.includes("teslim") || d.includes("tamam") || d.includes("bit") || d.includes("son")) {
       return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-inner">
           <CheckCircle2 className="w-4 h-4" />
           TESLİM EDİLDİ
        </div>
      );
    }
    if (d.includes("kargo")) {
       return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.15)]">
           <Truck className="w-4 h-4 animate-bounce" />
           KARGODA
        </div>
      );
    }
    if (d.includes("hazır") || d.includes("ödendi") || d.includes("odendi")) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest shadow-inner">
           <Package className="w-4 h-4" />
           SİPARİŞ HAZIRLANIYOR
        </div>
      );
    }
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-300 text-xs font-black uppercase tracking-widest shadow-inner">
           <Clock className="w-4 h-4" />
           SİPARİŞ ALINDI
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#070b1a] text-white pt-12 md:pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3b82f6] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#3b82f6] transition-all mb-3">
              <ArrowLeft className="w-4 h-4" /> MAĞAZAYA GERİ DÖN
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              SİPARİŞ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">GEÇMİŞİM</span>
            </h1>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 bg-[#09090b] text-[#3b82f6] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border shadow-lg ${refreshing ? 'border-[#3b82f6]/50 bg-[#3b82f6]/5 opacity-80 cursor-wait' : 'hover:bg-[#121215] border-slate-800/80 hover:border-[#3b82f6]/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]'}`}
          >
            <RefreshCw className={"w-4 h-4 " + (refreshing ? "animate-spin" : "")} />
            {refreshing ? "Güncelleniyor..." : "Durumları Güncelle"}
          </button>
        </div>

        {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm mb-6 flex justify-between items-center shadow-lg">
                <span className="font-medium">{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-300 transition-colors">✕</button>
            </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center p-10 sm:p-16 bg-transparent relative">
            <div className="w-20 h-20 rounded-full bg-[#121215]/50 border border-slate-800/50 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <PackageX className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Henüz Siparişiniz Yok</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
              Sipariş geçmişiniz şu an boş görünüyor. Size en uygun teknolojileri keşfetmek için mağazamızı inceleyebilirsiniz.
            </p>
            <Link href="/" prefetch={true} className="inline-block bg-[#3b82f6] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order: any) => {
              const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
              const adminMesaji = order.musteriMesaji || order.mesaj || order.adminMesaj || order.siparisNotu || order.kargoNotu || order.kargoTakipNo;
              const durumMetni = order.durum || order.status || "";

              return (
                <div key={order._id} className={`group border bg-[#09090b] rounded-2xl p-6 transition-all duration-300 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 ${refreshing ? 'border-slate-800/50 opacity-80 scale-[0.99]' : 'border-slate-800 hover:border-[#3b82f6]/40 shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.03)] scale-100'}`}>
                  
                  <button
                    onClick={() => handleDeleteClick(order._id)}
                    className="absolute top-4 right-4 p-2.5 text-slate-500 hover:text-red-500 bg-[#121215] border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all shadow-md z-20"
                    title="Siparişi Sil"
                    disabled={refreshing}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 pr-16">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-bold">
                        SİPARİŞ NO: <span className="text-[#3b82f6] font-black">{currentSiparisKodu}</span>
                        <button 
                          onClick={() => handleCopy(currentSiparisKodu)}
                          className="text-slate-400 hover:text-[#3b82f6] transition-colors bg-[#121215] border border-slate-800 p-1.5 rounded-lg"
                        >
                          {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </p>
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        Tarih: <span className="text-slate-300">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                      </p>
                      
                      {/* 🚀 ROZET OTOMATİK OLARAK BURADA DEVREYE GİRER 🚀 */}
                      <DurumRozetiGoster durum={durumMetni} isRefreshing={refreshing} />
                      
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#121215] text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 font-black uppercase tracking-wider">
                        {order.paymentMethod || "Havale / EFT"}
                      </span>
                    </div>
                  </div>

                  {adminMesaji && (
                    <div className={`mt-6 bg-[#0088ff]/10 border border-[#0088ff]/20 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm transition-opacity duration-500 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                      <MessageSquare className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-[#3b82f6] font-black uppercase tracking-widest mb-1">Mağaza Mesajı / Kargo Notu</p>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed">{adminMesaji}</p>
                      </div>
                    </div>
                  )}

                  <div className={`border-t border-slate-800/80 pt-6 mt-6 space-y-4 transition-opacity duration-500 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-[#121215] p-4 sm:p-5 rounded-2xl border border-slate-800/60 shadow-lg">
                        
                        <div className="w-full sm:w-32 sm:h-32 flex-shrink-0 flex justify-center items-center bg-[#09090b] py-6 sm:py-0 rounded-xl border border-slate-800/50 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                          {item.image || item.resim ? (
                            <img 
                              src={item.image || item.resim} 
                              alt={item.title} 
                              className="w-32 h-32 sm:w-28 sm:h-28 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-10"
                              onError={(e) => { 
                                e.currentTarget.src = "https://placehold.co/200x200/121215/00e5ff?text=Gorsel+Yok" 
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-[#09090b] border border-slate-700 flex items-center justify-center z-10">
                              <PackageOpen className="w-8 h-8 text-slate-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row flex-grow w-full justify-between sm:items-center gap-4">
                          
                          <div className="w-full sm:w-auto flex-grow text-center sm:text-left">
                            <p className="font-bold text-slate-200 break-words whitespace-normal leading-relaxed text-sm sm:text-base">
                              {item.title}
                            </p>
                          </div>

                          <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0 flex-shrink-0 gap-2">
                            <p className="text-xs text-slate-400 font-bold uppercase bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/50">
                              {item.quantity} ADET
                            </p>
                            <p className="font-black text-[#3b82f6] text-lg sm:text-xl whitespace-nowrap">
                              {Number((item.price || 0) * item.quantity).toLocaleString("tr-TR")} TL
                            </p>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-6 flex justify-between items-center bg-[#121215] border border-slate-800/80 p-5 rounded-xl shadow-inner transition-opacity duration-500 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Genel Toplam</span>
                    <span className="text-2xl font-black text-white tracking-tight">
                      {Number(order.totalPrice).toLocaleString("tr-TR")} <span className="text-sm text-slate-500">TL</span>
                    </span>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}

      </div>

      {orderToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <div className="w-14 h-14 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-[#121215] shadow-inner">
              <Trash2 className="w-6 h-6 text-slate-400" />
            </div>
            
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Siparişi Sil</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed">
              Bu siparişi kalıcı olarak silmek istediğinize emin misiniz?
              <span className="block text-red-400 font-bold mt-2">Bu işlem geri alınamaz!</span>
            </p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="flex-1 bg-[#121215] border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                İptal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
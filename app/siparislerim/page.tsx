"use client";

import { useEffect, useState } from "react";
import { Trash2, Copy, Check, RefreshCw, MessageSquare, PackageOpen } from "lucide-react"; 
import Link from "next/link";

export default function SiparislerimPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?t=" + new Date().getTime(), { 
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        setErrorMsg(data.message || "Siparişler yüklenemedi.");
      }
    } catch (error) {
      setErrorMsg("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(); 
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      const res = await fetch("/api/orders?id=" + orderToDelete, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter((order) => order._id !== orderToDelete));
        setOrderToDelete(null); 
      } else {
        setErrorMsg("Sipariş silinirken bir hata oluştu.");
        setOrderToDelete(null);
      }
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

  const getStepNumber = (order: any) => {
    const s = (order.searchableStatus || order.status || order.durum || "").toLowerCase();
    if (s.includes("teslim") || s.includes("tamam")) return 4;
    if (s.includes("kargo") || s.includes("gönder")) return 3;
    if (s.includes("hazırla") || s.includes("öden") || s.includes("başarılı") || s.includes("onay") || s.includes("kabul")) return 2;
    return 1; 
  };

  const steps = [
    { num: 1, label: "SİPARİŞ ALINDI" },
    { num: 2, label: "HAZIRLANIYOR" },
    { num: 3, label: "KARGODA" },
    { num: 4, label: "TESLİM EDİLDİ" },
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      
      {/* SİBER NEON ARKA PLAN IŞIKLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ÜST PANEL */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00e5ff] transition-all mb-3">
              Mağazaya Geri Dön
            </Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">SİPARİŞ</span> GEÇMİŞİM
            </h1>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-[#09090b] hover:bg-[#121215] text-[#00e5ff] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-800/80 hover:border-[#00e5ff]/50 shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
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

        {/* TEK HAYALETLİ YÜKLEME EKRANI */}
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="border border-slate-800/50 bg-[#09090b]/50 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden animate-pulse">
              <div className="flex justify-between items-center border-b border-slate-800/50 pb-4">
                <div className="h-4 bg-slate-800/40 rounded-md w-1/3"></div>
                <div className="h-6 bg-slate-800/40 rounded-md w-1/4"></div>
              </div>
              <div className="h-10 bg-slate-800/40 rounded-md w-full my-4"></div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                <div className="h-12 bg-slate-800/40 rounded-xl w-1/2"></div>
                <div className="h-8 bg-slate-800/40 rounded-md w-1/4"></div>
              </div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          
          /* BOŞ ARKA PLANLI EKRAN */
          <div className="text-center p-10 sm:p-16 bg-transparent relative">
            <div className="w-20 h-20 rounded-full bg-[#121215]/50 border border-slate-800/50 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <PackageOpen className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wide mb-2 text-white">Henüz Siparişiniz Yok</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">Sistemde kayıtlı herhangi bir donanım siparişiniz bulunmuyor. Yeni nesil parçalar vitrinde sizi bekliyor.</p>
            <Link href="/" className="inline-block bg-[#00e5ff] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#00c4db] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">
              Alışverişe Başla
            </Link>
          </div>

        ) : (
          /* SİPARİŞ KARTLARI LİSTESİ */
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order: any) => {
              const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
              const currentStep = getStepNumber(order); 
              const adminMesaji = order.musteriMesaji || order.mesaj || order.adminMesaj || order.siparisNotu || order.kargoNotu || order.kargoTakipNo;

              return (
                <div key={order._id} className="group border border-slate-800 bg-[#09090b] rounded-2xl p-6 transition-all duration-300 hover:border-[#00e5ff]/40 shadow-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.03)] relative overflow-hidden">
                  
                  <button
                    onClick={() => handleDeleteClick(order._id)}
                    className="absolute top-4 right-4 p-2.5 text-slate-500 hover:text-red-500 bg-[#121215] border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all shadow-md z-20"
                    title="Siparişi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 pr-16">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-bold">
                        SİPARİŞ NO: <span className="text-[#00e5ff] font-black">{currentSiparisKodu}</span>
                        <button 
                          onClick={() => handleCopy(currentSiparisKodu)}
                          className="text-slate-400 hover:text-[#00e5ff] transition-colors bg-[#121215] border border-slate-800 p-1.5 rounded-lg"
                          title="Kodu Kopyala"
                        >
                          {copiedCode === currentSiparisKodu ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Tarih: <span className="text-slate-300">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#121215] text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 font-black uppercase tracking-wider">
                        {order.paymentMethod || "Havale / EFT"}
                      </span>
                    </div>
                  </div>

                  {/* SİBER İLERLEME ÇUBUĞU (HİZALAMA DÜZELTİLDİ: items-start) */}
                  <div className="pt-8 pb-6 px-2 sm:px-8">
                    <div className="relative flex items-start justify-between w-full max-w-3xl mx-auto">
                      
                      {/* Arka Plan Çizgisi */}
                      <div className="absolute left-0 top-4 sm:top-5 -translate-y-1/2 w-full h-1 bg-[#121215] border-y border-slate-800 -z-10 rounded-full"></div>
                      
                      {/* İlerleme (Aktif) Çizgisi */}
                      <div 
                        className="absolute left-0 top-4 sm:top-5 -translate-y-1/2 h-1 bg-gradient-to-r from-[#00e5ff] to-[#0088ff] -z-10 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(0,229,255,0.6)] rounded-full" 
                        style={{ width: (((currentStep - 1) / 3) * 100) + "%" }}
                      ></div>

                      {steps.map((step) => {
                        const isCompleted = currentStep >= step.num;

                        return (
                          <div key={step.num} className="flex flex-col items-center gap-3 relative z-10 w-20 sm:w-24">
                            <div className={"w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border-2 transition-all duration-500 shrink-0 " + (
                              isCompleted ? "bg-[#00e5ff] border-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]" : 
                              "bg-[#09090b] border-slate-700 text-slate-500"
                            )}>
                              {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={4} /> : step.num}
                            </div>
                            <span className={"text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-center w-full transition-colors duration-500 " + (
                              isCompleted ? "text-slate-200" : "text-slate-600"
                            )}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {adminMesaji && (
                    <div className="mb-6 bg-[#0088ff]/10 border border-[#0088ff]/20 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                      <MessageSquare className="w-5 h-5 text-[#00e5ff] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-[#00e5ff] font-black uppercase tracking-widest mb-1">Mağaza Mesajı / Kargo Notu</p>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed">{adminMesaji}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-slate-800/80 pt-6 space-y-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between gap-4 text-sm bg-[#121215] p-3 rounded-xl border border-slate-800/50">
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-14 h-14 object-contain rounded-lg bg-[#09090b] border border-slate-800 p-1"/>
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-[#09090b] border border-slate-800 flex items-center justify-center">
                              <PackageOpen className="w-5 h-5 text-slate-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-200 line-clamp-1">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">{item.quantity} Adet</p>
                          </div>
                        </div>
                        <p className="font-black text-[#00e5ff] text-base whitespace-nowrap">
                          {Number(item.price * item.quantity).toLocaleString("tr-TR")} TL
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between items-center bg-[#121215] border border-slate-800/80 p-5 rounded-xl shadow-inner">
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

      {/* SİLME ONAY MODAL PANELİ */}
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
"use client";
import { useEffect, useState } from "react";
import { Loader2, Trash2, Copy, Check, RefreshCw, MessageSquare, X } from "lucide-react"; 

interface SiparisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SiparisModal({ isOpen, onClose }: SiparisModalProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?t=${new Date().getTime()}`, { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
      else setErrorMsg(data.message || "Siparişler yüklenemedi.");
    } catch (error) {
      setErrorMsg("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🚀 Popup açıldığında arkadaki sayfanın kaymasını (scroll) durdurur ve canlı veriyi çeker
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchOrders();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(); 
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      const res = await fetch(`/api/orders?id=${orderToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter((order) => order._id !== orderToDelete));
        setOrderToDelete(null); 
      } else {
        setErrorMsg("Sipariş silinirken hata oluştu.");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050B14]/90 backdrop-blur-md p-0 md:p-6 transition-all duration-300">
      
      {/* 🚀 BİLGİSAYARDA POPUP, TELEFONDA TAM EKRAN (Glassmorphism Tasarım) */}
      <div className="bg-[#050B14] md:bg-slate-900/80 md:border border-slate-700 md:rounded-3xl w-full h-full md:max-w-5xl md:h-[90vh] flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* ÜST BAŞLIK VE BUTONLAR (Sabitlenmiş) */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 bg-[#050B14]/95 md:bg-slate-900/95 sticky top-0 z-30 md:rounded-t-3xl backdrop-blur-xl">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Siparişlerim
          </h1>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={handleRefresh} disabled={refreshing || loading} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 p-2 sm:px-4 sm:py-2 rounded-xl font-bold text-sm transition-all border border-slate-700 hover:border-cyan-500/50">
              <RefreshCw className={`w-5 h-5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{refreshing ? "Güncelleniyor..." : "Güncelle"}</span>
            </button>
            <button onClick={onClose} className="p-2 sm:p-2.5 bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20" title="Kapat">
              <X className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* İÇERİK KISMI (Kaydırılabilir Alan) */}
        <div className="overflow-y-auto p-4 sm:p-8 flex-1 custom-scrollbar text-white">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-cyan-500 h-10 w-10" />
            </div>
          ) : errorMsg ? (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm mb-6 flex justify-between items-center">
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-300">✕</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center p-12 bg-slate-800/20 border border-slate-700/50 rounded-2xl mt-10">
              <p className="text-slate-400 text-sm">Henüz kayıtlı bir siparişiniz bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 pb-10">
              {orders.map((order: any) => {
                const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
                const currentStep = getStepNumber(order); 
                const adminMesaji = order.musteriMesaji || order.mesaj || order.adminMesaj || order.siparisNotu || order.kargoNotu || order.kargoTakipNo;

                return (
                  <div key={order._id} className="border border-slate-700/50 bg-slate-800/30 rounded-2xl p-4 sm:p-6 relative group hover:border-slate-600 transition-all">
                    
                    <button
                      onClick={() => setOrderToDelete(order._id)}
                      className="absolute top-4 right-4 p-2 sm:p-2.5 text-slate-500 hover:text-red-400 bg-slate-800/80 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all z-20"
                      title="Siparişi Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/50 pr-16 sm:pr-20">
                      <div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          Sipariş No: <span className="text-slate-200 font-bold">{currentSiparisKodu}</span>
                          <button onClick={() => handleCopy(currentSiparisKodu)} className="text-slate-400 hover:text-cyan-400 transition-colors bg-slate-700/50 p-1.5 rounded-md">
                            {copiedCode === currentSiparisKodu ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Tarih: <span className="text-slate-300">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-600 font-bold">
                          {order.paymentMethod || "Havale / EFT"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-8 pb-4 px-0 sm:px-8">
                      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                        <div className="absolute left-0 top-4 w-full h-1 bg-slate-700 -z-10"></div>
                        <div 
                          className="absolute left-0 top-4 h-1 bg-cyan-400 -z-10 transition-all duration-700 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                        ></div>

                        {steps.map((step) => {
                          const isCompleted = currentStep >= step.num;
                          return (
                            <div key={step.num} className="flex flex-col items-center gap-2 sm:gap-3 relative z-10">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all duration-500 ${
                                isCompleted ? "bg-cyan-500 border-cyan-400 text-[#050B14] shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "bg-slate-800 border-slate-600 text-slate-500"
                              }`}>
                                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} /> : step.num}
                              </div>
                              <span className={`text-[8px] sm:text-[11px] font-black tracking-wider text-center max-w-[60px] sm:max-w-none ${
                                isCompleted ? "text-slate-200" : "text-slate-500"
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {adminMesaji && (
                      <div className="mb-4 mt-4 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Mağaza Mesajı / Kargo Notu</p>
                          <p className="text-sm text-slate-200">{adminMesaji}</p>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-700/50 mt-4 pt-6 space-y-4">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between gap-3 sm:gap-4 text-sm">
                          <div className="flex items-center gap-3">
                            {item.image && <img src={item.image} alt={item.title} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-xl bg-slate-800 border border-slate-700"/>}
                            <div>
                              <p className="font-bold text-slate-200 line-clamp-1 sm:line-clamp-none">{item.title}</p>
                              <p className="text-xs text-slate-400 mt-1">{item.quantity} Adet</p>
                            </div>
                          </div>
                          <p className="font-black text-cyan-400 text-sm sm:text-base whitespace-nowrap">
                            {Number(item.price * item.quantity).toLocaleString("tr-TR")} TL
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 flex justify-between items-center bg-slate-800/40 p-4 rounded-xl">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Genel Toplam</span>
                      <span className="text-lg sm:text-xl font-black text-white">
                        {Number(order.totalPrice).toLocaleString("tr-TR")} TL
                      </span>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SİLME ONAY EKRANI */}
        {orderToDelete && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#050B14]/80 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mx-auto mb-6 border border-red-500/20">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Siparişi Sil</h3>
              <p className="text-sm text-slate-400 mb-8">Bu siparişi kalıcı olarak silmek istediğinize emin misiniz? <br/><span className="text-red-400 font-bold mt-1 inline-block">Bu işlem geri alınamaz!</span></p>
              <div className="flex gap-4">
                <button onClick={() => setOrderToDelete(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors">İptal</button>
                <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-black text-white bg-red-500 hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">Evet, Sil</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
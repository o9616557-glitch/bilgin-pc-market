"use client";
import { useEffect, useState } from "react";
// 🚀 MessageSquare ikonunu Admin Mesajı için ekledik!
import { Loader2, Trash2, Copy, Check, RefreshCw, MessageSquare } from "lucide-react"; 

export default function SiparislerimPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
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

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Bu siparişi kalıcı olarak silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter((order) => order._id !== orderId));
      } else {
        alert("Sipariş silinirken arka planda bir hata oluştu.");
      }
    } catch (error) {
      alert("Bağlantı hatası sebebiyle silinemedi.");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Siparişlerim
          </h1>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-xl font-bold text-sm transition-all border border-slate-700 hover:border-cyan-500/50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Güncelleniyor..." : "Durumları Güncelle"}
          </button>
        </div>

        {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm mb-6">
                {errorMsg}
            </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
            <p className="text-slate-400 text-sm">Henüz kayıtlı bir siparişiniz bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {orders.map((order: any) => {
              const currentSiparisKodu = order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase();
              const currentStep = getStepNumber(order); 
              
              // 🚀 SİNSİ MESAJ YAKALAYICI: Admin paneli mesajı hangi isimle yollarsa yollasın yakalar!
              const adminMesaji = order.mesaj || order.adminMesaj || order.adminMesaji || order.siparisNotu || order.kargoNotu || order.not || order.kargoTakipNo || order.kargoKodu;

              return (
                <div key={order._id} className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 backdrop-blur-sm relative group hover:border-slate-700/80 transition-all">
                  
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="absolute top-4 right-4 p-2.5 text-slate-500 hover:text-red-400 bg-slate-800/50 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all opacity-80 group-hover:opacity-100 z-20"
                    title="Siparişi Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/50 pr-20">
                    <div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        Sipariş No: <span className="text-slate-300 font-bold">{currentSiparisKodu}</span>
                        <button 
                          onClick={() => handleCopy(currentSiparisKodu)}
                          className="text-slate-400 hover:text-cyan-400 transition-colors bg-slate-800/50 p-1.5 rounded-md"
                          title="Kodu Kopyala"
                        >
                          {copiedCode === currentSiparisKodu ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Tarih: <span className="text-slate-400">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 font-bold">
                        {order.paymentMethod || "Havale / EFT"}
                      </span>
                    </div>
                  </div>

                  {/* GÖRSEL KARGO TAKİP MOTURU */}
                  <div className="pt-8 pb-4 px-2 sm:px-8">
                    <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                      <div className="absolute left-0 top-4 w-full h-1 bg-slate-800 -z-10"></div>
                      <div 
                        className="absolute left-0 top-4 h-1 bg-cyan-400 -z-10 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                      ></div>

                      {steps.map((step) => {
                        // 🚀 4. ADIM TİK DÜZELTMESİ BURADA! Eğer 4. adımdaysa orası artık tik (✔) olur!
                        const isCompleted = currentStep > step.num || (currentStep === 4 && step.num === 4);
                        const isCurrent = currentStep === step.num && currentStep !== 4;

                        return (
                          <div key={step.num} className="flex flex-col items-center gap-3 relative z-10">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all duration-500 ${
                              isCompleted ? "bg-cyan-500 border-cyan-400 text-[#050B14] shadow-[0_0_15px_rgba(34,211,238,0.5)]" : 
                              isCurrent ? "bg-[#050B14] border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]" : 
                              "bg-slate-900 border-slate-700 text-slate-500"
                            }`}>
                              {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} /> : step.num}
                            </div>
                            <span className={`text-[9px] sm:text-[11px] font-black tracking-wider text-center max-w-[80px] sm:max-w-none transition-colors duration-500 ${
                              isCompleted || isCurrent ? "text-slate-200" : "text-slate-600"
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 🚀 EFSANE ÖZEL MESAJ KUTUSU: Sadece mesaj varsa görünür */}
                  {adminMesaji && (
                    <div className="mx-2 sm:mx-8 mb-4 mt-2 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                      <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Mağaza Mesajı / Kargo Notu</p>
                        <p className="text-sm text-slate-200">{adminMesaji}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-slate-800/50 mt-4 pt-6 space-y-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl bg-slate-800 border border-slate-700/50"/>
                          )}
                          <div>
                            <p className="font-bold text-slate-200">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.quantity} Adet</p>
                          </div>
                        </div>
                        <p className="font-black text-cyan-400 text-base">
                          {Number(item.price * item.quantity).toLocaleString("tr-TR")} TL
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 flex justify-between items-center bg-slate-800/20 p-4 rounded-xl">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Genel Toplam</span>
                    <span className="text-xl font-black text-white">
                      {Number(order.totalPrice).toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
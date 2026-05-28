"use client";

import { useEffect, useState } from "react";
import { Trash2, Copy, Check, RefreshCw, MessageSquare, PackageOpen, Info } from "lucide-react"; 
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
      const res = await fetch("/api/orders?t=" + new Date().getTime(), { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch (error) {
      setErrorMsg("Bağlantı hatası.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

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
        setErrorMsg("Sipariş silinirken hata oluştu.");
        setOrderToDelete(null);
      }
    } catch (error) {
      setErrorMsg("Bağlantı hatası.");
      setOrderToDelete(null);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStepNumber = (order: any) => {
    const s = (order.durum || order.status || "").toLowerCase();
    if (s.includes("iptal")) return 5;
    if (s.includes("teslim") || s.includes("tamam")) return 4;
    if (s.includes("kargo") || s.includes("gönder")) return 3;
    if (s.includes("hazırla") || s.includes("öden") || s.includes("başarılı")) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      {/* SİBER IŞIKLAR */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] mb-10 drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          Sipariş Geçmişim
        </h1>
        
        {loading ? (
          <div className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Yükleniyor...</div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const step = getStepNumber(order);
              const siparisKodu = order._id.slice(-8).toUpperCase();

              return (
                <div key={order._id} className="group border border-slate-800 bg-[#09090b] rounded-2xl p-6 sm:p-8 shadow-xl relative transition-all hover:border-[#00e5ff]/30">
                  
                  {/* SİLME İKONU */}
                  <button
                    onClick={() => handleDeleteClick(order._id)}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 bg-[#121215] border border-slate-800 rounded-lg transition-all z-20"
                    title="Siparişi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* SİPARİŞ NO VE KOPYALAMA İKONU */}
                  <div className="flex items-center gap-3 mb-6 pr-10">
                    <span className="text-xs font-black text-slate-500 tracking-widest uppercase">SİPARİŞ NO:</span>
                    <span className="text-lg font-black text-[#00e5ff] tracking-wider">{siparisKodu}</span>
                    <button 
                      onClick={() => handleCopy(siparisKodu)} 
                      className="p-1.5 bg-[#121215] border border-slate-800 rounded-lg text-slate-400 hover:text-[#00e5ff] transition-all"
                      title="Kodu Kopyala"
                    >
                      {copiedCode === siparisKodu ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* DURUM ALANI */}
                  {step === 5 ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-center gap-2 text-amber-500 font-black uppercase text-sm tracking-widest mb-6">
                      <Info className="w-5 h-5" /> SİPARİŞ İPTAL EDİLDİ
                    </div>
                  ) : (
                    <div className="relative flex justify-between w-full mx-auto mb-6">
                       <div className="text-cyan-400 font-bold uppercase text-xs tracking-widest bg-[#121215] border border-slate-800 px-4 py-2 rounded-lg">
                         Durum: {order.durum || order.status || "İşleniyor"}
                       </div>
                    </div>
                  )}

                  {/* ÜRÜN RESMİ VE BAŞLIKLARI (HATA YARATAN KISIM GÜVENLİ HALE GETİRİLDİ) */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-slate-800/80 pt-4 mt-2 space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 bg-[#121215] border border-slate-800/50 p-3 rounded-xl">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-12 h-12 object-contain rounded-lg border border-slate-700 bg-[#09090b] p-1" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg border border-slate-700 bg-[#09090b] flex items-center justify-center">
                              <PackageOpen className="w-5 h-5 text-slate-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-slate-200 text-sm line-clamp-1">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{item.quantity} Adet</span>
                              <span className="text-xs font-black text-[#00e5ff]">{item.price ? item.price + " TL" : ""}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SİLME ONAY MODALI */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#09090b] border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4 bg-[#121215] rounded-full p-2 border border-slate-800" />
            <h3 className="text-lg font-black uppercase text-white mb-2">Siparişi Sil</h3>
            <p className="text-sm text-slate-400 mb-6 font-medium">Bu siparişi kalıcı olarak silmek istiyor musunuz?</p>
            <div className="flex gap-3">
              <button onClick={() => setOrderToDelete(null)} className="flex-1 py-3 bg-[#121215] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold uppercase transition-all">İptal</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white text-xs font-black uppercase transition-all shadow-lg">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
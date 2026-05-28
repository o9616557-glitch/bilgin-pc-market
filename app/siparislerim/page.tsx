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

  // SADECE SİLME İŞLEMİ İÇİN GEREKLİ OLAN MOTOR (SİLME İKONU İSTEDİĞİN İÇİN EKLENDİ)
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

  // SENİN BİREBİR KENDİ MOTORUN (DOKUNULMADI)
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-8">Sipariş Geçmişim</h1>
        {loading ? (<div>Yükleniyor...</div>) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const step = getStepNumber(order);
              return (
                <div key={order._id} className="border border-slate-800 bg-[#09090b] rounded-2xl p-6 shadow-xl relative">
                  
                  {/* SİLME İKONU BURAYA EKLENDİ */}
                  <button
                    onClick={() => handleDeleteClick(order._id)}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 transition-colors"
                    title="Siparişi Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {step === 5 ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-center gap-2 text-amber-500 font-black uppercase text-sm">
                      <Info className="w-5 h-5" /> SİPARİŞ İPTAL EDİLDİ
                    </div>
                  ) : (
                    <div className="relative flex justify-between w-full max-w-xl mx-auto mb-6">
                       {/* Senin orijinal ilerleme çubuğu kodlarını buraya yerleştirebilirsin */}
                       <div className="text-cyan-400 font-bold uppercase text-xs tracking-widest">Durum: {order.durum || order.status}</div>
                    </div>
                  )}
                  
                  <div className="text-slate-400 text-sm mt-4">Sipariş No: {order._id.slice(-8).toUpperCase()}</div>

                  {/* ÜRÜN RESMİ VE BAŞLIĞI BURAYA EKLENDİ (SADE TASARIM) */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-slate-800 pt-4 mt-4 space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-12 h-12 object-contain rounded-md border border-slate-800 bg-[#121215] p-1" />
                          ) : (
                            <div className="w-12 h-12 rounded-md border border-slate-800 bg-[#121215] flex items-center justify-center">
                              <PackageOpen className="w-5 h-5 text-slate-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-200 text-sm line-clamp-1">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.quantity} Adet - {item.price} TL</p>
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

      {/* SİLME İŞLEMİ İÇİN GEREKLİ ONAY PENCERESİ */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#09090b] border border-slate-800 rounded-2xl p-6 w-full max-w-sm text-center">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Siparişi Sil</h3>
            <p className="text-sm text-slate-400 mb-6">Bu siparişi kalıcı olarak silmek istiyor musunuz?</p>
            <div className="flex gap-3">
              <button onClick={() => setOrderToDelete(null)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold">İptal</button>
              <button onClick={confirmDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-bold">Sil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
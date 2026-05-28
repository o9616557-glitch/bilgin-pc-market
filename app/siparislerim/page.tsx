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
                <div key={order._id} className="border border-slate-800 bg-[#09090b] rounded-2xl p-6 shadow-xl">
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
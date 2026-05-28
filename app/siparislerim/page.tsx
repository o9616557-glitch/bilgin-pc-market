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
      const res = await fetch("/api/orders?t=" + new Date().getTime(), { 
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
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

  useEffect(() => { fetchOrders(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(); 
  };

  const handleDeleteClick = (orderId: string) => { setOrderToDelete(orderId); };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      const res = await fetch("/api/orders?id=" + orderToDelete, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter((order) => order._id !== orderToDelete));
        setOrderToDelete(null); 
      }
    } catch (error) {
      setErrorMsg("Silinemedi.");
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
    if (s.includes("iptal")) return 5; // 5 = İptal
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
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#00e5ff] transition-all mb-3">Mağazaya Geri Dön</Link>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff]">SİPARİŞ</span> GEÇMİŞİM
            </h1>
          </div>
          <button onClick={handleRefresh} className="flex items-center gap-2 bg-[#09090b] hover:bg-[#121215] text-[#00e5ff] px-5 py-3 rounded-xl font-bold text-xs uppercase transition-all border border-slate-800">
            <RefreshCw className={"w-4 h-4 " + (refreshing ? "animate-spin" : "")} /> Durumları Güncelle
          </button>
        </div>

        {loading ? (<div>Yükleniyor...</div>) : orders.length === 0 ? (<div>Sipariş bulunamadı.</div>) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order: any) => {
              const currentStep = getStepNumber(order);
              const isCancelled = currentStep === 5;

              return (
                <div key={order._id} className="group border border-slate-800 bg-[#09090b] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="pt-8 pb-6 px-2 sm:px-8">
                    {isCancelled ? (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-center gap-2 text-amber-500 font-black uppercase tracking-widest text-sm shadow-inner">
                        <Info className="w-5 h-5" /> SİPARİŞ İPTAL EDİLDİ
                      </div>
                    ) : (
                      <div className="relative flex items-start justify-between w-full max-w-3xl mx-auto">
                        <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-1 bg-[#121215] border-y border-slate-800 -z-10 rounded-full"></div>
                        <div className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-gradient-to-r from-[#00e5ff] to-[#0088ff] -z-10 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(0,229,255,0.6)] rounded-full" style={{ width: (((currentStep - 1) / 3) * 100) + "%" }}></div>
                        {steps.map((step) => (
                          <div key={step.num} className="flex flex-col items-center gap-3 relative z-10 w-20">
                            <div className={"w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 " + (currentStep >= step.num ? "bg-[#00e5ff] border-[#00e5ff] text-black" : "bg-[#09090b] border-slate-700 text-slate-500")}>
                              {currentStep >= step.num ? <Check className="w-4 h-4" /> : step.num}
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500">{step.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
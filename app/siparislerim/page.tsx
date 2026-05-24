"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Loader2, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  _id: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: {
    title: string;
    city: string;
    district: string;
  };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function SiparislerimPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders);
        } else if (res.status === 401) {
          toast.error("Siparişlerinizi görmek için giriş yapmalısınız.");
        }
      } catch (error) {
        toast.error("Siparişler yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hazırlanıyor": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Kargoya Verildi": return "text-[#00e5ff] bg-[#00e5ff]/10 border-[#00e5ff]/20";
      case "Teslim Edildi": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "İptal Edildi": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="mb-8 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            SİPARİŞLERİM
          </h1>
          <p className="text-slate-400 text-sm mt-1">Geçmiş siparişlerinizi ve kargo durumlarını buradan takip edebilirsiniz.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#00e5ff] animate-spin" />
            <p className="text-slate-400">Sipariş geçmişiniz yükleniyor...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#09090b] border border-white/10 rounded-3xl">
            <Package className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Henüz Siparişiniz Yok</h2>
            <p className="text-slate-400 mb-6">Sistemimizde kayıtlı herhangi bir siparişiniz bulunmamaktadır.</p>
            <Link href="/" className="bg-[#00e5ff] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00c4db] transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden">
                
                <div className="bg-white/5 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10">
                  <div className="flex flex-wrap gap-4 md:gap-8">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Sipariş Tarihi</p>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#00e5ff]" />
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Toplam Tutar</p>
                      <p className="text-sm font-bold text-[#00e5ff]">{order.totalPrice.toLocaleString('tr-TR')} TL</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">Teslimat</p>
                      <p className="text-sm font-medium flex items-center gap-1.5 text-slate-300">
                        <MapPin size={14} className="text-slate-400" />
                        {order.shippingAddress?.district} / {order.shippingAddress?.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">Sipariş No: <span className="text-slate-300">{order._id.slice(-8).toUpperCase()}</span></p>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex flex-col gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="w-16 h-16 bg-[#050814] border border-white/10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={24} className="text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-white truncate" title={item.title}>{item.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">{item.quantity} Adet</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
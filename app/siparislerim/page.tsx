"use client";
import { useEffect, useState } from "react";

export default function SiparislerimPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Siparişleri sunucudan çeker
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
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🚀 ŞEFİM SİLME TETİKLEYİCİSİ: Tıklayınca hem veritabanından siler hem ekrandan uçurur
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Bu siparişi tamamen silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Ekrondaki listeden anında kaldırır
        setOrders(orders.filter((order) => order._id !== orderId));
      } else {
        alert("Sipariş silinirken arka planda bir hata oluştu.");
      }
    } catch (error) {
      alert("Bağlantı hatası sebebiyle silinemedi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black uppercase tracking-wider mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Siparişlerim
        </h1>

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
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order: any) => (
              <div 
                key={order._id} 
                className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 backdrop-blur-sm relative hover:border-slate-700/80 transition-all group"
              >
                {/* 🚀 ŞEFİN SİLME SİMGESİ (KARTIN SAĞ ÜST KÖŞESİNDE) */}
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 bg-slate-800/30 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all opacity-80 group-hover:opacity-100"
                  title="Siparişi Sil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6.614m-5.788 0L8.26 9m4.343-4.484-1.313-1.313m0 0L8.928 3.5M10.612 3.5h2.776m-4.777 0h6.778m-11.33 0L4.5 18.75a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25L19.5 7.5m-15 0h15" />
                  </svg>
                </button>

                {/* Üst Bilgiler */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/50 pr-8">
                  <div>
                    {/* BPC Kodu Öncelikli Sipariş Numarası */}
                    <p className="text-xs text-slate-500 mt-1">
                      Sipariş No: <span className="text-slate-300 font-bold">{order.siparisKodu || order.orderNumber || order._id.slice(-8).toUpperCase()}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tarih: <span className="text-slate-400">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                    </p>
                  </div>

                  {/* Durum Rozeti */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-700 font-medium">
                      {order.paymentMethod || "Havale / EFT"}
                    </span>
                    <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg font-bold">
                      {order.status || "Hazırlanıyor"}
                    </span>
                  </div>
                </div>

                {/* Ürün Listesi */}
                <div className="mt-4 space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-10 h-10 object-cover rounded-xl bg-slate-800 border border-slate-700/50"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-200">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.quantity} Adet</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-300">
                        {Number(item.price * item.quantity).toLocaleString("tr-TR")} TL
                      </p>
                    </div>
                  ))}
                </div>

                {/* Genel Toplam */}
                <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Genel Toplam</span>
                  <span className="text-lg font-black text-blue-400">
                    {Number(order.totalPrice).toLocaleString("tr-TR")} TL
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// 🎯 VERCEL'İN ARADIĞI KRİTİK SATIR BURASI: "export default" kesinlikle olmalı!
export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    setLoading(false);
  }, []);

  const updateQty = (id: number, delta: number) => {
    const updated = cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart, customerDetails: { first_name: "Ziyaretçi" } })
      });
      const data = await res.json();
      if (data.paymentUrl) {
        localStorage.setItem("cart", "[]");
        window.location.href = data.paymentUrl;
      } else { 
        alert("Kasa bağlantısı başarısız."); 
      }
    } catch (e) { 
      alert("Sistem hatası."); 
    }
    setCheckoutLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-[#050814] flex items-center justify-center text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#050814] text-white py-12 px-4 sm:px-8 font-medium">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-10 border-b border-white/5 pb-6">🛒 Sepetim</h1>
        
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-[#0b1329]/60 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                  <img src={item.image} className="w-20 h-20 object-contain bg-white/5 rounded-lg" alt={item.name} />
                  <div className="flex-1">
                    <h2 className="text-sm font-bold uppercase line-clamp-1">{item.name}</h2>
                    <p className="text-blue-400 font-black mt-1">{Number(item.price).toLocaleString('tr-TR')} TL</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#050814] p-1 rounded-lg border border-white/10">
                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:text-blue-500">-</button>
                    <span className="font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:text-blue-500">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500/50 hover:text-red-500 text-xs uppercase font-black px-2">Kaldır</button>
                </div>
              ))}
            </div>

            <div className="bg-[#0b1329] border border-blue-500/20 p-6 rounded-2xl h-fit shadow-2xl">
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4">Sipariş Özeti</h2>
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-300">Toplam Tutarı:</span>
                <span className="text-2xl font-black text-blue-400">{total.toLocaleString('tr-TR')} TL</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs disabled:opacity-50 transition-all shadow-lg"
              >
                {checkoutLoading ? "Kasa Hazırlanıyor..." : "🔒 Güvenli Ödemeye Geç"}
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-4 uppercase font-bold">💳 256-Bit SSL ile Şifrelenmiş Ödeme</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#0b1329]/20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500 font-black uppercase tracking-widest mb-6">Sepetin henüz boş şef!</p>
            <Link href="/" className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl hover:bg-white/10 transition-all font-black uppercase text-xs">Alışverişe Başla</Link>
          </div>
        )}
      </div>
    </div>
  );
}
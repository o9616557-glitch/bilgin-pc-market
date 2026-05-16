"use client";

import React, { useState } from "react";
import Link from "next/navigation";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrderData(null);

    try {
      const res = await fetch("/api/siparis-takip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      const data = await res.json();

      if (res.ok) {
        setOrderData(data.order);
      } else {
        setError(data.error || "Sipariş bilgileri getirilemedi.");
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // WooCommerce durumlarını Türkçe'ye ve görsel aşamalara (1-4) çeviren motor
  const getTrackingStep = (status: string) => {
    switch (status) {
      case "pending": case "on-hold": return { step: 1, text: "Sipariş Alındı", color: "text-blue-500 border-blue-500/30 bg-blue-500/10" };
      case "processing": return { step: 2, text: "Hazırlanıyor", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" };
      case "completed": return { step: 4, text: "Teslim Edildi", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" };
      case "cancelled": return { step: 0, text: "İptal Edildi", color: "text-rose-500 border-rose-500/30 bg-rose-500/10" };
      default: return { step: 3, text: "Kargoya Verildi", color: "text-purple-500 border-purple-500/30 bg-purple-500/10" };
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050810] relative overflow-hidden font-sans text-white">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10 bg-[#0b1120] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        
        {isLoading && (
          <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
               <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sipariş Aranıyor...</span>
          </div>
        )}

        {/* BAŞLIK ALANI */}
        <div className="text-center mb-8">
          <div className="text-4xl font-black italic tracking-tighter uppercase">
            BİLGİN<span className="text-blue-500 not-italic">PC</span>
          </div>
          <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
          <h1 className="text-xl font-black uppercase tracking-widest mt-6">Sipariş Takibi</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* SORGULAMA FORMU */}
        {!orderData && (
          <form onSubmit={handleTrack} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Sipariş Numarası</label>
              <input 
                type="text" 
                required 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)} 
                placeholder="Örn: 4592" 
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Fatura E-Posta Adresi</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="posta@adresiniz.com" 
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800" 
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              Siparişi Sorgula
            </button>
          </form>
        )}

        {/* 🌟 CANLI SİPARİŞ SONUÇ PANELİ */}
        {orderData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* ÜST BİLGİ ŞERİDİ */}
            <div className="p-5 bg-[#050810] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Sipariş No</span>
                <span className="text-sm font-black text-white italic">#{orderData.id}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Toplam Tutar</span>
                <span className="text-sm font-black text-blue-500">{orderData.total} {orderData.currency}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Mevcut Durum</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border block mt-0.5 ${getTrackingStep(orderData.status).color}`}>
                  {getTrackingStep(orderData.status).text}
                </span>
              </div>
            </div>

            {/* 🚀 NEON GÖRSEL ZAMAN ÇİZELGESİ (PROGRESS TIMELINE) */}
            {orderData.status !== "cancelled" && (
              <div className="py-4 px-2">
                <div className="relative flex items-center justify-between w-full">
                  {/* Arka plandaki sönük hat */}
                  <div className="absolute left-0 right-0 h-0.5 bg-white/5 z-0"></div>
                  {/* Ön plandaki ilerleyen neon çizgi */}
                  <div 
                    className="absolute left-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6] z-0 transition-all duration-500"
                    style={{ width: `${((getTrackingStep(orderData.status).step - 1) / 3) * 100}%` }}
                  ></div>

                  {/* AŞAMALAR */}
                  {[1, 2, 3, 4].map((index) => {
                    const currentStep = getTrackingStep(orderData.status).step;
                    const isDone = currentStep >= index;
                    const labels = ["Alındı", "Hazırlanıyor", "Kargoda", "Teslim Edildi"];
                    
                    return (
                      <div key={index} className="relative z-10 flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${isDone ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_#3b82f6]" : "bg-[#050810] border-white/5 text-slate-600"}`}>
                          {isDone ? "✓" : index}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider mt-2 hidden sm:block ${isDone ? "text-white" : "text-slate-600"}`}>
                          {labels[index - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SATIN ALINAN DONANIMLAR */}
            <div className="p-6 bg-[#050810] border border-white/5 rounded-2xl space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Paketteki Donanımlar</div>
              {orderData.line_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-xs py-1">
                  <div className="text-white font-bold uppercase">{item.name} <span className="text-blue-500 font-black ml-1">x{item.quantity}</span></div>
                  <div className="text-slate-400 font-black">{item.total} TL</div>
                </div>
              ))}
            </div>

            {/* YENİDEN SORGULAMA BUTONU */}
            <button 
              onClick={() => setOrderData(null)}
              className="w-full py-3.5 bg-white/5 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Başka Bir Sipariş Sorgula
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
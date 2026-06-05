"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, MapPin, Info, Phone, MessageCircle } from "lucide-react";

export default function AkilliAsistan() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Asistan açıldığında ilk mesajı atar
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ text: "Merhaba! Bilgin PC Akıllı Asistanı ben. 🤖 Size nasıl yardımcı olabilirim?", isBot: true }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen]);

  const handleAction = (action: string) => {
    let botReply = "";
    if (action === "siparis") botReply = "Siparişinizi takip etmek için 'Sipariş Takip' sayfamıza gidebilirsiniz. SP- ile başlayan kodunuz yanınızda mı?";
    if (action === "kargo") botReply = "Saat 16:00'ya kadar verilen siparişler aynı gün kargoya verilir! 🚚";
    if (action === "canli") botReply = "Sizi hemen WhatsApp destek hattımıza aktarıyorum. Müşteri temsilcimiz 1 dakika içinde sizinle olacak!";

    setMessages((prev) => [...prev, { text: action.toUpperCase(), isBot: false }]);
    
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botReply, isBot: true }]);
      setIsTyping(false);
      if (action === "canli") {
        window.open("https://wa.me/908503055968", "_blank");
      }
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      {/* 🚀 ASİSTAN BUTONU (Neon Mavi) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#3b82f6] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-110 transition-all group"
        >
          <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-2 -left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">1</span>
        </button>
      )}

      {/* 🤖 CHAT PENCERESİ */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-[#3b82f6] p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-lg">🤖</div>
              <div>
                <p className="text-black font-black text-xs uppercase tracking-widest">AKILLI ASİSTAN</p>
                <p className="text-black/60 text-[10px] font-bold uppercase">Online & Hazır</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-black/60 hover:text-black">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${
                  msg.isBot ? "bg-white/5 text-white border border-white/10" : "bg-[#3b82f6] text-black font-bold"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-white/5 bg-[#050814]">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Hızlı İşlemler</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleAction("siparis")} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all flex items-center gap-2">
                <MapPin size={12} /> SİPARİŞİM NEREDE?
              </button>
              <button onClick={() => handleAction("kargo")} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all flex items-center gap-2">
                <Info size={12} /> KARGO BİLGİSİ
              </button>
              <button onClick={() => handleAction("canli")} className="px-3 py-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-lg text-[10px] font-black text-[#3b82f6] hover:bg-[#3b82f6] hover:text-black transition-all flex items-center gap-2 w-full justify-center">
                <MessageCircle size={14} /> CANLI DESTEĞE BAĞLAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


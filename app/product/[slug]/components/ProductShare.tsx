"use client";

import React, { useState } from "react";

export default function ProductShare() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: "wp" | "x") => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      if (platform === "wp") window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank");
      else window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
    }
  };

  return (
    <div className="flex items-center gap-3 mb-4 bg-[#050814]/30 border border-white/5 p-2 rounded-md w-max shadow-inner">
      <span className="text-[10px] font-bold uppercase text-slate-500">Paylaş:</span>
      <div className="flex items-center gap-2">
        {/* 🚀 DAHA ANLAŞILIR KOPYALA BUTONU */}
        <button 
          type="button" 
          onClick={handleCopy} 
          title="Bağlantıyı Kopyala"
          className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11px] font-bold cursor-pointer transition-all ${copied ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white'}`}
        >
          {copied ? "✅ Kopyalandı" : "🔗 Kopyala"}
        </button>
        
        <button type="button" onClick={() => handleShare("wp")} title="WhatsApp'ta Paylaş" className="w-7 h-7 rounded-md bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center text-[10px] font-black text-green-400 cursor-pointer transition-all">WP</button>
        <button type="button" onClick={() => handleShare("x")} title="X'te (Twitter) Paylaş" className="w-7 h-7 rounded-md bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400 cursor-pointer transition-all">X</button>
      </div>
    </div>
  );
}
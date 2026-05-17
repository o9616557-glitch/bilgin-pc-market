import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex flex-col items-center justify-center text-white">
      
      {/* RGB / Neon Işıklı Çift Çark Animasyonu */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute w-14 h-14 border-4 border-emerald-500/10 border-b-emerald-400 rounded-full animate-spin [animation-direction:reverse]"></div>
        {/* Ortada parıldayan bir çekirdek ışık efekti */}
        <div className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
      </div>
      
      {/* Canlı ve Parlayan Kurumsal Marka Yazısı */}
      <h3 className="text-xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-slate-400 animate-pulse">
        BİLGİN PC MARKET
      </h3>
      
      {/* Alt Bilgi Yazısı */}
      <p className="text-xs font-bold text-slate-500 tracking-wider mt-2 uppercase">
        Sistem ve Bileşenler Yükleniyor...
      </p>

    </div>
  );
}
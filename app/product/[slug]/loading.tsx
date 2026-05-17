import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050810] flex flex-col items-center justify-center text-white">
      {/* Şık ve Dönen Teknoloji Çarkı */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute w-10 h-10 border-4 border-emerald-500/10 border-b-emerald-400 rounded-full animate-spin [animation-direction:reverse]"></div>
      </div>
      
      {/* Kullanıcıya Bilgi Veren Canlı Yazı */}
      <h3 className="text-lg font-bold tracking-wide uppercase text-slate-200 animate-pulse">
        Sefim Urun Hazirlaniyor...
      </h3>
      <p className="text-xs text-slate-500 mt-1">Sistem saliseler icinde baglaniyor</p>
    </div>
  );
}
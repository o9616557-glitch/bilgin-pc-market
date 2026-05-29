import React from "react";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-24 px-4 relative overflow-hidden font-sans">
      
      {/* SİBER NEON ARKA PLAN IŞIKLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e5ff] blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#0088ff] blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ÜST PANEL SKELETON */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-700 pb-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 opacity-50">
              <ArrowLeft className="w-4 h-4" /> Mağazaya Geri Dön
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              KAYITLI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#0088ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">ADRESLERİM</span>
            </h1>
          </div>
          {/* YENİ ADRES EKLE Butonu Hayaleti (Hafif Siyan Tonunda) */}
          <div className="w-48 h-12 bg-[#00e5ff]/20 rounded-xl animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.1)]"></div>
        </div>

        {/* 🚀 2 ADET ADRES KARTI HAYALETİ (Aydınlatılmış Renkler) */}
        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="border border-slate-700 bg-slate-800/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col gap-4">
              
              {/* Başlık ve Düzenle/Sil İkonları */}
              <div className="flex justify-between items-center border-b border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  {/* Konum İkonu Hayaleti */}
                  <div className="w-5 h-5 bg-slate-500/50 rounded-full animate-pulse"></div>
                  {/* Ev/İş Yazısı Hayaleti */}
                  <div className="w-16 h-5 bg-slate-500/50 rounded-md animate-pulse"></div>
                </div>
                {/* Sağdaki Düzenle/Sil İkonları Hayaleti */}
                <div className="flex gap-4">
                  <div className="w-5 h-5 bg-slate-500/50 rounded animate-pulse"></div>
                  <div className="w-5 h-5 bg-slate-500/50 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Varsayılan / Fatura Adresi Etiketi Hayaleti */}
              <div className="w-28 h-7 bg-slate-500/50 rounded-md animate-pulse mt-1"></div>

              {/* Adres Detay Yazıları Hayaleti */}
              <div className="flex flex-col gap-3 mt-3">
                {/* İsim */}
                <div className="w-32 h-4 bg-slate-500/50 rounded-md animate-pulse"></div>
                {/* Telefon */}
                <div className="w-24 h-4 bg-slate-500/50 rounded-md animate-pulse"></div>
                {/* Açık Adres Satırları */}
                <div className="w-full sm:w-3/4 h-4 bg-slate-500/50 rounded-md animate-pulse mt-2"></div>
                {/* Ülke / Şehir */}
                <div className="w-32 h-4 bg-slate-500/50 rounded-md animate-pulse"></div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
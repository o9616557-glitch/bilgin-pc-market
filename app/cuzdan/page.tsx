"use client";

import React from "react";
import Link from "next/link";
import { 
  User, ShieldCheck, CreditCard, Plus, Receipt, Download, 
  CheckCircle2, XCircle, CreditCard as CardIcon, ChevronRight
} from "lucide-react";

export default function CuzdanPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-clip font-medium">
      
      {/* 🚀 DEEP SEA NEON: Pembe tamamen imha edildi, derin okyanus mavisi ışık sızması geldi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-blue-600 blur-[250px] opacity-[0.03] pointer-events-none rounded-full"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-8 relative z-10 items-start">
        
        {/* 🗂️ SOL MENÜ (Güvenlik paneliyle birebir simetrik) */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 static lg:sticky lg:top-28 z-10">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
            <nav className="flex flex-col gap-1.5">
              <Link href="/hesabim" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Profil
              </Link>
              {/* Buranın linkini /cuzdan yaptık ki aktif basılı kalsın */}
              <Link href="/cuzdan" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold shadow-inner transition-all text-sm sm:text-base">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> Dijital Cüzdanım
              </Link>
              <Link href="/guvenlik" className="flex items-center gap-3 px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Güvenlik
              </Link>
            </nav>
          </div>
        </div>

        {/* 🛡️ SAĞ İÇERİK - CÜZDAN MERKEZİ */}
        <div className="flex-1 flex flex-col min-w-0 gap-5 lg:gap-6 w-full">
          
          {/* ÜST BAŞLIK KUTUSU */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 blur-[50px] pointer-events-none rounded-full"></div>
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#020617] border border-cyan-500/20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.1)] shrink-0">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-0.5 sm:mb-1">Dijital Cüzdanım</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Kayıtlı kartlarınızı ve geçmiş faturalarınızı güvenle yönetin.</p>
              </div>
            </div>
          </div>

          {/* İKİLİ PANEL İSKELETİ */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
            
            {/* 💳 KARTLARIM (SOL PANEL) */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col h-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
                <CardIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Kayıtlı Kartlarım</h2>
              </div>

              <div className="flex flex-col gap-4">
                
                {/* 🚀 KARBON SİYAHI VE LÜKS GECE MAVİSİ KART */}
                <div className="relative w-full aspect-[1.6/1] max-w-sm mx-auto sm:mx-0 rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:scale-[1.01] shadow-[0_15px_35px_-15px_rgba(6,182,212,0.15)]">
                  {/* Ağır Karbon / Titanyum Geçişi */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#030712] to-blue-950"></div>
                  {/* Safir Işığı */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[35px] rounded-full transform translate-x-8 -translate-y-8"></div>
                  <div className="absolute inset-0 border border-slate-800 group-hover:border-cyan-500/20 rounded-2xl transition-colors duration-500"></div>

                  {/* Kart Üst Bölüm */}
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">VARSAYILAN</div>
                    <div className="flex gap-1 opacity-60">
                      <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-600 -ml-3 backdrop-blur-sm"></div>
                    </div>
                  </div>

                  {/* Kart Numarası */}
                  <div className="relative z-10 mt-auto">
                    <div className="text-base sm:text-xl font-mono font-medium tracking-[0.15em] sm:tracking-[0.2em] text-slate-300 mb-3">
                      **** **** **** 1453
                    </div>
                    {/* Kart Sahibi ve SKT */}
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 mb-0.5">KART SAHİBİ</span>
                        <span className="text-xs font-bold tracking-wider text-slate-300">ÖZKAN BİLGİN</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 mb-0.5">SKT</span>
                        <span className="text-xs font-bold tracking-wider text-slate-300">12/28</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ➕ KESİK ÇİZGİLİ YENİ KART EKLE BUTONU */}
                <button className="relative w-full max-w-sm mx-auto sm:mx-0 p-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/20 hover:bg-slate-800/40 hover:border-cyan-500/30 transition-all duration-300 group flex flex-col items-center justify-center gap-2 h-[110px] sm:h-[125px]">
                  <div className="w-9 h-9 rounded-full bg-[#020617] border border-slate-800 group-hover:border-cyan-500/30 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-wider">Yeni Kart Ekle</span>
                </button>

              </div>
            </div>

            {/* 📄 FAURALAR (SAĞ PANEL) */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col h-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Son Harcamalar</h2>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                
                {/* Fatura 1 */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-[#020617] border border-slate-800/60 hover:border-slate-700 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-200 mb-0.5">Premium Paket - Yıllık</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">22 Haziran 2026 • Kart (**1453)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-black text-slate-200">₺2.499,00</p>
                      <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Ödendi</p>
                    </div>
                    <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800/50 hover:bg-cyan-500/10 flex items-center justify-center transition-colors text-slate-500 hover:text-cyan-400 border border-transparent hover:border-cyan-500/20">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Fatura 2 */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-[#020617] border border-slate-800/60 hover:border-slate-700 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-200 mb-0.5">Güvenlik Duvarı Altyapısı</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">15 Mayıs 2026 • Kart (**1453)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-black text-slate-200">₺149,00</p>
                      <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Ödendi</p>
                    </div>
                    <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800/50 hover:bg-cyan-500/10 flex items-center justify-center transition-colors text-slate-500 hover:text-cyan-400 border border-transparent hover:border-cyan-500/20">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Fatura 3 */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-[#020617] border border-slate-800/60 hover:border-slate-700 rounded-xl transition-all group opacity-60 hover:opacity-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shrink-0">
                      <XCircle className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-400 mb-0.5">Ek Depolama Alanı</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">01 Nisan 2026 • Limit Yetersiz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-black text-slate-500 line-through">₺89,00</p>
                      <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">Reddedildi</p>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8"></div>
                  </div>
                </div>

                {/* Alt Link */}
                <button className="mt-auto pt-4 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">
                  Tüm Fatura Geçmişi <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* 🔒 PCI-DSS GÜVENLİK ALANI */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-400 mb-0.5">Uçtan Uca Şifreleme ve PCI-DSS Güvencesi</p>
              <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">Finansal verileriniz bizim sunucularımızda asla saklanmaz. Kart doğrulamaları banka altyapısı üzerinden yüksek güvenlikli 256-bit şifreleme ile doğrudan işlenir.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import Link from 'next/link';

export default function GizlilikPolitikasiPage() {
  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* ÜST MENÜ */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 bg-[#0b1120]/90 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-lg md:text-xl font-black tracking-tighter uppercase italic group">
          BİLGİN <span className="text-blue-600 underline decoration-2 underline-offset-4 group-hover:text-blue-400 transition-colors">PC MARKET</span>
        </Link>
        <Link href="/" className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-blue-600 transition-all">
          ← ANA SAYFAYA DÖN
        </Link>
      </nav>

      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-24 flex-grow">
        
        {/* BAŞLIK */}
        <div className="mb-16 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">VERİ KORUMA PROTOKOLÜ</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            GİZLİLİK <br /> <span className="text-blue-600 italic">POLİTİKAMIZ.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Bilgin PC Market olarak, dijital güvenliğinizi en az sistem performansınız kadar önemsiyoruz. Kişisel verileriniz bizimle tamamen güvende.
          </p>
        </div>

        {/* VERİ KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Toplanan Bilgiler */}
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6">
            <div className="text-blue-500 text-3xl font-black italic">01.</div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">TOPLANAN BİLGİLER</h3>
            <div className="space-y-3 pt-2">
              {[
                "Ad ve soyad bilgisi",
                "Telefon ve e-posta adresi",
                "Teslimat ve fatura adresi",
                "Sipariş ve ödeme detayları"
              ].map((item, i) => (
                <div key={i} className="text-slate-300 font-medium text-sm flex items-center gap-3 border-b border-white/5 pb-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Kullanım Amacı */}
          <div className="p-8 md:p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6">
            <div className="text-blue-500 text-3xl font-black italic">02.</div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">KULLANIM AMACI</h3>
            <div className="space-y-3 pt-2">
              {[
                "Sipariş işlemlerinin yürütülmesi",
                "Kargo ve teslimat süreçleri",
                "Müşteri destek hizmetleri",
                "Yasal yükümlülüklerin sağlanması"
              ].map((item, i) => (
                <div key={i} className="text-slate-300 font-medium text-sm flex items-center gap-3 border-b border-white/5 pb-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Veri Güvenliği */}
          <div className="p-8 md:p-10 bg-blue-600 border border-blue-500 rounded-[3rem] space-y-6 shadow-2xl shadow-blue-600/20">
            <div className="text-white text-3xl font-black italic">03.</div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">VERİ GÜVENLİĞİ</h3>
            <p className="text-blue-50 text-sm font-medium leading-relaxed pt-2">
              Web sitemizde güvenli ödeme altyapıları ve güncel şifreleme protokolleri kullanılmaktadır. Kullanıcı bilgilerinin korunması için teknik ve idari tüm tedbirler eksiksiz uygulanmaktadır.
            </p>
          </div>
        </div>

        {/* ALT DETAYLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Kullanıcı Hakları */}
          <div className="p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6">
             <h4 className="text-2xl font-black text-white uppercase italic">KULLANICI HAKLARI</h4>
             <div className="grid gap-4 pt-2">
                {[
                  "Kişisel verilere erişim talep etme hakkı",
                  "Eksik veya yanlış verilerin düzeltilmesini isteme",
                  "Gerekli durumlarda verilerin silinmesini talep etme",
                  "İlgili mevzuat kapsamında başvuru yapma"
                ].map((text, i) => (
                  <p key={i} className="text-slate-300 text-sm font-medium border-l-2 border-blue-600/50 pl-4 py-1">{text}</p>
                ))}
             </div>
          </div>

          {/* Sonuç Bölümü */}
          <div className="p-8 md:p-10 flex flex-col justify-center items-start bg-[#0d1629] border border-blue-900/40 rounded-[3rem] space-y-6">
             <div className="text-5xl text-blue-500">🛡️</div>
             <h4 className="text-2xl font-black text-white uppercase italic">GÜVENLİ ALIŞVERİŞ</h4>
             <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                Bilgin PC Market, kullanıcı gizliliğini temel bir ilke olarak benimsemekte ve alışveriş deneyimini en yüksek güvenlik standartlarında sürdürülebilir şekilde sağlamayı amaçlamaktadır.
             </p>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 text-center mt-auto">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 BİLGİN PC MARKET – VERİLERİNİZ GÜVENCE ALTINDADIR.
        </p>
      </footer>

    </div>
  );
}
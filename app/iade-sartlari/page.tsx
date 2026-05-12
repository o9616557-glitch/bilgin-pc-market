"use client";

import React from 'react';
import Link from 'next/link';

export default function IadeSartlariPage() {
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
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">TÜKETİCİ HAKLARI VE PROSEDÜR</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            İADE VE DEĞİŞİM <br /> <span className="text-blue-600 italic">ŞARTLARI.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            Bilgin PC Market'ten alınan her ürün, yasal iade haklarınız ve teknik kontrol süreçlerimiz dahilinde güvence altındadır.
          </p>
        </div>

        {/* ANA BÖLÜMLER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Cayma Hakkı & İade Şartı */}
          <div className="p-8 md:p-12 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic border-b-2 border-blue-600 pb-2 inline-block">01. CAYMA HAKKI</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                Satın aldığınız ürünleri teslim tarihinden itibaren 14 gün içerisinde, kutusu açılmamış ve yeniden satılabilir durumda olması şartıyla iade edebilirsiniz.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic border-b-2 border-blue-600 pb-2 inline-block">02. İADE KOŞULLARI</h3>
              <div className="space-y-4">
                {[
                  "Orijinal kutusu ve ambalajı ile gönderilmelidir.",
                  "Eksiksiz aksesuarları ile birlikte iletilmelidir.",
                  "Fatura veya sipariş belgesi pakete eklenmelidir.",
                  "Fiziksel olarak hasarsız durumda olmalıdır."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-300 font-medium text-sm">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* İade Kapsamı Dışı & Süreç */}
          <div className="space-y-8">
            {/* Kapsam Dışı */}
            <div className="p-8 md:p-12 bg-[#0d1629] border border-blue-900/30 rounded-[3rem] space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-blue-400 italic">İADE KAPSAMI DIŞI DURUMLAR</h3>
              <div className="space-y-4">
                {[
                  "Kullanılmış veya montajı yapılmış ürünler",
                  "Fiziksel hasar görmüş donanımlar",
                  "Sıvı teması bulunan bileşenler",
                  "Ambalajı zarar görmüş veya eksik içerikli kutular"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-300 font-medium text-sm border-l-2 border-blue-500/30 pl-4 py-1">
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* İade Süreci */}
            <div className="p-8 md:p-12 bg-blue-600 border border-blue-500 rounded-[3rem] space-y-6 shadow-2xl shadow-blue-600/20">
               <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">İADE SÜRECİ</h3>
               <p className="text-blue-50 text-sm md:text-base font-medium leading-relaxed">
                  İade talebi onaylandıktan sonra ürün tarafımıza gönderilir. Teknik kontrol sonrası ücret iadesi, ödeme yönteminize göre belirlenen yasal sürede gerçekleştirilir.
               </p>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 py-12 px-6 text-center mt-auto">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 BİLGİN PC MARKET – ŞEFFAF TİCARET, GÜÇLÜ DONANIM.
        </p>
      </footer>

    </div>
  );
}
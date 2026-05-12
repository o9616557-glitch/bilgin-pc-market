"use client";

import React from 'react';
import Link from 'next/link';

export default function MesafeliSatisPage() {
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

      <main className="max-w-[1000px] mx-auto px-6 py-16 md:py-24 flex-grow">
        
        {/* SAYFA BAŞLIĞI */}
        <div className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Resmi Satış Protokolü</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            MESAFELİ SATIŞ <br /> <span className="text-blue-600">SÖZLEŞMESİ.</span>
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
            Son Güncelleme: 12 Mayıs 2026
          </p>
        </div>

        {/* SÖZLEŞME İÇERİĞİ */}
        <div className="space-y-12 text-slate-400 leading-relaxed font-medium">
          
          {/* Madde 1 */}
          <section className="space-y-4">
            <h2 className="text-white font-black text-xl md:text-2xl uppercase tracking-tight italic border-l-4 border-blue-600 pl-6">
              MADDE 1 - TARAFLAR
            </h2>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4 text-sm md:text-base">
              <p>
                İşbu sözleşme, bir tarafta <strong className="text-blue-500 uppercase">Bilgin PC Market</strong> (Bundan sonra SATICI olarak anılacaktır) ile diğer tarafta bu platform üzerinden sipariş veren kullanıcı (Bundan sonra ALICI olarak anılacaktır) arasında akdedilmiştir.
              </p>
            </div>
          </section>

          {/* Madde 2 */}
          <section className="space-y-4">
            <h2 className="text-white font-black text-xl md:text-2xl uppercase tracking-tight italic border-l-4 border-blue-600 pl-6">
              MADDE 2 - SÖZLEŞMENİN KONUSU
            </h2>
            <p className="pl-6 text-sm md:text-base">
              İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda siparişini yaptığı, sözleşmede belirtilen nitelikleri haiz ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </section>

          {/* Madde 3 */}
          <section className="space-y-4">
            <h2 className="text-white font-black text-xl md:text-2xl uppercase tracking-tight italic border-l-4 border-blue-600 pl-6">
              MADDE 3 - TESLİMAT VE FATURA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6">
              <div className="p-6 bg-[#0d1629] border border-blue-900/30 rounded-2xl">
                <h4 className="text-blue-400 font-black text-xs uppercase mb-2 tracking-widest">Teslimat Süreci</h4>
                <p className="text-xs md:text-sm">Siparişleriniz, hassas donanım paketleme standartlarına uygun olarak 3-7 iş günü içerisinde kargoya teslim edilir.</p>
              </div>
              <div className="p-6 bg-[#0d1629] border border-blue-900/30 rounded-2xl">
                <h4 className="text-blue-400 font-black text-xs uppercase mb-2 tracking-widest">Ödeme ve Fatura</h4>
                <p className="text-xs md:text-sm">Tüm ödemeler güvenli altyapılar üzerinden tahsil edilir ve e-faturanız sisteme kayıtlı mail adresinize iletilir.</p>
              </div>
            </div>
          </section>

          {/* Bilgilendirme Notu */}
          <div className="p-8 bg-blue-600 border border-blue-500 rounded-[2.5rem] shadow-2xl shadow-blue-600/20">
            <p className="text-white text-sm md:text-base font-bold italic text-center">
              "Bilgin PC Market üzerinden yapılan her işlem, karşılıklı güven ve şeffaflık esasına dayanmaktadır. Her türlü uyuşmazlıkta Tüketici Hakem Heyetleri yetkilidir."
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 text-center mt-auto">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 BİLGİN PC MARKET – YASAL HAKLARINIZ GÜVENCEMİZ ALTINDADIR.
        </p>
      </footer>

    </div>
  );
}
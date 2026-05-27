"use client";
import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, Zap, Users, ArrowRight } from "lucide-react";

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* BAŞLIK ALANI */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00e5ff] blur-[120px] opacity-20 pointer-events-none"></div>
          {/* 🚀 ŞEFİN BULDUĞU HATA DÜZELTİLDİ: h1 ile açıldı, h1 ile kapandı! */}
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider text-white mb-4 relative z-10">
            BİZ <span className="text-[#00e5ff]">KİMİZ?</span>
          </h1>
          <p className="text-slate-400 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed relative z-10">
            Performans tutkunları için donanımın sınırlarını zorlayan, işi mutfağında öğrenmiş bir ekibiz.
          </p>
        </div>

        {/* HİKAYEMİZ KUTUSU */}
        <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-6 sm:p-10 mb-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff] blur-[100px] opacity-10 pointer-events-none"></div>
          <h2 className="text-2xl font-black uppercase tracking-wide text-white mb-6 flex items-center gap-3">
            <span className="text-[#00e5ff]">🚀</span> HİKAYEMİZ
          </h2>
          <div className="text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed font-medium">
            <p>
              Bilgin PC Market olarak, sadece bir e-ticaret sitesi değil; bilgisayar donanımına, hız aşırtmaya (overclock) ve yüksek performansa gönül vermiş bir topluluğun merkezini kurmak için yola çıktık.
            </p>
            <p>
              Sektördeki en büyük eksikliğin, "kutuyu satıp arkasını dönen" satıcılar olduğunu gördük. Biz bu algıyı yıkmak, her bütçeye en doğru, en optimize ve en canavar performanslı bileşenleri ulaştırmak için dükkanımızı açtık. Sizin kurduğunuz o sistemleri biz kendi bilgisayarımız gibi heyecanla inceliyor ve paketliyoruz.
            </p>
          </div>
        </div>

        {/* BİZİ AYIRAN ÖZELLİKLER (GRID TASARIM) */}
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-center text-white mb-8">
          NEDEN BİLGİN <span className="text-[#00e5ff]">PC MARKET?</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          
          {/* ÖZELLİK 1 */}
          <div className="bg-[#09090b] border border-slate-850 p-6 rounded-2xl flex gap-4 items-start transition-all hover:border-[#00e5ff]/30">
            <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/20 flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Gerçek Donanım Uzmanlığı</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Biz sadece ürün satmıyoruz. Hangi işlemci hangi ana kartla coşar, hangi RAM oyunlarda darboğazı bitirir milimetrik olarak biliyoruz.
              </p>
            </div>
          </div>

          {/* ÖZELLİK 2 */}
          <div className="bg-[#09090b] border border-slate-850 p-6 rounded-2xl flex gap-4 items-start transition-all hover:border-[#00e5ff]/30">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">%100 Orijinal & Distribütör Garantisi</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Sitemizdeki her vida, her fan, her ekran kartı tamamen yetkili distribütör garantilidir. Sahte veya faturasız mala dükkanımızda yer yoktur.
              </p>
            </div>
          </div>

          {/* ÖZELLİK 3 */}
          <div className="bg-[#09090b] border border-slate-850 p-6 rounded-2xl flex gap-4 items-start transition-all hover:border-[#00e5ff]/30">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Jet Hızıyla Kargo</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Donanım bekletmeye gelmez, iyi biliriz. Saat 16:00'dan önce verdiğiniz siparişler aynı gün korumalı paketlerle kargoya verilir.
              </p>
            </div>
          </div>

          {/* ÖZELLİK 4 */}
          <div className="bg-[#09090b] border border-slate-850 p-6 rounded-2xl flex gap-4 items-start transition-all hover:border-[#00e5ff]/30">
            <div className="w-12 h-12 rounded-xl bg-purple-550/10 border border-purple-550/20 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Satış Sonrası Tam Destek</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Siparişi teslim aldığınızda işimiz bitmiyor. Montajda, kurulumda veya bir sorun yaşadığınızda WhatsApp ekibimizle her zaman yanınızdayız.
              </p>
            </div>
          </div>

        </div>

        {/* EYLEM ÇAĞRISI KUTUSU */}
        <div className="bg-gradient-to-r from-[#09090b] to-[#121215] border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#00e5ff] blur-[100px] opacity-10 pointer-events-none"></div>
          <h3 className="text-xl sm:text-2xl font-black uppercase mb-3">SİSTEMİNİ YÜKSELTMEYE <span className="text-[#00e5ff]">HAZIR MISIN?</span></h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            En yeni ekran kartları, canavar işlemciler ve en hızlı SSD modelleri mağazada seni bekliyor.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#00e5ff] text-black font-black uppercase tracking-wider px-8 py-3.5 rounded-xl hover:bg-[#00c4db] transition-all text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            Alışverişe Başla <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 🚀 1. RADARI İÇERİ ALDIK
import { Phone, Mail, MessageCircle, ShieldCheck, FileText, Info, RefreshCcw, Smartphone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname(); // 🚀 2. RADARI ÇALIŞTIRDIK (Şu an hangi sayfadayız?)

  // 🚀 3. BİNGO: Müşteri Sepette veya Ödemede ise Footer'ı tamamen GİZLE!
  if (pathname === "/sepet" || pathname === "/odeme") {
    return null;
  }

  return (
    <footer className="bg-[#050814] border-t border-slate-800/80 pt-16 pb-8 mt-10 relative overflow-hidden">
      {/* Arka plan ışık efekti */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent opacity-20"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. SÜTUN: MARKA VE UYGULAMA */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                BİLGİN <span className="text-[#00e5ff]">PC</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Oyuncuların ve profesyonellerin bir numaralı donanım adresi. En iyi fiyat, en hızlı kargo garantisiyle.
              </p>
            </div>
            
            {/* Google Play Butonu */}
            <div>
              <span className="text-white font-bold text-sm uppercase tracking-wider block mb-3">Uygulamamızı İndirin</span>
              <a href="#" className="flex items-center gap-3 bg-[#09090b] border border-slate-700 hover:border-[#00e5ff]/50 transition-all p-3 rounded-xl group w-max">
                <Smartphone className="w-8 h-8 text-[#00e5ff] group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Hemen İndir</span>
                  <span className="text-white font-bold text-sm leading-none">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* 2. SÜTUN: KURUMSAL */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">Kurumsal</h3>
            <Link href="/hakkimizda" className="text-slate-400 hover:text-[#00e5ff] transition-colors text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" /> Hakkımızda
            </Link>
            <Link href="/gizlilik-politikasi" className="text-slate-400 hover:text-[#00e5ff] transition-colors text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Gizlilik Politikası
            </Link>
            <Link href="/mesafeli-satis" className="text-slate-400 hover:text-[#00e5ff] transition-colors text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> Mesafeli Satış Sözleşmesi
            </Link>
            <Link href="/iade-ve-garanti" className="text-slate-400 hover:text-[#00e5ff] transition-colors text-sm font-medium flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> İade ve Garanti Şartları
            </Link>
          </div>

          {/* 3. SÜTUN: İLETİŞİM */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">İletişim</h3>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-[#121215] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#00e5ff]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Müşteri Hizmetleri</span>
                <span className="text-white">0850 123 45 67</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-[#121215] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#00e5ff]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">E-Posta Desteği</span>
                <span className="text-white">destek@bilginpc.com</span>
              </div>
            </div>
          </div>

          {/* 4. SÜTUN: SOSYAL MEDYA VE DESTEK */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">Bize Ulaşın</h3>
            
            {/* WhatsApp Butonu */}
            <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#10b981]/10 border border-[#10b981]/30 hover:bg-[#10b981]/20 transition-all p-3 rounded-xl group">
              <MessageCircle className="w-6 h-6 text-[#10b981]" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">WhatsApp Destek</span>
                <span className="text-[#10b981] text-[11px] font-bold uppercase tracking-wider">Hızlı Yanıt</span>
              </div>
            </a>

            {/* Instagram Butonu (SVG) */}
            <a href="https://instagram.com/bilginpc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#e1306c]/10 border border-[#e1306c]/30 hover:bg-[#e1306c]/20 transition-all p-3 rounded-xl group">
              <svg className="w-6 h-6 text-[#e1306c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">Instagram'da Biz</span>
                <span className="text-[#e1306c] text-[11px] font-bold uppercase tracking-wider">Takip Et</span>
              </div>
            </a>
          </div>

        </div>

        {/* ALT ÇİZGİ VE COPYRIGHT */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium text-center md:text-left">
            © {new Date().getFullYear()} Bilgin PC Market Tüm Hakları Saklıdır.
          </p>
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <img src="https://iyzico.com/assets/images/iyzico-logo.svg" alt="iyzico" className="h-6 object-contain filter invert brightness-0" />
            <span className="text-slate-600 text-xl">|</span>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Güvenli Alışveriş</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
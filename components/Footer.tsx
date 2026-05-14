import React from "react";
import Link from "next/link";

// EĞİTİM NOTU: Emojileri sildik, sadece tertemiz isimler ve link yolları kaldı.
const kurumsalLinkler = [
  { title: "Hakkımızda", path: "/hakkimizda" },
  { title: "Gizlilik Politikası", path: "/gizlilik-politikasi" },
  { title: "Mesafeli Satış", path: "/mesafeli-satis" },
  { title: "İade Şartları", path: "/iade-sartlari" },
  { title: "Garanti Şartları", path: "/garanti-sartlari" },
  { title: "İletişim", path: "/iletisim" }
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#050810] border-t border-white/5 pt-12 pb-6 mt-10 z-50 relative">
      <div className="max-w-[1400px] mx-auto px-5">
        
        {/* ÜÇ SÜTUNLU DÜZEN (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/5 pb-10">
          
          {/* 1. SÜTUN: Kurumsal Linkler */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black italic tracking-wider uppercase mb-2">Kurumsal</h3>
            <div className="grid grid-cols-2 gap-3">
              {kurumsalLinkler.map((link, index) => (
                <Link key={index} href={link.path} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* 2. SÜTUN: İletişim Bilgileri */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black italic tracking-wider uppercase mb-2">Müşteri Hizmetleri</h3>
            
            <div className="flex items-center gap-3 text-slate-400">
              {/* Telefon İkonu SVG */}
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <div>
                <p className="text-xs text-slate-500">Destek Hattı</p>
                <a href="tel:08503055968" className="text-white font-bold hover:text-blue-500 transition-colors">0850 305 59 68</a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              {/* WhatsApp İkonu SVG */}
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.614-.087-.112-.708-.94-.708-1.793s.448-1.273.606-1.446c.158-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
              <div>
                <p className="text-xs text-slate-500">WhatsApp Sipariş & Destek</p>
                <a href="https://wa.me/905327345023" target="_blank" className="text-white font-bold hover:text-green-500 transition-colors">0532 734 50 23</a>
              </div>
            </div>

          </div>

          {/* 3. SÜTUN: Sosyal Medya ve Uygulamalar */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black italic tracking-wider uppercase mb-2">Bizi Takip Edin</h3>
            <div className="flex items-center gap-4">
              
              {/* Instagram Butonu */}
              <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 rounded-lg transition-all group">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <span className="text-sm font-bold text-slate-300 group-hover:text-pink-500 transition-colors">Instagram</span>
              </a>

              {/* Google Play Butonu */}
              <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-green-500/10 border border-white/5 hover:border-green-500/30 rounded-lg transition-all group">
                {/* Basit Google Play SVG İkonu */}
                <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.38 0 .74.15 1 .42l13.5 10.5c.66.51.66 1.56 0 2.07l-13.5 10.5c-.26.27-.62.42-1 .42-.83 0-1.5-.67-1.5-1.5z"/></svg>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">İndirin</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-green-500 transition-colors leading-none mt-1">Google Play</span>
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* EN ALT TELİF HAKKI BİLGİSİ */}
        <div className="text-center text-slate-600 text-xs mt-6 font-medium">
          © 2026 BİLGİN PC Market. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
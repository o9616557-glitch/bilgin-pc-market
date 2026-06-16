"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Phone, Mail, MessageCircle, ShieldCheck, FileText, Info, RefreshCcw, Smartphone, Globe } from "lucide-react";

export default function Footer() {
  const pathname = usePathname(); 

 if (
    pathname?.includes("/sepet") || 
    pathname?.includes("/odeme") || 
    pathname?.includes("/giris") || 
    pathname?.includes("/kayit") || 
    pathname?.includes("/login") || 
    pathname?.includes("/register")
  ) {
    return null;
  }
  return (
    <footer className={`bg-[#09090b] border-t border-slate-800/80 pt-16 relative overflow-hidden flex flex-col items-center ${pathname?.includes('/product') ? 'pb-40 md:pb-8' : 'pb-8'}`
    }>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-20"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                BİLGİN <span className="text-[#3b82f6]">PC</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Yüksek performanslı bilgisayar bileşenleri ve yeni nesil donanım çözümleri. Güvenli alışveriş altyapısı ve kurumsal destekle hizmetinizdeyiz.
              </p>
            </div>
            
            <div>
              <span className="text-white font-bold text-sm uppercase tracking-wider block mb-3">Uygulamamızı İndirin</span>
              <a href="#" className="flex items-center gap-3 bg-[#121215] border border-slate-700 hover:border-[#3b82f6]/50 transition-all p-3 rounded-xl group w-max">
                <Smartphone className="w-8 h-8 text-[#3b82f6] group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Hemen İndir</span>
                  <span className="text-white font-bold text-sm leading-none">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">Kurumsal</h3>
            <Link href="/hakkimizda" className="text-slate-400 hover:text-[#3b82f6] transition-colors text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" /> Hakkımızda
            </Link>
            <Link href="/gizlilik-politikasi" className="text-slate-400 hover:text-[#3b82f6] transition-colors text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Gizlilik Politikası
            </Link>
            <Link href="/mesafeli-satis" className="text-slate-400 hover:text-[#3b82f6] transition-colors text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> Mesafeli Satış Sözleşmesi
            </Link>
            <Link href="/iade-ve-garanti" className="text-slate-400 hover:text-[#3b82f6] transition-colors text-sm font-medium flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> İade ve Garanti Şartları
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">İletişim</h3>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-[#121215] flex items-center justify-center shrink-0 border border-slate-800">
                <Phone className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Müşteri Hizmetleri</span>
                <span className="text-white">0850 123 45 67</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-[#121215] flex items-center justify-center shrink-0 border border-slate-800">
                <Mail className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Kurumsal E-Posta</span>
                <span className="text-white">info@bilginpcmarket.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-[#121215] flex items-center justify-center shrink-0 border border-slate-800">
                <Globe className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Web Sitemiz</span>
                <a href="https://bilginpcmarket.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#3b82f6] transition-colors">
                  www.bilginpcmarket.com
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">Bize Ulaşın</h3>
            
           <div className="flex items-center gap-3">
  {/* Instagram Butonu */}
  <a 
    href="https://www.instagram.com/bilginpcmarket" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-1"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  </a>

  {/* YouTube Butonu */}
  <a 
    href="https://www.youtube.com/@bilginpcmarket" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-[#ef4444] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 transform hover:-translate-y-1"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
      <path d="M2.5 7.1C2.5 5.9 3.5 5 4.7 5h14.6c1.2 0 2.2.9 2.2 2.1v9.8c0 1.2-1 2.1-2.2 2.1H4.7c-1.2 0-2.2-.9-2.2-2.1V7.1z"/>
      <path d="M10 15l5-3-5-3v6z" fill="currentColor"/>
    </svg>
  </a>

  {/* WhatsApp Butonu */}
  <a 
    href="https://wa.me/905327345023" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all duration-300 transform hover:-translate-y-1"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  </a>
</div>
            
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium text-center md:text-left">
            © {new Date().getFullYear()} Bilgin PC Market Tüm Hakları Saklıdır.
          </p>
     <div className="flex items-center justify-center md:justify-start gap-4">
    <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781544026/iyzico_blue-1024x576_kl0i8d.png" alt="iyzico" className="h-8 object-contain" />
    <img src="https://res.cloudinary.com/dtnbkoa9s/image/upload/q_auto/f_auto/v1781544625/WhatsApp-Image-2025-07-18-at-12.03.53-1200x675_hpqyxg.png" alt="Visa Mastercard" className="h-8 object-contain" />
    <span className="text-slate-600 text-xl">|</span>
    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Güvenli Alışveriş</span>
</div>
        </div>

      </div>
    </footer>
  );
}
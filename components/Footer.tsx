"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Phone, Mail, ShieldCheck, FileText, Info, RefreshCcw, Smartphone, Globe } from "lucide-react";

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
    <footer className={`bg-[#09090b] border-t border-slate-800/80 pt-16 relative overflow-hidden flex flex-col items-center ${pathname?.includes('/product') ? 'pb-40 md:pb-8' : 'pb-8'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-20"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Sütun: Logo, Açıklama ve AYRI İNDİRME ALANI */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                BİLGİN <span className="text-[#3b82f6]">PC</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Yüksek performanslı bilgisayar bileşenleri ve yeni nesil donanım çözümleri. Güvenli alışveriş altyapısı ve kurumsal destekle hizmetinizdeyiz.
              </p>
            </div>
            
            {/* Ayrı İndirme Alanı */}
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">MOBİL UYGULAMA</h3>
              <a href="#" className="flex items-center gap-3 bg-transparent border border-slate-700 hover:border-[#3b82f6] transition-all p-3 rounded-xl group w-max">
                <Smartphone className="w-8 h-8 text-[#3b82f6] group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Hemen İndir</span>
                  <span className="text-white font-bold text-sm leading-none">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* 2. Sütun: Kurumsal */}
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

          {/* 3. Sütun: İletişim */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">İletişim</h3>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-transparent border border-slate-700 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Müşteri Hizmetleri</span>
                <span className="text-white">0850 123 45 67</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-transparent border border-slate-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Kurumsal E-Posta</span>
                <span className="text-white">info@bilginpcmarket.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-transparent border border-slate-700 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Web Sitemiz</span>
                <a href="https://bilginpcmarket.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#3b82f6] transition-colors">
                  www.bilginpcmarket.com
                </a>
              </div>
            </div>
          </div>

          {/* 4. Sütun: TAKİP EDİN (Razer Tarzı Yuvarlak İkonlar) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-2">TAKİP EDİN</h3>
            
            <div className="flex items-center gap-3">
              {/* Instagram: Razer Style Circle */}
              <a href="https://www.instagram.com/bilginpcmarket" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-600 bg-transparent hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#E1306C] transition-colors">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* YouTube: Razer Style Circle */}
              <a href="https://www.youtube.com/@bilginpcmarket" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-600 bg-transparent hover:border-[#FF0000] hover:bg-[#FF0000]/10 transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 group-hover:text-[#FF0000] transition-colors">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* WhatsApp: Razer Style Circle */}
              <a href="https://wa.me/905327345023" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-600 bg-transparent hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 group-hover:text-[#25D366] transition-colors">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-2.622-1.313-4.521-3.66-5.074-4.606-.057-.101-.013-.2.062-.276.069-.069.149-.174.223-.261.075-.088.099-.15.15-.248.049-.1.024-.186-.013-.261-.037-.074-.67-1.615-.918-2.21-.242-.58-.487-.502-.67-.512-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.413 1.042 3.16.891 3.738.835.637-.061 1.758-.717 2.005-1.41.248-.693.248-1.289.173-1.41-.074-.124-.272-.198-.57-.347zM12 21.841c-1.745 0-3.456-.47-4.948-1.356l-.355-.21-3.673.963.98-3.582-.23-.365A9.794 9.794 0 0 1 2.22 12c0-5.395 4.385-9.78 9.78-9.78 5.395 0 9.78 4.385 9.78 9.78 0 5.394-4.385 9.78-9.78 9.78zm0-21.619C5.586.222.368 5.438.368 11.832c0 2.052.535 4.056 1.553 5.82L0 24l6.495-1.703a11.604 11.604 0 0 0 5.505 1.383h.005c6.393 0 11.61-5.215 11.61-11.609 0-6.393-5.216-11.61-11.615-11.61z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Alt Kısım: Telif Hakkı ve Ödeme İkonları */}
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
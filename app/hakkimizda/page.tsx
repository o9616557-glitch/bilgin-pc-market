import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Hakkımızda | Bilgin PC Market",
  description: "Bilgin PC Market - Yüksek performanslı donanımlar ve geleceğin teknoloji çözümleri.",
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-hidden relative">
      
      {/* Arka Plan Dekoratif Işıklar (Glow Effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. HERO BÖLÜMÜ (Ana Giriş) */}
      <section className="relative max-w-6xl mx-auto px-4 pt-24 pb-16 text-center z-10">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
          Geleceğin Performans Merkezi
        </span>
        <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-white uppercase">
          Bilgin PC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Market</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Biz sadece bir e-ticaret platformu değil; dijital dünyanın sınırlarını zorlayanların, rekabetçi arenada zirveyi hedefleyenlerin ve donanım tutkusunu profesyonellikle birleştirenlerin ortak noktasıyız.
        </p>
      </section>

      {/* 2. VİZYON VE E-SPOR BÖLÜMÜ */}
      <section className="max-w-6xl mx-auto px-4 py-16 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide">
                Performansın Ne Demek Olduğunu Biliyoruz
              </h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-base">
              E-spor dünyasının tam kalbinden gelen, yüksek performansın ve <span className="text-cyan-400 font-semibold">1 milisaniyelik tepkime süresinin</span> bile ne kadar kritik olduğunu bilen bir ekibiz. Bu yüzden kataloğumuza eklediğimiz her bir ekran kartını, işlemciyi ve bileşeni özenle seçiyoruz.
            </p>
            <p className="text-slate-400 leading-relaxed text-base">
              Amacımız; standart donanımlar satmak değil, amiral gemisi teknolojileri (en güncel mimariler, üst düzey soğutma çözümleri ve premium bileşenler) oyun ve iş istasyonlarına entegre edecek doğru çözümleri sunmaktır.
            </p>
          </div>
          
          {/* Sağ Taraftaki Şık İstatistik Kutusu */}
          <div className="md:col-span-5 bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-md relative group hover:border-slate-700 transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <div>
                <div className="text-3xl font-black text-cyan-400">%100</div>
                <div className="text-sm text-slate-400 font-medium mt-1">Orijinal & Resmi Türkiye Garantili Ürünler</div>
              </div>
              <div className="border-t border-slate-800/80" />
              <div>
                <div className="text-3xl font-black text-blue-500">0 ms</div>
                <div className="text-sm text-slate-400 font-medium mt-1">Gri Market / Paralel İthalat Toleransı</div>
              </div>
              <div className="border-t border-slate-800/80" />
              <div>
                <div className="text-3xl font-black text-white">7/24</div>
                <div className="text-sm text-slate-400 font-medium mt-1">Gelişmiş Yazılım ve Ödeme Altyapısı Güvenliği</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DİSTRİBÜTÖR VE GÜVEN BÖLÜMÜ (Kart Yapısı) */}
      <section className="max-w-6xl mx-auto px-4 py-16 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide">
            Şeffaflık, Güven ve Kurumsal Taahhüdümüz
          </h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base">
            Türkiye'nin ve dünyanın önde gelen teknoloji distribütörleriyle kurduğumuz dürüst bağlar sayesinde, markaların değerini kendi değerimiz gibi koruyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kart 1: Orijinallik */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl hover:border-blue-500/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Sıfır Gri Market Toleransı</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Yalnızca resmi distribütör çıkışlı ürünler satarak, markaların Türkiye'deki fiyat ve hizmet politikalarına tam uyum sağlarız. Tüm süreçlerimiz şeffaf ve yasaldır.
            </p>
          </div>

          {/* Kart 2: Altyapı */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl hover:border-cyan-500/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Modern Dijital Altyapı</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Platformumuz en güncel web teknolojileri (Next.js, Tailwind, Vercel) ile sıfırdan, en yüksek veri güvenliği ve UI/UX standartlarına (256-bit SSL, 3D Secure) göre kodlanmıştır.
            </p>
          </div>

          {/* Kart 3: Satış Sonrası */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl hover:border-purple-500/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Yetkin Teknik Destek</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Üst düzey donanımların uyumluluğu ve optimizasyonu konusunda müşterilerimize doğru teknik rehberlik sunarak distribütörlerin servis yükünü azaltır, memnuniyeti artırırız.
            </p>
          </div>
        </div>
      </section>

    {/* 4. CALL TO ACTION (Kapanış Mesajı) */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center z-10 relative">
        
        {/* 🚀 LABORATUVAR TESTİ: FAVORİLERİM BUTONU 🚀 */}
        <div className="flex justify-center mb-10 animate-in fade-in zoom-in duration-500">
          <Link 
            href="/favorilerim" 
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            Favorilerime Git (TEST)
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-slate-800 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <blockquote className="text-lg md:text-xl italic text-slate-200 font-medium">
            "Teknolojinin zirvesine giden yolda, doğru donanım ve güvenilir kurumsal hizmet için Bilgin PC Market daima yanınızda."
          </blockquote>
        </div>
      </section>
    </div>
  );
}
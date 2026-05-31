import Link from "next/link";
import React from "react";

export default function AnaSayfaHero() {
  return (
    <div className="relative w-full bg-[#0b0f19] overflow-hidden min-h-[90vh] flex items-center">
      
      {/* Arka Plan Atmosfer Işıkları */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* İnce Izgara (Grid) Deseni - Teknolojik bir hava katar */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Sol Taraf - Metin ve Butonlar */}
          <div className="text-left space-y-8">
            
            {/* Üst Rozet */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-300 tracking-wide uppercase">
                Yeni Nesil Stoklarda
              </span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight uppercase">
              Oyunun Kurallarını <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-gradient-x">
                Yeniden Yaz.
              </span>
            </h1>

            {/* Alt Başlık (Donanım Vurgusu) */}
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
              E-spor arenasında sınırları zorlamak isteyenler için en güçlü bileşenler Bilgin PC Market'te. Sektörü kasıp kavuran <strong className="text-cyan-400">RX 9070</strong>, amiral gemisi <strong className="text-blue-500">RTX 5090</strong> ve performansı zirveye taşıyan <strong className="text-purple-400">Ryzen 9 9950X3D</strong> gibi efsanelerle sisteminizi hemen şimdi yükseltin.
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/kategori/ekran-karti" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-600 rounded-xl hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider overflow-hidden">
                <span className="relative z-10">Ekran Kartlarını İncele</span>
                <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
              </Link>
              
              <Link href="/kategori/islemci" className="inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 transition-all duration-200 bg-slate-900/80 border border-slate-700 rounded-xl hover:text-white hover:bg-slate-800 hover:border-slate-600 backdrop-blur-md uppercase tracking-wider">
                İşlemcilere Göz At
              </Link>
            </div>
            
            {/* Güven Rozetleri */}
            <div className="flex items-center gap-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-xs text-slate-400 font-medium">Resmi Distribütör Garantisi</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <span className="text-xs text-slate-400 font-medium">Güvenli Alışveriş</span>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Vitrin Görseli (Cam Efektli Kutu İçinde) */}
          <div className="relative hidden lg:block">
            {/* Arkadaki dönen/parlayan efekt çemberi */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-blue-600/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Ürün Kartı Çerçevesi */}
            <div className="relative bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute -top-4 -right-4 bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/50">
                Sınırlı Stok
              </div>
              
              {/* BURAYA KENDİ EKRAN KARTI GÖRSELİNİ EKLEYEBİLİRSİN */}
              <div className="w-full h-80 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden relative">
                 {/* Gerçek bir sitende buraya <img src="/ekran-karti.png" /> gelecek */}
                 <span className="text-slate-600 font-bold uppercase tracking-widest">[ Amiral Gemisi Donanım Görseli ]</span>
                 
                 {/* Görselin üstüne düşen teknolojik ışık yansıması */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">Extreme Performans Serisi</h3>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  </div>
                </div>
                <p className="text-sm text-slate-400">En güncel mimari, maksimum FPS, sıfır darboğaz.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
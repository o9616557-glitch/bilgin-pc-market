import React from "react";

export const metadata = {
  title: "İletişim | Bilgin PC Market",
  description: "Bilgin PC Market iletişim bilgileri, destek hatları ve adres detayları.",
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-hidden relative pb-20">
      
      {/* Arka Plan Dekoratif Işıklar */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. HERO BÖLÜMÜ */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center z-10 border-b border-slate-800/80">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
          Bize Ulaşın
        </span>
        <h1 className="mt-6 text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          İletişim <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Kanalları</span>
        </h1>
        <p className="mt-6 text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Siparişleriniz, teknik destek talepleriniz veya kurumsal iş birlikleri için aşağıdaki kanallar üzerinden uzman ekibimizle doğrudan iletişime geçebilirsiniz.
        </p>
      </section>

      {/* 2. İLETİŞİM KARTLARI VE FORM BÖLÜMÜ */}
      <section className="max-w-6xl mx-auto px-4 pt-16 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sol Taraf - İletişim Bilgileri (Kartlar) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Çağrı Merkezi Kartı */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex items-center gap-5 hover:border-cyan-500/40 transition-colors">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <h3 className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Müşteri Hizmetleri</h3>
                <a href="tel:08501234567" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">0850 123 45 67</a>
              </div>
            </div>

            {/* WhatsApp Destek Kartı */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex items-center gap-5 hover:border-green-500/40 transition-colors">
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 flex-shrink-0">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.373-.043c.098-.115.424-.491.539-.66.115-.173.231-.144.39-.087.159.058 1.014.478 1.187.564.173.087.289.129.332.202.043.073.043.423-.101.827z"></path></svg>
              </div>
              <div>
                <h3 className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">WhatsApp Destek</h3>
                <a href="https://wa.me/905327345023" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-white hover:text-green-400 transition-colors">0532 734 50 23</a>
              </div>
            </div>

            {/* E-Posta Kartı */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex items-start gap-5 hover:border-blue-500/40 transition-colors">
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 flex-shrink-0 mt-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Kurumsal E-Posta</h3>
                  <a href="mailto:info@bilginpcmarket.com" className="text-lg font-bold text-white hover:text-blue-400 transition-colors block">info@bilginpcmarket.com</a>
                </div>
                <div className="border-t border-slate-800/80 pt-2">
                  <h3 className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Teknik Destek</h3>
                  <a href="mailto:destek@bilginpcmarket.com" className="text-lg font-bold text-white hover:text-blue-400 transition-colors block">destek@bilginpcmarket.com</a>
                </div>
              </div>
            </div>

            {/* Adres ve Web Sitesi Kartı */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex items-start gap-5 hover:border-purple-500/40 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              </div>
              <div>
                <h3 className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Merkez / Web</h3>
                <a href="https://www.bilginpcmarket.com" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-white hover:text-purple-400 transition-colors block mb-2">www.bilginpcmarket.com</a>
                <p className="text-sm text-slate-400 leading-relaxed">İstanbul, Türkiye<br/><span className="text-xs opacity-70">(Sadece E-Ticaret Operasyon Merkezi)</span></p>
              </div>
            </div>

          </div>

          {/* Sağ Taraf - İletişim Formu */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">Hızlı Mesaj Gönder</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Adınız Soyadınız</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">E-Posta Adresiniz</label>
                    <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="ornek@mail.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Konu</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none">
                    <option value="">Lütfen Bir Konu Seçin</option>
                    <option value="siparis">Sipariş Durumu</option>
                    <option value="teknik">Teknik Destek / Garanti</option>
                    <option value="kurumsal">Kurumsal Satış & Bayilik</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Mesajınız</label>
                  <textarea rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none" placeholder="Size nasıl yardımcı olabiliriz?"></textarea>
                </div>

                <button type="button" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] uppercase tracking-widest text-sm">
                  Mesajı Gönder
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
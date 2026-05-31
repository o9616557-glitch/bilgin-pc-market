import React from "react";

export const metadata = {
  title: "İade ve Garanti Şartları | Bilgin PC Market",
  description: "Bilgin PC Market - Ürün iade koşulları, cayma hakkı ve resmi Türkiye distribütör garanti süreçleri.",
};

export default function IadeVeGarantiPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-hidden relative pb-20">
      
      {/* Arka Plan Dekoratif Işıklar (Glow Effect) */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. HERO BÖLÜMÜ */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center z-10 border-b border-slate-800/80">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
          Müşteri Hizmetleri
        </span>
        <h1 className="mt-6 text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          İade ve Garanti <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Şartları</span>
        </h1>
        <p className="mt-6 text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Satın aldığınız tüm donanımlar %100 Orijinal ve Resmi Türkiye Distribütör Garantisi altındadır. Servis ve iade süreçlerimizin detaylarını aşağıda bulabilirsiniz.
        </p>
      </section>

      {/* 2. İÇERİK BÖLÜMÜ */}
      <section className="max-w-4xl mx-auto px-4 pt-12 z-10 relative">
        <div className="grid grid-cols-1 gap-10">
          
          {/* Garanti Şartları Kartı */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 md:p-10 rounded-2xl backdrop-blur-md shadow-xl">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-wide border-b border-slate-800 pb-4">
              <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              Garanti Kapsamı ve İşleyişi
            </h2>
            <div className="space-y-4 text-slate-400 text-sm md:text-base leading-relaxed">
              <p>
                Platformumuzda satılan tüm ürünler ithalatçı veya üretici firmaların yetkili servisleri tarafından <strong>en az 2 (iki) yıl garanti</strong> kapsamındadır.
              </p>
              <ul className="list-none space-y-3 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▹</span>
                  <span><strong>Arıza Durumunda:</strong> Ürününüzde garanti süresi içerisinde oluşan teknik arızalarda, doğrudan faturanız ile birlikte markanın Türkiye'deki yetkili servisine başvurabilirsiniz. Bu, sürecin en hızlı şekilde çözülmesini sağlar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▹</span>
                  <span><strong>Kullanıcı Hatası İstisnaları:</strong> Aşırı hız aşırtma (overclock) sonucu oluşan yanmalar, işlemci pinlerindeki fiziksel yamulma veya kırılmalar, yetkisiz kişilerce ürünün içinin açılması (garanti bandının yırtılması), kripto para madenciliği (mining) amaçlı modlanmış BIOS kurulumları garanti kapsamı dışındadır.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* İade Şartları Kartı */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 md:p-10 rounded-2xl backdrop-blur-md shadow-xl">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-wide border-b border-slate-800 pb-4">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path></svg>
              İade ve Cayma Hakkı
            </h2>
            <div className="space-y-4 text-slate-400 text-sm md:text-base leading-relaxed">
              <p>
                Satın almış olduğunuz ürünü, teslim tarihinden itibaren <strong>14 (on dört) gün</strong> içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin iade edebilirsiniz. Ancak iadenin kabul edilebilmesi için yasa gereği aşağıdaki şartların sağlanması zorunludur:
              </p>
              
              <div className="bg-slate-950/50 p-5 rounded-xl border border-red-500/20 mt-4">
                <h3 className="text-red-400 font-bold mb-3">Elektronik Bileşenlerde İade Red Sebepleri:</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Ürünün orijinal kutusunun, koruyucu jelatininin, mühür veya güvenlik bantlarının açılmış/yırtılmış olması.</li>
                  <li>Anakart, işlemci, ekran kartı ve bellek (RAM) gibi ürünlerin montajının yapılmış, soketlere takılmış veya sistemde çalıştırılmış olması (İkinci el statüsüne düşen elektronik bileşenler iade alınamaz).</li>
                  <li>Termal macunu sürülmüş işlemci veya soğutucular.</li>
                  <li>Orijinal faturasının ve tüm kutu içeriğinin (kablolar, vidalar, kitapçıklar) eksik veya hasarlı olması.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* İade Adımları */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950/30 border border-slate-800 p-6 md:p-10 rounded-2xl backdrop-blur-md shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wide">İade Süreci Nasıl İşler?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>
              
              <div className="bg-[#0b0f19] border border-slate-800 p-5 rounded-xl text-center relative">
                <div className="w-10 h-10 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3 shadow-[0_0_15px_rgba(37,99,235,0.5)]">1</div>
                <h3 className="text-white font-bold text-sm mb-2">Talebinizi İletin</h3>
                <p className="text-slate-500 text-xs">Müşteri panelinizden veya destek mailimiz üzerinden iade talebi oluşturun.</p>
              </div>

              <div className="bg-[#0b0f19] border border-slate-800 p-5 rounded-xl text-center relative">
                <div className="w-10 h-10 mx-auto bg-cyan-500 text-slate-900 rounded-full flex items-center justify-center font-bold mb-3 shadow-[0_0_15px_rgba(6,182,212,0.5)]">2</div>
                <h3 className="text-white font-bold text-sm mb-2">Kargoya Teslim Edin</h3>
                <p className="text-slate-500 text-xs">Size verilecek iade kodu ile ürünü anlaşmalı kargo firmasına sağlamca paketleyerek teslim edin.</p>
              </div>

              <div className="bg-[#0b0f19] border border-slate-800 p-5 rounded-xl text-center relative">
                <div className="w-10 h-10 mx-auto bg-green-500 text-slate-900 rounded-full flex items-center justify-center font-bold mb-3 shadow-[0_0_15px_rgba(34,197,94,0.5)]">3</div>
                <h3 className="text-white font-bold text-sm mb-2">İade Onayı ve Ödeme</h3>
                <p className="text-slate-500 text-xs">Ürün teknik ekibimizce kontrol edildikten sonra onaylanır ve ücret iadeniz bankanıza iletilir.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
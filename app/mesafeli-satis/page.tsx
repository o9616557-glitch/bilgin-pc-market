import React from "react";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi | Bilgin PC Market",
  description: "Bilgin PC Market - 6502 Sayılı Tüketicinin Korunması Hakkında Kanun kapsamında Mesafeli Satış Sözleşmesi.",
};

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-hidden relative pb-20">
      
      {/* Arka Plan Dekoratif Işıklar (Glow Effect) */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. HERO BÖLÜMÜ */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center z-10 border-b border-slate-800/80">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
          Yasal Metinler
        </span>
        <h1 className="mt-6 text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          Mesafeli Satış <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Sözleşmesi</span>
        </h1>
        <p className="mt-6 text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          İşbu sözleşme, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenlemektedir.
        </p>
      </section>

      {/* 2. SÖZLEŞME METNİ BÖLÜMÜ */}
      <section className="max-w-4xl mx-auto px-4 pt-12 z-10 relative">
        <div className="bg-slate-900/50 border border-slate-800 p-6 md:p-10 rounded-2xl backdrop-blur-md space-y-10 shadow-2xl">
          
          {/* Madde 1: Taraflar */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">1. TARAFLAR</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80">
                <h3 className="text-cyan-400 font-bold mb-2 text-sm uppercase">1.1. Satıcı Bilgileri</h3>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li><strong className="text-slate-300">Ünvanı:</strong> [Şirketinizin Vergi Levhasındaki Resmi Ünvanı]</li>
                  <li><strong className="text-slate-300">Merkez:</strong> İstanbul</li>
                  <li className="text-xs text-slate-500 font-medium border-l-2 border-cyan-500/30 pl-3 py-0.5 my-2.5">
                    * Bilgin PC Market, tüm Türkiye'ye hizmet veren e-ticaret odaklı bir teknoloji tedarikçisidir. Açık depo ve merkez adresimiz, güvenlik protokolleri gereği yalnızca sipariş sonrası tarafınıza iletilen resmi e-fatura üzerinde yer almaktadır.
                  </li>
                  <li><strong className="text-slate-300">Telefon:</strong> 0850 123 45 67</li>
                  <li><strong className="text-slate-300">E-posta:</strong> info@bilginpcmarket.com</li>
                </ul>
              </div>

              {/* 🚀 "i" YAZIM HATASI BURADA DÜZELTİLDİ 🚀 */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80">
                <h3 className="text-cyan-400 font-bold mb-2 text-sm uppercase">1.2. Alıcı Bilgileri</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Siparişi veren, ödeme sayfasında bilgileri yer alan ve platform üzerinden alışveriş yapan tüketiciyi ifade eder.
                </p>
              </div>
            </div>
          </div>

          {/* Madde 2: Konu */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">2. KONU</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait Bilgin PC Market internet sitesinden elektronik ortamda siparişini yaptığı, sözleşmede ve ödeme sayfasında nitelikleri ile satış fiyatı belirtilen donanım ve elektronik ürünün/ürünlerin satışı ve teslimi ile ilgili olarak yasal mevzuat hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </div>

          {/* Madde 3: Teslimat */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">3. TESLİMAT ŞARTLARI</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-3">
              Ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler kısmında açıklanan süre zarfında ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
            </p>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed text-red-400/80 bg-red-900/10 p-3 rounded border border-red-900/30">
              <strong>Önemli:</strong> ALICI, kargo paketini teslim alırken hasar kontrolü yapmakla ve koli üzerinde ezilme, yırtılma veya ıslanma gibi olağandışı bir durum tespit etmesi halinde ürünü teslim almayarak kargo yetkilisine tutanak tutturmakla yükümlüdür.
            </p>
          </div>

          {/* Madde 4: Cayma Hakkı */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">4. CAYMA HAKKI VE İSTİSNALARI</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4">
              ALICI, satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir. 
            </p>
            
            <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-xl">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Cayma Hakkının Kullanılamayacağı Durumlar
              </h3>
              <p className="text-slate-400 text-sm mb-3">
                Bilgisayar donanımları yüksek hassasiyet içeren elektronik bileşenlerdir. Aşağıdaki durumlarda yasa gereği cayma hakkı kullanılamaz:
              </p>
              <ul className="space-y-2 text-sm text-slate-400 list-disc pl-5">
                <li>Ambalajı, güvenlik bandı, mührü, paketi gibi koruyucu unsurları açılmış olan elektronik aletler ve bilgisayar bileşenleri.</li>
                <li>İşlemci (CPU) ve Anakart gibi montajı yapıldıktan sonra "ikinci el" statüsüne düşen, statik elektrik riski taşıyan ürünler (Pinlerin montaj izi taşıması durumu).</li>
                <li>Termal macunu sürülmüş veya soğutucu montajı yapılmış bileşenler.</li>
                <li>Lisans gerektiren yazılımlar ve dijital aktivasyon kodları içeren ürünler.</li>
              </ul>
            </div>
          </div>

          {/* Madde 5: Uyuşmazlık Çözümü */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">5. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              İşbu sözleşmenin uygulanmasında doğabilecek uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
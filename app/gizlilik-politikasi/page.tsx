import React from "react";

export const metadata = {
  title: "Gizlilik Politikası | Bilgin PC Market",
  description: "Bilgin PC Market - Gizlilik ve Kişisel Verilerin Korunması Politikası",
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-hidden relative pb-20">
      
      {/* Arka Plan Dekoratif Işıklar (Glow Effect) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. HERO BÖLÜMÜ (Ana Giriş) */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center z-10 border-b border-slate-800/80">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
          Yasal Bilgilendirme
        </span>
        <h1 className="mt-6 text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
          Gizlilik ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">KVKK</span> Politikası
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Bilgin PC Market olarak kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz. Dijital dünyadaki ayak izinizin güvende olması, yüksek performanslı sistemlerimiz kadar hassas olduğumuz bir konudur.
        </p>
      </section>

      {/* 2. İÇERİK BÖLÜMÜ */}
      <section className="max-w-4xl mx-auto px-4 pt-12 z-10 relative">
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 md:p-10 rounded-2xl backdrop-blur-sm space-y-10 shadow-2xl">
          
          {/* Madde 1 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wide">
              <span className="text-cyan-400">1.</span> Veri Sorumlusu Kimliği
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, <strong>Bilgin PC Market</strong> olarak, veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında; hukuka ve dürüstlük kurallarına uygun bir şekilde kaydedecek, saklayacak, güncelleyecek ve mevzuatın izin verdiği durumlarda üçüncü kişilere aktarabileceğiz.
            </p>
          </div>

          {/* Madde 2 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wide">
              <span className="text-cyan-400">2.</span> İşlenen Kişisel Verileriniz
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-3">
              Platformumuz üzerinden alışveriş yapmanız veya üye olmanız durumunda aşağıdaki verileriniz işlenmektedir:
            </p>
            <ul className="list-none space-y-2 text-slate-400 text-sm md:text-base ml-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">▹</span> 
                <span><strong>Kimlik ve İletişim Verileri:</strong> Ad, soyad, T.C. kimlik numarası (fatura kesimi için yasal zorunluluk), e-posta adresi, telefon numarası, fatura ve teslimat adresi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">▹</span> 
                <span><strong>İşlem Güvenliği Verileri:</strong> IP adresi bilgileri, site içi gezinme bilgileri, şifre ve parola bilgileri.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">▹</span> 
                <span><strong>Finansal Veriler:</strong> Ödeme yöntemine ilişkin bilgiler (Kredi kartı bilgileriniz sistemlerimizde tutulmaz, doğrudan lisanslı ödeme kuruluşlarına 256-bit SSL ile şifrelenerek iletilir).</span>
              </li>
            </ul>
          </div>

          {/* Madde 3 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wide">
              <span className="text-cyan-400">3.</span> Verilerinizin İşlenme Amacı
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Toplanan kişisel verileriniz; sipariş süreçlerinin yürütülmesi, faturalandırma işlemlerinin yasal mevzuata uygun yapılması, kargo teslimatlarının gerçekleştirilmesi, satış sonrası teknik destek hizmetlerinin sağlanması, distribütör garanti süreçlerinin takibi ve yetkili kamu kurumlarına yasal bilgi verilmesi amaçlarıyla işlenmektedir.
            </p>
          </div>

          {/* Madde 4 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wide">
              <span className="text-cyan-400">4.</span> Verilerin Aktarımı (Kime ve Neden?)
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-3">
              Kişisel verileriniz, gizlilik sözleşmeleri ile güvence altına alınmış olmak şartıyla yalnızca işin gerektirdiği kurumlarla paylaşılır:
            </p>
            <ul className="list-none space-y-2 text-slate-400 text-sm md:text-base ml-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">▹</span> 
                <span>Ürün teslimatı için sözleşmeli kargo firmalarıyla.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">▹</span> 
                <span>Ödeme tahsilatı için BDDK lisanslı güvenli ödeme altyapısı sağlayıcılarıyla (İyzico, PayTR vb.).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">▹</span> 
                <span>Garanti süreçlerinin işletilebilmesi için resmi distribütörler ve yetkili teknik servislerle.</span>
              </li>
            </ul>
          </div>

          {/* Madde 5 - Vurgulu Kutu (Güvenilirlik İmajı) */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900/20 p-6 rounded-xl border border-blue-500/20">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Veri Güvenliği Taahhüdümüz
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Bilgin PC Market altyapısı, uluslararası güvenlik standartlarına uygun olarak tasarlanmıştır. Sitemizde gerçekleşen tüm veri alışverişleri 256-bit şifreleme algoritmaları ve SSL sertifikaları ile korunmaktadır. Sunucularımız düzenli siber güvenlik testlerinden geçirilmekte ve yetkisiz erişimlere karşı kapalı tutulmaktadır.
            </p>
          </div>

          {/* Madde 6 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wide">
              <span className="text-cyan-400">5.</span> KVKK Kapsamındaki Haklarınız
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, verilerin düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Bu taleplerinizi <strong>destek@bilginpcmarket.com</strong> adresi üzerinden bizimle iletişime geçerek iletebilirsiniz. Talepleriniz en geç 30 gün içerisinde ücretsiz olarak sonuçlandırılacaktır.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
"use client";
import React from "react";
import { RefreshCcw, ShieldAlert, Box, CheckCircle } from "lucide-react";

export default function IadeVeGarantiPage() {
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* BAŞLIK ALANI */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00e5ff] blur-[120px] opacity-20 pointer-events-none"></div>
          <div className="flex justify-center mb-6 relative z-10">
            <div className="w-20 h-20 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full flex items-center justify-center">
              <RefreshCcw className="w-10 h-10 text-[#00e5ff]" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-white mb-4 relative z-10">
            İADE VE <span className="text-[#00e5ff]">GARANTİ</span> ŞARTLARI
          </h1>
          <p className="text-slate-400 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed relative z-10">
            Satın aldığınız her donanım %100 orijinal olup, resmi distribütör güvencesi altındadır. Memnuniyetiniz bizim için her şeyden önemlidir.
          </p>
        </div>

        {/* BİLGİLENDİRME KUTULARI (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden transition-all hover:border-[#00e5ff]/40 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Box className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">14 Gün İade Hakkı</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kullanılmamış, kutusu açılmamış, jelatini yırtılmamış ve tekrar satılabilirlik özelliğini yitirmemiş ürünlerinizi, teslim tarihinden itibaren 14 gün içerisinde hiçbir gerekçe göstermeden iade edebilirsiniz.
            </p>
          </div>

          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden transition-all hover:border-[#00e5ff]/40 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Distribütör Garantisi</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bilgin PC Market'te satılan tüm ürünler, aksi belirtilmedikçe en az 24 Ay (2 Yıl) resmi Türkiye distribütörü garantisi altındadır. Arıza durumunda ürünleriniz yetkili servislerde ücretsiz onarılır.
            </p>
          </div>

        </div>

        {/* METİN ALANI (ŞARTLAR VE İSTİSNALAR) */}
        <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-6 sm:p-10 mb-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <CheckCircle className="w-6 h-6 text-[#00e5ff]" />
            <h2 className="text-xl font-black uppercase text-white tracking-wide">Önemli Kurallar ve İstisnalar</h2>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            
            {/* 🚀 ŞEFİN EKLETTİĞİ YENİ MADDE: ARIZA DURUMU */}
            <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 p-5 rounded-2xl">
              <h4 className="text-[#00e5ff] font-bold mb-2 text-lg">1. Ürün Arızalı/Kusurlu Çıkarsa Ne Olur? (DOA ve Garanti Süreci)</h4>
              <p className="text-slate-300 mb-3">
                Kargodan teslim aldığınız ürün ilk kullanımda <strong>fabrikasyon arızalı (DOA - Dead on Arrival)</strong> çıkarsa, durumu hemen tarafımıza bildirip ürünü bize veya yetkili servise geri gönderiyorsunuz. Teknik servisimiz "kullanıcı hatası olmadığını" onayladığı an, sizi hiç bekletmeden <strong>birebir yenisiyle değişim</strong> veya <strong>tam para iadesi</strong> yapıyoruz.
              </p>
              <p className="text-slate-400 text-sm">
                Eğer ürün garanti süresi (2 Yıl) içerisinde sonradan bozulursa, ürünü doğrudan markanın resmi Türkiye yetkili servisine gönderirsiniz. Yasal azami tamir süresi 20 iş günüdür. Servis raporuna göre ürün onarılır, onarılamıyorsa yenisiyle değiştirilir veya iadesi sağlanır. Biz bu sürecin her adımında size destek olmak için yanınızdayız.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">2. İade Edilemeyecek Ürünler Nelerdir?</h4>
              <ul className="list-disc pl-5 text-slate-400 space-y-2 mt-2">
                <li>Montajı yapılmış, vida izi kalmış ana kart, ekran kartı ve benzeri donanımlar.</li>
                <li>İşlemci (CPU) gibi pimleri hassas olan ve kutusu açılmış bileşenler.</li>
                <li>Koruma bandı, güvenlik etiketi sökülmüş SSD, RAM veya yazılım lisansları.</li>
                <li>Sizin isteğiniz üzerine özel olarak toplanan (hazır sistem) bilgisayarlar.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">3. Kullanıcı Hatası ve Garanti Dışı Durumlar</h4>
              <p className="text-slate-400">
                Yanlış montaj nedeniyle kırılan işlemci pinleri, aşırı hız aşırtma (overclock) sonucu yanan parçalar, sıvı teması, voltaj dalgalanmalarından kaynaklı güç kaynağı hasarları ve fiziksel darbeler tamamen <strong>kullanıcı hatası</strong> kapsamındadır ve garanti dışı kalır.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">4. İade Süreci Nasıl İşler?</h4>
              <p className="text-slate-400 mb-2">İade etmek veya servise göndermek istediğiniz ürün için adımlar şunlardır:</p>
              <ol className="list-decimal pl-5 text-slate-400 space-y-1">
                <li>Müşteri hizmetlerimizle (info@bilginpcmarket.com veya WhatsApp) iletişime geçip iade/servis kodu alın.</li>
                <li>Ürünü faturası, tüm aksesuarları ve kutu içeriği eksiksiz olacak şekilde güvenli bir koliye koyun. (Orijinal kutuya kargo bandı yapıştırılması iadeyi geçersiz kılar).</li>
                <li>Anlaşmalı kargo firmamız ile tarafımıza veya yönlendirilen servise gönderin.</li>
                <li>Ürün teknik ekibimiz tarafından incelendikten sonra, şarta uyuyorsa 1-3 iş günü içinde ücret iadeniz veya değişiminiz yapılır.</li>
              </ol>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
"use client";
import React from "react";
import { ShieldCheck, Lock, Database, Eye } from "lucide-react";

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* BAŞLIK ALANI */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00e5ff] blur-[120px] opacity-20 pointer-events-none"></div>
          <div className="flex justify-center mb-6 relative z-10">
            <div className="w-20 h-20 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-[#00e5ff]" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-white mb-4 relative z-10">
            GİZLİLİK <span className="text-[#00e5ff]">POLİTİKASI</span>
          </h1>
          <p className="text-slate-400 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed relative z-10">
            Verileriniz bizimle, sisteminizdeki en değerli dosyanız gibi güvende. Şeffaflık ve güvenlik en büyük önceliğimizdir.
          </p>
        </div>

        {/* BİLGİLENDİRME KUTULARI (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden transition-all hover:border-[#00e5ff]/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center shrink-0">
                <Database className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">Toplanan Veriler</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Alışveriş deneyiminizi kusursuz hale getirmek için yalnızca ad, soyad, e-posta, teslimat adresi ve iletişim bilgileriniz gibi temel verileri (KVKK kapsamında) topluyoruz. Gereksiz hiçbir veri sistemlerimizde tutulmaz.
            </p>
          </div>

          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden transition-all hover:border-[#00e5ff]/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">Ödeme Güvenliği</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz veya kaydedilmez. Tüm ödeme işlemleri, BDDK lisanslı ve uluslararası PCI-DSS güvenlik standartlarına sahip İyzico altyapısı üzerinden 256-bit şifreleme ile gerçekleşir.
            </p>
          </div>

        </div>

        {/* METİN ALANI (SÖZLEŞME DETAYLARI) */}
        <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-6 sm:p-10 mb-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <Eye className="w-6 h-6 text-[#00e5ff]" />
            <h2 className="text-xl font-black uppercase text-white tracking-wide">Veri Kullanım Amaçları</h2>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            <p>
              Bilgin PC Market ("Şirket"), müşterilerine daha iyi hizmet verebilmek amacıyla bazı kişisel bilgilerinizi sizlerden talep etmektedir. Toplanan bu kişisel veriler, siparişlerinizin ulaştırılması, kampanyalardan haberdar edilmeniz ve satış sonrası teknik destek hizmetlerinin sağlanması amacıyla kullanılmaktadır.
            </p>
            
            <div>
              <h4 className="text-white font-bold mb-2">1. Üçüncü Kişilerle Paylaşım</h4>
              <p className="text-slate-400">
                Müşteri bilgileri, resmi makamlarca usulü dairesinde bu bilgilerin talep edilmesi halinde ve yürürlükteki emredici mevzuat hükümleri gereğince resmi makamlara açıklama yapmak zorunda olunduğu durumlarda resmi makamlara açıklanabilecektir. Bunun dışında verileriniz asla satılamaz, kiralanamaz veya ticari amaçla üçüncü şahıslarla paylaşılamaz. (Kargo firmaları gibi zorunlu teslimat ortakları hariçtir).
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">2. Çerezler (Cookies)</h4>
              <p className="text-slate-400">
                Sitemiz, alışveriş sepetinizi hatırlamak ve site içi tercihlerinizi korumak amacıyla çerez (cookie) teknolojisini kullanmaktadır. Çerezler bilgisayarınıza virüs bulaştırmaz. Dilerseniz tarayıcı ayarlarınızdan çerezleri kapatabilirsiniz ancak bu durumda sepet işlemlerinizde aksaklıklar yaşanabilir.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">3. İletişim İzni İptali</h4>
              <p className="text-slate-400">
                E-bülten ve SMS listemizden çıkmak isterseniz, size gönderilen mesajların alt kısmında bulunan "Listeden Ayrıl" bağlantısına tıklayabilir veya <strong className="text-white">info@bilginpcmarket.com</strong> adresine talebinizi iletebilirsiniz.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
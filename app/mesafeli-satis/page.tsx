"use client";
import React from "react";
import { FileText, Scale, ShoppingBag, Truck } from "lucide-react";

export default function MesafeliSatisPage() {
  return (
    <div className="min-h-screen bg-[#050814] text-white pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* BAŞLIK ALANI */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00e5ff] blur-[120px] opacity-20 pointer-events-none"></div>
          <div className="flex justify-center mb-6 relative z-10">
            <div className="w-20 h-20 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-[#00e5ff]" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-white mb-4 relative z-10">
            MESAFELİ <span className="text-[#00e5ff]">SATIŞ SÖZLEŞMESİ</span>
          </h1>
          <p className="text-slate-400 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed relative z-10">
            Tüketici Kanunu'na uygun olarak hazırlanan, hem sizin hem de bizim haklarımızı güvence altına alan yasal sözleşmedir.
          </p>
        </div>

        {/* ÖNE ÇIKAN MADDELER (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden transition-all hover:border-[#00e5ff]/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Teslimat Şartları</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Siparişleriniz onaylandıktan sonra yasal 30 günlük süreyi aşmamak kaydıyla, belirttiğiniz teslimat adresine kargo firması aracılığıyla güvenli ve sigortalı olarak ulaştırılır.
            </p>
          </div>

          <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden transition-all hover:border-[#00e5ff]/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Cayma Hakkı</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tüketici, ürünü teslim aldığı tarihten itibaren 14 (ondört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
            </p>
          </div>

        </div>

        {/* SÖZLEŞME METNİ */}
        <div className="bg-[#09090b] border border-slate-800/80 rounded-3xl p-6 sm:p-10 mb-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <ShoppingBag className="w-6 h-6 text-[#00e5ff]" />
            <h2 className="text-xl font-black uppercase text-white tracking-wide">Sözleşme Maddeleri</h2>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            
            <div>
              <h4 className="text-white font-bold mb-2">MADDE 1 - TARAFLAR</h4>
              <p className="text-slate-400 text-sm">
                <strong>SATICI:</strong> BİLGİN PC MARKET LTD. ŞTİ.<br />
                <strong>E-Posta:</strong> info@bilginpcmarket.com<br />
                <strong>Web:</strong> bilginpcmarket.com<br />
                <strong>ALICI:</strong> bilginpcmarket.com e-ticaret sitesinden sipariş veren ve fatura/teslimat bilgilerini dolduran kullanıcıdır.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">MADDE 2 - SÖZLEŞMENİN KONUSU</h4>
              <p className="text-slate-400 text-sm">
                İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait bilgisayar donanımı ve bileşenleri satan e-ticaret sitesinden elektronik ortamda siparişini verdiği, sözleşmede nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">MADDE 3 - ÜRÜN VE ÖDEME BİLGİLERİ</h4>
              <p className="text-slate-400 text-sm">
                Ürünlerin cinsi, miktarı, marka/modeli, adedi, satış bedeli ve ödeme şekli siparişin sonlandırıldığı andaki bilgilerden oluşmaktadır. Havale veya Kredi Kartı ile yapılan ödemelerde, banka onayının ardından sipariş işleme alınır. Havale ödemelerinde 3 iş günü içinde yapılmayan transferlerin siparişleri otomatik iptal edilir.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">MADDE 4 - GENEL HÜKÜMLER</h4>
              <p className="text-slate-400 text-sm">
                4.1- ALICI, sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.<br />
                4.2- Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler içinde açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">MADDE 5 - CAYMA HAKKI İSTİSNALARI</h4>
              <p className="text-slate-400 text-sm">
                ALICI'nın özel istek ve talepleri uyarınca üretilen veya üzerinde değişiklik ya da ilaveler yapılarak kişiye özel hale getirilen ürünlerde (Örn: ALICI'nın talebiyle özel toplanan, montajı yapılan ve test edilen hazır sistem bilgisayarlar) ve ambalajı açılmış, jelatini sökülmüş yazılım/donanım ürünlerinde mevzuat gereği cayma hakkı kullanılamaz.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2">MADDE 6 - YETKİLİ MAHKEME</h4>
              <p className="text-slate-400 text-sm">
                İşbu sözleşmenin uygulanmasında, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir. Sipariş gerçekleştiğinde ALICI işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
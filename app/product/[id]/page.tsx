// app/product/[id]/page.tsx

import React from "react";
import dynamic from 'next/dynamic'; 
// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ProductGallery from "./productgallery";
import Header from "../../../components/Header"; 

// AĞIR BİLEŞENLERİ SONRADAN YÜKLEME
const FpsMotoru = dynamic(() => import("./fpsmotoru"), { 
  loading: () => <p className="text-slate-500 p-4 animate-pulse">Performans analizi yükleniyor...</p> 
});
const ProductCompare = dynamic(() => import("./productcompare"), { 
  loading: () => <p className="text-slate-500 p-4 animate-pulse">Kıyaslama motoru hazırlanıyor...</p> 
});

// GÜVENLİ SUNUCU AYARLARI
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

// TÜRKÇE ÇEVİRİ SÖZLÜĞÜ
const turkceSozluk: Record<string, string> = {
  "model": "Model", "grafik_motoru": "Grafik Motoru", "ai_performansi": "AI Performansı",
  "bus_standarti": "Veri Yolu Standartı", "opengl": "OpenGL", "bellek": "Bellek",
  "saat_hizi": "Saat Hızı", "cuda_cekirdegi": "CUDA Çekirdeği", "bellek_hizi": "Bellek Hızı",
  "bellek_arayuzu": "Bellek Arayüzü", "cozunurluk": "Çözünürlük", "boyutlar": "Boyutlar"
};

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Ürün, WordPress detayları ve Kıyaslama için diğer ürünleri tek seferde çekiyoruz
  const [wcRes, wpRes, allProductsRes] = await Promise.all([
    api.get(`products/${id}`).catch(() => ({ data: null })),
    fetch(`${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2/product/${id}`).then(res => res.json()).catch(() => ({})),
    api.get('products', { per_page: 50, status: 'publish' }).catch(() => ({ data: [] }))
  ]);

  const product = wcRes.data;
  if (!product) return <div className="text-white p-10 text-center font-black">Ürün yüklenemedi...</div>;

  const acf = product.acf || wpRes.acf || {};
  const uzunAciklama = product.description || "<p>Teknik detaylar bulunamadı.</p>";
  const productList = allProductsRes.data
    .map((p: any) => ({ id: p.id, name: p.name }))
    .filter((p: any) => p.id.toString() !== id.toString());

  return (
    // EĞİTİM NOTU: pb-32 ekledik ki, en alttaki yapışkan çubuk yazıların üstünü örtmesin.
    <div className="bg-[#050810] min-h-screen pb-32 text-white font-sans selection:bg-blue-500/30">
      
      {/* ÜST MENÜ */}
      <Header />

      {/* ÜRÜN BAŞLIĞI VE YILDIZLAR */}
      <div className="max-w-6xl mx-auto px-5 pt-10">
        <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">High Performance</span>
        <h1 className="text-3xl md:text-5xl font-black leading-none uppercase italic tracking-tighter mt-2">{product.name}</h1>
        
        <div className="flex items-center gap-4 pt-3">
          <div className="flex text-yellow-400 text-sm">★★★★★</div>
          <span className="text-slate-500 text-xs font-bold">5.0 (124 Yorum)</span>
          <button className="ml-4 text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            Favorilere Ekle
          </button>
        </div>
      </div>

      {/* GALERİ */}
      <div className="max-w-4xl mx-auto px-5 mt-8 mb-12">
        <ProductGallery images={product.images} productName={product.name} />
      </div>

      {/* GÜVEN ROZETLERİ */}
      <div className="max-w-4xl mx-auto px-5 mb-12">
        <div className="flex justify-center gap-6 md:gap-16 border-y border-slate-800/60 py-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full border border-slate-700 bg-[#0b0f1a] flex items-center justify-center text-xl">🚚</div>
            <span className="text-[11px] text-slate-400 font-semibold tracking-wide">HIZLI<br/>KARGO</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full border border-slate-700 bg-[#0b0f1a] flex items-center justify-center text-xl">🛡️</div>
            <span className="text-[11px] text-slate-400 font-semibold tracking-wide">GÜVENLİ<br/>ALIŞVERİŞ</span>
          </div>
        </div>
      </div>

      {/* KAYBOLAN ÖZELLİKLERİ GERİ GETİRDİK */}
      <div className="max-w-5xl mx-auto px-5 space-y-8">
        
        {/* TEKNİK DETAYLAR KUTULARI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(acf).map(([key, value]: any) => {
            if (!value || typeof value === 'object' || key.toLowerCase().includes('fps')) return null;
            return (
              <div key={key} className="bg-[#0b0f1a] p-5 rounded-2xl border border-slate-800/40 flex flex-col justify-center text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase mb-1 truncate" title={turkceSozluk[key.toLowerCase()] || key}>
                  {turkceSozluk[key.toLowerCase()] || key}
                </span>
                <span className="text-blue-400 font-bold text-xs md:text-sm break-words">{String(value)}</span>
              </div>
            );
          })}
        </div>

        {/* UZUN AÇIKLAMA */}
        <details className="group bg-[#0b0f1a] rounded-[2rem] border border-slate-800/60 overflow-hidden" open>
          <summary className="p-6 md:p-8 cursor-pointer list-none flex justify-between items-center select-none">
            <span className="text-white font-bold uppercase tracking-wider text-sm md:text-base">📄 Detaylı İnceleme</span>
            <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div 
            className="p-6 md:p-8 pt-0 text-sm md:text-base text-slate-400 leading-relaxed [&>p]:mb-4 [&>h1]:text-xl [&>h1]:font-black [&>h1]:text-white [&>h1]:mb-4 [&>h1]:mt-6" 
            dangerouslySetInnerHTML={{ __html: uzunAciklama }} 
          />
        </details>

        {/* FPS MOTORU */}
        <div className="bg-[#0b0f1a] rounded-[2rem] border border-slate-800/60 p-6 md:p-8 shadow-xl">
           <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wider mb-6 flex items-center gap-2">
             <span className="text-green-500 text-xl">⚡</span> Oyun Performansı
           </h3>
           {acf && <FpsMotoru acf={acf} />}
        </div>

        {/* KIYASLAMA MOTORU */}
        <div className="bg-[#0b0f1a] rounded-[2rem] border border-slate-800/60 p-6 md:p-8 shadow-xl overflow-x-auto">
           <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wider mb-6 flex items-center gap-2">
             <span className="text-blue-500 text-xl">⚖️</span> Teknik Kıyaslama
           </h3>
           <ProductCompare currentProduct={{ name: product.name, acf }} productList={productList} />
        </div>

      </div>

      {/* ======================================================================= */}
      {/* EĞİTİM NOTU: İŞTE SENİN İSTEDİĞİ YAPIŞKAN (STICKY) SEPET VE FİYAT ÇUBUĞU */}
      {/* fixed bottom-0 komutu bu çubuğu her zaman ekranın en altına yapıştırır. */}
      {/* ======================================================================= */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050810]/95 backdrop-blur-xl border-t border-slate-800 p-4 md:p-5 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Sol: Fiyat Alanı */}
          <div className="flex flex-col">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Peşin Fiyatı</span>
            <div className="text-2xl md:text-4xl font-black text-white italic tracking-tighter leading-none">
              {product.price} <span className="text-blue-500 text-lg md:text-2xl">TL</span>
            </div>
          </div>

          {/* Sağ: Sepete Ekle Butonu */}
          <button className="bg-green-500 hover:bg-green-400 text-[#050810] py-3 md:py-4 px-8 md:px-16 rounded-xl font-black text-sm md:text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all">
            SEPETE EKLE
          </button>

        </div>
      </div>

    </div>
  );
}
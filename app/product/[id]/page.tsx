// app/product/[id]/page.tsx

import React from "react";
// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ProductGallery from "./productgallery";
// EĞİTİM: Senin başarıyla kaydettiğin menüyü buraya güvenle çağırıyoruz.
import Header from "../../../components/Header"; 

// GÜVENLİ SUNUCU AYARLARI
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  // Promise tabanlı güvenli veri çekimi
  const { id } = await params;
  const res = await api.get(`products/${id}`).catch(() => ({ data: null }));
  const product = res.data;

  if (!product) return <div className="text-white p-10 text-center font-black">Ürün yüklenemedi...</div>;

  return (
    <div className="bg-[#050810] min-h-screen pb-20 text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. ÜST MENÜ (HAMBURGER, ARAMA, SEPET) */}
      <Header />

      {/* 2. ÜRÜN BAŞLIĞI, YILDIZLAR VE FAVORİ (Tam senin istediğin gibi) */}
      <div className="max-w-6xl mx-auto px-5 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">High Performance</span>
            <h1 className="text-3xl md:text-5xl font-black leading-none uppercase italic tracking-tighter">{product.name}</h1>
            
            {/* Yıldızlar ve Favori Ekle Butonu */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <span className="text-slate-500 text-xs font-bold">5.0 (124 Yorum)</span>
              
              <button className="ml-4 text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Favorilere Ekle
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-slate-500 text-[10px] font-black uppercase block">Peşin Fiyatı</span>
            <div className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
              {product.price} <span className="text-blue-500 text-2xl md:text-4xl">TL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GALERİ VE SEPETE EKLE (Kutusuz Ferah Tasarım) */}
      <div className="max-w-6xl mx-auto px-5 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Sol: Kutusuz büyük görsel galerisi */}
        <div className="lg:col-span-8">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Sağ: Satın Alma Butonu ve Güven Rozetleri */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
           <button className="w-full bg-green-500 hover:bg-green-400 text-[#050810] h-20 rounded-2xl font-black text-xl uppercase tracking-tighter transition-all shadow-[0_20px_50px_rgba(34,197,94,0.2)] active:scale-95">
              SEPETE EKLE
           </button>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-white/5 rounded-2xl">
                <div className="text-blue-500 text-xl mb-1">🚚</div>
                <div className="text-[9px] font-black text-slate-500 uppercase">Hızlı Kargo</div>
              </div>
              <div className="text-center p-4 border border-white/5 rounded-2xl">
                <div className="text-blue-500 text-xl mb-1">🛡️</div>
                <div className="text-[9px] font-black text-slate-500 uppercase">2 Yıl Garanti</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
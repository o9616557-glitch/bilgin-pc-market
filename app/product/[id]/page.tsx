// app/product/[id]/page.tsx
import React from "react";
// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ProductGallery from "./productgallery";
import Header from "../../../components/Header"; 
import dynamic from 'next/dynamic';

// EĞİTİM NOTU: { ssr: false } ayarını kaldırdık çünkü Sunucu Bileşenlerinde bu hata verir.
// Bu bileşenler kendi içlerinde zaten "use client" olduğu için hız kaybı yaşamayacaksın.
const FpsMotoru = dynamic(() => import("./fpsmotoru"));
const ProductCompare = dynamic(() => import("./productcompare"));

const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Veriyi doğrudan sunucuda çekiyoruz, bu en hızlı yöntemdir.
  const res = await api.get(`products/${id}`);
  const product = res.data;

  if (!product) return null;

  return (
    <div className="bg-[#050810] min-h-screen pb-32 text-white font-sans selection:bg-blue-500/30">
      <Header />

      {/* İÇERİK ALANI: Boşluklar senin istediğin gibi minimumda */}
      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col items-center">
        
        {/* ÜRÜN BAŞLIĞI */}
        <div className="w-full mb-4">
          <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-slate-500 uppercase">
            <div className="flex text-yellow-400">★★★★★</div>
            <span>5.0 (124 YORUM)</span>
            <span className="text-blue-500 cursor-pointer">FAVORİLERE EKLE</span>
          </div>
        </div>

        {/* GALERİ: Oklar yerinde, kutu yok, tam ekran özelliği aktif */}
        <div className="w-full">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* TEKNİK BİLGİLER VE FPS: Boşluklar (mt-8) daraltıldı */}
        <div className="w-full mt-8 space-y-6">
          <div className="border-t border-white/5 pt-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-green-500">⚡</span> OYUN PERFORMANSI
            </h3>
            <FpsMotoru acf={product.acf} />
          </div>

          <div className="border-t border-white/5 pt-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-blue-500">⚖️</span> TEKNİK KIYASLAMA
            </h3>
            <ProductCompare currentProduct={{ name: product.name, acf: product.acf }} productList={[]} />
          </div>
        </div>
      </div>

      {/* YAPIŞKAN ALT ÇUBUK: Fiyat ve Sepet yan yana */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050810]/95 backdrop-blur-xl border-t border-white/5 p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-slate-500 text-[10px] font-black uppercase leading-none mb-1">Peşin Fiyat</span>
            <div className="text-2xl font-black italic tracking-tighter">
              {product.price} <span className="text-blue-500 text-sm">TL</span>
            </div>
          </div>
          <button className="bg-green-500 text-[#050810] px-10 py-4 rounded-xl font-black uppercase tracking-tighter text-sm shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 transition-transform active:scale-95">
            SEPETE EKLE
          </button>
        </div>
      </div>
    </div>
  );
}
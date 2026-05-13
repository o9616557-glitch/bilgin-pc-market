// app/product/[id]/page.tsx
import React from "react";
// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ProductGallery from "./productgallery";
import Header from "../../../components/Header"; 
import dynamic from 'next/dynamic';

// Hata veren ssr:false ayarı kaldırıldı, hız için sunucu tarafında hazırlandı.
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
  
  // Veri doğrudan sunucuda çekiliyor (Fişek hızı burada!)
  const res = await api.get(`products/${id}`);
  const product = res.data;
  if (!product) return null;

  return (
    <div className="bg-[#050810] min-h-screen pb-32 text-white font-sans">
      <Header />

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* ÜRÜN BAŞLIĞI: Sıkıştırılmış boşluklar */}
        <h1 className="text-2xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{product.name}</h1>
        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-500 uppercase">
          <div className="flex text-yellow-400">★★★★★</div>
          <span>5.0 (124 YORUM)</span>
        </div>

        {/* GALERİ */}
        <div className="mt-4">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* BİLGİ ALANLARI: Kutu içinde kutu olmaması için border-t kullanıldı */}
        <div className="mt-10 space-y-8">
          <div className="border-t border-white/5 pt-6">
             {/* Gereksiz iç kutuları temizlemek için p-0 verdik */}
             <div className="p-0">
               {product.acf && <FpsMotoru acf={product.acf} />}
             </div>
          </div>
          
          <div className="border-t border-white/5 pt-6">
             <ProductCompare currentProduct={{ name: product.name, acf: product.acf }} productList={[]} />
          </div>
        </div>
      </div>

      {/* YAPIŞKAN ALT ÇUBUK: Fiyat ve Buton Yan Yana */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050810]/95 backdrop-blur-md border-t border-white/5 p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase">Peşin Fiyat</span>
            <div className="text-xl md:text-3xl font-black italic">
              {product.price} <span className="text-blue-500 text-sm italic">TL</span>
            </div>
          </div>
          <button className="bg-green-500 text-black px-8 py-3 rounded-xl font-black uppercase text-sm tracking-tighter shadow-[0_0_20px_rgba(34,197,94,0.2)] active:scale-95 transition-all">
            SEPETE EKLE
          </button>
        </div>
      </div>
    </div>
  );
}
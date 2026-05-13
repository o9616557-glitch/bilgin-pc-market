// app/product/[id]/page.tsx
import React from "react";
// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import ProductGallery from "./productgallery";
import Header from "../../../components/Header"; 
import dynamic from 'next/dynamic';

const FpsMotoru = dynamic(() => import("./fpsmotoru"), { ssr: false });
const ProductCompare = dynamic(() => import("./productcompare"), { ssr: false });

const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // VERİ ÇEKME: Sunucu tarafında yapıldığı için sayfa anında açılır.
  const res = await api.get(`products/${id}`);
  const product = res.data;
  if (!product) return null;

  return (
    <div className="bg-[#050810] min-h-screen pb-32 text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col items-center">
        {/* BAŞLIK */}
        <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase text-center">{product.name}</h1>
        
        {/* YILDIZLAR VE FAVORİ */}
        <div className="flex items-center gap-4 mt-4 text-[10px] font-black uppercase text-slate-500">
          <div className="flex text-yellow-400">★★★★★</div>
          <span>5.0 (124 YORUM)</span>
          <span className="text-blue-500 cursor-pointer">FAVORİLERE EKLE</span>
        </div>

        {/* GALERİ: Oklar yerinde, kutu yok */}
        <div className="w-full mt-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* FPS VE DİĞER BİLGİLER: Boşluklar azaltıldı */}
        <div className="w-full mt-12 space-y-10">
          <div className="border-t border-white/5 pt-10">
            {product.acf && <FpsMotoru acf={product.acf} />}
          </div>
          <div className="border-t border-white/5 pt-10">
             {/* Kıyaslama Motoru Buraya */}
             <ProductCompare currentProduct={{ name: product.name, acf: product.acf }} productList={[]} />
          </div>
        </div>
      </div>

      {/* SABİT ALT ÇUBUK */}
      <div className="fixed bottom-0 left-0 w-full bg-[#050810]/95 backdrop-blur-xl border-t border-white/5 p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black italic">{product.price} <span className="text-blue-500 text-sm italic">TL</span></div>
          <button className="bg-green-500 text-black px-12 py-4 rounded-xl font-black uppercase tracking-tighter shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            SEPETE EKLE
          </button>
        </div>
      </div>
    </div>
  );
}
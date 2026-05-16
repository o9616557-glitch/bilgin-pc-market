import React from 'react';
import Hero from '@/components/Hero';
import ProductSlider from '@/components/ProductSlider';
import MidBanner from '@/components/MidBanner';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const revalidate = 3600;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function HomePage() {
  // Üstteki kaydırmalı bant (Slider) için verileri çekiyoruz
  const res = await api.get('products', { per_page: 20, status: 'publish' }).catch(() => ({ data: [] }));
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    ad: item.name,
    fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
    resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
    ozellik: item.short_description ? item.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..." : ""
  }));

  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans flex flex-col">
      <main className="flex-grow">
        {/* Büyük Reklam Alanı */}
        <Hero />

        {/* Üstteki Kaydırmalı Bant */}
        <ProductSlider urunler={urunler} />

        {/* Orta Reklam Afişi */}
        <MidBanner />

        {/* 🚀 Alttaki Ürün Izgarası: Artık tertemiz, propssuz ve tıklanabilir! */}
        <ProductGrid />
      </main>
      
      {/* Alt Menü */}
      <Footer />
    </div>
  );
}
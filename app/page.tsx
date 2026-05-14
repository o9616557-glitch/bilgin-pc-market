import React from 'react';
import Hero from '@/components/Hero';
import ProductSlider from '@/components/ProductSlider';
// YENİ EKLENDİ: Orta Banner parçamızı çağırıyoruz
import MidBanner from '@/components/MidBanner';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const revalidate = 3600;

const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function HomePage() {
  const res = await api.get('products', { per_page: 20, status: 'publish' }).catch(() => ({ data: [] }));
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    ad: item.name,
    fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
    resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
    ozellik: item.short_description ? item.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..." : "Sistem detayları yükleniyor..."
  }));

  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans flex flex-col">
      <main className="flex-grow">
        <Hero />
        
        {/* Üstteki Kaydırmalı Bant */}
        <ProductSlider urunler={urunler} />

        {/* 🚀 YENİ: ORTA BANNER (Tam merkeze yerleştirdik) */}
        <MidBanner />

        {/* Alttaki Ürün Izgarası (Grid) */}
        <ProductGrid urunler={urunler} />
      </main>
      <Footer />
    </div>
  );
}
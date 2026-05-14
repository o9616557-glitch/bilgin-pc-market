import React from 'react';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
// EĞİTİM NOTU: Yeni Kaydırmalı Vitrin parçamızı sayfaya çağırıyoruz.
import ProductSlider from '@/components/ProductSlider';

// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const revalidate = 3600;

// SİTENİN MOTORU: API Bağlantı Ayarları
const api = new (WooCommerceRestApi as any)({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function HomePage() {
  
  // WOOCOMMERCE VERİ ÇEKME İŞLEMLERİ (Senin mağazandaki gerçek ürünler)
  const res = await api.get('products', { per_page: 10, status: 'publish' }).catch(() => ({ data: [] }));
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    ad: item.name,
    fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
    resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
    ozellik: item.short_description ? item.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..." : "Sistem detayları için tıklayın."
  }));

  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* ANA İÇERİK */}
      <main className="flex-grow">
        
        {/* 1. KAHRAMAN AFİŞİ */}
        <Hero />
        
        {/* 2. KAYDIRMALI ÜRÜN VİTRİNİ */}
        {/* EĞİTİM NOTU: Yukarıda API'den çektiğimiz 'urunler' listesini Slider'ın içine gönderiyoruz. */}
        <ProductSlider urunler={urunler} />

      </main>

      {/* ALT BİLGİ */}
      <Footer />

    </div>
  );
}
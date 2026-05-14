import React from 'react';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

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
  
  // WOOCOMMERCE VERİ ÇEKME İŞLEMLERİ
  const res = await api.get('products', { per_page: 20, status: 'publish' }).catch(() => ({ data: [] }));
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    ad: item.name,
    fiyat: item.price ? Number(item.price).toLocaleString('tr-TR') + " TL" : "Fiyat Sorunuz",
    resim: item.images?.[0]?.src || "https://via.placeholder.com/300?text=Bilgin+PC",
    ozellik: item.short_description ? item.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..." : "Sistem özellikleri yükleniyor..."
  }));

  return (
    <div className="bg-[#0b1120] min-h-screen text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* 1. PARÇA: Ana İçerik (Header silindi, sadece layout.tsx'den gelecek) */}
      <main className="flex-grow">
        <Hero />
        {/* İleride ürünleri dizeceğimiz alan */}
      </main>

      {/* 2. PARÇA: Alt Bilgi (Footer) */}
      <Footer />

    </div>
  );
}
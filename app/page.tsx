import React from 'react';
import Hero from '@/components/Hero';
import ProductSlider from '@/components/ProductSlider';
import MidBanner from '@/components/MidBanner';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// 🚀 İŞTE HIZ BURADAN GELİYOR! 0 yerine 60 yaptık. 
// Artık Vercel sayfayı hazırda tutacak, tıkladığın an bekletmeden yüzüne çarpacak!
export const revalidate = 60; 

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WC_URL || "",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3"
});

export default async function HomePage() {
  const res = await api.get('products', { per_page: 20, status: 'publish' }).catch(() => ({ data: [] }));
  
  const urunler = res.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price ? Number(item.price).toLocaleString('tr-TR') : "Fiyat Sorunuz",
    slug: item.slug,
    images: item.images || [{ src: "https://via.placeholder.com/300" }],
    short_description: item.short_description || "",
    in_stock: item.stock_status === "instock"
  }));

  const sliderUrunler = urunler.map((u: any) => ({
    id: u.id,
    ad: u.name,
    fiyat: u.price + " TL",
    resim: u.images[0]?.src,
    ozellik: u.short_description.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "..."
  }));

  return (
    <div className="bg-[#050810] min-h-screen text-white font-sans flex flex-col">
      <main className="flex-grow">
        <Hero />
        <ProductSlider urunler={sliderUrunler} />
        <MidBanner />
        <section className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase italic text-white">
              ÖNE ÇIKAN <span className="text-blue-500">DONANIMLAR</span>
            </h2>
            <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
          </div>
          <ProductGrid initialProducts={urunler} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
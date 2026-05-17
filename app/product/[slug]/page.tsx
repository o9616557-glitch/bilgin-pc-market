import React from "react";
import ProductClient from "./ProductClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
  const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";
  const SITE_URL = "https://bilginpcmarket.com";

  // 1. MEVCUT AÇIK OLAN ÜRÜNÜ ÇEK
  const res = await fetch(
    `${SITE_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}`,
    { next: { revalidate: 86400 } } // 24 Saat Ön Bellek (İlk sefer yavaş, sonrakiler fişek!)
  );

  const data = await res.json();
  const product = data && data.length > 0 ? data[0] : null;

  // 2. 🚀 CANLI KIYASLAMA MOTORU (LİMİT 100'E ÇIKARILDI - TÜM SERİLER GELECEK!)
  let allProducts: any[] = [];
  if (product && product.categories && product.categories.length > 0) {
    const categoryId = product.categories[0].id;
    try {
      // per_page=100 komutu ile o kategorideki 100 ürünü birden tek seferde çeker.
      const resAll = await fetch(
        `${SITE_URL}/wp-json/wc/v3/products?category=${categoryId}&per_page=100&consumer_key=${CK}&consumer_secret=${CS}`,
        { next: { revalidate: 86400 } }
      );
      allProducts = await resAll.json();
    } catch (error) {
      console.error("Diğer ürünler çekilemedi şefim:", error);
    }
  }

  // 3. İKİ VERİYİ DE ARAYÜZE (CLIENT) PASLA
  return <ProductClient product={product} allProducts={allProducts} />;
}
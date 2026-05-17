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
    { next: { revalidate: 86400 } }
  );

  const data = await res.json();
  const product = data && data.length > 0 ? data[0] : null;

  // 2. 🚀 CANLI KIYASLAMA MOTORU İÇİN AYNI KATEGORİDEKİ DİĞER ÜRÜNLERİ ÇEK
  let allProducts: any[] = [];
  if (product && product.categories && product.categories.length > 0) {
    const categoryId = product.categories[0].id;
    try {
      // O kategoriye ait 30 ürünü WooCommerce'ten topluyoruz
      const resAll = await fetch(
        `${SITE_URL}/wp-json/wc/v3/products?category=${categoryId}&per_page=30&consumer_key=${CK}&consumer_secret=${CS}`,
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
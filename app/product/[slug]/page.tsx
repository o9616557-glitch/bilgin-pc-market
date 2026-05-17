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

  // 2. 🚀 TÜM KATEGORİ BAĞLARINI ÇEK (Sadece ilkine değil, hepsine bak!)
  let allProducts: any[] = [];
  if (product && product.categories && product.categories.length > 0) {
    
    // Ürünün bağlı olduğu TÜM kategorilerin ID'lerini aralarına virgül koyarak alıyoruz (Örn: "15,24,30")
    // Bu sayede alt kategori / üst kategori ayrımı yapmadan o ailedeki tüm ürünleri yakalıyoruz!
    const categoryIds = product.categories.map((cat: any) => cat.id).join(",");
    
    try {
      // per_page=100 ile ağı devasa genişlettik
      const resAll = await fetch(
        `${SITE_URL}/wp-json/wc/v3/products?category=${categoryIds}&per_page=100&consumer_key=${CK}&consumer_secret=${CS}`,
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
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

  // 1. 🚀 ANA ÜRÜNÜ FİŞEK GİBİ ÇEK (SADECE GEREKEN ALANLARI ALARAK %80 HIZLANDIRILDI)
  const res = await fetch(
    `${SITE_URL}/wp-json/wc/v3/products?slug=${slug}&status=publish&_fields=id,name,slug,price,regular_price,sale_price,on_sale,stock_status,images,description,categories,attributes,meta_data,acf&consumer_key=${CK}&consumer_secret=${CS}`,
    { next: { revalidate: 3600 } } // 1 Saatte bir çaktırmadan arkadan yeniler, müşteriyi asla bekletmez!
  );

  const data = await res.json();
  const product = data && data.length > 0 ? data[0] : null;

  // 2. 🚀 RAKİP ÜRÜNLERİ SÜZEREK ÇEK (STOKTA OLMAYANLARI ÇÖPE ATTIK, HIZI İKİYE KATLADIK)
  let allProducts: any[] = [];
  if (product && product.categories && product.categories.length > 0) {
    const categoryIds = product.categories.map((cat: any) => cat.id).join(",");
    
    try {
      // status=publish ve stock_status=instock eklendi! Sadece yayında ve stokta olanlar gelir.
      const resAll = await fetch(
        `${SITE_URL}/wp-json/wc/v3/products?category=${categoryIds}&per_page=100&status=publish&stock_status=instock&_fields=id,name,meta_data,acf,attributes&consumer_key=${CK}&consumer_secret=${CS}`,
        { next: { revalidate: 3600 } }
      );
      allProducts = await resAll.json();
    } catch (error) {
      console.error("Diğer ürünler çekilemedi şefim:", error);
    }
  }

  // 3. FİŞEK GİBİ ARAYÜZE PASLA
  return <ProductClient product={product} allProducts={allProducts} />;
}
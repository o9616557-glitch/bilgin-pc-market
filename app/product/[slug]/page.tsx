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

  // Next.js sen ana sayfadayken bu veriyi arkada çaktırmadan yükleyecek!
  const res = await fetch(
    `${SITE_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}`,
    { next: { revalidate: 86400 } }
  );
  
  const data = await res.json();
  const product = data && data.length > 0 ? data[0] : null;

  return <ProductClient product={product} />;
}
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // 🚀 1. DEĞİŞİKLİK: params artık bir Promise!
) {
  try {
    const { slug } = await params; // 🚀 2. DEĞİŞİKLİK: await ile ürün ismini çözüyoruz!
    
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";
    const SITE_URL = "https://bilginpcmarket.com";

    // WooCommerce'den ürünü ismiyle (slug) sorguluyoruz
    const res = await fetch(
      `${SITE_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}`,
      { next: { revalidate: 60 } }
    );

    const data = await res.json();

    // Ürün varsa vitrine gönderiyoruz
    if (res.ok && data && data.length > 0) {
      return NextResponse.json(data[0]);
    }

    return NextResponse.json({ error: "Ürün bulunamadı şefim" }, { status: 404 });
  } catch (error) {
    console.error("Ürün API Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 });
  }
}
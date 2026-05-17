import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> } // Yeni Next.js kuralı
) {
  try {
    const { slug } = await context.params;
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";
    const SITE_URL = "https://bilginpcmarket.com";

    const res = await fetch(
      `${SITE_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}`,
      { next: { revalidate: 86400 } }
    );

    const data = await res.json();

    if (res.ok && data && data.length > 0) {
      return NextResponse.json(data[0]);
    }

    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
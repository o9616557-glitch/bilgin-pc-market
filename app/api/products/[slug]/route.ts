import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";
    const SITE_URL = "https://bilginpcmarket.com";

    // WooCommerce'den ürünü çekiyoruz (Vercel veri hafızasını 24 saate çıkarıyoruz)
    const res = await fetch(
      `${SITE_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}`,
      { next: { revalidate: 86400 } } 
    );

    const data = await res.json();

    if (res.ok && data && data.length > 0) {
      // 🚀 ŞEFİM İŞTE SİTEYİ UÇURAN CDN HAFIZA ROKETİ:
      // Bu ürünün tüm bilgilerini Vercel'in internet ağında 24 saat kilitler.
      // İlk tıklamadan sonraki tüm tıklamalar tüm dünyada anlık açılır!
      return NextResponse.json(data[0], {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=600'
        }
      });
    }

    return NextResponse.json({ error: "Ürün bulunamadı şefim" }, { status: 404 });
  } catch (error) {
    console.error("Ürün API Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 });
  }
}
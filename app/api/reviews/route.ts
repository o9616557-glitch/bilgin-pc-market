import { NextResponse } from 'next/server';

// 🚀 VERCEL'İN ÖNBELLEĞİNİ KÖKTEN YASAKLAYAN SİHİRLİ KODLAR
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// ⬇️ 1. GET: SİTE YÜKLENDİĞİNDE YORUMLARI ÇEKER
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');

  if (!productId) return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });

  const wpUrl = process.env.NEXT_PUBLIC_WC_URL; 
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;

  try {
    // 🚀 WORDPRESS (LITESPEED VB.) ÖNBELLEK KIRICI:
    // Linkin sonuna "_t=123456789" şeklinde sürekli değişen bir şifre ekliyoruz.
    // WordPress eklentileri bu linki her saniye "yeni bir link" sandığı için hafızadaki (cache) eski veriyi veremez, MECBUR veritabanından taze veriyi çeker!
    const cacheBuster = Date.now();
    const fetchUrl = `${wpUrl}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved&_t=${cacheBuster}`;

    const res = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`
      },
      cache: 'no-store'
    });
    
    const data = await res.json();
    
    // 🚀 TARAYICI (CHROME/SAFARİ) ÖNBELLEK KIRICI:
    // Tarayıcıya da "bu veriyi sakın hafızanda tutma" diye sert bir uyarı gönderiyoruz.
    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Yorumlar WP panelinden çekilemedi' }, { status: 500 });
  }
}

// ⬆️ 2. POST: MÜŞTERİ YORUM GÖNDERDİĞİNDE PANELDE "BEKLEYEN" OLARAK DÜŞÜRÜR
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const wpUrl = process.env.NEXT_PUBLIC_WC_URL;
    const ck = process.env.WC_CONSUMER_KEY;
    const cs = process.env.WC_CONSUMER_SECRET;

    const finalReviewText = body.is_question ? `[SORU] ${body.review}` : body.review;
    const finalEmail = body.reviewer_email || body.email;

    const res = await fetch(`${wpUrl}/wp-json/wc/v3/products/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`
      },
      body: JSON.stringify({
        product_id: body.product_id,
        review: finalReviewText,
        reviewer: body.reviewer,
        reviewer_email: finalEmail,
        rating: body.rating || 0,
        status: 'hold' // 🚀 Müşteri yorum yaptığında kesin olarak panele "Bekleyen (Onaylanmamış)" olarak düşer.
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("❌ WooCommerce REST API Reddetme Hatası:", data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API Route Sistem Hatası:", error);
    return NextResponse.json({ error: 'Yorum WP paneline gönderilemedi' }, { status: 500 });
  }
}
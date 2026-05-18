import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');

  if (!productId) return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });

  const wpUrl = process.env.NEXT_PUBLIC_WC_URL; 
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;
  const cacheBuster = Date.now();

  let wcData = [];
  let wpData = [];

  // 1️⃣ WooCommerce üzerinden yıldızlı müşteri yorumlarını güvenli modda çek
  try {
    const wcRes = await fetch(`${wpUrl}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved&_t=${cacheBuster}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`
      },
      cache: 'no-store'
    });
    if (wcRes.ok) wcData = await wcRes.json();
  } catch (e) {
    console.error("WooCommerce bağlantı hatası:", e);
  }

  // 2️⃣ WordPress çekirdeğinden senin yazdığın admin cevaplarını çek
  try {
    const wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/comments?post=${productId}&status=approve&_t=${cacheBuster}`, {
      method: 'GET',
      cache: 'no-store'
    });
    if (wpRes.ok) wpData = await wpRes.json();
  } catch (e) {
    console.error("WordPress çekirdek bağlantı hatası:", e);
  }

  // 3️⃣ İki listeyi birbirini ezmeden havada KUSURSUZCA BİRLEŞTİR
  const cleanedReviews = (Array.isArray(wcData) ? wcData : []).map((item: any) => ({
    id: item.id,
    parent: item.parent_id || item.parent || 0,
    date_created: item.date_created || item.date,
    review: item.review || "",
    rating: item.rating || 0,
    reviewer: item.reviewer
  }));

  const cleanedReplies = (Array.isArray(wpData) ? wpData : [])
    .filter((item: any) => item.parent && item.parent > 0)
    .map((item: any) => ({
      id: item.id,
      parent: item.parent,
      date_created: item.date,
      review: item.content?.rendered || item.content || "",
      rating: 0, // Admin cevaplarında yıldız olmaz
      reviewer: item.author_name || "Mağaza Yetkilisi"
    }));

  // İki listeyi harmanlayarak tek bir havuzda topluyoruz
  const finalReviews = [...cleanedReviews, ...cleanedReplies];

  const response = NextResponse.json(finalReviews);
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

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
        status: 'hold'
      })
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Yorum WP paneline gönderilemedi' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// ⬇️ 1. GET: WOOCOMMERCE VE WORDPRESS'İ BİRLEŞTİREN MASTER MOTOR
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');

  if (!productId) return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });

  const wpUrl = process.env.NEXT_PUBLIC_WC_URL; 
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;

  try {
    const cacheBuster = Date.now();

    // 1️⃣ ADIM: WOOCOMMERCE'DEN YILDIZLI MÜŞTERİ YORUMLARINI ÇEK
    const wcRes = await fetch(`${wpUrl}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved&_t=${cacheBuster}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`
      },
      cache: 'no-store'
    });
    const wcData = await wcRes.json();

    // 2️⃣ ADIM: WORDPRESS ÇEKİRDEĞİNDEN TÜM YORUMLARI VE "ADMİN CEVAPLARINI" ÇEK
    const wpRes = await fetch(`${wpUrl}/wp-json/wp/v2/comments?post=${productId}&status=approve&_t=${cacheBuster}`, {
      method: 'GET',
      cache: 'no-store'
    });
    const wpData = await wpRes.json();

    // 3️⃣ ADIM: İKİSİNİ HAVADA BİRLEŞTİR (Admin cevaplarını ve parent_id'leri kurtar!)
    let finalReviews = [];

    if (Array.isArray(wpData) && wpData.length > 0) {
      finalReviews = wpData.map((wpItem: any) => {
        // Bu yorum WooCommerce'in yıldızlı listesinde var mı diye bakıyoruz
        const wcMatch = Array.isArray(wcData) ? wcData.find((wcItem: any) => wcItem.id === wpItem.id) : null;

        return {
          id: wpItem.id,
          parent: wpItem.parent, // İŞTE BİZE LAZIM OLAN BAĞLANTI KİMLİĞİ!
          date_created: wpItem.date,
          review: wpItem.content?.rendered || "",
          rating: wcMatch ? wcMatch.rating : 0, // Admin cevabıysa yıldız 0 olur
          reviewer: wpItem.author_name
        };
      });
    } else if (Array.isArray(wcData)) {
      // Eğer wp API kapalıysa sadece WooCommerce verisini kullan (Yedek Plan)
      finalReviews = wcData.map((item: any) => ({ ...item, parent: 0 }));
    }

    const response = NextResponse.json(finalReviews);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Yorumlar çekilemedi' }, { status: 500 });
  }
}

// ⬆️ 2. POST: YORUM GÖNDERME MOTORU (Aynı kalıyor)
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
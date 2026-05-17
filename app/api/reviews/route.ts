import { NextResponse } from 'next/server';

const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";
const SITE_URL = "https://bilginpcmarket.com";

// 🚀 WORDPRESS'TEN SADECE ONAYLI YORUM VE CEVAPLARI ÇEKME
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');

  if (!productId) {
    return NextResponse.json({ error: 'Ürün ID eksik' }, { status: 400 });
  }

  try {
    // status=approved ekleyerek onaysızların otomatik görünmesini engelledik!
    const res = await fetch(
      `${SITE_URL}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved&per_page=100&consumer_key=${CK}&consumer_secret=${CS}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Veriler çekilemedi' }, { status: 500 });
  }
}

// 🚀 WORDPRESS'E YORUM VEYA SORU GÖNDERME
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, reviewer, reviewer_email, review, rating, is_question } = body;

    const finalReviewText = is_question ? `[SORU] ${review}` : review;
    const finalRating = is_question ? 0 : rating;

    const res = await fetch(
      `${SITE_URL}/wp-json/wc/v3/products/reviews?consumer_key=${CK}&consumer_secret=${CS}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product_id,
          review: finalReviewText,
          reviewer: reviewer,
          reviewer_email: reviewer_email,
          rating: finalRating
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'WP Reddetti' }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
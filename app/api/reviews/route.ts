import { NextResponse } from 'next/server';

const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";
const SITE_URL = "https://bilginpcmarket.com";

// 🚀 1. SİTEYE YORUMLARI ÇEKME MOTORU (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');

  if (!productId) {
    return NextResponse.json({ error: 'Ürün ID eksik şefim' }, { status: 400 });
  }

  try {
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/products/reviews?product=${productId}&consumer_key=${CK}&consumer_secret=${CS}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Yorumlar çekilemedi' }, { status: 500 });
  }
}

// 🚀 2. SİTEDEN WP PANELİNE YORUM GÖNDERME MOTORU (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, reviewer, reviewer_email, review, rating } = body;

    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/products/reviews?consumer_key=${CK}&consumer_secret=${CS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: product_id,
        review: review,
        reviewer: reviewer,
        reviewer_email: reviewer_email,
        rating: rating
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Panel reddetti şefim' }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu Hatası' }, { status: 500 });
  }
}
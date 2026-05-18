import { NextResponse } from 'next/server';

// ⬇️ 1. GET: SİTE YÜKLENDİĞİNDE YORUMLARI VE SORULARI WORDPRESS'TEN ÇEKER
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');

  if (!productId) return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;

  try {
    // WordPress'ten sadece "onaylanmış" (approved) yorumları çekiyoruz.
    const res = await fetch(`${wpUrl}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`
      },
      next: { revalidate: 30 } // 30 saniyede bir paneli kontrol et
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Yorumlar WP panelinden çekilemedi' }, { status: 500 });
  }
}

// ⬆️ 2. POST: MÜŞTERİ BUTONA BASTIĞINDA YORUMU/SORUYU WORDPRESS PANELİNE GÖNDERİR
export async function POST(request: Request) {
  const body = await request.json();
  
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;

  try {
    // Akıllı Sistem: Eğer gelen şey bir Soru ise, WP panelinde rahat anla diye başına [SORU] etiketi ekler
    const finalReviewText = body.is_question ? `[SORU] ${body.review}` : body.review;

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
        reviewer_email: body.reviewer_email,
        rating: body.rating || 0
      })
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Yorum WP paneline gönderilemedi' }, { status: 500 });
  }
}
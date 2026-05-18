import { NextResponse } from 'next/server';

// 🚀 NEXT.JS HAFIZASINI (CACHE) KÖKTEN İPTAL EDEN SİHİRLİ KOMUT
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ⬇️ 1. GET: SİTE YÜKLENDİĞİNDE YORUMLARI VE SORULARI CANLI OLARAK ÇEKER
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');

  if (!productId) return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });

  const wpUrl = process.env.NEXT_PUBLIC_WC_URL; 
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;

  try {
    // 🚀 CACHE: 'NO-STORE' ekledik. Asla hafızadan getirme, direkt WP panelinden CANLI getir!
    const res = await fetch(`${wpUrl}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`
      },
      cache: 'no-store'
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Yorumlar WP panelinden çekilemedi' }, { status: 500 });
  }
}

// ⬆️ 2. POST: MÜŞTERİ BUTONA BASTIĞINDA YORUMU/SORUYU WORDPRESS PANELİNE GÖNDERİR
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
        rating: body.rating || 0
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
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const SITE_URL = "https://bilginpcmarket.com";
  const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
  const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let targetUrl = `${SITE_URL}/wp-json/wc/v3/products?consumer_key=${CK}&consumer_secret=${CS}&per_page=20`;
    
    if (slug) {
      targetUrl += `&slug=${slug}`;
    }

    const res = await fetch(targetUrl, { cache: 'no-store' });
    const data = await res.json();

    let responseData = data;
    if (slug) {
      if (!data || data.length === 0) {
        return new NextResponse(JSON.stringify({ error: "Ürün bulunamadı." }), {
          status: 404,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
        });
      }
      responseData = data[0]; 
    }

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Sistem hatası oluştu." }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });
  }
}
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const SITE_URL = "https://bilginpcmarket.com"; 
  const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b"; 
  const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

  try {
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/products?consumer_key=${CK}&consumer_secret=${CS}`, {
      cache: 'no-store'
    });

    const data = await res.json();
    
    // TELEFONLAR İÇİN GÜVENLİK KAPISINI AÇIYORUZ (CORS)
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Herkese izin ver
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Hata" }, { status: 500 });
  }
}
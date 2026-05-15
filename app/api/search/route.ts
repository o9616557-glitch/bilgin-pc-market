import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Müşterinin arama kutusuna yazdığı kelimeyi yakalıyoruz (Örn: RTX)
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  // Kelime yoksa boş liste döndür
  if (!q) return NextResponse.json([]);

  // Senin kendi yazdığın, çalışan anahtarların
  const SITE_URL = "https://bilginpcmarket.com";
  const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
  const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

  try {
    // 2. FARK BURADA: Linkin içine "?search=kelime" ekliyoruz ki sadece arananlar gelsin
    const res = await fetch(`${SITE_URL}/wp-json/wc/v3/products?search=${encodeURIComponent(q)}&consumer_key=${CK}&consumer_secret=${CS}`, {
      cache: 'no-store'
    });
    
    const data = await res.json();
    
    // Telefonlar ve farklı tarayıcılar için güvenlik kapısını açıyoruz (Senin yaptığın gibi)
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Arama motoru hatası" }, { status: 500 });
  }
}
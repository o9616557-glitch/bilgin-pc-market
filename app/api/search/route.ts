import { NextResponse } from 'next/server';

// ŞEFİM DİKKAT: 'force-dynamic' satırını sildik! Artık sistem belleği kullanabilecek.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) return NextResponse.json([]);

  const SITE_URL = "https://bilginpcmarket.com";
  const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
  const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

  try {
    // Sadece vitrinlik bilgileri çekiyoruz (_fields)
    const wpUrl = `${SITE_URL}/wp-json/wc/v3/products?search=${encodeURIComponent(q)}&per_page=6&status=publish&_fields=id,name,price,images,slug,categories&consumer_key=${CK}&consumer_secret=${CS}`;

    // Hafıza süresini 3600 saniyeye (1 Saat) çıkardım! Canlıya (Vercel) çıkınca uçacak.
    const res = await fetch(wpUrl, {
      next: { revalidate: 3600 }
    });

    const data = await res.json();

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
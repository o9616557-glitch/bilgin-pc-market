import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const SITE_URL = "https://bilginpcmarket.com";
    const CK = "ck_6ef66adad9ec356716cc40a803f4669e4c30006b";
    const CS = "cs_95b1791dad078934610a39930ac3e49da04a6efc";

    // 🚀 WooCommerce'in resmi ve güvenli müşteri oluşturma kapısı
    const wpUrl = `${SITE_URL}/wp-json/wc/v3/customers?consumer_key=${CK}&consumer_secret=${CS}`;

    const res = await fetch(wpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      // WordPress'ten dönen gerçek hata mesajını yakala (Örn: Bu mail zaten kayıtlı)
      return NextResponse.json({ error: data.message || "Kayıt başarısız." }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Sunucu bağlantı hatası." }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const SITE_URL = "https://bilginpcmarket.com";
    
    // 🚀 WordPress çekirdeğindeki resmi şifre sıfırlama (Lost Password) API kapısı
    const wpUrl = `${SITE_URL}/wp-json/wp/v2/users/lost-password`;

    const res = await fetch(wpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_login: email // WordPress buraya kullanıcı adı veya e-posta kabul eder
      })
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      // WordPress'ten gelen hata mesajını yakala (Örn: Böyle bir kullanıcı yok)
      return NextResponse.json({ error: data.message || "E-posta gönderilemedi." }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Sunucu bağlantı hatası." }, { status: 500 });
  }
}